/**
 * frontpage.js
 * handles rendering of html elements in the front page
 */
var suggestedProblems

function onload() {
	console.log('frontpage.js loaded');
	fetchSuggestedProblems();
	fetchPopularProblems();
}

window.addEventListener("load", onload);

function fetchSuggestedProblems() {
	//perform ajax query
	const requestURL = '/frontPageSuggested';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log(data);
			renderProblems(data, 'suggestedProblems');
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

function fetchPopularProblems() {
	//perform ajax query
	const requestURL = '/frontPagePopular';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log(data);
			renderProblems(data, 'popularProblems');
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

function renderProblems(data, elementID) {
	for (let i = 0; i < data.length; i++) {
		const question = document.createElement("tr");
		
		var tag = (data[i][2] < 2 ? 'Trivial' :
				   data[i][2] >= 2 && data[i][2] < 4 ? 'Easy' : 
				   data[i][2] >= 4 && data[i][2] < 6 ? 'Medium' : 'Hard');
				   
		const difficulty = document.createElement("th");
		difficulty.innerText = tag + " (" + data[i][2] + ")";
		question.appendChild(difficulty);
		
		const name = document.createElement("td");
		const nameLink = document.createElement("a");
		nameLink.setAttribute("onClick", "fetchProblem('" + data[i][1] + "')");
		name.appendChild(nameLink);
		nameLink.innerText = data[i][0];
		question.appendChild(name);
		
		document.getElementById(elementID).appendChild(question);
	}
}