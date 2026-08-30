from pymongo import MongoClient
from pymongo.server_api import ServerApi

MONGODB_DATABASE_CONNECTION_STRING = "mongodb+srv://samuelsvob_db_user:yQPsSBbjyiEAnnht@bookstore.p0cdh9m.mongodb.net/?appName=Bookstore"

# Create a new client and connect to the server
client = MongoClient(MONGODB_DATABASE_CONNECTION_STRING, server_api=ServerApi('1'))