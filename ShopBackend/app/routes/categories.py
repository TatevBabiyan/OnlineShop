from flask import Blueprint, jsonify, request
from app.extensions import db
from bson import ObjectId

categories_bp = Blueprint("categories", __name__)

import re

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    if "slug" not in doc and "name" in doc:
        # Fallback for existing docs
        doc["slug"] = re.sub(r'[^a-zA-Z0-9]', '-', doc["name"].lower()).strip('-')
    return doc

def slugify(text):
    return re.sub(r'[^a-zA-Z0-9]', '-', text.lower()).strip('-')

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
    
    slug = slugify(name)
    
    # Check uniqueness
    if db.categories.find_one({"$or": [{"name": name}, {"slug": slug}]}):
        return jsonify({"error": "Category already exists"}), 400

    res = db.categories.insert_one({
        "name": name,
        "slug": slug,
        "description": data.get("description", ""),
        "image": data.get("image", "")
    })
    return jsonify({"_id": str(res.inserted_id), "name": name, "slug": slug}), 201

@categories_bp.put("/<id>")
def update_category(id):
    data = request.json or {}
    name = data.get("name")
    
    update_fields = {}
    if name:
        # Check uniqueness if name is changing
        slug = slugify(name)
        existing = db.categories.find_one({"$or": [{"name": name}, {"slug": slug}]})
        if existing and str(existing["_id"]) != id:
             return jsonify({"error": "Category already exists"}), 400
        update_fields["name"] = name
        update_fields["slug"] = slug
        
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
