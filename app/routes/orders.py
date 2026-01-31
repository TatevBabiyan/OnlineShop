from flask import Blueprint, jsonify
from app.extensions import db

orders_bp = Blueprint("orders", __name__)

@orders_bp.get("/")
def get_orders():
    # Fetch from both collections
    raw_ua = list(db.useraddress.find())
    raw_orders = list(db.orders.find())
    
    combined = raw_ua + raw_orders
    # Sort by createdAt desc
    combined.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)
    
    results = []
    for o in combined:
        try:
            customer = o.get("customer", {})
            
            # Extract fields with multi-schema support
            first_name = customer.get("firstName") or o.get("firstName", "")
            last_name = customer.get("lastName") or o.get("lastName", "")
            email = customer.get("email") or o.get("email", "")
            phone = customer.get("phone") or o.get("phone", "")
            city = customer.get("city") or o.get("city", "")
            address = customer.get("address") or o.get("address", "")
            zip_val = o.get("postal") or o.get("postalCode") or customer.get("postal") or o.get("zip", "")
            
            # Items mapping
            raw_items = o.get("items") or o.get("products") or o.get("productIds") or []
            mapped_items = []
            
            if isinstance(raw_items, list):
                for item in raw_items:
                    if isinstance(item, str):
                        # Legacy string ID
                        mapped_items.append({"title": f"Product ID: {item}", "qty": 1})
                    elif isinstance(item, dict):
                        # Already a dict, normalization
                        mapped_items.append({
                            "productId": item.get("productId") or str(item.get("_id", "")),
                            "title": item.get("title") or "Unknown Product",
                            "price": item.get("price") or 0,
                            "image": item.get("image"),
                            "color": item.get("color") or item.get("variantColor"),
                            "size": item.get("size"),
                            "qty": item.get("qty") or item.get("quantity") or 1
                        })

            mapped_order = {
                "_id": str(o["_id"]),
                "createdAt": o.get("createdAt").isoformat() if hasattr(o.get("createdAt"), 'isoformat') else str(o.get("createdAt", "")),
                "firstName": first_name,
                "lastName": last_name,
                "email": email,
                "phone": phone,
                "city": city,
                "address": address,
                "zip": zip_val,
                "total": o.get("total", 0),
                "status": o.get("status", "pending"),
                "productIds": mapped_items,
                "note": o.get("note", "")
            }
            results.append(mapped_order)
        except Exception as e:
            print(f"Error mapping order {o.get('_id')}: {e}")
            continue

    return jsonify(results)


@orders_bp.put("/<order_id>")
def update_order_status(order_id):
    from flask import request
    from bson import ObjectId

    data = request.json or {}
    new_status = data.get("status")

    if not new_status:
        return jsonify({"error": "Status is required"}), 400

    db.useraddress.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": new_status}}
    )

    return jsonify({"success": True})
