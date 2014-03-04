import pymongo
from mongokit import *
import datetime
import json

class UserInfo(Document):
    __collection__ = 'Users'
    __database__ = 'brainlab_test'
    structure = {
        '_id': basestring,
        'First_Name': basestring,
        'Last_Name': basestring,
        'Password': basestring,
        'Time_Created': datetime,
        'Last_Activity': datetime,
        'Login_Site': basestring, 
        'Lab': basestring,
        'Rank': basestring,
        'Username': basestring, #email
        'Session_ID': int,
        'Subscription' : datetime
    }

connection = Connection(host="mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test", port=27017)
connection.register([UserInfo])
