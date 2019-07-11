const targets = ["problemTableBody"];
var numProblems = 0;

//render all the problems from problems.json in a table

function onload(){
	console.log('fetching problem data...');
	renderQuestions();
	console.log('rendered problem data');
}
window.addEventListener("load", onload);

function renderQuestions() {
	//perform ajax query
	const requestURL = '/problemsListAll';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'json',
		success: (data) => {
			console.log('query completed');
			console.log(data);
			console.log('printing test info');
			console.log(data.problem);
			renderAll(data);
		},
		error: function(req, err){ console.log('error occured: ' + err); }
		
	});
}

function renderAll(problems){
    targets.forEach( tgt => render(
        document.getElementById(tgt), problems));
}

function render(targetDiv, problems){
    problems.forEach( (problemObj) => {
		const { problem, problemID, difficulty, category } = problemObj
		const detailsContainer = document.createElement("tr");
		
		//name
		const entry = document.createElement("tr");
		const nameE = document.createElement("td");
		const linkE = document.createElement("a");
		linkE.setAttribute("onClick", "fetchProblem('" + problemID + "')");
		nameE.appendChild(linkE);
		linkE.innerText = problem;
		
		//nameE.innerText = problem;
		detailsContainer.appendChild(nameE);
		
		//url
		const urlE = document.createElement("td");
		urlE.innerText = "https://open.kattis.com/problems/" + problemID;
		detailsContainer.appendChild(urlE);
		
		//category
		const categoryE = document.createElement("td");
		categoryE.innerText = category;
		detailsContainer.appendChild(categoryE);
		
		//difficulty
		const difficultyE = document.createElement("td");
		difficultyE.innerText = difficulty;
		detailsContainer.appendChild(difficultyE);
		
        targetDiv.appendChild(detailsContainer);
		numProblems++;
    })
}