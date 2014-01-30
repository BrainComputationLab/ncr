#Based on tutorial from http://pymotw.com/2/json/

import json
import tempfile

data = [ { 'a':'A', 'b':(2, 4), 'c':3.0 } ]
#JSON DUMP
f = tempfile.NamedTemporaryFile(mode='w+')
json.dump(data, f)
f.flush()
print open(f.name, 'r').read()

#JSON LOAD
f = tempfile.NamedTemporaryFile(mode='w+')
f.write('[{"a": "A", "c": 3.0, "b": [2, 4]}]')
f.flush()
f.seek(0)
print json.load(f)
