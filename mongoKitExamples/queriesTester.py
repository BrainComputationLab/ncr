import pymongo
from mongokit import *
import datetime
import json

connection = Connection(host="mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test", port=27017)

found = connection.brainlab_test.Channels.find({"author": "Lander Burns"}, {"author": 1})
for doc in found:
    print doc
    print
    print




