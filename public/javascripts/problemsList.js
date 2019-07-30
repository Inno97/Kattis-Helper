/**
 * problemList.js
 * for use in problemsList.html
 */
var numProblems = 0;
var renderNumProblems = 50;
var problemsJSON, problems;

/**
 * problem JSON format
 * problemID
 * problem (name)
 * difficulty
 * category
 */

//render all the problems from problems.json in a table
function onload(){
	console.log('fetching problem data...');
	renderFilter();
	fetchProblems();
	console.log('rendered problem data');
}
window.addEventListener("load", onload);

function renderFilter() {
	//text description
	const filterBoxHeader = document.createElement('div');
	filterBoxHeader.classList.add('filterHorzWrapper');
	document.getElementById('filterBox').appendChild(filterBoxHeader);
	
	const filterBoxSearchText = document.createElement('div');
	filterBoxSearchText.innerText = 'Search';
	filterBoxSearchText.classList.add('filterTextHeader');
	filterBoxHeader.appendChild(filterBoxSearchText);
	
	const filterBoxSearchPadding = document.createElement('div');
	filterBoxSearchPadding.innerText = 'asdfghjklq1wertyuiopzxcv';
	filterBoxSearchPadding.classList.add('filler');
	filterBoxHeader.appendChild(filterBoxSearchPadding);
	
	const filterBoxSearchDifficultyRange = document.createElement('div');
	filterBoxSearchDifficultyRange.innerText = 'Difficulty Range';
	filterBoxSearchDifficultyRange.classList.add('filterTextHeader');
	filterBoxHeader.appendChild(filterBoxSearchDifficultyRange);
	
	const filterBoxSearchPadding2 = document.createElement('div');
	filterBoxSearchPadding2.innerText = 'asdfg';
	filterBoxSearchPadding2.classList.add('filler');
	filterBoxHeader.appendChild(filterBoxSearchPadding2);
	
	const filterBoxSearchFields = document.createElement('div');
	filterBoxSearchFields.innerText = 'Fields';
	filterBoxSearchFields.classList.add('filterTextHeader');
	filterBoxHeader.appendChild(filterBoxSearchFields);
	
	//interactable items
	const filterBoxTextAreaWrapper = document.createElement('div');
	filterBoxTextAreaWrapper.classList.add('filterHorzWrapper');
	document.getElementById('filterBox').appendChild(filterBoxTextAreaWrapper);
	
	const filterQueryText = document.createElement('textarea');
	filterQueryText.id = 'filterQueryText';
	filterQueryText.classList.add('filterTextArea');
	filterQueryText.placeholder = "Query Keyword";
	filterBoxTextAreaWrapper.appendChild(filterQueryText);
	
	const filterBoxTextAreaPadding1 = document.createElement('div');
	filterBoxTextAreaPadding1.innerText = 'abcd';
	filterBoxTextAreaPadding1.classList.add('filler');
	filterBoxTextAreaWrapper.appendChild(filterBoxTextAreaPadding1);
	
	const filterQueryDiff1 = document.createElement('input');
	filterQueryDiff1.id = 'filterQueryDiff1';
	filterQueryDiff1.classList.add('filterTextAreaDifficulty');
	filterQueryDiff1.type = 'number';
	filterQueryDiff1.min = '0';
	filterQueryDiff1.max = '20';
	filterQueryDiff1.placeholder = "Min.";
	filterBoxTextAreaWrapper.appendChild(filterQueryDiff1);
	
	const filterBoxTextAreaPadding2 = document.createElement('div');
	filterBoxTextAreaPadding2.innerText = 'ab';
	filterBoxTextAreaPadding2.classList.add('filler');
	filterBoxTextAreaWrapper.appendChild(filterBoxTextAreaPadding2);
	
	const filterQueryDiff2 = document.createElement('input');
	filterQueryDiff2.id = 'filterQueryDiff2';
	filterQueryDiff2.classList.add('filterTextAreaDifficulty');
	filterQueryDiff2.type = 'number';
	filterQueryDiff2.placeholder = "Max.";
	filterQueryDiff2.min = '0';
	filterQueryDiff2.max = '20';
	filterBoxTextAreaWrapper.appendChild(filterQueryDiff2);
	
	const filterBoxTextAreaPadding3 = document.createElement('div');
	filterBoxTextAreaPadding3.innerText = 'abcdefghij';
	filterBoxTextAreaPadding3.classList.add('filler');
	filterBoxTextAreaWrapper.appendChild(filterBoxTextAreaPadding3);
	
	const filterSearchName = document.createElement('button');
	filterSearchName.setAttribute('onClick', 'filterByName()');
	filterSearchName.classList.add('filterButton');
	filterSearchName.innerText = 'Name';
	filterBoxTextAreaWrapper.appendChild(filterSearchName);
	
	const filterBoxTextAreaPadding4 = document.createElement('div');
	filterBoxTextAreaPadding4.innerText = 'ab';
	filterBoxTextAreaPadding4.classList.add('filler');
	filterBoxTextAreaWrapper.appendChild(filterBoxTextAreaPadding4);
	
	const filterSearchCategory = document.createElement('button');
	filterSearchCategory.setAttribute('onClick', 'filterByCategory()');
	filterSearchCategory.classList.add('filterButton');
	filterSearchCategory.innerText = 'Category';
	filterBoxTextAreaWrapper.appendChild(filterSearchCategory);
	
	const filterBoxTextAreaPadding5 = document.createElement('div');
	filterBoxTextAreaPadding5.innerText = 'ab';
	filterBoxTextAreaPadding5.classList.add('filler');
	filterBoxTextAreaWrapper.appendChild(filterBoxTextAreaPadding5);
	
	const filterSearchReset = document.createElement('button');
	filterSearchReset.setAttribute('onClick', 'resetList()');
	filterSearchReset.classList.add('filterButton');
	filterSearchReset.innerText = 'Reset';
	filterBoxTextAreaWrapper.appendChild(filterSearchReset);
	
}

//fetch all questions and render the first 50 alphabetically
function fetchProblems() {
	//generate next and previous button
	const unused = document.createElement('div');
	unused.classList.add('unusedObj');
	unused.id = 'unused';
	document.getElementById('dashboardLocation').appendChild(unused);
	
	const nextButton = document.createElement('button');
	nextButton.classList.add('nextPageButton');
	nextButton.id = 'nextButton';
	nextButton.innerText = 'Next';
	unused.appendChild(nextButton);
	
	const prevButton = document.createElement('button');
	prevButton.classList.add('nextPageButton');
	prevButton.id = 'prevButton';
	prevButton.innerText = 'Prev';
	unused.appendChild(prevButton);
	
	//perform ajax query
	const requestURL = '/problemsListAll';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'json',
		success: (data) => {
			console.log('query completed');
			console.log(data);
			console.log('query JSON array size is ' + data.length);
			numProblems = data.length;
			problemsJSON = data;
			problems = data;
			renderProblemRange(0, 0 + renderNumProblems - 1, data);
			//renderAll(data);
		},
		error: function(req, err){ console.log('error occured: ' + err); }
	});
	
	//process JSON data
}

//render a set number of problems, starting at index 0
function renderProblemRange(first, last, data) {
	var numRendered = 0;
	console.log('rendering range ' + first + ' to ' + last);
	//clear table
		while (document.getElementById('problemTableBody').firstChild) {
		document.getElementById('problemTableBody').removeChild(document.getElementById('problemTableBody').firstChild);
	}
	
	for (let i = first; i <= last && i < data.length; i++) {
		renderProblem(data[i]);
		numRendered++;
	}
	
	console.log('rendered ' + numRendered + ' problems');
	console.log('num of problems currently is ' + problems.length);
	
	//add next and previous button
	if (first - renderNumProblems >= 0 ) { //add prev button
		console.log('rendering prev');
		document.getElementById('questions').appendChild(document.getElementById('prevButton'));
		document.getElementById('prevButton').setAttribute('onClick', 'renderProblemRange(' + (first - renderNumProblems) + ', ' + (last - renderNumProblems) + ', problems)');
	} else {
		document.getElementById('unused').appendChild(document.getElementById('prevButton'));
	}
	if (last < problems.length - 1) { //add next button
		console.log('rendering next');
		document.getElementById('questions').appendChild(document.getElementById('nextButton'));
		document.getElementById('nextButton').setAttribute('onClick', 'renderProblemRange(' + (first + renderNumProblems) + ', ' + (last + renderNumProblems) + ', problems)');
	} else {
		document.getElementById('unused').appendChild(document.getElementById('nextButton'));
	}
}

//render a specific question
function renderProblem(problem) {
	const detailsContainer = document.createElement("tr");
	//name
	const entry = document.createElement("tr");
	const nameE = document.createElement("td");
	const linkE = document.createElement("a");
	linkE.setAttribute("onClick", "fetchProblem('" + problem.problemID + "')");
	nameE.appendChild(linkE);
	linkE.innerText = problem.problem;
	
	//nameE.innerText = problem;
	detailsContainer.appendChild(nameE);
	
	//url
	const urlE = document.createElement("td");
	urlE.innerText = "https://open.kattis.com/problems/" + problem.problemID;
	detailsContainer.appendChild(urlE);
	
	//category
	const categoryE = document.createElement("td");
	categoryE.innerText = problem.category;
	detailsContainer.appendChild(categoryE);
	
	//difficulty
	const difficultyE = document.createElement("td");
	difficultyE.innerText = problem.difficulty;
	detailsContainer.appendChild(difficultyE);
	
	document.getElementById('problemTableBody').appendChild(detailsContainer);
}

/**
 * Filtering of problems list
 */
function filterByName() {
	var query = document.getElementById('filterQueryText').value;
	var diffMin = document.getElementById('filterQueryDiff1').value;
	var diffMax = document.getElementById('filterQueryDiff2').value;
	
	if (diffMax && diffMin && (diffMax < diffMin)) {
		var temp = diffMin;
		diffMin = diffMax;
		diffMax = temp;
	}
	
	var tempProblems = [];
	for (let i = 0; i < problems.length; i++) {
		if (query != '') {
			if (problems[i].problem.toLowerCase().includes(query.toLowerCase()) || problems[i].problemID.toLowerCase().includes(query.toLowerCase())) {
				if (diffMin && diffMax) {
					if (problems[i].difficulty >= diffMin && problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
				} else if (diffMin) {
					if (problems[i].difficulty >= diffMin) tempProblems.push(problems[i]);
				} else if (diffMax) {
					if (problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
				} else {
					tempProblems.push(problems[i]);
				}
			}
		} else {
			if (diffMin && diffMax) {
				if (problems[i].difficulty >= diffMin && problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
			} else if (diffMin) {
				if (problems[i].difficulty >= diffMin) tempProblems.push(problems[i]);
			} else if (diffMax) {
				if (problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
			} else {
				tempProblems.push(problems[i]);
			}
		}
	}
	
	//reset fields
	document.getElementById('filterQueryText').value = '';
	document.getElementById('filterQueryDiff1').value = '';
	document.getElementById('filterQueryDiff2').value = '';
	
	problems = tempProblems;
	renderProblemRange(0, 0 + renderNumProblems - 1, problems);
}

function filterByCategory() {
	var query = document.getElementById('filterQueryText').value;
	var diffMin = document.getElementById('filterQueryDiff1').value;
	var diffMax = document.getElementById('filterQueryDiff2').value;
	
	if (diffMax && diffMin && (diffMax < diffMin)) {
		var temp = diffMin;
		diffMin = diffMax;
		diffMax = temp;
	}
	
	var tempProblems = [];
	for (let i = 0; i < problems.length; i++) {
		if (query != '') {
			if (problems[i].category.toLowerCase().includes(query.toLowerCase())) {
				if (diffMin && diffMax) {
					if (problems[i].difficulty >= diffMin && problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
				} else if (diffMin) {
					if (problems[i].difficulty >= diffMin) tempProblems.push(problems[i]);
				} else if (diffMax) {
					if (problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
				} else {
					tempProblems.push(problems[i]);
				}
			}
		} else {
			if (diffMin && diffMax) {
				if (problems[i].difficulty >= diffMin && problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
			} else if (diffMin) {
				if (problems[i].difficulty >= diffMin) tempProblems.push(problems[i]);
			} else if (diffMax) {
				if (problems[i].difficulty <= diffMax) tempProblems.push(problems[i]);
			} else {
				tempProblems.push(problems[i]);
			}
		}
	}
	
	//reset fields
	document.getElementById('filterQueryText').value = '';
	document.getElementById('filterQueryDiff1').value = '';
	document.getElementById('filterQueryDiff2').value = '';
	
	problems = tempProblems;
	renderProblemRange(0, 0 + renderNumProblems - 1, problems);
}

//reset entire problems list and re-render
function resetList() {
	console.log('resetting list');
	problems = problemsJSON;
	renderProblemRange(0, 0 + renderNumProblems - 1, problems);
}

/**
 * Sorting of problems list
 * filter based on index of JSON format
 * order => 0 == ascending, 1 == descending
 */
function filterProblems(index, order) {
	console.log('sorting');
	switch(index) {
	case 0: //name
		if (order == 0) {
			console.log('sorting problem name ascending');
			problems.sort(sortNameAsc);
			document.getElementById('filterName').setAttribute('onClick', 'filterProblems(0, 1)');
		} else {
			console.log('sorting problem name descending');
			problems.sort(sortNameDesc);
			document.getElementById('filterName').setAttribute('onClick', 'filterProblems(0, 0)');
		}
		break;
	case 1: //kattis link
		if (order == 0) {
			console.log('sorting problem link ascending');
			problems.sort(sortLinkAsc);
			document.getElementById('filterLink').setAttribute('onClick', 'filterProblems(1, 1)');
		} else {
			console.log('sorting problem link descending');
			problems.sort(sortLinkDesc);
			document.getElementById('filterLink').setAttribute('onClick', 'filterProblems(1, 0)');
		}
		break;
	case 2: //category
		if (order == 0) {
			console.log('sorting problem category ascending');
			problems.sort(sortCategoryAsc);
			document.getElementById('filterCategory').setAttribute('onClick', 'filterProblems(2, 1)');
		} else {
			console.log('sorting problem category descending');
			problems.sort(sortCategoryDesc);
			document.getElementById('filterCategory').setAttribute('onClick', 'filterProblems(2, 0)');
		}
		break;
	case 3: //difficulty
		if (order == 0) {
			console.log('sorting problem diff ascending');
			problems.sort(sortDifficultyAsc);
			document.getElementById('filterDifficulty').setAttribute('onClick', 'filterProblems(3, 1)');
		} else {
			console.log('sorting problem diff descending');
			problems.sort(sortDifficultyDesc);
			document.getElementById('filterDifficulty').setAttribute('onClick', 'filterProblems(3, 0)');
		}
		break;
	}
	
	
	renderProblemRange(0, 0 + renderNumProblems - 1, problems);
	console.log(problems);
}

function sortNameAsc(a, b) {
	return a.problem < b.problem ? -1 : 1;
}

function sortNameDesc(a, b) {
	return a.problem > b.problem ? -1 : 1;
}

function sortLinkAsc(a, b) {
	return a.problemID < b.problemID ? -1 : 1;
}

function sortLinkDesc(a, b) {
	return a.problemID > b.problemID ? -1 : 1;
}

function sortCategoryAsc(a, b) {
	return a.category < b.category ? -1 : 1;
}

function sortCategoryDesc(a, b) {
	return a.category > b.category ? -1 : 1;
}

function sortDifficultyAsc(a, b) {
	return a.difficulty < b.difficulty ? -1 : 1;
}

function sortDifficultyDesc(a, b) {
	return a.difficulty > b.difficulty ? -1 : 1;
}