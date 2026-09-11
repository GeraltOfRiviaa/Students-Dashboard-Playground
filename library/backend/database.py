from pymongo import MongoClient
from pymongo.server_api import ServerApi

f = open("mongo_connection_string.txt", "r")

CONNECT_STR = f.read()
f.close()

# Create a new client and connect to the server
client = MongoClient(CONNECT_STR, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)