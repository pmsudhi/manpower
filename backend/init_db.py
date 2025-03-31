import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, DBUser, create_tables
from auth import get_password_hash

# Get database URL from environment variable or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/fb_manpower")

def init_db():
    """Initialize the database with tables and default admin user"""
    # Create tables
    create_tables()
    
    # Create engine and session
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if admin user exists
        admin_user = db.query(DBUser).filter(DBUser.username == "admin").first()
        
        if not admin_user:
            # Create admin user
            admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
            hashed_password = get_password_hash(admin_password)
            
            admin_user = DBUser(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=True
            )
            
            db.add(admin_user)
            db.commit()
            print("Admin user created successfully")
        else:
            print("Admin user already exists")
        
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

