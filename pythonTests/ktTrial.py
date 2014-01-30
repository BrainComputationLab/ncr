import json
import tempfile


print json.dumps( {"#izh_parameters": {
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
     }, indent=4, separators=(',' , ': '))
