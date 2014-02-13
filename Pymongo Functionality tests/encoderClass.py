#Based on tutorial from http://pymotw.com/2/json/

import json


#Create class to encode
class MyObj(object):
	def __init__(self, s):
		self.s = s
    #get out the type, model, a,b,c,d,u,v info from sampleIzhikevich
	def __repr__(self):
		return '<MyObj(%s)>' % self.s

class MyEncoder(json.JSONEncoder):
	def default(self, obj):
		d = { '__class__': obj.__class__.__name__,
            '__module__':obj.__module__,
		    }
		d.update(obj.__dict__)
		return d

data = { 'a':'A', 'b':(2, 4), 'c':3.0 } 
sampleIzhikevich =  {"#izh_parameters": {
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
     }

#Makes the object with string s as data, followed by module and class info
object = MyObj(data)
print 'USING ENCODER CLASS: ' , MyEncoder().encode(object)
