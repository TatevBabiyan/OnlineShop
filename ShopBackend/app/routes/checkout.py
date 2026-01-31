from flask import Blueprint, request, jsonify
from app.extensions import db
from datetime import datetime

checkout_bp = Blueprint(
    "checkout",
    __name__,
    url_prefix="/api/orders"
)

@checkout_bp.route("/create", methods=["POST"])
def checkout():
    from bson import ObjectId
    data = request.json
    products_to_order = data.get("products", [])

    # ================= VALIDATE STOCK =================
    for item in products_to_order:
        try:
            p_id = item.get("_id")
            if not p_id: continue

            # 1. Get Product
            product = db.products.find_one({"_id": ObjectId(p_id)})
            if not product:
                continue 

            # 2. Get Stock (if linked)
            stock_id = product.get("stock_id")
            if not stock_id:
                continue

            stock = db.stocks.find_one({"_id": ObjectId(stock_id)})
            if not stock:
                continue

            # 3. Check Variant Stock
            item_qty = int(item.get("qty", item.get("quantity", 1)))
            item_color = item.get("variantColor") or item.get("color")
            item_size = item.get("size")
            
            variants = stock.get("variants", [])
            variant_found = False
            
            for v in variants:
                # Match variant loosely (if undefined in item, match generic?)
                # Sticking to exact match for Color/Size logic
                v_color = v.get("color", "")
                v_size = v.get("size", "")
                
                # Check for match (handling potential None/Empty string mismatch)
                # If item has color, variant usually should too.
                match_color = (str(item_color or "").strip().lower() == str(v_color or "").strip().lower())
                match_size = (str(item_size or "").strip().lower() == str(v_size or "").strip().lower())

                if match_color and match_size:
                    variant_found = True
                    available_stock = int(v.get("stock", 0))
                    if item_qty > available_stock:
                        return jsonify({
                            "error": f"Insufficient stock for {product.get('title')} ({v_color}, {v_size}). Available: {available_stock}"
                        }), 400
                    break
            
            # If we didn't find the variant but the product has variants, 
            # we might want to flag strictness. For now, we only block if we FIND it and it's low.

        except Exception as e:
            print(f"Validation error for item {item}: {e}")
            return jsonify({"error": "Error validating stock"}), 500
    # ==================================================

    # Proceed to Create Order
    order = {
        "createdAt": datetime.utcnow(),
        "customer": {
            "email": data["email"],
            "firstName": data["firstName"],
            "lastName": data["lastName"],
            "address": data["address"],
            "apartment": data.get("apartment"),
            "city": data["city"],
            "postal": data["postal"],
            "country": data["country"],
            "phone": data["phone"]
        },
        "items": products_to_order,
        "subtotal": data["subtotal"],
        "shipping": data["shipping"],
        "shippingMethod": data.get("shippingMethod", "haypost"), # Add shippingMethod
        "total": data["total"],
        "payment": data["payment"],
        "status": "pending"
    }

    # CRITICAL FIX: Save to db.orders instead of db.useraddress
    result = db.orders.insert_one(order) 
    new_order_id = str(result.inserted_id)

    # ================= DECREMENT STOCK & SYNC PRODUCT =================
    try:
        for item in products_to_order:
            try:
                p_id = item.get("_id")
                if not p_id: continue
                
                product = db.products.find_one({"_id": ObjectId(p_id)})
                if not product or not product.get("stock_id"): continue

                stock_id = product["stock_id"]
                stock = db.stocks.find_one({"_id": ObjectId(stock_id)})
                if not stock: continue

                variants = stock.get("variants", [])
                item_qty = int(item.get("qty", item.get("quantity", 1)))
                item_color = item.get("variantColor") or item.get("color")
                item_size = item.get("size")
                
                updated_stock = False
                total_stock_acc = 0 # Recalculate total stock from variants

                for v in variants:
                    # Match variant logic (same as validation)
                    v_color = v.get("color", "")
                    v_size = v.get("size", "")
                    match_color = (str(item_color or "").strip().lower() == str(v_color or "").strip().lower())
                    match_size = (str(item_size or "").strip().lower() == str(v_size or "").strip().lower())

                    if match_color and match_size:
                        current_stock = int(v.get("stock", 0))
                        new_stock = max(0, current_stock - item_qty)
                        v["stock"] = str(new_stock) # Keep schema string if that's what it was
                        updated_stock = True
                    
                    # Accumulate for total update
                    total_stock_acc += int(v.get("stock", 0))

                if updated_stock:
                    # 1. Update Stock Collection (Variants + Total)
                    db.stocks.update_one(
                        {"_id": ObjectId(stock_id)},
                        {"$set": {
                            "variants": variants, 
                            "totalStock": total_stock_acc,
                            "lastUpdated": datetime.utcnow()
                        }}
                    )

                    # 2. Update Product Collection (Total Quantity Sync)
                    db.products.update_one(
                        {"_id": ObjectId(p_id)},
                        {"$set": {"quantity": total_stock_acc}}
                    )

            except Exception as e:
                print(f"Error updating stock for item {item}: {e}")

    except Exception as e:
        print(f"Global stock update error: {e}")
    # ===================================================

    return jsonify({"status": "ok", "orderId": new_order_id}), 201
