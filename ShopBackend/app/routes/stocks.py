from flask import Blueprint, jsonify, request
from app.extensions import db
from bson import ObjectId
from datetime import datetime

stocks_bp = Blueprint("stocks", __name__)


# ================= STATUS HELPER =================
def get_stock_status(total_qty):
    if total_qty <= 0:
        return "OUT"
    elif total_qty <= 10:
        return "LOW"
    return "IN"


# ================= CALCULATE TOTAL STOCK =================
def calculate_total_stock(variants):
    total = 0
    for v in variants:
        try:
            total += int(v.get("stock", 0))
        except:
            pass
    return total


# ================= GET ALL STOCKS =================
@stocks_bp.get("/")
def get_stocks():

    items = list(db.stocks.find())
    result = []

    for s in items:

        variants = s.get("variants", [])
        total_qty = calculate_total_stock(variants)

        result.append({
            "_id": str(s["_id"]),
            "productName": s.get("productName"),
            "fabrics": s.get("fabrics", ""),
            "variants": variants,
            "totalStock": total_qty,
            "status": get_stock_status(total_qty),
            "createdAt": s.get("createdAt")
        })

    return jsonify(result)


# ================= CREATE STOCK =================
@stocks_bp.post("/")
def create_stock():

    data = request.json or {}
    
    product_name = data.get("productName")
    if not product_name:
         return jsonify({"error": "Product Name is required"}), 400

    stock = {
        "productName": product_name,
        "fabrics": data.get("fabrics"),
        "variants": data.get("variants", []), # List of {size, color, stock, sku}
        "createdAt": datetime.utcnow(),
        "lastUpdated": datetime.utcnow()
    }

    res = db.stocks.insert_one(stock)

    return jsonify({
        "success": True,
        "id": str(res.inserted_id)
    }), 201


# ================= UPDATE STOCK =================
@stocks_bp.put("/<stock_id>")
def update_stock(stock_id):

    data = request.json or {}

    data["lastUpdated"] = datetime.utcnow()

    db.stocks.update_one(
        {"_id": ObjectId(stock_id)},
        {"$set": data}
    )

    return jsonify({"success": True})


# ================= DELETE =================
@stocks_bp.delete("/<stock_id>")
def delete_stock(stock_id):

    db.stocks.delete_one({"_id": ObjectId(stock_id)})

    return jsonify({"success": True})
