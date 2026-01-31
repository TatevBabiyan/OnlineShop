import os
from pymongo import MongoClient

# Use MONGO_URI from environment variables (e.g., MongoDB Atlas)
# Fallback to localhost for development
mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["shopdb"]
