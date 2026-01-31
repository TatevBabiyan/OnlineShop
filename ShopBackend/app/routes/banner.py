from flask import Blueprint, jsonify, request
from app.extensions import db
from bson import ObjectId

banner_bp = Blueprint("banner", __name__)

@banner_bp.get("/")
def get_banners():
    banners = list(db.banners.find({}))
    for b in banners:
        b["_id"] = str(b["_id"])
    return jsonify(banners)

@banner_bp.post("/")
def create_banner():
    data = request.json
    btype = data.get("type")

    if btype == "hero":
        if db.banners.count_documents({"type": "hero"}) >= 1:
            return jsonify({"error": "Hero already exists"}), 400

    if btype == "look":
        if db.banners.count_documents({"type": "look"}) >= 1:
            return jsonify({"error": "Look already exists"}), 400

    if btype == "category":
        if db.banners.count_documents({"type": "category"}) >= 1:
            return jsonify({"error": "Category banner already exists. Please edit the existing one."}), 400

        # Make sure category has exactly 3 images
        if "images" not in data or not isinstance(data["images"], list) or len(data["images"]) != 3:
            return jsonify({"error": "Category banner must have exactly 3 images"}), 400

        # Titles, buttonText, buttonLink must be arrays of length 3
        for arrKey in ["title", "buttonText", "buttonLink"]:
            if arrKey not in data or not isinstance(data[arrKey], list) or len(data[arrKey]) != 3:
                return jsonify({"error": f"Field '{arrKey}' must be an array of length 3"}), 400

    try:
        res = db.banners.insert_one(data)
        data["_id"] = str(res.inserted_id)
        return jsonify(data), 201
    except Exception as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

@banner_bp.put("/<id>")
def update_banner(id):
    data = request.json
    # Protection against immutable _id
    if "_id" in data:
        del data["_id"]
    
    try:
        res = db.banners.update_one({"_id": ObjectId(id)}, {"$set": data})
        if res.matched_count == 0:
            return jsonify({"error": "Banner not found"}), 404
            
        banner = db.banners.find_one({"_id": ObjectId(id)})
        banner["_id"] = str(banner["_id"])
        return jsonify(banner)
    except Exception as e:
        return jsonify({"error": "Update failed", "details": str(e)}), 500

@banner_bp.delete("/<id>")
def delete_banner(id):
    try:
        db.banners.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "deleted"})
    except Exception as e:
        return jsonify({"error": "Delete failed", "details": str(e)}), 500
