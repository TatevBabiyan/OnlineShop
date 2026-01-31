import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load locally for testing, or rely on Render environment
import sys
load_dotenv()

def seed_admin():
    # Priority: Command line argument > Environment variable > Localhost
    if len(sys.argv) > 1:
        mongo_uri = sys.argv[1]
    else:
        mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/shopdb")
    
    client = MongoClient(mongo_uri)
    
    # Extract DB name from URI or use default
    if "mongodb+srv" in mongo_uri:
        # Atlas URIs usually look like ...net/db_name?options
        parts = mongo_uri.split("/")
        if len(parts) > 3:
            db_name = parts[3].split("?")[0]
        else:
            db_name = "shopdb"
    else:
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
