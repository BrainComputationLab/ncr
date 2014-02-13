#Sample/Test Python file to make calls to mongodb
#This document tests the ability to connect to the Mongo db

from pymongo import MongoClient
import pymongo
from bson.objectid import ObjectId
import datetime
import json

#Create or connect to the client db
client = MongoClient("mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test") #Set up to public db

#get data base and collection information
db = client.brainlab_test
collection = db.sampleIzh

#decide between izh or lif databases
if(True):
	#switch collection to sampleIzh
	collection = db.sampleIzh

else:
	#switch collection to sampleLIF
	collection = db.sampleLIF  

#search! Based on incoming criteria
key = "entity_type"
value = "neuron"
for post in collection.find({"entity_type" : "neuron"}):
	print post
