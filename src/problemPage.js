import "./css/default.scss";
import "./css/problemPage.scss"; // Modify this file as required.

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

function onload(){
	console.log("load problem: ");
	console.log(userStorage.getItem('problem'));
	renderProblem(userStorage.getItem('problem'));
}
window.addEventListener("load", onload);

function renderProblem(problem) {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	//overall wrapper
	const problemWrapper = document.createElement("div");
	problemWrapper.classList.add("problemWrapper");
	
	//left side / content
	const problemLeft = document.createElement("div");
	problemLeft.classList.add("problemLeft");
	problemWrapper.appendChild(problemLeft);
	
	const problemTitle = document.createElement("div");
	problemTitle.classList.add("problemTitle");
	problemTitle.innerText = problem;
	problemLeft.appendChild(problemTitle);
	
	const problemDesc = document.createElement("div");
	problemDesc.classList.add("problemContent");
	problemDesc.innerText = "VisuAlgo (http://visualgo.net) is a website developed by a team of staff and students of School of Computing, National University of Singapore.";
	problemLeft.appendChild(problemDesc);
	
	//input
	const problemInputHeader = document.createElement("div");
	problemInputHeader.classList.add("problemHeaderLarge");
	problemInputHeader.innerText = "Input";
	problemLeft.appendChild(problemInputHeader);
	
	const problemInput = document.createElement("div");
	problemInput.classList.add("problemContent");
	problemInput.innerText = "Spam Visualgo for 1 weekend.";
	problemLeft.appendChild(problemInput);
	
	//output
	const problemOutputHeader = document.createElement("div");
	problemOutputHeader.classList.add("problemHeaderLarge");
	problemOutputHeader.innerText = "Output";
	problemLeft.appendChild(problemOutputHeader);
	
	const problemOutput = document.createElement("div");
	problemOutput.classList.add("problemContent");
	problemOutput.innerText = "Get 19 out of 20 for Visualgo quiz because of the last question";
	problemLeft.appendChild(problemOutput);
	
	//format sample test cases
	const testCase1Wrapper = document.createElement("div");
	testCase1Wrapper.classList.add("testCaseWrapper");
	problemLeft.appendChild(testCase1Wrapper);
	
	//input
	const testCase1Input = document.createElement("div");
	testCase1Wrapper.appendChild(testCase1Input);
	
	const testCase1InputHeader = document.createElement("div");
	testCase1InputHeader.classList.add("testCaseHeader");
	testCase1InputHeader.innerText = "Sample Input 1";
	testCase1Input.appendChild(testCase1InputHeader);
	
	const testCase1InputContent = document.createElement("div");
	testCase1InputContent.classList.add("testCaseBox");
	testCase1Input.appendChild(testCase1InputContent);
	
	//output
	const testCase1Output = document.createElement("div");
	testCase1Wrapper.appendChild(testCase1Output);
	
	const testCase1OutputHeader = document.createElement("div");
	testCase1OutputHeader.classList.add("testCaseHeader");
	testCase1OutputHeader.innerText = "Sample Output 1";
	testCase1Output.appendChild(testCase1OutputHeader);
	
	const testCase1OutputContent = document.createElement("div");
	testCase1OutputContent.classList.add("testCaseBox");
	testCase1OutputContent.innerText = "ok";
	testCase1Output.appendChild(testCase1OutputContent);
	
	//right side / sidebar
	const problemRight = document.createElement("div");
	problemRight.classList.add("problemRight");
	problemWrapper.appendChild(problemRight);
	
	const problemSummaryTitle = document.createElement("div");
	problemSummaryTitle.classList.add("problemSummaryTitle");
	problemSummaryTitle.innerText = "Problem Summary";
	problemRight.appendChild(problemSummaryTitle);
	
	//problem ID
	const problemID = document.createElement('p');
	problemRight.appendChild(problemID);
	
	const problemIDHeader = document.createElement('strong');
    const problemIDHeaderText = document.createTextNode("Problem ID: ");
	problemIDHeader.appendChild(problemIDHeaderText);
	problemID.appendChild(problemIDHeader);
	const problemIDContent = document.createTextNode(problem); //fetch data
	problemID.appendChild(problemIDContent);
	
	//CPU Time limit
	const cpuLimit = document.createElement('p');
	problemRight.appendChild(cpuLimit);
	
	const cpuLimitHeader = document.createElement('strong');
    const cpuLimitHeaderText = document.createTextNode("CPU Time Limit: ");
	cpuLimitHeader.appendChild(cpuLimitHeaderText);
	cpuLimit.appendChild(cpuLimitHeader);
	const cpuLimitContent = document.createTextNode("1 second"); //fetch data
	cpuLimit.appendChild(cpuLimitContent);
	
	//memory limit
	const memoryLimit = document.createElement('p');
	problemRight.appendChild(memoryLimit);
	
	const memoryLimitHeader = document.createElement('strong');
    const memoryLimitHeaderText = document.createTextNode("Memory Limit: ");
	memoryLimitHeader.appendChild(memoryLimitHeaderText);
	memoryLimit.appendChild(memoryLimitHeader);
	const memoryLimitContent = document.createTextNode("1000 MB"); //fetch data
	memoryLimit.appendChild(memoryLimitContent);
	
	//difficulty
	const difficulty = document.createElement('p');
	problemRight.appendChild(difficulty);
	
	const difficultyHeader = document.createElement('strong');
    const difficultyHeaderText = document.createTextNode("Difficulty ");
	difficultyHeader.appendChild(difficultyHeaderText);
	difficulty.appendChild(difficultyHeader);
	const difficultyContent = document.createTextNode("4.8"); //fetch data
	difficulty.appendChild(difficultyContent);
	
	
	
	document.getElementById('content').appendChild(problemWrapper);
	
}