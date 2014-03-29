#Tutorial and Info from : http://pymotw.com/2/json/

import json

#encoding/decoding data types
data = [ {'a':'A', 'b':(2,4), 'c':3.0}]
print 'Data : ' + repr(data)

#JSON.DUMPS encodes 
data_string = json.dumps(data)
print 'JSON ENCODED: ' + data_string
print 'JSON DECODED: ' ,  json.loads(data_string)  #json.loads returns list


# JSON.LOADS decodes 
print 'ORIGINAL: ' , type(data[0]['b'])
decoded = json.loads(data_string)
print 'DECODED: '  , type(decoded[0]['b'] )

#Using sort keys and indent
print 'SORTED: ' , json.dumps(data, sort_keys=True)

#keys in dictionaries are assumed to be strings
#printing dataNew w/out skipKeys makes ERROR: keys must be a string
#skipKeys just ignores keys that aren't strings
dataNew = [ { 'a':'A', 'b':(2, 4), 'c':3.0, ('d',):'D tuple' } ]
print json.dumps(dataNew, skipkeys=True)
