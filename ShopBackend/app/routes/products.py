from flask import Blueprint, jsonify, request
from app.extensions import db
from bson import ObjectId

# This defines: /api/products as base URL
products_bp = Blueprint("products", __name__, url_prefix="/api/products")


def serialize(item):
    item["_id"] = str(item["_id"])
    return item


# GET /api/products/?category=bodysuits
@products_bp.get("/")
def get_all_products():
    search = request.args.get("search")
    category = request.args.get("category")
    
    # Filters
    ids = request.args.get("ids")
    colors = request.args.getlist("colors")
    sizes = request.args.getlist("sizes")
    fabrics = request.args.getlist("fabrics")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    
    # Sorting
    sort_by = request.args.get("sort", "newest") # Default to newest
    
    query = {}

    if category:
        query["category"] = category

    if ids:
        try:
            id_list = [ObjectId(x.strip()) for x in ids.split(",") if x.strip()]
            query["_id"] = {"$in": id_list}
        except:
            pass

    if search:
        query["title"] = {"$regex": search, "$options": "i"}
        
    if colors:
        query["colors"] = {"$in": colors}
        
    if sizes:
        query["sizes"] = {"$in": sizes}
        
    if fabrics:
        query["fabric"] = {"$in": fabrics}
        
    if min_price or max_price:
        price_query = {}
        if min_price:
            try: price_query["$gte"] = float(min_price)
            except: pass
        if max_price:
            try: price_query["$lte"] = float(max_price)
            except: pass
        if price_query:
            query["price"] = price_query

    # Sort Logic
    sort_criteria = [("_id", -1)] # Default newest (using ObjectId desc)
    
    if sort_by == "price_asc":
        sort_criteria = [("price", 1)]
    elif sort_by == "price_desc":
        sort_criteria = [("price", -1)]
    elif sort_by == "title_asc":
        sort_criteria = [("title", 1)]
    elif sort_by == "title_desc":
        sort_criteria = [("title", -1)]
    elif sort_by == "oldest":
        sort_criteria = [("_id", 1)]
    # 'newest' is default

    items = list(db.products.find(query).sort(sort_criteria))
    return jsonify([serialize(i) for i in items])


# GET /api/products/c/bodysuits
@products_bp.get("/c/<category>")
def get_by_category(category):
    items = list(db.products.find({"category": category}))
    return jsonify([serialize(i) for i in items])


# GET /api/products/<id>
@products_bp.get("/<id>")
def get_product(id):
    item = db.products.find_one({"_id": ObjectId(id)})
    if not item:
        return jsonify({"error": "Not found"}), 404
        
    # Fetch linked stock details
    stock_id = item.get("stock_id")
    variants = []
    if stock_id:
        stock = db.stocks.find_one({"_id": ObjectId(stock_id)})
        if stock:
            variants = stock.get("variants", [])
            
    # Add variants to the response
    item["variants"] = variants 
    return jsonify(serialize(item))


# POST /api/products/
@products_bp.post("/")
def create_product():
    data = request.json
    
    # 1. Check required fields
    required_fields = [
        "stock_id", "title", "category", "price", "description"
    ]
    for f in required_fields:
        if f not in data:
            return jsonify({"error": f"{f} required"}), 400

    # 2. Validate Stock Link
    stock_id = data["stock_id"]
    stock_item = db.stocks.find_one({"_id": ObjectId(stock_id)})
    if not stock_item:
        return jsonify({"error": "Invalid stock_id"}), 400
        
    # 3. Image limitation
    images = data.get("images", [])
    if len(images) > 5:
        return jsonify({"error": "Max 5 images allowed"}), 400

    # 4. Prepare Insert Data
    # For now, we trust the frontend/user to provide details, 
    # but we link it to the stock for future sync.
    insert_data = {
        "stock_id": stock_id,
        "images": images,
        "title": data["title"],
        "category": data["category"],
        "price": float(data["price"]),
        
        # Details
        "description": data.get("description", ""),
        "fit_fabric": data.get("fit_fabric", ""),
        "returns_exchanges": data.get("returns_exchanges", ""),
        "shipping": data.get("shipping", ""),
        "fabric": data.get("fabric", ""),

        # Inherited/Managed from Stock (Snapshotted here or can be dynamic)
        # We'll snapshot specific fields for the product display
        "colors": data.get("colors", []), 
        "sizes": data.get("sizes", []),
        "quantity": int(data.get("quantity", 0)) # Initial quantity snapshot
    }

    result = db.products.insert_one(insert_data)
    return jsonify({"_id": str(result.inserted_id)}), 201


# PUT /api/products/<id>
@products_bp.put("/<id>")
def update_product(id):
    data = request.json
    update_data = {}

    for key in [
        "stock_id", "images", "title", "category", "price", "quantity", "colors", "sizes",
        "description", "fit_fabric", "returns_exchanges", "shipping", "fabric"
    ]:
        if key in data:
            update_data[key] = data[key]

    db.products.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    return jsonify({"success": True})


# DELETE /api/products/<id>
@products_bp.delete("/<id>")
def delete_product(id):
    db.products.delete_one({"_id": ObjectId(id)})
    return jsonify({"success": True})
