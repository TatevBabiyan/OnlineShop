from flask import Blueprint, jsonify
from app.extensions import db

orders_bp = Blueprint("orders", __name__)

@orders_bp.get("/")
def get_orders():
    # Fetch from db.useraddress (legacy name for orders)
    raw_orders = list(db.useraddress.find().sort("createdAt", -1))
    
    results = []
    for o in raw_orders:
        customer = o.get("customer", {})
        
        # Map to frontend expected structure
        # Support both new schema (customer dict) and old schema (flat fields)
        mapped_order = {
            "_id": str(o["_id"]),
            "createdAt": o.get("createdAt").isoformat() if hasattr(o.get("createdAt"), 'isoformat') else str(o.get("createdAt", "")),
            "firstName": customer.get("firstName") or o.get("firstName", ""),
            "lastName": customer.get("lastName") or o.get("lastName", ""),
            "email": customer.get("email") or o.get("email", ""),
            "phone": customer.get("phone") or o.get("phone", ""),
            "city": customer.get("city") or o.get("city", ""),
            "address": customer.get("address") or o.get("address", ""),
            "zip": customer.get("postal") or o.get("postalCode") or customer.get("postal") or o.get("zip", ""),
            "total": o.get("total", 0),
            "status": o.get("status", "pending"),
            # Support both 'items' (new) and 'productIds' (old)
            "productIds": o.get("items") or o.get("productIds") or [],
            "note": o.get("note", "")
        }
        
        # Ensure productIds is a list of objects for frontend
        # If it's a list of IDs (old schema), we might want to normalize it, 
        # but the frontend seems to expect objects with title/image.
        # Let's see if we can at least make it a list.
        if isinstance(mapped_order["productIds"], list) and len(mapped_order["productIds"]) > 0:
            # If the first item is a string, it's the old schema
            if isinstance(mapped_order["productIds"][0], str):
                # We should probably fetch these products or just pass placeholders
                # For now, let's just make them look like objects the frontend expects
                new_items = []
                for pid in mapped_order["productIds"]:
                    new_items.append({"title": f"Product ID: {pid}", "qty": 1})
                mapped_order["productIds"] = new_items

        results.append(mapped_order)

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
