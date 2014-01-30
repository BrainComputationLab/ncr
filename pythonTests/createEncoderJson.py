#Based on tutorial from http://pymotw.com/2/json/
import json

#Create class to encode
class MyObj(object):
	def __init__(self, s):
		self.s = s
	def __repr__(self):
		return '<MyObj(%s)>' % self.s

#convert unknown type to a known type
obj = MyObj('instance value goes here')
sampleIzhikevich = MyObj('[ {"#izh_parameters": {
                    "type": "model_parameters",
                    "model_type": "izhikevich",
                    "a": { "type": "exact", "value": 1.0},
                    "b": { "type": "normal", "mean": 1.0, "std_dev": 0.1},
                    "c": { "type": "exact", "value": 1.0},
                    "d": { "type": "exact", "value": 1.0},
                    "u": { "type": "exact", "value": 1.0},
                    "v": { "type": "exact", "value": 1.0}
                    },
                    "#box_generator": {
                    "type": "geometry_generator",
                    "generator_type": "box",
                    "x": { "type": "uniform", "min_value": -1.0, "max_value": 1.0 },
                    "y": { "type": "uniform", "min_value": -1.0, "max_value": 1.0 },
                    "z": { "type": "uniform", "min_value": -1.0, "max_value": 1.0 }
                    }
                    }]')
#convert objs to dicionary of representation
def convert_type(obj):
	d = { '__class__':obj.__class__.__name__,
	      '__module__':obj.__module__,
	    }

	d.update(obj.__dict__)
	return d

print 
print 'ENCODED: ' , json.dumps(obj, default=convert_type)


#Decoding the results....
def dict_to_object(d):
	if '__class___' in d:
		class_name = d.pop('__class__')
		module_name = d.pop('__module__')
		module = __import__(module_name)
		class_ = getattr(module, class_name)
		args = dict( (key.encode('ascii'), value) for key, in d.items() )
		inst = class_(**args)
	else:
		inst = d
	return inst
encoded_object = '[{"s": "instance value goes here", "__module__": "json_myobj", "__class__": "MyObj"}]'

#object hook grabs at each element
myobj_instance = json.loads(encoded_object, object_hook=dict_to_object)

print
print 'DECODED: ', myobj_instance
