from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os

upload_bp = Blueprint("upload", __name__)

@upload_bp.post("/image")
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "no-file"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "empty-filename"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)

    os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
    file.save(save_path)

    return jsonify({"url": f"/uploads/{filename}"})
