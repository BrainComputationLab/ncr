from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient() #insert the host here
db = client.test
collection = db.test.izhikevich_collection



posts=[{"author":"Katie", "a":"1", "b":"1", "c":"1", "d":"1", "v":"1", "u":"1", "local":"true", "continental":"false", "global":"false"}, {"author":"Edson", "a":"2", "b":"2", "c":"2", "d":"2", "v":"2", "u":"2", "local":"true", "continental":"false", "global":"false"},{"author":"Alex", "a":"1", "b":"1", "c":"1", "d":"1", "v":"1", "u":"1", "local":"true", "continental":"true", "global":"false"},{"author":"Aidan", "a":"1", "b":"1", "c":"1", "d":"1", "v":"1", "u":"1", "local":"true", "continental":"false", "global":"true"}]

for post in posts:
	db.test.izhikevich_collection.insert( post )
