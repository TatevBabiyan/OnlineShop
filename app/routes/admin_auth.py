from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
import jwt
import datetime

admin_auth_bp = Blueprint("admin_auth", __name__)

@admin_auth_bp.post("/login")
def admin_login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "no-body"}), 400

    email = data.get("email")
    password = data.get("password")

    user = db.admins.find_one({"email": email})
    if not user:
        return jsonify({"error": "invalid-email"}), 401

    if user.get("password") != password:
        return jsonify({"error": "invalid-password"}), 401

    token = jwt.encode({
        "admin_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, current_app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({"token": token})
