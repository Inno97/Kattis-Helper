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
		userStorage.setItem('questionName', '');
		userStorage.setItem('questionInternalName', '');
		userStorage.setItem('questionUrl', '');
		userStorage.setItem('questionCat', '');
		userStorage.setItem('questionDiff', '');
		userStorage.setItem('questionDesc', '');
		userStorage.setItem('questionIn', '');
		userStorage.setItem('questionOut', '');
		userStorage.setItem('questionCpuLim', '');
		userStorage.setItem('questionMemLim', '');
		userStorage.setItem('questionNumTest', '');
		userStorage.setItem('questionSamIn', '');
		userStorage.setItem('questionSamOut', '');
		userStorage.setItem('questionAuthor', '');
		userStorage.setItem('questionSource', '');
		console.log("question data reset");
	}
}

//query search and load problems.html
function queryProblem(query) {
	if (query = '') return;
	console.log("fetching query: problem: ");
	console.log(query);
	userStorage.setItem('problem', (document.getElementById('searchText').value).toLowerCase());
	console.log(userStorage.getItem('problem'));
	document.getElementById("searchText").value = "";
	location = "./problemPage.html";
}