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
		userStorage.setItem('problemNumSam', '');
		userStorage.setItem('problemSamInJSON', '');
		userStorage.setItem('problemSamOutJSON', '');
		userStorage.setItem('problemTestCaseInputJSON', JSON.stringify(data.table.input));
		userStorage.setItem('problemTestCaseOutputJSON', JSON.stringify(data.table.input));
		userStorage.setItem('problemAuthor', '');
		userStorage.setItem('problemSource', '');
		userStorage.setItem('problemStatus', '');
		userStorage.setItem('problemTestCase', '');
		
		console.log("problem data reset");
	}
}

//flush all temp data from localStorage
function flushLocalStorage() {
	localStorage.clear();
	initLocalStorage();
}

function setProblemData(data) {
	console.log('setting problem data');
	console.log(data.problem);
	userStorage.setItem('problemName', data.problem);
	userStorage.setItem('problemID', data.sidebar.problemID);
	//userStorage.setItem('problemUrl', '');
	userStorage.setItem('problemCat', data.data.category);
	userStorage.setItem('problemDiff', data.sidebar.difficulty);
	userStorage.setItem('problemDesc', data.body.question);
	userStorage.setItem('problemIn', data.body.input);
	userStorage.setItem('problemOut', data.body.output);
	userStorage.setItem('problemCpuLim', data.sidebar.CPU);
	userStorage.setItem('problemMemLim', data.sidebar.memory);
	userStorage.setItem('problemNumTest', data.testCases.numTestCases);
	userStorage.setItem('problemNumSam', data.table.input.length);
	userStorage.setItem('problemSamInJSON', JSON.stringify(data.table.input));
	userStorage.setItem('problemSamOutJSON', JSON.stringify(data.table.output));
	userStorage.setItem('problemTestCaseInputJSON', JSON.stringify(data.testCases.input));
	userStorage.setItem('problemTestCaseOutputJSON', JSON.stringify(data.testCases.output));
	userStorage.setItem('problemAuthor', data.content.author);
	userStorage.setItem('problemSource', data.content.source);
	console.log('finished setting problem data');
}

function fetchProblemPage() {
	//perform ajax query
	const requestURL = '/problem/';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/problem/';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

function fetchNotFound() {
	//perform ajax query
	const requestURL = '/problemNotFound';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/problemNotFound';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

//query search and load problem.html
function queryProblem(query) {
	if (query = '') return;
	console.log("fetching query: problem: ");
	console.log(query);
	userStorage.setItem('problem', (document.getElementById('searchText').value).toLowerCase());
	console.log(userStorage.getItem('problem'));
	
	//perform ajax query
	const requestURL = '/problemQuery/?q=' + document.getElementById("searchText").value;
	
	//flush search box
	document.getElementById("searchText").value = "";
	userStorage.setItem('problemStatus', '');
	
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log('fetched problem data');
			console.log(data);
			setProblemData(data);
			fetchProblemPage()
		},
		statusCode: {
			404: function() {
				console.log('not found');
				fetchNotFound();
			}
		}
	});
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
	
	//perform ajax query
	const requestURL = '/problemQuery/?q=' + query;
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log('fetched problem data');
			console.log(data);
			setProblemData(data);
			fetchProblemPage();
		},
		statusCode: {
			404: function() {
				console.log('not found');
				fetchNotFound();
			}
		}
	});	
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