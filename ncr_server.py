from flask import Flask, render_template, send_from_directory, redirect, request, url_for, jsonify
from werkzeug import secure_filename
import datetime, os
import bson
import json
from bson import json_util
from bson.json_util import dumps
import pymongo
from pymongo import MongoClient

app = Flask(__name__)
app.debug = True 
uploadFolder = 'uploads'
allowedFileExtension = set(['json','py'])
client = MongoClient("mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test")
db = client.brainlab_test
app.config['UPLOAD_FOLDER'] = uploadFolder

##### NCB Template Code #####
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1] in allowedFileExtensions
@app.route('/uploads', methods=['POST'])
def uploadFile():
    if request.method == 'POST':
        file = request.files['uploadFile']
        if file:
            filename = secure_filename(file.filename)
            print os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            print "File Found!"
            return jsonify({"success" : True})
        
        return jsonify({"success" : False})

# function to view / download an uploaded file
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
##### END NCB Template code #####


@app.route('/', methods=['GET'])
def mainPage():
    year = datetime.datetime.now().year
    modelList = list( db.sampleIzh.find() )
    modelList.extend(  list(db.sampleLIF.find() )  )
    return render_template('index.html', year = year, mcount = len( modelList), db =  modelList ) #, models = list( db.sampleIzh.find()) )

def getmodels():
    modelsdb = db.sampleIzh
    models = list(modelsdb.find())  
    return json_util.dumps(models)

def displayResults():
    return render_template('index.html', year = year, returned = izhCollection.find_one( {"entity_type": "neuron"} ), count = 48)#numResults)

@app.route('/get_db', methods = ['GET'])
def get_db():
	modelsdb = db.sampleIzh
	returnedModels = list(modelsdb.find())
	return json_util.dumps(returnedModels)


# Serves static resources like css, js, images, etc.
@app.route('/assets/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/assets/', resource)

if __name__ == '__main__':
    app.run()