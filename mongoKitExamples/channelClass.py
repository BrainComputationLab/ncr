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
            'm_initial': { 'type': basestring, 'value': int}

                                }
    }
    required_fields=['_id']
    default_values={}

connection = Connection(host="localhost", port=27017)

connection.register([ModelInfo])
connection.brainlab_test.Channels.ModelInfo({'_id' : 'df90sahf0sd9ha8sdhf8dhsb', 'description':'Bananas are delicious', 'entity_type': 'channel', 'entity_name': 'channel_vgi', 'author':'Lander Burns', 'author_email': 'megaAwesome@something.com', 'channel_parameters.v_half_active.type': 'exact'})

item = connection.brainlab_test.Channels.ModelInfo()
item['_id'] = 'df90sahf0sd9ha8sdhf8dhsf'
item.validate() #Checks that the fields are set correctly
item.save() #Saves to the DB
for post in connection.brainlab_test.Channels.ModelInfo.find():
    print json.dumps(post)
