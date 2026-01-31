from flask import Blueprint, jsonify, request
from app.extensions import db
from bson import ObjectId

categories_bp = Blueprint("categories", __name__)

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@categories_bp.get("/")
def get_categories():
    items = list(db.categories.find())
    return jsonify([serialize_doc(i) for i in items])

@categories_bp.post("/")
def create_category():
    data = request.json or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    # Check uniqueness
    if db.categories.find_one({"name": name}):
        return jsonify({"error": "Category already exists"}), 400

    res = db.categories.insert_one({
        "name": name, 
        "description": data.get("description", ""),
        "image": data.get("image", "")
    })
    return jsonify({"_id": str(res.inserted_id), "name": name}), 201

@categories_bp.put("/<id>")
def update_category(id):
    data = request.json or {}
    name = data.get("name")
    
    update_fields = {}
    if name:
        # Check uniqueness if name is changing
        existing = db.categories.find_one({"name": name})
        if existing and str(existing["_id"]) != id:
             return jsonify({"error": "Category name already exists"}), 400
        update_fields["name"] = name
        
    if "description" in data:
        update_fields["description"] = data["description"]
        
    if "image" in data:
        update_fields["image"] = data["image"]
        
    if not update_fields:
        return jsonify({"success": True}) # Nothing to update

    db.categories.update_one({"_id": ObjectId(id)}, {"$set": update_fields})
    return jsonify({"success": True})

@categories_bp.delete("/<id>")
def delete_category(id):
    # Optional: Check if used in products before deleting
    db.categories.delete_one({"_id": ObjectId(id)})
    return jsonify({"success": True})
