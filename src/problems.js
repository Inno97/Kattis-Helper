import "./css/default.scss";
import "./css/problem.scss";

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

const targets = ["problemTableBody"];
var numQuestions = 0;

//render all the questions from questions.json in a table

function onload(){
	console.log("loading up questions.json");
    Axios.get('/data/questions.json')
    .then( resp => {
        renderAll(resp.data);
    });
	console.log("rendered question data");
}
window.addEventListener("load", onload);


function renderAll(questions){
    targets.forEach( tgt => render(
        document.getElementById(tgt), questions));
}

function render(targetDiv, questions){
    questions.forEach( (question) => {
		const { problem, body, table, sidebar, content, testCases, data } = question
		const detailsContainer = document.createElement("tr");
		
		//name
		const entry = document.createElement("tr");
		const nameE = document.createElement("td");
		const linkE = document.createElement("a");
		//"queryProblem(sidebar.problemID)"
		linkE.setAttribute("onClick", "fetchProblem('" + sidebar.problemID + "')");
		nameE.appendChild(linkE);
		linkE.innerText = problem;
		
		//nameE.innerText = problem;
		detailsContainer.appendChild(nameE);
		
		//url
		const urlE = document.createElement("td");
		urlE.innerText = "https://open.kattis.com/problems/" + sidebar.problemID;
		detailsContainer.appendChild(urlE);
		
		//category
		
		const categoryE = document.createElement("td");
		//categoryE.innerText = data.category;
		detailsContainer.appendChild(categoryE);
		
		//difficulty
		const difficultyE = document.createElement("td");
		difficultyE.innerText = sidebar.difficulty;
		detailsContainer.appendChild(difficultyE);
		
        targetDiv.appendChild(detailsContainer);
		numQuestions++;
    })
}