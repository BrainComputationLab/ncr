from flask import Flask, render_template, send_from_directory, redirect, request, url_for, jsonify
from werkzeug import secure_filename
import datetime, os, bson, json, pymongo, random, string, crypt
from pymongo import MongoClient
from bson import json_util
from bson.json_util import dumps
#from flask.ext.mail import Mail, Message
#from Crypto.Cipher import AES

app = Flask(__name__)
app.debug = True 
uploadFolder = 'uploads'
allowedFileExtension = set(['json','py'])
client = MongoClient("mongodb://braintest:braintest@ds041167.mongolab.com:41167/brainlab_test")
db = client.brainlab_test
app.config['UPLOAD_FOLDER'] = uploadFolder
GlobalThreshold = 0;#number of promotions needed to elevate model to global
RegionalThreshold = 0;#number of promotions needed to elevate model to next region

app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587,
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = 'falconiarmie@gmail.com',
    MAIL_PASSWORD = 'A10324747F'
))

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
    global response;
    return render_template('index.html', year = year)

@app.route('/dbmodels/<dbmodel>', methods=['GET', 'PUT', 'DELETE'])
def handleDBRequest(username):
    # Get the models collection
    modelsdb = db.Channels
    # If it's a get request, return the requested user
    if request.method == 'GET':
        # Find the model in the mongo collection
        dbmodel = modelsdb.find_one({'dbmodel': dbmodel})
        # Serialize it as JSON and return to the client
        return json.dumps(dbmodel)
    # If adding/updating a model
    if request.method == 'PUT':
        # Deserialize the json object into a dict
        dbmodel = json.loads(request.get_data())
        # Update the user with the new data, or insert if it doesn't exist (upsert)
        dbmodel.update({'dbmodel': dbmodel}, dbmodel, upsert=True)
        return ''
    # If deleting a user
    if request.method == 'DELETE':
        # Remove the user from the database
        dbmodel.remove({'dbmodel': dbmodel })
        return ''

#This route returns all models in the database
@app.route('/dbmodels', methods = ['GET'])
def getDBModels():
    dbmodels = list( db.Channels.find() ) 
    dbmodels.extend(  list(db.Neuron.find() )  )
    dbmodels.extend( list( db.Stimulus.find() ) )
    dbmodels.extend( list( db.Synapse.find() ) )

    return json_util.dumps(dbmodels)


# This route returns all the users in the database
@app.route('/users', methods=['GET'])
def getUsers():
    # Load all users in the DB
    users = list(db.Users.find())
    # Send them back to the client as a json string
    return json_util.dumps(users)

#This route handles all standard user requests
@app.route('/users/<sessionID>', methods=['GET', 'PUT', 'POST', 'DELETE'])
def handleUserRequest(sessionID):    
	# Get the user data
	if request.method == 'GET':
		# Hardcheck for existing user		
		check =  db.Users.find({'Username': request.form['uemail']});
		if check.count():
			return jsonify({"success" : False});
		else:
			return jsonify({"success" : True}); 
	# If updating a user (e.g. logging in)
	elif request.method == 'PUT':
		# Check content
		if not len(request.form['luser']):
			return jsonify({"success" : False, "error": "No user passed."});
		if not len(request.form['lpassword']):
			return jsonify({"success" : False, "error": "No password passed."});
		# Check user exists? Compare password?
		check = db.Users.find({'Username': request.form['luser']});
		if not check.count():
			return jsonify({"success" : False, "error": "Invalid username and/or password."});
		# Encrypt above	
		check = list(check)
		pw = crypt.crypt(request.form['lpassword'], '$6$' + check[0]['Secret'] + '$')
		check = db.Users.find({'Username': request.form['luser'].lower(), 'Password': pw});
		if not check.count():
			return jsonify({"success" : False, "error": "Invalid username and/or password."});	
		check = list(check);				
		# Success! Create session ID		
		session = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(16)])
		# Update the user with the new data
		db.Users.update({'Username': request.form['luser']}, { "$set": {'Session_ID' : session, 'Last_Activity': str(datetime.datetime.now()),  'Login_Site': request.remote_addr} });
		# Return session id
		return jsonify({"success" : True, "session_id" : session, "logged": request.form['luser'], "rank": check[0]["Rank"], "activation": check[0]['Activate']});
	# If adding a user
	elif request.method == 'POST':
		# Hardcheck for existing user		
		check =  db.Users.find({'Username': request.form['uemail'].lower()});
		if check.count():
			return jsonify({"success" : False, "error": "Email already registered."});
		# Hardcheck for valid email, password, security question, and security answer
		if not len(request.form['usecurityQuestion']):
			return jsonify({"success" : False, "error": "No security question passed."});
		elif not len(request.form['usecurityAnswer']):
			return jsonify({"success" : False, "error": "No security answer passed."});
		elif not len(request.form['upassword']):
			return jsonify({"success" : False, "error": "No password passed."});
		elif not len(request.form['uconfirm']):
			return jsonify({"success" : False, "error": "No confirmation passed."});
		# in javascript compare password with confirm
		if request.form['upassword'] != request.form['uconfirm']:
			return jsonify({"success" : False, "error": "Password and confirmation do not match."});
		# Prep random activation code
		activate = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(16)])	
		# Encrypt password
		key = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
		pw = crypt.crypt(request.form['upassword'], '$6$' + key + '$')
        # Insert the user with the new data
		db.Users.insert({'Username': request.form['uemail'].lower(), 'Password': pw, 'Secret': key, 
		'Security_Question': request.form['usecurityQuestion'], 'Security_Answer': request.form['usecurityAnswer'].lower(), 
		'Time_Created': str(datetime.datetime.now()), 'Last_Activity': 0, 'Login_Site': 0, 'Lab': 0, 'Rank': 'neuroscientist', 
		'Session_ID': 0, 'Activate': activate, 'First_Name': request.form['ufirstName'].lower(), 'Last_Name': request.form['ulastName'].lower(), 
		'Subscription': 0});
        #Send email to specified email with an activation link
		mail = Mail(app);
		msg = Message("Welcome to NCS", sender="NCR@no-reply.com", recipients=[request.form['uemail']])
		msg.body = "Welcome to NCS. Enclosed is your activation code: "+activate;
		mail.send(msg);
		return jsonify({"success" : True}); 
	# If logging out a user
	elif request.method == 'DELETE':
		# Check user is logged in
		check = db.Users.find({'Session_ID': sessionID});
		if not check.count():
			return jsonify({"success" : False, "error": "Invalid session id."});			
		# Update the user with the new data
		db.Users.update({'SessionID': sessionID}, { "$set": {'Session_ID' : 0, 'Last_Activity': str(datetime.datetime.now())} });
		# Done
		return jsonify({"success" : True});

@app.route('/activate/<email>', methods=['GET', 'POST'])
def handleActivationRequest(email):    
	# If it's a get request, return re-send the activation email
	if request.method == 'GET':
		#Send email
		check =  db.Users.find({'Username': email.lower()});
		if not check.count():
			return jsonify({"success" : False, "error": "No such user: "+email});
		if not list(check)[0]['Activate']:
			return jsonify({"success" : False, "error": "Account already activated."});
		mail = Mail(app);
		msg = Message("Welcome to NCS", sender="NCR@no-reply.com", recipients=[email])
		msg.body = "Welcome to NCS. Enclosed is your activation code: "+activate;
		mail.send(msg);
		return jsonify({"success" : True}); 
	# If it's an update request, attempt to activate the user
	elif request.method == 'POST':
		check = db.Users.find({'Username': email.lower(), 'Activate': request.form['acode']});
		if check.count() < 1:
			return jsonify({"success" : False, "error": "No such user or the activation code does not match."});
		db.Users.update({'Username': email}, { "$set": {'Activate': 0, 'Last_Activity': str(datetime.datetime.now())} });
		return jsonify({"success" : True}); 

@app.route('/forgot', methods=['PUT', 'POST'])
def handleForgetRequest():    
	# If it's a get request, return the security question upon matching the email
	if request.method == 'PUT':
		#Send email
		check =  db.Users.find({'Username': request.form['email'].lower()});
		if not check.count():
			return jsonify({"success" : False, "error": "No such user: "+email});
		else:
			check = list(check);
		return jsonify({"success" : True, "question": check[0]["Security_Question"]}); 
	# If it's an update request, attempt to activate the user
	elif request.method == 'POST':
		check = db.Users.find({'Username': request.form['email'].lower(), 'Security_Answer': request.form['securityAnswer'].lower()});
		if check.count() < 1:
			return jsonify({"success" : False, "error": "You did not answer your security question correctly."});
		check = list(check);
		# Generate new random password
		password = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(8)]);
		key = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(32)])
		pw = crypt.crypt(password, '$6$' + key + '$')
		# Update password and key
		db.Users.update({'Username': request.form['email'].lower(), 'Security_Answer': request.form['securityAnswer'].lower()}, { "$set": {'Password' : pw, 'Secret': key} });
		# Send new password to email
		mail = Mail(app);
		msg = Message("NCS Password Recovery", sender="NCR@no-reply.com", recipients=[request.form['email']])
		msg.body = "We are sorry that you forgot your password. We have randomly generated a new password for you, please take the time to update your password after logging in by selecing 'Preferences' from the navigation bar and following the appropriate prompts. Enclosed is your new password: "+password+"\nIf you have not requested a password recovery, please take steps to maximize your account security.";
		mail.send(msg);
		return jsonify({"success" : True}); 
		
@app.route('/promote/<model>', methods=['POST', 'DELETE'])
def handlePromoteRequest(model):    
	sessionID = int(request.form['sessionID']);
	user = request.form['logged'];	
	#Check user logged in
	if sessionID == 0:
		return jsonify({"success": False, "error": "User must be logged in."});
	#Use sessionID to get user
	check =  db.Users.find({'SessionID': sessionID, 'Logged': user});
	if not check.count():
		return jsonify({"success" : False, "error": "SessionID does not match any users on file."});
	else:
		lab = list(check).Lab;
		check = db.Labs.find({'Lab': lab});
		region = check.list().Region;

	if request.method == 'POST':
		#Check if user already promoted this model
		check =  db.Channels.find({'_id.$oid': model});
		if not check.count():
			check = db.Neurons.find({'_id.$oid': model});
			if not check.count():
				return jsonify({"success" : False, "error": "Model id does not match any models on file."});				
			else:
				votes = list(check).votes;
				if user in votes:
					return jsonify({"success" : False, "error": "User has already promoted this model."});			
				else:
					votes = votes.append(user);
					# Compare against thresholds to see if model elevates
					elev = eventElevate(len(votes));
					if elev == 2:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': 'global'} });
						return jsonify({"success" : True, 'scope': 'global', "update": votes}); 
					elif elev == 1:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': region} });					
						return jsonify({"success" : True, 'scope': region, "update": votes}); 
					else:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': lab} });
						return jsonify({"success" : True, "update": votes}); 
		else:
			votes = list(check).votes;
			if user in votes:
				return jsonify({"success" : False, "error": "User has already promoted this model."});			
			else:			
				votes = votes.append(user);
				# Compare against thresholds to see if model elevates
				elev = canElevate(len(votes), scope);
				if elev == 2:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': 'global'} });
					return jsonify({"success" : True, 'scope': 'global', "update": votes}); 
				elif elev == 1:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': region} });					
					return jsonify({"success" : True, 'scope': region, "update": votes}); 
				else:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes} });		
					return jsonify({"success" : True, "update": votes}); 
	elif request.method == 'DELETE':
		#Check if user has not promoted this model
		check =  db.Channels.find({'_id.$oid': model});
		if not check.count():
			check = db.Neurons.find({'_id.$oid': model});
			if not check.count():
				return jsonify({"success" : False, "error": "Model id does not match any models on file."});				
			else:
				votes = list(check).votes;
				if user in votes:
					votes = votes.remove(user);
					# Compare against thresholds to see if model elevates
					elev = canElevate(len(votes), scope);
					if elev == 2:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': 'global'} });
						return jsonify({"success" : True, 'scope': 'global', "update": votes}); 
					elif elev == 1:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': region} });					
						return jsonify({"success" : True, 'scope': region, "update": votes}); 
					else:
						db.Neurons.update({'_id.$oid': model}, { "$set": {'votes' : votes} });				
						return jsonify({"success" : True, "update": votes}); 
				else:
					return jsonify({"success" : False, "error": "User has not promoted this model."});			
		else:
			votes = list(check).votes;
			if user in votes:
				votes = votes.remove(user);
				# Compare against thresholds to see if model elevates
				elev = canElevate(len(votes), scope);
				if elev == 2:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': 'global'} });
					return jsonify({"success" : True, 'scope': 'global', "update": votes}); 
				elif elev == 1:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes, 'scope': region} });					
					return jsonify({"success" : True, 'scope': region, "update": votes}); 
				else:
					db.Channels.update({'_id.$oid': model}, { "$set": {'votes' : votes} });				
					return jsonify({"success" : True, "update": votes}); 
			else:
				return jsonify({"success" : False, "error": "User has not promoted this model."});			

# Update the promotion thresholds periodically
def updateThresholds():
	#check = db.Users.find();#the threshold may someday be based on the total number of users
	RegionThreshold = 25;#check.count()/20+1;
	GlobalThreshold = 5;#check.count()/5+1;

# Update the promotion thresholds periodically
def canElevate(votes):
	updateThresholds();#periodic check to see if we should update thresholds
	if votes >= GlobalThreshold:
		return 2
	elif votes >= RegionThreshold:
		return 1;
	else: 
		return 0;
		
@app.route('/region', methods=['POST', 'DELETE'])
def handleRegions():  
	#check sessionID and Logged
	sessionID = int(request.form['sessionID']);
	user = request.form['logged'];	
	#Check user logged in
	if sessionID == 0:
		return jsonify({"success": False, "error": "User must be logged in."});
	#Use sessionID to get user
	check =  db.Users.find({'SessionID': sessionID, 'Username': user});
	if not check.count():
		return jsonify({"success" : False, "error": "SessionID does not match any users on file."});
	else:
		if check[0]["Rank"] != "admin":
			return jsonify({"success" : False, "error": "This user is not an admin."});
	if request.method == 'POST':
		#If region already exists, error
		check =  db.Regions.find({'Name': request.form['regionAdd']});
		if not check.count():
			db.Regions.insert({'Name': request.form['regionAdd']});
			return jsonify({"success" : True}); 
		else:
			return jsonify({"success" : False, "error": "This region already exists. Duplicates not permitted."});				
	elif request.method == 'DELETE':
		#If region does not exist, error
		check =  db.Regions.find({'Name': request.form['regionRemove']});
		if check.count():
			db.Regions.delete({'Name': request.form['regionRemove']});
			return jsonify({"success" : True}); 
		else:
			return jsonify({"success" : False, "error": "This region does not exist. Cannot delete what does not exist."});

@app.route('/lab', methods=['POST', 'DELETE', 'PUT'])
def handleLabs():  
	#check sessionID and Logged
	sessionID = int(request.form['sessionID']);
	user = request.form['logged'];	
	#Check user logged in
	if sessionID == 0:
		return jsonify({"success": False, "error": "User must be logged in."});
	#Use sessionID to get user
	check =  db.Users.find({'SessionID': sessionID, 'Username': user});
	if not check.count():
		return jsonify({"success" : False, "error": "SessionID does not match any users on file."});
	else:
		if request.method != "PUT": #verify is lab manager
			if check[0]["Rank"] != "admin": #otherwise must be admin to add and remove labs
				return jsonify({"success" : False, "error": "This user is not an admin."});
	if request.method == 'POST':
		#If lab already exists, error
		check =  db.Labs.find({'Name': request.form['labAdd']});
		if not check.count():
			db.Labs.insert({'Name': request.form['labAdd'], 'Region': request.form['region']});
			return jsonify({"success" : True}); 
		else:
			return jsonify({"success" : False, "error": "This lab already exists. Duplicates not permitted."});				
	elif request.method == 'DELETE':
		#If lab does not exist, error
		check =  db.Labs.find({'Name': request.form['labRemove']});
		if check.count():
			db.Labs.delete({'Name': request.form['labAdd']});
			return jsonify({"success" : True}); 
		else:
			return jsonify({"success" : False, "error": "This lab does not exist. Cannot delete what does not exist."});
	elif request.method == 'PUT':
		check =  db.Labs.find({'Manager': user});
		#If the lab does not exist, error
		if not check.count():
			return jsonify({"success" : False, "error": "This user does not manage any labs."});
		else:
			lab = list(check)[0]["Name"]; #Get the lab the user manages
		#If the target user does not exist, error
		check = db.Users.find({'Username': request.form['labTarget']});
		if not check.count():
			return jsonify({"success" : False, "error": "Target user cannot be added because the user does not exist. "});
		else:
			#If the target user already has a lab, error--ask the user to resign from their lab
			if list(check)[0]["Lab"] != 0:
				return jsonify({"success" : False, "error": "Target user cannot be added because the user is already in a lab. "});
		db.Users.update({'Username': request.form['labTarget']}, { "$set": {'Lab' : lab} });				
	#Code to allow users to abandon labs necessary
	#need code to set manager of lab, might as well fork this code off
	#deletion of region when labs exist under it; deletion of labs when users are in it
	
# Serves static resources like css, js, images, etc.
@app.route('/assets/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/assets/', resource)

if __name__ == '__main__':
    app.run('localhost', 5000)
