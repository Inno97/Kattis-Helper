/**
 * Local Storage Handler
 * Call this when user loads in
 */

function onload(){
	console.log("local storage setting up...");
	console.log("local storage setup done");
	initLocalStorage();
}
window.addEventListener("load", onload);

function initLocalStorage() {
	userStorage = window.localStorage;
	userStorage.setItem('myCat', 'Kattis');
	if (userStorage.getItem('problem') == '') {
		userStorage.setItem('problem', '');
		console.log("reset problem");
		
		//init local storage values for questions here
		userStorage.setItem('problemName', '');
		userStorage.setItem('problemID', '');
		userStorage.setItem('problemUrl', '');
		userStorage.setItem('problemCat', '');
		userStorage.setItem('problemDiff', '');
		userStorage.setItem('problemDesc', '');
		userStorage.setItem('problemIn', '');
		userStorage.setItem('problemOut', '');
		userStorage.setItem('problemCpuLim', '');
		userStorage.setItem('problemMemLim', '');
		userStorage.setItem('problemNumTest', '');
		userStorage.setItem('problemSamIn', '');
		userStorage.setItem('problemSamOut', '');
		userStorage.setItem('problemAuthor', '');
		userStorage.setItem('problemSource', '');
		userStorage.setItem('problemStatus', '');
		
		console.log("problem data reset");
	}
}

//flush all temp data from localStorage
function flushLocalStorage() {
	localStorage.clear();
	initLocalStorage();
}

//query search and load problems.html
function queryProblem(query) {
	if (query = '') return;
	//flushLocalStorage();
	console.log("fetching query: problem: ");
	console.log(query);
	userStorage.setItem('problem', (document.getElementById('searchText').value).toLowerCase());
	console.log(userStorage.getItem('problem'));
	document.getElementById("searchText").value = "";
	userStorage.setItem('problemStatus', '');
	
	location = "./problemPage.html"; 
}

//fetch problem with designated query
function fetchProblem(query) {
	//flushLocalStorage();
	console.log("fetching query (direct): problem: ");
	console.log(query);
	userStorage.setItem('problem', query.toLowerCase());
	console.log(userStorage.getItem('problem'));
	document.getElementById("searchText").value = "";
	userStorage.setItem('problemStatus', '');
	
	location = "./problemPage.html";
}

//rendering of context menus in problemPage.html
function renderDetails() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemDetails'))) {
		console.log("already at details menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemDetails'));
	
	userStorage.setItem('problemStatus', 'details');
}

function renderTestCase() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemTestCase'))) {
		console.log("already at test case menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemTestCase'));
	
	userStorage.setItem('problemStatus', 'testCase');
}

function renderIDE() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemIDE'))) {
		console.log("already at IDE menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemIDE'));
	
	userStorage.setItem('problemStatus', 'ide');
}

function renderForum() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemForum'))) {
		console.log("already at forum menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemForum'));
	
	userStorage.setItem('problemStatus', 'forum');
}

function renderSpecificTestCase(num) {
	console.log("rendering specific test case");
	if (document.getElementById('problemTestCase').childNodes.item(4) == ("testCase" + num).toString()) {
		console.log("already at test case" + num);
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('testCaseUnused').appendChild(document.getElementById('problemTestCase').childNodes.item(4));
	}
	document.getElementById('problemTestCase').appendChild(document.getElementById("testCase" + num));
}