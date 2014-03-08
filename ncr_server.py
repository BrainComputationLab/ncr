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
    modelList = list(  list(db.Neuron.find() )  )
    #modelList = list(db.Channels.find())
    return render_template('index.html', year = year, mcount = len( modelList), db =  modelList ) #, models = list( db.sampleIzh.find()) )

def getmodels():
    modelsdb = db.sampleIzh
    models = list(modelsdb.find())  
    return json_util.dumps(models)

def displayResults():
    return render_template('index.html', year = year, returned = izhCollection.find_one( {"entity_type": "neuron"} ), count = 48)#numResults)

def search_scopes():
    scope = 'global' #replace with form data
    user = list( db.Users.find( {'_id' : '6'}) ) #Replace with Gathered user's info
    modelList = []
    userIDList = []
    userNameList = []
    
    if scope =='global':
        modelList = db.Channels.find()
        return render_template('index.html', year = 2014, mcount = len(modelList), db = modelList )
    if scope == 'personal':
        userIDList = list(user)
    elif scope == 'lab':
        userIDList = list(db.Labs.find( {'_id' : 'lab2'}, {'Users' : 1} )[0]['Users'])
    #Create list of First + Last name of each author
    #Should add email double check in the case of duplicate user names
    for user in userIDList:
        currentUser = db.Users.find({'_id' : user})
        if currentUser:
            userNameList.insert(0,  str(currentUser[0]['First_Name'] + " " + currentUser[0]['Last_Name']) )
            modelList.extend( db.Channels.find({'author': userNameList[0]}) )
    return render_template('index.html', year = userNameList, mcount = len(modelList), db = modelList )

@app.route('/get_db', methods = ['GET'])
def get_db():
	modelsdb = db.sampleIzh
	returnedModels = list(modelsdb.find())
	return json_util.dumps(returnedModels)

@app.route('/search_scope', methods =['GET'])
def search_scope():
    #Get the scope selection
    scope = 'personal'
    user._id = 'user1'
    lab._id = 'lab2'
    modelList = []
    userIDList = []
    userNameList = []
    if scope == 'personal':
        userList = user._id
    elif scope == 'lab':
        userIDList = list( db.Labs.find( {'_id' : user.Lab}, {'Users' : 1} ))
        #Create list of First + Last name of each author
        for userID in userIDList:
            userNameList.extend( str( db.Users.find( {'_id' : userID} ).First_Name + db.Users.find( {'_id' : userID} ).Last_Name))
        for userName in userNameList:
            for collection in collectionSearchList:
                modelList.extend( db.collection.find({'Author': userName}) )
    #Get list of users included
    #Get models with those users into the list
    #Return the list
    return render_template('index.html', year = 2014, mcount = len(modelList), db = modelList )


# Serves static resources like css, js, images, etc.
@app.route('/assets/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/assets/', resource)

if __name__ == '__main__':
    app.run()