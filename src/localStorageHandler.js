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
	}
}
//query search and load problems.html
function queryProblem(query) {
	if (query = '') return;
	console.log("fetching query: problem: ");
	console.log(query);
	userStorage.setItem('problem', document.getElementById('searchText').value);
	console.log(userStorage.getItem('problem'));
	document.getElementById("searchText").value = "";
	location = "./problemPage.html"
}