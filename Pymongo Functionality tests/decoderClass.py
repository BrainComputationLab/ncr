# This document creates a decoder for a sample json object like the kind returned from the web server's database query 
#Tutorial from http://pymotw.com/2/json/

import json

class MyDecoder(json.JSONDecoder):
	def __init__(self):
		json.JSONDecoder.__init__(self,  object_hook=self.dict_to_object)

    #translate the dictionary to an object 
	def dict_to_object(self, d):
		if '__class__' in d:
			class_name = d.pop('__class__')
           		module_name = d.pop('__module__')
            		module = __import__(module_name)
            		class_ = getattr(module, class_name)
            		args = dict( (key.encode('ascii'), value) for key, value in d.items())
            		inst = class_(**args)
        	else:
            		inst = d
        	return inst

encoded_object = '[{"s": "instance value goes here", "__module__": "json_myobj", "__class__": "MyObj"}]'

