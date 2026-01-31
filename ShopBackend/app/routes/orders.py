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
        mapped_order = {
            "_id": str(o["_id"]),
            "createdAt": o.get("createdAt").isoformat() if o.get("createdAt") else None,
            "firstName": customer.get("firstName"),
            "lastName": customer.get("lastName"),
            "phone": customer.get("phone"),
            "city": customer.get("city"),
            "address": customer.get("address"),
            "zip": customer.get("zip"),
            "total": o.get("total", 0),
            "status": o.get("status"),
            # Frontend calls it productIds, but we saved it as items
            "productIds": o.get("items", []) 
        }
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
