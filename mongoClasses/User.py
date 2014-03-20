import pymongo
from mongokit import *
import datetime
import json

class UserInfo(Document):
    __collection__ = 'Users'
    __database__ = 'brainlab_test'
    structure = {
        'First_Name': basestring,
        'Last_Name': basestring,
        'Password': basestring,
        'Time_Created': basestring,
        'Last_Activity': basestring,
        'Login_Site': basestring, 
        'Lab': basestring,
        'Rank': basestring,
        'Username': basestring, #email
        'Session_ID': int,
        'Subscription' : basestring,
        'Security_Question' : basestring,
        'Security_Answer' : basestring,
    }
