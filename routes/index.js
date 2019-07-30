/**
 * routes/index.js
 * handling of http requests for server
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path');
var appDir = path.join(path.dirname(require.main.filename), '..');
var app = express();
let request2 = require('request');
app.use(express.json());

var requestNum = 0; //keep track of the number of requests
var jsonFilesLoaded = 0;
const jsonFilesToLoad = 4;

/**
 * Api Token
 */
var accessToken = 'ec65428e23e670ad88e08516964956f5';
var endpoint = '9ecff548.compilers.sphere-engine.com';

/**
 * MongoDB Setup
 */
const assert = require('assert');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "<mongodb_atlas_uri>";
const DATABASE_NAME = "kattishelper";
const COLLECTION_NAME = 'kattisHelperDB';
var db, userCollection, forumCollection, queriedCollection;

const frontPageUpdateTiming = 1800000; //update once every 30 minutes

app.listen(3001, () => {
	console.log('[SRV] [mongo] Connecting to MongoDB Atlas server: ' + DATABASE_NAME);
		mongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('[SRV] [mongo] Connected successfully to MongoDB Atlas server: ' + DATABASE_NAME);
		
		//set global objects
		db = client.db(COLLECTION_NAME);
		userCollection = db.collection('users');
		forumCollection = db.collection('forums');
		queriedCollection = db.collection('problemsQueried');
		
		while (jsonFilesLoaded < jsonFilesToLoad); //wait for all files to be loaded
		
		//setup frontpage
		createSuggestedProblems();
		fetchPopularProblems();
	});
});

/**
 * nodemailer
 */
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "email",
        pass: "password"
    },
    tls: {
        rejectUnauthorized: false
    }
});
var mailOptions, host, link;

transporter.verify(function(error, success) {
	console.log('[SRV] [nodemailer] checking SMTP transporter connection');
	if (error) {
		console.log('[SRV] [nodemailer] error: ' + error);
	} else {
		console.log("[SRV] [nodemailer] SMTP transporter connection verified");
	}
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
		jsonFilesLoaded++;
	}
});

var problemsListJSON = {}; //all problems
fs.readFile(appDir + '/data/problemsList.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsList.json read successfully');
		problemsListJSON = JSON.parse(jsonString);
		jsonFilesLoaded++;
	}
});

var problemsQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] File read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsQuery.json read successfully');
		problemsQueryJSON = JSON.parse(jsonString);
		jsonFilesLoaded++;
	}
});

var problemsIDQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsIDQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('[SRV] [FS] File read failed:', err);
        return;
    } else {
		console.log('[SRV] [FS] problemsIDQuery.json read successfully');
		problemsIDQueryJSON = JSON.parse(jsonString);
		jsonFilesLoaded++;
	}
});

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

/**
 * HTTP routes for kattis problems
 */
//get problem list
router.get('/problemsList', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemsList');
	requestNum++;

	res.sendFile(appDir + '/src/problemsList.html');
	console.log('[OUT] [GET] sent problemsList.html');
});

router.get('/problem/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	if (req.query.q === undefined) {
		console.log('[INC] [GET] /problem/');
	} else {
		console.log('[INC] [GET] /problem/?q=' + req.query.q);
	}
	requestNum++;
	
	if (req.query.q === undefined) { //no query
		res.sendFile(appDir + '/src/problemsList.html');
		console.log('[OUT] [GET] sent over problemsList.html');
	} else if (problemsIDQueryJSON.indexOf(req.query.q) > -1) { //check against ID
		console.log('[SRV] problemID query successful: ' + req.query.q);
		res.sendFile(appDir + '/src/problem.html');
	} else if (problemsQueryJSON.indexOf(req.query.q) > -1) { //check against name
		console.log('[SRV] problem query successful: ' + req.query.q);
		res.sendFile(appDir + '/src/problem.html');
		
	} else {
		console.log('[SRV] problem not found: ' + req.query.q);
		res.status(404);
		res.send();
		console.log('[OUT] [GET] sent over 404');
	}
	
	console.log('[OUT] [GET] sent problem.html');
});

router.get('/problem', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problem/');
	requestNum++;
	
	console.log(req.query.q);
	console.log(req.query.q === undefined);
	
	if (req.query.q === undefined) {
		res.sendFile(appDir + '/src/problemsList.html');
	} else {
		res.sendFile(appDir + '/src/problem.html');
	}
	
	console.log('[OUT] [GET] sent problem.html');
});

//get problem not found page
router.get('/error', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /error');
	requestNum++;
	
	res.sendFile(appDir + '/src/error.html');
	console.log('[OUT] [GET] sent error.html');
});

//get login page
router.get('/login', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /login');
	requestNum++;
	
	res.sendFile(appDir + '/src/login.html');
	console.log('[OUT] [GET] sent login.html');
});

//get help page 
router.get('/help', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /help');
	requestNum++;
	
	res.sendFile(appDir + '/src/help.html');
	console.log('[OUT] [GET] sent help.html');
});

//get create_account page
router.get('/create_account', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /create_account');
	requestNum++;
	
	res.sendFile(appDir + '/src/create_account.html');
	console.log('[OUT] [GET] sent create_account.html');
});

//get reset_password page
router.get('/reset_password', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /reset_password');
	requestNum++;
	
	res.sendFile(appDir + '/src/reset_password.html');
	console.log('[OUT] [GET] sent reset_password.html');
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
					"verificationCode": verification,
					"forumPosts": [],
					"problemsSolved": []
					
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
				
				//send mail with verification code
				console.log('[SRV] [nodemailer] preparing to send verification email...');
				mailOptions = {
					to : email,
					subject : 'Please confirm your Kattis Helper Account',
					html : 'Hello,<br> Please use this verification code to activate your Kattis Helper Account!<br>' + verification
				}
				console.log('[SRV] [nodemailer] mail options:');
				console.log(mailOptions);
				
				transporter.sendMail(mailOptions, function(error, response){
					if (error) {
						console.log('[SRV] [nodemailer] error: ' + error);
					} else{
						console.log('[SRV] [nodemailer] verification mail successfully sent to: ' + email);
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

//reset password
router.post('/resetPassword', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /resetPassword');
	requestNum++;
	
	var username = req.body.username;
	var verification = req.body.verification;
	var password = req.body.password;
	var email = req.body.email;
	
	if (username && verification && password && email) {
		userCollection.findOne({"username": username}, (error, result) => {
			if (error) {
				res.status(404);
				console.log('[OUT] [POST] sent 404');
				res.send();
			} else {
				console.log('[SRV] /resetPassword query successful');
				if (result === null) {
					console.log('[SRV] user is not found: ' + username);
					response = JSON.stringify('3');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (email != result.email) {
					console.log('[SRV] email is wrong for user: ' + username);
					response = JSON.stringify('4');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				} else if (verification == result.verificationCode) {
					//query and change in mongo
					userCollection.findOneAndUpdate({"username": username}, {$set: {password: password}}, (error, result) => {
						if (error){
							console.log('[SRV] query error');
							console.log('[SRV] password reset failed');
							response = JSON.stringify('5');
							res.send(response);
							console.log('[OUT] [POST] sent res: ' + response);
						} else {
							console.log('[SRV] updated document: ' + username);
							console.log('[SRV] password reset success');
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

//send recovery email
router.post('/sendPasswordCode', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /sendPasswordCode');
	requestNum++;
	
	var username = req.body.username;
	var email = req.body.email;
	
	if (!email.includes('@') || !email.includes('.')) { //check valid email
		console.log('[SRV] user email is invalid: ' + email + ' (' + username + ')');
		response = JSON.stringify('3');
		res.send(response);
		console.log('[OUT] [POST] sent res: ' + response);
	} else if (username && email) {
		//query user
		userCollection.findOne({"username": username}, (error, result) => {
			if (result === null) { //user does not exist
				console.log('[SRV] user is not found: ' + username);
				response = JSON.stringify('2');
				res.send(response);
				console.log('[OUT] [POST] sent res: ' + response);
			} else {
				if (email == result.email) {
					//generate verification code
					var verification = Math.floor((Math.random() / Math.random() * 100000000));
					
					//query and change in mongo
					userCollection.findOneAndUpdate({"username": username}, {$set: {verificationCode: verification}}, (error, result) => {
						if (error){
							console.log('[SRV] query error');
							console.log('[SRV] password recovery failed');
							response = JSON.stringify('2');
							res.send(response);
							console.log('[OUT] [POST] sent res: ' + response);
						} else {
							//send mail with verification code
							console.log('[SRV] [nodemailer] preparing to send password recovery email...');
							mailOptions = {
								to : email,
								subject : 'Kattis Helper Account Recovery',
								html : 'Hello,<br> Please use this recovery code to change the password for your Kattis Helper Account!<br>' + verification
							}
							console.log('[SRV] [nodemailer] mail options:');
							console.log(mailOptions);
							
							transporter.sendMail(mailOptions, function(error, response){
								if (error) {
									console.log('[SRV] [nodemailer] error: ' + error);
									response = JSON.stringify('5');
									res.send(response);
									console.log('[OUT] [POST] sent res: ' + response);
									res.end();
								} else{
									console.log('[SRV] [nodemailer] verification mail successfully sent to: ' + email);
								}
							});
							
							console.log('[SRV] updated document: ' + username);
							console.log('[SRV] password recovery success');
							response = JSON.stringify('1');
							res.send(response);
							console.log('[OUT] [POST] sent res: ' + response);
						}
					});
				} else { //wrong email
					console.log('[SRV] wrong email for user: ' + username);
					response = JSON.stringify('3');
					res.send(response);
					console.log('[OUT] [POST] sent res: ' + response);
				}
			}
		});
	} else { //empty credentials
		console.log('[SRV] empty credentials for /createUser');
		res.send(JSON.stringify('-1'));
		console.log('[OUT] [POST] sent req');
	}
});

/**
 * HTTP requests for problems
 */
//query specific problem
router.get('/problemQuery/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /problemQuery/?problem=' + req.query.q);
	requestNum++;
	
	if (problemsQueryJSON.indexOf(req.query.q) > -1) {
		console.log('[SRV] problem found: ' + req.query.q);
		res.send(problemsJSON[problemsQueryJSON.indexOf(req.query.q)]);
		//console.log(problemsJSON[problemsQueryJSON.indexOf(req.query.q)]);
		console.log('[OUT] [GET] sent over problem: ' + req.query.q);
		
		//update number of times problem has been queried in mongo
		//turned off atm, will only track queries via ID instead
		/*
		queriedCollection.findOne({"problem": req.query.q}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] server error: ' + error);
			} else if (result === null) {
				console.log('[SRV] [mongo] item not found, attempting to add');
				
				newProblem = {
					"problem": req.query.q,
					"problemID": problemsJSON[problemsQueryJSON.indexOf(req.query.q)].problem,
					"numQueried": 1
				};
				
				queriedCollection.insertOne( newProblem, (error, result) => {
					if (error) {
						console.log('[INC] [mongo] item failed to add to database: problemsQueried');
						console.log('[SRV] failed to add queried problem obj: ' + req.query.problem);
					} else {
						console.log('[INC] [mongo] item added successfully to database: problemsQueried');
					}
				});
				
			} else {
				var updatedQueries = result.numQueried;
				updatedQueries++;
				queriedCollection.findOneAndUpdate({"problem": req.query.q}, {$set: {numQueried: updatedQueries}}, (error, result) => {
					if (error){
						console.log('[SRV] [mongo] problem queried update failed for problem: ' + req.query.q);
					} else {
						console.log('[SRV] [mongo] problem queried update successful for problem: ' + req.query.q);
					}
				});
				
			}
		});
		*/
	} else if (problemsIDQueryJSON.indexOf(req.query.q) > -1) {
		console.log('[SRV] problemID found: ' + req.query.q);
		res.send(problemsJSON[problemsIDQueryJSON.indexOf(req.query.q)]);
		console.log('[OUT] [GET] sent over problem ID: ' + req.query.q);
		
		//update number of times problem has been queried in mongo
		queriedCollection.findOne({"problemID": req.query.q}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] server error: ' + error);
			} else if (result === null) {
				console.log('[SRV] [mongo] item not found, attempting to add');
				
				newProblem = {
					"problem": problemsJSON[problemsIDQueryJSON.indexOf(req.query.q)].problem,
					"problemID": req.query.q,
					"numQueried": 1
				};
				
				queriedCollection.insertOne( newProblem, (error, result) => {
					if (error) {
						console.log('[INC] [mongo] item failed to add to database: problemsQueried');
						console.log('[SRV] failed to add queried problem obj: ' + req.query.problem);
					} else {
						console.log('[INC] [mongo] item added successfully to database: problemsQueried');
					}
				});
				
			} else {
				var updatedQueries = result.numQueried;
				updatedQueries++;
				queriedCollection.findOneAndUpdate({"problemID": req.query.q}, {$set: {numQueried: updatedQueries}}, (error, result) => {
					if (error){
						console.log('[SRV] [mongo] problem queried update failed for problem: ' + req.query.q);
					} else {
						console.log('[SRV] [mongo] problem queried update successful for problem: ' + req.query.q);
					}
				});
				
			}
		});
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

/**
 * HTTP requests for forum
 */
//get forum posts for a problem
router.get('/forum/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /forum/' + req.query.problem);
	requestNum++;
	
	console.log('[SRV] fetching forum query: ' + req.query.problem);
	if (problemsIDQueryJSON.indexOf(req.query.problem) > -1) {
		console.log('[SRV] problem found: ' + req.query.problem);
		forumCollection.findOne({"problem": req.query.problem}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] forums query failed');
			} else if (result === null) { //not found
				console.log('[SRV] forum posts does not exist for problem: ' + req.query.problem);
				//create default post
				var forumPost = {
					"problem": req.query.problem,
					"posts": []
				};
				//query database and insert user
				forumCollection.insertOne( forumPost, (error, result) => {
					if (error) {
						console.log('[INC] [mongo] item failed to add to database: ' + COLLECTION_NAME);
						console.log('[SRV] failed to add forum post obj to problem: ' + req.query.problem);
						response = JSON.stringify('-1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[INC] [mongo] item added successfully to database: ' + COLLECTION_NAME);
					}
				});
				
				//re-query
				forumCollection.findOne({"problem": req.query.problem}, (error, result) => {
					if (error) {
						console.log('[SRV] [mongo] forums query failed');
						response = JSON.stringify('-1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else { //query successful
						console.log('[SRV] [mongo] forums query successful');
						res.send(result);
						console.log('[OUT] [GET] sent over forum posts for problem: ' + req.query.problem);
					}
				});
			} else { //query successful
				console.log('[SRV] [mongo] forums query successful');
				res.send(result);
				console.log('[OUT] [GET] sent over forum posts for problem: ' + req.query.problem);
			}
		});
		
		
		console.log('[OUT] [GET] sent over problem: ' + req.query.problem);
	} else {
		console.log('[SRV] problem not found: ' + req.query.problem);
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();
	}
});

//POST request sends JSON data to server
//create forum post (using thread as a term to avoid confusion with POST)
router.post('/forumPost/thread', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /forumPost/thread');
	requestNum++;
	
	var problem = req.body.problem;
	var problemID = req.body.problemID;
	var postUsername = req.body.username;
	var postText = req.body.text;
	var postDate = req.body.date;
	
	var newPost = [postUsername, postText, postDate];
	console.log(newPost);
	
	//fetch forum post from mongo
	console.log('[SRV] [mongo] sent query for forum posts for problemID: ' + problemID);
	if (problemsIDQueryJSON.indexOf(problemID) > -1) {
		console.log('[SRV] problemID found: ' + problemID);
		forumCollection.findOne({"problem": problemID}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] forums query failed');
			} else if (result === null) { //not found
				console.log('[SRV] problemID not found: ' + req.query.problemID);
				response = JSON.stringify('-1');
				res.send(response);
				console.log('[OUT] [GET] sent res: ' + response);
				res.end();
			} else { //query successful
				console.log('[SRV] [mongo] forums query successful');
				var newThread = [];
				newThread.push(newPost);
				var updatedPosts = result.posts;
				updatedPosts.push(newThread);
				
				//query and update user
				console.log('[SRV] [mongo] fetching user forum posts to update');
				userCollection.findOne({"username": postUsername}, (error, result) => {
					if (error) {
						console.log('[SRV] query error');
						console.log('[SRV] user forum post update failed');
					} else {
						var forumPosts = result.forumPosts;
						var userNewPost = [problem, problemID, postDate, postText];
						forumPosts.push(userNewPost);
						userCollection.findOneAndUpdate({"username": postUsername}, {$set: {forumPosts: forumPosts}}, (error, result) => {
						if (error){
							console.log('[SRV] [mongo] user forum posts update failed');
						} else {
							console.log('[SRV] [mongo] user forum posts update successful');
						}
					});
					}
				});
				
				//update
				forumCollection.findOneAndUpdate({"problem": problemID}, {$set: {posts: updatedPosts}}, (error, result) => {
					if (error){
						console.log('[SRV] query error');
						console.log('[SRV] forum post reply creation failed');
						response = JSON.stringify('2');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[SRV] query successful');
						console.log('[SRV] forum post reply creation success');
						response = JSON.stringify('1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					}
				});
			}
		});
	} else {
		console.log('[SRV] problemID not found: ' + req.query.problemID);
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();
	}
});

//create forum reply
router.post('/forumPost/reply', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /forumPost/reply');
	requestNum++;
	
	var problem = req.body.problem;
	var problemID = req.body.problemID;
	var postNum = req.body.postNum;
	var postUsername = req.body.username;
	var postText = req.body.text;
	var postDate = req.body.date;
	
	var newPost = [postUsername, postText, postDate];
	console.log(newPost);
	
	//fetch forum post from mongo
	console.log('[SRV] [mongo] sent query for forum posts for problem: ' + problemID);
	if (problemsIDQueryJSON.indexOf(problemID) > -1) {
		console.log('[SRV] problem found: ' + problemID);
		forumCollection.findOne({"problem": problemID}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] forums query failed');
			} else if (result === null) { //not found
				console.log('[SRV] problemID not found: ' + req.query.problemID);
				response = JSON.stringify('-1');
				res.send(response);
				console.log('[OUT] [GET] sent res: ' + response);
				res.end();
			} else { //query successful
				console.log('[SRV] [mongo] forums query successful');
				var updatedPosts = result.posts;
				updatedPosts[postNum].push(newPost);
				
				//query and update user
				console.log('[SRV] [mongo] fetching user forum posts to update');
				userCollection.findOne({"username": postUsername}, (error, result) => {
					if (error) {
						console.log('[SRV] query error');
						console.log('[SRV] user forum post update failed');
					} else {
						var forumPosts = result.forumPosts;
						var userNewPost = [problem, problemID, postDate, postText];
						forumPosts.push(userNewPost);
						userCollection.findOneAndUpdate({"username": postUsername}, {$set: {forumPosts: forumPosts}}, (error, result) => {
						if (error){
							console.log('[SRV] [mongo] user forum posts update failed');
						} else {
							console.log('[SRV] [mongo] user forum posts update successful');
						}
					});
					}
				});
				
				//update
				forumCollection.findOneAndUpdate({"problem": problemID}, {$set: {posts: updatedPosts}}, (error, result) => {
					if (error){
						console.log('[SRV] query error');
						console.log('[SRV] forum post reply creation failed');
						response = JSON.stringify('2');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[SRV] query successful');
						console.log('[SRV] forum post reply creation success');
						response = JSON.stringify('1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					}
				});
			}
		});
	} else {
		console.log('[SRV] problemID not found: ' + req.query.problemID);
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();
	}
});

//delete forum thread
router.post('/forumPost/deleteReply', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /forumPost/deleteReply');
	requestNum++;
	
	var problem = req.body.problem;
	var postNum = req.body.postNum;
	var itemNum = req.body.itemNum;
	
	//fetch forum post from mongo
	console.log('[SRV] [mongo] sent query for forum posts for problem: ' + problem);
	if (problemsIDQueryJSON.indexOf(problem) > -1) {
		console.log('[SRV] problem found: ' + problem);
		forumCollection.findOne({"problem": problem}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] forums query failed');
			} else if (result === null) { //not found
				console.log('[SRV] problem not found: ' + req.query.problem);
				response = JSON.stringify('-1');
				res.send(response);
				console.log('[OUT] [GET] sent res: ' + response);
				res.end();
			} else { //query successful
				console.log('[SRV] [mongo] forums query successful');
				var updatedPosts = result.posts;
				updatedPosts[postNum].splice(itemNum, 1);
				
				//update
				forumCollection.findOneAndUpdate({"problem": problem}, {$set: {posts: updatedPosts}}, (error, result) => {
					if (error){
						console.log('[SRV] query error');
						console.log('[SRV] forum post reply deletion failed');
						response = JSON.stringify('2');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[SRV] query successful');
						console.log('[SRV] forum post reply deletion success');
						response = JSON.stringify('1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					}
				});
			}
		});
	} else {
		console.log('[SRV] problem not found: ' + req.query.problem);
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();
	}
});

//delete forum reply
router.post('/forumPost/deleteThread', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /forumPost/deleteThread');
	requestNum++;
	
	var problem = req.body.problem;
	var postNum = req.body.postNum;
	
	//fetch forum post from mongo
	console.log('[SRV] [mongo] sent query for forum posts for problem: ' + problem);
	if (problemsIDQueryJSON.indexOf(problem) > -1) {
		console.log('[SRV] problem found: ' + problem);
		forumCollection.findOne({"problem": problem}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] forums query failed');
			} else if (result === null) { //not found
				console.log('[SRV] problem not found: ' + req.query.problem);
				response = JSON.stringify('-1');
				res.send(response);
				console.log('[OUT] [GET] sent res: ' + response);
				res.end();
			} else { //query successful
				console.log('[SRV] [mongo] forums query successful');
				var updatedPosts = result.posts;
				updatedPosts.splice(postNum, 1);
				
				//update
				forumCollection.findOneAndUpdate({"problem": problem}, {$set: {posts: updatedPosts}}, (error, result) => {
					if (error){
						console.log('[SRV] query error');
						console.log('[SRV] forum post thread deletion failed');
						response = JSON.stringify('2');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					} else {
						console.log('[SRV] query successful');
						console.log('[SRV] forum post thread deletion success');
						response = JSON.stringify('1');
						res.send(response);
						console.log('[OUT] [POST] sent res: ' + response);
					}
				});
			}
		});
	} else {
		console.log('[SRV] problem not found: ' + req.query.problem);
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();
	}
});

/**
 * HTTP requests for IDE compilation
 */
//api call to submit code for compiling
router.get('/compile', (req, res) => {

    var submissionData = {
        compilerId: req.query.id,
        source: req.query.source,
        input: req.query.input
    };
    request2({
        url: 'https://' + endpoint + '/api/v4/submissions?access_token=' + accessToken,
        method: 'POST',
        form: submissionData
    }, function (error, response, body) {
        
        if (error) {
            console.log('Connection problem');
        }
        
        // process response
        if (response) {
            if (response.statusCode === 201) {
                res.send(response.body); // submission data in JSON
            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                } else if (response.statusCode === 402) {
                    console.log('Unable to create submission');
                } else if (response.statusCode === 400) {
                    var body = JSON.parse(response.body);
                    console.log('Error code: ' + body.error_code + ', details available in the message: ' + body.message)
                }
            }
        }
    });

    
    
});

//request for output data
router.get('/output', (req,res) => {
    request2({
        url: req.query.url,
        method: 'GET'
    }, function (error, response, body){
        if(error){
            console.log('Connection problem');
        }

        if(response){
            if(response.statusCode ===200){
                res.send(response.body);
            }
        }
    })
})

router.get('/compile_error', (req,res) => {
    request2({
        url: req.query.url,
        method: 'GET'
    }, function (error, response, body){
        if(error){
            console.log('Connection problem');
        }

        if(response){
            if(response.statusCode ===200){
                res.send(response.body);
            }
        }
    })
})

//api call for information of submission
router.get('/result' , (req , res) => {
    var submissionId = req.query.id;
    request2({
        url: 'https://' + endpoint + '/api/v4/submissions/' + submissionId + '?access_token=' + accessToken,
        method: 'GET'
    }, function (error, response, body) {
       
        if (error) {
            console.log('Connection problem');
        }
        
        // process response
        if (response) {
            if (response.statusCode === 200) {
                res.send(response.body); // submission data in JSON
            } else {
                if (response.statusCode === 401) {
                    console.log('Invalid access token');
                }
                if (response.statusCode === 403) {
                    console.log('Access denied');
                }
                if (response.statusCode === 404) {
                    console.log('Submision not found');
                }
            }
        }
	});
});

router.get('/compile_list', (req, res) => {
	request2({
		url: 'https://' + endpoint + '/api/v4/compilers?access_token=' + accessToken,
		method: 'GET'
	}, function (error, response, body) {
		
		if (error) {
			console.log('Connection problem');
		}
		
		// process response
		if (response) {
			if (response.statusCode === 200) {
				res.send(response.body); // list of compilers in JSON
			} else {
				if (response.statusCode === 401) {
					console.log('Invalid access token');
				}
			}
		}
	});
});
/**
 * HTTP requests for user profile
 */
router.get('/fetchProfile/', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /fetchProfile/?username=' + req.query.username);
	requestNum++;
	
	var username = req.query.username;
	
	//fetch user data from mongo
	console.log('[SRV] [mongo] sent query for user: ' + username);
	if (username) {
		userCollection.findOne({"username": username}, (error, result) => {
			if (error) {
				console.log('[SRV] [mongo] user query failed');
				
			} else {
				console.log('[SRV] [mongo] user query successful for user: ' + username);
				console.log('[SRV] creating user profile to send');
				
				if (result == undefined) {
					console.log('[SRV] [mongo] user not found: ' + username);
					res.send(404);
					console.log('[OUT] [GET] sent over status 404');
					
				} else {
				
					var userProfile = {
						"username": result.username,
						"email": result.email,
						"forumPosts": result.forumPosts,
						"problemsSolved": result.problemsSolved
					};
				}
				res.send(userProfile);
				console.log('[OUT] [GET] sent over user profile for user: ' + username);
			}
		});
	} else {
		console.log('[SRV] empty user');
		response = JSON.stringify('-1');
		res.send(response);
		console.log('[OUT] [GET] sent res: ' + response);
		res.end();	
	}
});

//update user problemsSolved in userCollection
router.post('/updateProblemSolved', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [POST] /updateProblemSolved');
	requestNum++;
	
	var problem = req.body.problem;
	var problemID = req.body.problemID;
	var username = req.body.username;
	var date = req.body.date;
	
	//query and update user
	console.log('[SRV] [mongo] fetching user forum posts to update');
	userCollection.findOne({"username": username}, (error, result) => {
		if (error) {
			console.log('[SRV] query error');
			console.log('[SRV] user forum post update failed');
		} else {
			var problemsSolved = result.problemsSolved;
			var userNewProblem = [problem, problemID, date];
			problemsSolved.push(userNewProblem);
			userCollection.findOneAndUpdate({"username": username}, {$set: {problemsSolved: problemsSolved}}, (error, result) => {
				if (error) {
					console.log('[SRV] [mongo] user problemsSolved update failed');
					response = JSON.stringify('-1');
					res.send(response);
					console.log('[OUT] [GET] sent res: ' + response);
					res.end();
				} else {
					console.log('[SRV] [mongo] user problemsSolved update successful');
					response = JSON.stringify('1');
					res.send(response);
					console.log('[OUT] [GET] sent res: ' + response);
					res.end();
				}
			});
		}
	});
});

/**
 * HTTP requests for front page
 */
//setup code
var suggestedQuery = [];
var popularProblems = [];

//random int generator 
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createSuggestedProblems() {
	var query = [];
	var numFound = 0;
	var problem = [];
	console.log('[SRV] preparing suggested problems');
	//throw random questions of specific difficulty
	while (numFound < 8) {
		var seed = getRandomInt(2300);
		//parse specific difficulty ranges
		if (numFound >= 0 && numFound <= 1) { //trivial
			if (problemsJSON[seed].sidebar.difficulty < 2) {
				problem = [problemsJSON[seed].problem, problemsJSON[seed].sidebar.problemID, problemsJSON[seed].sidebar.difficulty];
				query.push(problem);
				//console.log(problemsJSON[seed].problem);
				numFound++;
			}
		} else if (numFound >= 2 && numFound <= 3) { //easy
			if (problemsJSON[seed].sidebar.difficulty >= 2 && problemsJSON[seed].sidebar.difficulty < 4) {
				problem = [problemsJSON[seed].problem, problemsJSON[seed].sidebar.problemID, problemsJSON[seed].sidebar.difficulty];
				query.push(problem);
				//console.log(problemsJSON[seed].problem);
				numFound++;
			}
		} else if (numFound >= 4 && numFound <= 5) { //medium
			if (problemsJSON[seed].sidebar.difficulty >= 4 && problemsJSON[seed].sidebar.difficulty < 6) {
				problem = [problemsJSON[seed].problem, problemsJSON[seed].sidebar.problemID, problemsJSON[seed].sidebar.difficulty];
				query.push(problem);
				//console.log(problemsJSON[seed].problem);
				numFound++;
			}
		} else if (numFound >= 6 && numFound <= 7) { //hard
			if (problemsJSON[seed].sidebar.difficulty >= 6) {
				problem = [problemsJSON[seed].problem, problemsJSON[seed].sidebar.problemID, problemsJSON[seed].sidebar.difficulty];
				query.push(problem);
				//console.log(problemsJSON[seed].problem);
				numFound++;
			}
		}
	}
	suggestedQuery = query;
	console.log('[SRV] generated suggested problems');
}
setInterval(createSuggestedProblems, frontPageUpdateTiming);

router.get('/frontPageSuggested', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /frontPageSuggested');
	requestNum++;
	
	res.send(suggestedQuery);
	console.log('[OUT] [GET] sent suggested problems:');
});

function fetchPopularProblems() {
	console.log('[SRV] [mongo] fetching problemsQueried collection');
	var query = [];
		var options = {
		"limit": 8,
		"sort": ['numQueried','desc']
	}

	queriedCollection.find({}, options, (error, result) => { 
		if (error) {
			console.log(error);
		} else {
			result.toArray((err, docs) => {
				for (let i = 0; i < docs.length; i++) {
					var problem = [docs[i].problem, docs[i].problemID, problemsJSON[problemsIDQueryJSON.indexOf(docs[i].problemID)].sidebar.difficulty];
					query.push(problem);
				}
			});
		}
	});
	popularProblems = query;
	
	console.log('[SRV] [mongo] problemsQueried collection fetch successful');
}
setInterval(fetchPopularProblems, frontPageUpdateTiming);


router.get('/frontPagePopular', function(req, res) {
	console.log('[REQ] [' + requestNum + ']');
	console.log('[INC] [GET] /frontPagePopular');
	requestNum++;
	
	res.send(popularProblems);
	console.log('[OUT] [GET] sent popular problems:');
});

module.exports = router;