import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load locally for testing, or rely on Render environment
load_dotenv()

def seed_admin():
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/shopdb")
    client = MongoClient(mongo_uri)
    
    # Extract DB name from URI or use default
    db_name = mongo_uri.split("/")[-1].split("?")[0] or "shopdb"
    db = client[db_name]
    
    print(f"Connecting to database: {db_name}...")

    # Default Credentials (YOU SHOULD CHANGE THESE IN THE DASHBOARD LATER)
    admin_email = "admin@yourbasiq.com"
    admin_password = "password123"

    existing = db.admins.find_one({"email": admin_email})
    if existing:
        print(f"Admin {admin_email} already exists!")
    else:
        db.admins.insert_one({
            "email": admin_email,
            "password": admin_password
        })
        print(f"SUCCESS: Admin created!")
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")

if __name__ == "__main__":
    seed_admin()
