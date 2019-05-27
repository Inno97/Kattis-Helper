import "./css/default.scss";
import "./css/problem.scss";

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

const targets = ["questions"];

//render all the questions from questions.json

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
        const { name, url, category, difficulty } = question;
        const entry = document.createElement("div");
        entry.classList.add("question-card");
		const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("details");
        
		// Name
        const nameE = document.createElement("div");
        nameE.classList.add("name")
        nameE.innerText = name;
        detailsContainer.appendChild(nameE);

        // url
        const urlE = document.createElement("a");
		//urlE.classList.add("url");
		urlE.innerText = url;
		urlE.href = url;
		detailsContainer.appendChild(urlE);
		
		// category
		const catEWrapper = document.createElement("div");
		catEWrapper.classList.add("wrapper");
		catEWrapper.innerText = "Category: ";
        const catE = document.createElement("div");
        catE.classList.add("category");
        catE.innerText = category;
		catEWrapper.appendChild(catE);
		detailsContainer.appendChild(catEWrapper);
		
        // difficulty
        const diffEWrapper = document.createElement("div");
        diffEWrapper.classList.add("wrapper");
		diffEWrapper.innerText = "Difficulty: ";
		const diffE = document.createElement("div");
        diffE.classList.add("difficulty");
        diffE.innerText = difficulty;
		diffEWrapper.appendChild(diffE);
		detailsContainer.appendChild(diffEWrapper);
		
        entry.appendChild(detailsContainer);
        targetDiv.appendChild(entry);
    })
    
}