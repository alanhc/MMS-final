from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
load_dotenv()
CONNECTION_STRING = os.environ.get("CONNECTION_STRING")



def get_database(name, srv=CONNECTION_STRING):
    client = MongoClient(srv)
    return client[name]

DB_showroom = get_database("mms-ticketing", CONNECTION_STRING)
Col_login = DB_showroom["login"]
Col_user = DB_showroom["user"]
