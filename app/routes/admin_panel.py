from flask import Blueprint, request, jsonify, current_app
import jwt

admin_panel_bp = Blueprint("admin_panel", __name__)

def require_admin(f):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth:
            return jsonify({"error": "missing-token"}), 401

        token = auth.replace("Bearer ", "").strip()

        try:
            decoded = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
            request.admin_id = decoded["admin_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "token-expired"}), 401
        except Exception:
            return jsonify({"error": "invalid-token"}), 401

        return f(*args, **kwargs)
    
    wrapper.__name__ = f.__name__
    return wrapper


@admin_panel_bp.get("/dashboard")
@require_admin
def admin_dashboard():
    return jsonify({"message": "admin ok", "admin_id": request.admin_id})
