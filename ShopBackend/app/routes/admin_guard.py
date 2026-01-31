from flask import request, jsonify, current_app
import jwt

def require_admin(fn):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth:
            return jsonify({"error": "Unauthorized"}), 401

        try:
            token = auth.split()[1]
            decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            if decoded.get("role") != "admin":
                return jsonify({"error": "Forbidden"}), 403
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return fn(*args, **kwargs)

    wrapper.__name__ = fn.__name__
    return wrapper
