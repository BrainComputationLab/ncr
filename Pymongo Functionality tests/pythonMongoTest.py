#Sample/Test Python file to make calls to mongodb
#This document makes calls to get and post documents to the mongo collection through the database connection

from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

#Create or connect to the client db
client = MongoClient("mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test") #Set up to public db

#get data base and collection information
db = client.test_databse
collection = db.test_collection


#When already inserted, comment out the posts
#Tests dynamic document changing
post={ 'author' : 'Katie', 'text' : 'Entry for testing', 'tags' : ['mongodb', 'python', 'pymongo'], 'date' : datetime.datetime.utcnow() }

postArray= [{ "author" : "Leesa", "text" : "Entry", "tags" : ["mongodb", "python", "pymongo"], "date" : datetime.datetime.utcnow()  },{"author" : "Aidan ", "text" : "Entry", "tags" : ["mongodb", "python", "pymongo"], "date" : datetime.datetime.utcnow()}]

db.posts.insert( post)
db.posts.insert( postArray)

for post in db.posts.find({"author":"Katie"}):
    print post

print db.collection_names()
print db.test_database.find()
print db.posts.find()
