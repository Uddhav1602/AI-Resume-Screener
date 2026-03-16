from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import get_settings

settings = get_settings()

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}  # needed for SQLite only
)

# Each request gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All models will inherit from this Base
Base = declarative_base()

# Dependency — used in every route that needs DB access
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# ```

# ---

# ### 💡 What does each part do?
# ```
# engine        → actual connection to your SQLite file
# SessionLocal  → factory that creates DB sessions
# Base          → parent class all your models inherit from
# get_db()      → gives a DB session to a route, closes it when done
# ```

# Think of it like this:
# ```
# engine      = the road to the database
# SessionLocal = the car that travels that road
# get_db()    = borrows the car, uses it, returns it when done
# Base        = blueprint that all tables are built from