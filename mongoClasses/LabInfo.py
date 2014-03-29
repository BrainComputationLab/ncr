import pymongo
from mongokit import *
import datetime
import json

class LabInfo(Document):
    __collection__ = 'Labs'
    __database__ = 'brainlab_test'
    structure = {
        '_id' : basestring,
        'Admin': basestring, #_id of admin user
        'Users': [ basestring ],
        'Password': basestring,
        'Lab_Name' : basestring
    }