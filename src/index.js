import "./css/default.scss";
import "./css/index.scss";

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

function onload(){
	console.log("loaded index.html");
	
	Axios.get('/data/questions.json')
    .then( resp => {
		loadSuggestedQuestion(resp.data);
		loadPopularQuestion(resp.data);
    });
}
window.addEventListener("load", onload);

var numQuestionsRendered = 0; //keep track of how many questions are rendered currently

//load 8 questions per box
//load random questions for now, but put in order of difficulty

/*
<tbody id="popularProblemsTbody">
				</tbody>
<tbody id="suggestedProblemsTbody">
					<tr>
						<th>Trivial</th>
						<th>Hello World!</th>
					</tr>
					<tr>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th></th>
					</tr>
					<tr>
						<th></th>
						<th></th>
					</tr>
				</tbody>
*/

function loadSuggestedQuestion(questions) {
	questions.forEach( (question) => {
		const { problem, body, table, sidebar, content, testCases, data } = question;
		
		//console.log(problem + " " + sidebar.difficulty);
		
		//edit ranges as needed
		if (numQuestionsRendered >= 0 && numQuestionsRendered <= 1) { //trivial
			if (sidebar.difficulty < 2) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Trivial", "suggestedProblemsTbody");
				numQuestionsRendered++;
			}
		} else if (numQuestionsRendered >= 2 && numQuestionsRendered <= 3) { //easy
			if (sidebar.difficulty >= 2 && sidebar.difficulty < 4) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Easy", "suggestedProblemsTbody");
				numQuestionsRendered++;
			}
		} else if (numQuestionsRendered >= 4 && numQuestionsRendered <= 5) { //medium
			if (sidebar.difficulty >= 4 && sidebar.difficulty < 6) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Medium", "suggestedProblemsTbody");
				numQuestionsRendered++;
			}
		} else if (numQuestionsRendered >= 6 && numQuestionsRendered <= 7) { //hard
			if (sidebar.difficulty >= 6) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Hard", "suggestedProblemsTbody");
				numQuestionsRendered++;
			}
		}
	});
}

function loadPopularQuestion(questions) {
	questions.forEach( (question) => {
		const { problem, body, table, sidebar, content, testCases, data } = question;
		
		//console.log(problem + " " + sidebar.difficulty);
		
		if (numQuestionsRendered <= 15) {
		//edit ranges as needed
			if (sidebar.difficulty < 2) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Trivial", "popularProblemsTbody");
				numQuestionsRendered++;
			}
			if (sidebar.difficulty >= 2 && sidebar.difficulty < 4) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Easy", "popularProblemsTbody");
				numQuestionsRendered++;
			}
			if (sidebar.difficulty >= 4 && sidebar.difficulty < 6) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Medium", "popularProblemsTbody");
				numQuestionsRendered++;
			}
			if (sidebar.difficulty >= 6) {
				renderQuestion(problem, sidebar.difficulty, sidebar.problemID, "Hard", "popularProblemsTbody");
				numQuestionsRendered++;
			}
		}
		
	});
}

function renderQuestion(questionName, questionDifficulty, questionID, tag, target) {
	const question = document.createElement("tr");
	
	const difficulty = document.createElement("th");
	difficulty.innerText = tag + " (" + questionDifficulty + ")";
	question.appendChild(difficulty);
	
	const name = document.createElement("td");
	const nameLink = document.createElement("a");
	nameLink.setAttribute("onClick", "fetchProblem('" + questionID + "')");
	name.appendChild(nameLink);
	nameLink.innerText = questionName;
	question.appendChild(name);
	
	document.getElementById(target).appendChild(question);
}

function loadQuestion(questions) {
	questions.forEach( (question) => {
		const { problem, body, table, sidebar, content, testCases, data } = question;
		
		
	});
	
} 