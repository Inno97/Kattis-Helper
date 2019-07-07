var express = require('express');
var router = express.Router();
var fs = require('fs');

var path = require('path');
var appDir = path.join(path.dirname(require.main.filename), '..');
var app = express();

var axios = require('axios');

//debug
//console.log(path.join(appDir + '/public'));

//static files
router.use('/static', express.static(appDir + '/public/javascripts'));
router.use('/static', express.static(appDir + '/public/stylesheets'));
router.use('/static', express.static(appDir + '/public/images'));

//global objects
var problemsJSON = {}; //all problems
fs.readFile(appDir + '/data/problems.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    } else {
		console.log('problems.json read successfully');
		problemsJSON = JSON.parse(jsonString);
	}
})

var problemsListJSON = {}; //all problems
fs.readFile(appDir + '/data/problemsList.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    } else {
		console.log('problemsList.json read successfully');
		problemsListJSON = JSON.parse(jsonString);
	}
})

var problemsQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    } else {
		
		console.log('problemsQuery.json read successfully');
		problemsQueryJSON = JSON.parse(jsonString);
	}
})

var problemsIDQueryJSON = {}; //problem names only, for querying whether a problem exists
fs.readFile(appDir + '/data/problemsIDQuery.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    } else {
		
		console.log('problemsIDQuery.json read successfully');
		problemsIDQueryJSON = JSON.parse(jsonString);
	}
})

//get home page
router.get('/', function(req, res) {
  res.sendFile(appDir + '/src/index.html');
});

//kattis problems related routes
//direct to problemsList.html
router.get('/problemsList', function(req, res) {
  console.log('sent over problemsList.html');
  res.sendFile(appDir + '/src/problemsList.html');
});

//direct to problem.html (problem page)
router.get('/problem/', function(req, res) {
  console.log('sent over problem.html');
  res.sendFile(appDir + '/src/problem.html');
});

//direct to problemNotFound.html
router.get('/problemNotFound', function(req, res) {
  console.log('sent over problemNotFound.html');
  res.sendFile(appDir + '/src/problemNotFound.html');
});

//query specific problem
router.get('/problemQuery/', function(req, res) {
	console.log('incoming query: ' + req.query.q);
	if (problemsQueryJSON.indexOf(req.query.q) > -1) {
		console.log('query found (name)');
		res.send(problemsJSON[problemsQueryJSON.indexOf(req.query.q)]);
	} else if (problemsIDQueryJSON.indexOf(req.query.q) > -1) {
		console.log('query found (ID)');
		res.send(problemsJSON[problemsIDQueryJSON.indexOf(req.query.q)]);
	} else {
		console.log('query not found');
		res.status(404);
		res.send();
	}
});

router.get('/problemsListAll', function(req, res) {
	res.send(problemsListJSON);
	console.log('sent questionsList.json over');
});

module.exports = router;