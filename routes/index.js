var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path');
var appDir = path.join(path.dirname(require.main.filename), '..');
var app = express();

var requestNum = 0;

/**
 * MongoDB Setup
 */
const assert = require('assert');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://kattis:gSpXVFFx7WDdfzoN@kattishelper-3x5fa.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "kattishelper";
const COLLECTION_NAME = 'kattisHelperDB';
var db, userCollection;

app.listen(3001, () => {
	console.log('[SRV] [mongo] Connecting to MongoDB Atlas server: ' + DATABASE_NAME);
		mongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('[SRV] [mongo] Connected successfully to MongoDB Atlas server: ' + DATABASE_NAME);
		
		//set global objects
		db = client.db(COLLECTION_NAME);
		userCollection = db.collection('users');
	});
});

/**
 * utilities
 */
//purge unverified users
function clearUnverifiedUsers() {
	userCollection.deleteMany({"isVerified": "false"}, (error, result) => {
		if (error) {
			console.log('[SRV] clearUnverifiedUsers() error: ' + error);
		} else {
			console.log('[SRV] clearUnverifiedUsers() successful');
		}
	});
}


/**
 * static files
 * For client-side assets
 */
router.use('/static', express.static(appDir + '/public/javascripts'));
router.use('/static', express.static(appDir + '/public/stylesheets'));
router.use('/static', express.static(appDir + '/public/images'));

/**
 * global objects
 * Use fs to open and parse JSON
 */
 console.log('[SRV] [FS] loading up JSON assets');
var problemsJSON = {}; //all problems
fs.readFile(appDir + '/data/problems.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] File read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problems.json read successfully');
		problemsJSON = JSON.parse(jsonString);
	}
})

var problemsListJSON = {}; //all problems
fs.readFile(appDir + '/data/problemsList.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsList.json read successfully');
		problemsListJSON = JSON.parse(jsonString);
	}
})

var problemsQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] File read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsQuery.json read successfully');
		problemsQueryJSON = JSON.parse(jsonString);
	}
})

var problemsIDQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsIDQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] File read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsIDQuery.json read successfully');
		problemsIDQueryJSON = JSON.parse(jsonString);
	}
})

/**
 * HTTP routes for directs
 */
//get home page
router.get('/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /');
	requestNum++;
	
	res.sendFile(appDir + '/src/index.html');
	console.log('[OUT] [GET] sent index.html');
});

//kattis problems related routes
//get problem list
router.get('/problemsList', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemsList');
	requestNum++;

	res.sendFile(appDir + '/src/problemsList.html');
	console.log('[OUT] [GET] sent problemsList.html');
});

//get specific problem
router.get('/problem/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problem/');
	requestNum++;
	
	res.sendFile(appDir + '/src/problem.html');
	console.log('[OUT] [GET] sent problem.html');
});

//get problem not found page
router.get('/problemNotFound', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemNotFound');
	requestNum++;
	
	res.sendFile(appDir + '/src/problemNotFound.html');
	console.log('[OUT] [GET] sent problemNotFound.html');
});

//get login page
router.get('/login', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /login');
	requestNum++;
	
	res.sendFile(appDir + '/src/login.html');
	console.log('[OUT] [GET] sent login.html');
});

//get create_account page
router.get('/create_account', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /create_account');
	requestNum++;
	
	res.sendFile(appDir + '/src/create_account.html');
	console.log('[OUT] [GET] sent create_account.html');
});

//get forgot_password page
router.get('/recover_password', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /recover_password');
	requestNum++;
	
	res.sendFile(appDir + '/src/recover_password.html');
	console.log('[OUT] [GET] sent recover_password.html');
});

//get verify user page
router.get('/verify', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /user');
	requestNum++;
	
	res.sendFile(appDir + '/src/verify.html');
	console.log('[OUT] [GET] sent verify.html');
});

//get user page
router.get('/user', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /user');
	requestNum++;
	
	res.sendFile(appDir + '/src/user.html');
	console.log('[OUT] [GET] sent user.html');
});

//get error 404 page
router.get('/error', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /error');
	requestNum++;
	
	res.sendFile(appDir + '/src/error.html');
	console.log('[OUT] [GET] sent error.html');
});

/**
 * HTTP requests for authentication
 */

//authenticate user
router.post('/auth', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /auth');
	requestNum++;
	var username = req.body.username;
	var password = req.body.password;
	var response;
	
	if (username && password) {
		userCollection.findOne({"username": username}, (error, result) => {
			if (error) {
				res.status(404);
				console.log('[OUT] [POST] sent 404');
				res.send();
			} else {
				console.log('[SRV] /auth query successful');
				if (result === null) {
					console.log('[SRV] user is invalid: ' + username);
					response = JSON.stringify('3');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (result.isVerified == 'false') {
					console.log('[SRV] user is not verified: ' + username);
					response = JSON.stringify('4');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (password == result.password) {
					console.log('[SRV] user logged in: ' + username);
					response = JSON.stringify('1');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else {
					console.log('[SRV] user failed password: ' + username);
					response = JSON.stringify('2');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				}
			}
		});
	} else {
		console.log('[SRV] empty credentials for /auth');
		res.send(JSON.stringify('-1'));
		console.log('[OUT] [POST] sent req');
	}
});

//verify user
router.post('/verifyUser', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /verifyUser/');
	requestNum++;
	
	var username = req.body.username;
	var verification = req.body.verification;
	if (username && verification) {
		userCollection.findOne({"username": username}, (error, result) => {
			if (error) {
				res.status(404);
				console.log('[OUT] [POST] sent 404');
				res.send();
			} else {
				console.log('[SRV] /verifyUser/ query successful');
				if (result === null) {
					console.log('[SRV] user is not found: ' + username);
					response = JSON.stringify('3');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (result.isVerified == 'true') {
					console.log('[SRV] user is already verified: ' + username);
					response = JSON.stringify('4');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (verification == result.verificationCode) {
					
					//query and change in mongo
					userCollection.findOneAndUpdate({"username": username}, {$set: {isVerified: 'true'}}, (error, result) => {
						if (error){
							console.log('[SRV] query error');
							console.log('[SRV] user verification failed');
							response = JSON.stringify('2');
							res.send(response);
							console.log('[OUT] [POST] sent res: ' + response);
						} else {
							console.log('[SRV] updated document: ' + username);
							console.log('[SRV] user verification success');
							response = JSON.stringify('1');
							res.send(response);
							console.log('[OUT] [POST] sent res: ' + response);
						}
					});
				} else if (verification != result.verificationCode) {
					console.log('[SRV] user verification failed');
					response = JSON.stringify('2');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				}
			}
		});
	} else { //empty credentials
		console.log('[SRV] empty credentials for /verifyUser');
		res.send(JSON.stringify('-1'));
		console.log('[OUT] [POST] sent req');
	}
});

//create temp user
router.post('/createUser', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /createUser');
	requestNum++;
	
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	
	//check for unique username
	if (!email.includes('@') || !email.includes('.')) {
		console.log('[SRV] user email is invalid: ' + email + ' (' + username + ')');
		response = JSON.stringify('4');
		res.send(response);
		console.log('[OUT] [POST] sent res: ' + response);
		
	} else if (username && password && email) {
		//verify unique username
		userCollection.findOne({"username": username}, (error, result) => {
			if (result === null) {
				//create user
				//generate verification code
				var verification = Math.floor((Math.random() / Math.random() * 100000000));
				var user = {
					"username": username,
					"password": password,
					"email": email,
					"isVerified": "false",
					"verificationCode": verification
				};
				//query database and insert user
				userCollection.insertOne( user, (error, result) => {
					if (error) {
						console.log('[INC] [mongo] item failed to add to database: ' + COLLECTION_NAME);
						console.log('[SRV] failed to add user in mongodb: ' + username);
						response = JSON.stringify('3');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[INC] [mongo] item added successfully to database: ' + COLLECTION_NAME);
					}
				});
				
				console.log('[SRV] created unverified user: ' + username);
				response = JSON.stringify('1');
				res.send(response);
				console.log('[OUT] [POST] sent res: ' + response);
			} else { //duplicate user
				console.log('[SRV] duplicate username: ' + username);
				response = JSON.stringify('2');
				res.send(response);
				console.log('[OUT] [POST] sent res: ' + response);
			}
		});
	} else { //empty credentials
		console.log('[SRV] empty credentials for /createUser');
		res.send(JSON.stringify('-1'));
		console.log('[OUT] [POST] sent req');
	}
});

/**
 * HTTP queries for problems
 */
//query specific problem
router.get('/problemQuery/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemQuery/' + req.query.q);
	requestNum++;
	
	if (problemsQueryJSON.indexOf(req.query.q) > -1) {
		console.log('[SRV] problem found: ' + req.query.q);
		res.send(problemsJSON[problemsQueryJSON.indexOf(req.query.q)]);
		console.log('[OUT] [GET] sent over problem: ' + req.query.q);
	} else if (problemsIDQueryJSON.indexOf(req.query.q) > -1) {
		console.log('[SRV] problemID found: ' + req.query.q);
		res.send(problemsJSON[problemsIDQueryJSON.indexOf(req.query.q)]);
		console.log('[OUT] [GET] sent over problem: ' + req.query.q);
	} else {
		console.log('[SRV] problem not found: ' + req.query.q);
		res.status(404);
		res.send();
		console.log('[OUT] [GET] sent over 404');
	}
});

//query for problems list
router.get('/problemsListAll', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemsListAll');
	requestNum++;
	
	res.send(problemsListJSON);
	console.log('[OUT] [GET] sent problemsList.json');
});

module.exports = router;