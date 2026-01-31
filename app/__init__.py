from flask import Flask, send_from_directory
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "1234") # Use environment variable in prod
    app.config["UPLOAD_FOLDER"] = os.path.join(os.getcwd(), "uploads")

    CORS(
        app,
        supports_credentials=True,
        resources={r"/api/*": {
            "origins": "*",  # Allow all for now (or configure specific domains)
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }}
    )

    # ===== IMPORT ROUTES =====
    from app.routes.admin_auth import admin_auth_bp
    from app.routes.admin_panel import admin_panel_bp
    from app.routes.categories import categories_bp
    from app.routes.products import products_bp
    from app.routes.checkout import checkout_bp
    from app.routes.orders import orders_bp
    from app.routes.banner import banner_bp
    from app.routes.uploads import upload_bp
    
    from app.routes.stocks import stocks_bp
    from app.routes.newsletter import newsletter_bp



    # ===== BLUEPRINT REGISTRATION =====
    app.register_blueprint(admin_auth_bp,  url_prefix="/api/admin")
    app.register_blueprint(admin_panel_bp, url_prefix="/api/admin-panel")
    app.register_blueprint(banner_bp,      url_prefix="/api/banner")
    app.register_blueprint(upload_bp,      url_prefix="/api/upload")
    app.register_blueprint(categories_bp,  url_prefix="/api/categories")
    app.register_blueprint(products_bp) 
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(checkout_bp)   
    app.register_blueprint(stocks_bp, url_prefix="/api/stocks")
    app.register_blueprint(newsletter_bp, url_prefix="/api/newsletter")


    # ===== STATIC UPLOADS SERVE =====
    @app.route("/uploads/<path:filename>")
    def serve_uploads(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    return app
