import pymongo
from mongokit import *
import datetime
import json

class ModelInfo(Document):
    __collection__ = 'Channels'
    __database__ = 'brainlab_test'
    structure = {
        '_id':basestring,
        'entity_type': basestring,
        'entity_name':basestring,
        'description': basestring,
        'author': basestring,
        'author_email': basestring,
        'channel_parameters': {
            'type': basestring,
            'conductance': { 'type': basestring, 'value': float},
            'reversal_potential': { 'type': basestring, 'value':float},
            'particles' : {
                'x_initial': float,
                'alpha':{
                    'a': float,
                    'b': float,
                    'c': float,
                    'd': float,
                    'f': float,
                    'h': float
                },
                'beta': {
                    'a': float,
                    'b': float,
                    'c': float,
                    'd': float,
                    'f': float,
                    'h': float
                },
                'power': float
        }   

    }
    }
    required_fields=['_id']
    default_values={}

connection = Connection(host="mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test", port=27017)
connection.register([ModelInfo])


item1 = connection.ModelInfo({
    "_id": "a",
    "entity_type": "channel",
    "entity_name": "channel_vg",
    "description": "This is an extended description of the entity",
    "author": "Nathan Jordan",
    "author_email": "njordan@cse.unr.edu",
    "channel_parameters": {
        "type": "voltage_gated",
        "conductance": {
            "type": "exact",
            "value": 65.0
        },
        "reversal_potential": {
            "type": "exact",
            "value": 65.0
        },
        "particles": {
	       	"x_initial": 5.0,
            "alpha": {
                "a": 0.5,
                "b": 0.01,
                "c": 1.0,
                "d": 50.0,
                "f": -10.0,
          		"h": -1.0
            },
      		"beta": {
        		"a": 0.125,
          		"b": 0.0,
          		"c": 0.0,
          		"d": 60.0,
          		"f": 80.0,
          		"h": 1.0
        	},
        	"power": 4.0
        }
    } 
})

for x in range(0, 12):
    item1['_id'] = "hh" + str(x)
    item1.save()


