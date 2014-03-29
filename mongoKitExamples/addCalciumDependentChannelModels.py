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
            'm_initial': {
                'type':basestring,
                'value': float
            },
            'reversal_potential': {
                    'type':basestring,
                    'value': float
            },
            'm_power': {
                    'type':basestring,
                    'value': float
            },
            'conductance': {
                    'type':basestring,
                    'value': float
            },
            'forward_scale': {
                    'type':basestring,
                    'value': float
            },
            'forward_exponent': {
                'type':basestring,
                'value': float
            },
            'backwards_rate': {
                    'type':basestring,
                    'value': float
            },
            'tau_scale': {
                    'type':basestring,
                    'value': float
            }
    }
    }
    required_fields=['_id']
    default_values={}

connection = Connection(host="mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test", port=27017)
connection.register([ModelInfo])


item1 = connection.ModelInfo(
                             {
                             "_id": "df90sahf0sd9ha8sdhf8dhsa",
                             "entity_type": "channel",
                             "entity_name": "calcium_dependant_1",
                             "description": "This is an extended description of the entity",
                             "author": "Nathan Jordan",
                             "author_email": "njordan@cse.unr.edu",
                             "channel_parameters": {
                             "type": "calcium_dependant",
                             "m_initial": {
                             "type": "exact",
                             "value": 65.0
                             },
                             "reversal_potential": {
                             "type": "exact",
                             "value": 65.0
                             },
                             "m_power":{
                             "type": "exact",
                             "value": 65.0
                             },
                             "conductance": {
                             "type": "exact",
                             "value": 65.0
                             },
                             "forward_scale": {
                             "type": "exact",
                             "value": 40.0
                             },
                             "forward_exponent": {
                             "type": "exact",
                             "value": 20.0
                             },
                             "backwards_rate": {
                             "type": "exact",
                             "value": 8.8
                             },
                             "tau_scale": {
                             "type": "exact",
                             "value": 65.0
                             }
                             }
                             })

for x in range(0, 12):
    item1['_id'] = "cd" + str(x)
    item1.save()