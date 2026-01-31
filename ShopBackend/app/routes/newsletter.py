from flask import Blueprint, jsonify, request
from app.extensions import db
from datetime import datetime

newsletter_bp = Blueprint("newsletter", __name__, url_prefix="/api/newsletter")

@newsletter_bp.post("/")
def subscribe():
    data = request.json
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    # Check if already exists
    existing = db.mails.find_one({"email": email})
    if existing:
        return jsonify({"message": "Successfully subscribed"}), 200
        
    db.mails.insert_one({
        "email": email,
        "subscribed_at": datetime.utcnow()
    })
    
    return jsonify({"message": "Successfully subscribed"}), 201

@newsletter_bp.get("/")
def get_subscribers():
    # Admin only (implicitly for now, given the context of other admin routes)
    subscribers = list(db.mails.find({}, {"_id": 0}))
    return jsonify(subscribers)
