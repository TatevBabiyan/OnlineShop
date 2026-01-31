import os
import re
from pymongo import MongoClient

# Use MONGO_URI from environment variables (e.g., MongoDB Atlas)
mongo_uri = os.environ.get("MONGO_URI")

if not mongo_uri or "localhost" in mongo_uri:
    print("⚠️ WARNING: MONGO_URI is not set or is localhost. Using local database.")
    mongo_uri = "mongodb://localhost:27017/shopdb"
else:
    # Mask password for safe logging
    safe_uri = re.sub(r':([^@]+)@', ':****@', mongo_uri)
    print(f"✅ Connecting to Cloud Database: {safe_uri}")

# Extract DB name (default to 'shopdb' if not in URI)
# Atlas URIs look like ...net/db_name?options
db_name = "shopdb"
if "/" in mongo_uri.replace("mongodb+srv://", ""):
    path_part = mongo_uri.split("/")[-1]
    if path_part and "?" in path_part:
        db_name = path_part.split("?")[0]
    elif path_part:
        db_name = path_part

mongo_client = MongoClient(mongo_uri)
db = mongo_client[db_name]
print(f"📂 Using Database: {db_name}")

