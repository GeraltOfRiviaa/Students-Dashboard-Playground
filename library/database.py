from pymongo import MongoClient
from pymongo.server_api import ServerApi

f = open("mongo_connection_string.txt", "r")

CONNECT_STR = f.read()
f.close()

# Create a new client and connect to the server
client = MongoClient(CONNECT_STR, server_api=ServerApi('1'))