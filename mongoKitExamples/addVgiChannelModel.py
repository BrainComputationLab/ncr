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
            'v_half_active': { 'type':basestring, 'value':int},
            'transaction_rate': { 'type': basestring, 'value': int},
            'activation_slope': { 'type': basestring, 'value':int },
            'deactivation_slope': { 'type': basestring, 'value': int},
            'equilibrium_slope': { 'type': basestring, 'value': int},
            'conductance': { 'type': basestring, 'value': int},
            'reversal_potential': { 'type': basestring, 'value':int},
            'm_initial': { 'type': basestring, 'value': int},
            'm_power':{ 'type': basestring, 'value' : float}
                
            }
    }
    required_fields=['_id']
    default_values={}

connection = Connection(host="mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test", port=27017)
connection.register([ModelInfo])

item1 = connection.ModelInfo({
                             "_id": "df90sahf0sd9ha8sdhf8dhsa",
                             "entity_type": "channel",
                             "entity_name": "channel_vgi",
                             "description": "This is an extended description of the entity",
                             "author": "Nathan Jordan",
                             "author_email": "njordan@cse.unr.edu",
                             "channel_parameters": {
                             "type": "voltage_gated_ion",
                             "v_half_active": {
                             "type": "exact",
                             "value": 65
                             },
                             "transaction_rate": {
                             "type": "exact",
                             "value": 65
                             },
                             "activation_slope": {
                             "type": "exact",
                             "value": 65
                             },
                             "deactivation_slope": {
                             "type": "exact",
                             "value": 65
                             },
                             "equilibrium_slope": {
                             "type": "exact",
                             "value": 65
                             },
                             "conductance": {
                             "type": "exact",
                             "value": 65
                             },
                             "reversal_potential": {
                             "type": "exact",
                             "value": 65
                             },
                             "m_initial": {
                             "type": "exact",
                             "value": 65
                             },
                             "m_power": {
                                "type":"exact",
                                "value":2.0
                             }
                             }
                             }
                             
                             )

for x in range(0, 11):
    item1['_id'] = "vgi" + str(x)
    item1.save(  ) #auto calls validate




