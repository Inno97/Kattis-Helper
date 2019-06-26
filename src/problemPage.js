import "./css/default.scss";
import "./css/problemPage.scss"; // Modify this file as required.

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

var verifyFlag = false;

function onload(){
	console.log("load problem: ");
	console.log(userStorage.getItem('problem'));
	verifyProblem();
}
window.addEventListener("load", onload);

function verifyProblem() {
	Axios.get('/data/questions.json')
    .then( resp => {
        verifyEachProblem(resp.data);
    });
}

function verifyEachProblem(questions) {
	questions.forEach( (question) => {
		const { problem, body, table, sidebar, content, testCases, data } = question
		/* JSON format
		{
        "problem": "0-1 Sequences",
        "body": {
            "Question": "For each 0-1 sequence, define its number of inversions as\n    the minimum number of adjacent swaps required to sort the\n    sequence in non-decreasing order. In this problem, the sequence\n    is sorted in non-decreasing order precisely when all the zeroes\n    occur before all the ones. For example, the sequence 11010 has $5$ inversions. We can sort it by the\n    following moves: 11010 $\\rightarrow $ 11001 $\\rightarrow $ 10101 $\\rightarrow $ 01101 $\\rightarrow $ 01011 $\\rightarrow $ 00111.Find the sum of the number of inversions of the $2^ k$ sequences, modulo $1\\, 000\\, 000\\, 007$ ($10^9 + 7$).",
            "Input": "The first and only line of input contains the input string,\n    consisting of characters ‘0’,\n    ‘1’, and ‘?’ only, and the input string has between\n    $1$ to $500\\, 000$ characters, inclusive.",
            "Output": "Output an integer indicating the aforementioned number of\n    inversions modulo $1\\, 000\\,\n    000\\, 007$."
        },
        "table": {
            "input": [
                "?0?\n"
            ],
            "output": [
                "3\n"
            ]
        },
        "sidebar": {
            "ProblemID": "sequences",
            "CPU": " 1 second",
            "Memory": " 1024 MB",
            "Difficulty": "6.7"
        },
        "content": {
            "author": "Tung Kam Chuen",
            "source": "Hong Kong Regional Online Preliminary 2016",
            "license": "https://licensebuttons.net/l/by-sa/3.0/80x15.png"
        }
    }
		*/
		if (sidebar.problemID == userStorage.getItem('problem')) {
			verifyFlag = true;
			console.log(sidebar.ProblemID);
			
			//set local storage here, values are init via localStorageHandler.js
			userStorage.setItem('questionName', problem);
			userStorage.setItem('questionID', sidebar.problemID);
			//userStorage.setItem('questionUrl', url);
			userStorage.setItem('questionCat', data.category);
			userStorage.setItem('questionDiff', sidebar.difficulty);
			userStorage.setItem('questionDesc', body.question);
			userStorage.setItem('questionIn', body.input);
			userStorage.setItem('questionOut', body.output);
			userStorage.setItem('questionCpuLim', sidebar.CPU);
			userStorage.setItem('questionMemLim', sidebar.memory);
			userStorage.setItem('questionNumTest', testCases.numTestCase);
			userStorage.setItem('questionSamIn', table.input);
			userStorage.setItem('questionSamOut', table.output);
			userStorage.setItem('questionAuthor', content.author);
			userStorage.setItem('questionSource', content.source);
			renderProblem(sidebar.problemID);
			
			userStorage.setItem('questionNumSample', table.input.length);
			var numSampleCases = 0;
			var inputStringName = "";
			var outputStringName = "";
			table.input.forEach( function(input) {
				inputStringName = "input" + numSampleCases;
				outputStringName = "output" + numSampleCases;
				console.log(numSampleCases);
				console.log(inputStringName);
				userStorage.setItem(inputStringName.toString(), table.input[numSampleCases]);
				userStorage.setItem(outputStringName.toString(), table.output[numSampleCases]);
				//console.log(userStorage.getItem('input0'));
				numSampleCases++;
			});
			
			return 0;
		}
	});
	if (verifyFlag == false) {window.location.href = "problemNotFound.html"; }
}

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
	problemTitle.innerText = userStorage.getItem('questionName');
	problemLeft.appendChild(problemTitle);
	
	const problemDesc = document.createElement("div");
	problemDesc.classList.add("problemContent");
	problemDesc.innerText = userStorage.getItem('questionDesc');
	problemLeft.appendChild(problemDesc);
	
	//input
	const problemInputHeader = document.createElement("div");
	problemInputHeader.classList.add("problemHeaderLarge");
	problemInputHeader.innerText = "Input";
	problemLeft.appendChild(problemInputHeader);
	
	const problemInput = document.createElement("div");
	problemInput.classList.add("problemContent");
	problemInput.innerText = userStorage.getItem('questionIn');
	problemLeft.appendChild(problemInput);
	
	//output
	const problemOutputHeader = document.createElement("div");
	problemOutputHeader.classList.add("problemHeaderLarge");
	problemOutputHeader.innerText = "Output";
	problemLeft.appendChild(problemOutputHeader);
	
	const problemOutput = document.createElement("div");
	problemOutput.classList.add("problemContent");
	problemOutput.innerText = userStorage.getItem('questionOut');
	problemLeft.appendChild(problemOutput);
	
	//render all sample test cases
	const testCaseHeader = document.createElement("div");
	testCaseHeader.classList.add("problemHeaderLarge");
	testCaseHeader.innerText = "Sample Test Cases";
	problemLeft.appendChild(testCaseHeader);
	
	const testCaseWrapper = document.createElement("div");
	testCaseWrapper.classList.add("testCaseWrapper");
	problemLeft.appendChild(testCaseWrapper);
	
	console.log("rendering sample test cases");
	for (var i = 1; i <= userStorage.getItem('questionNumSample'); i++) {
		const testCaseWrapperHorz = document.createElement("div");
		testCaseWrapperHorz.classList.add("testCaseWrapperHorz");
		console.log(i); //debug
		//input
		var inputName = "input" + (i - 1);
		const testCaseInput = document.createElement("div");
		testCaseWrapperHorz.appendChild(testCaseInput);
		
		const testCaseInputHeader = document.createElement("div");
		testCaseInputHeader.classList.add("testCaseHeader");
		testCaseInputHeader.innerText = "Sample Input " + i;
		testCaseInput.appendChild(testCaseInputHeader);
		
		const testCaseInputContent = document.createElement("div");
		testCaseInputContent.classList.add("testCaseBox");
		testCaseInputContent.innerText = userStorage.getItem(inputName.toString());
		testCaseInput.appendChild(testCaseInputContent);
		
		//filler
		const sampleFiller = document.createElement("div");
		sampleFiller.classList.add("filler");
		sampleFiller.innerText = "xxxx";
		testCaseWrapperHorz.appendChild(sampleFiller);
		
		//output
		var outputName = "output" + (i - 1);
		const testCaseOutput = document.createElement("div");
		testCaseWrapperHorz.appendChild(testCaseOutput);
		
		const testCaseOutputHeader = document.createElement("div");
		testCaseOutputHeader.classList.add("testCaseHeader");
		testCaseOutputHeader.innerText = "Sample Output " + i;
		testCaseOutput.appendChild(testCaseOutputHeader);
		
		const testCaseOutputContent = document.createElement("div");
		testCaseOutputContent.classList.add("testCaseBox");
		testCaseOutputContent.innerText = userStorage.getItem(outputName.toString());
		testCaseOutput.appendChild(testCaseOutputContent);
		testCaseWrapper.appendChild(testCaseWrapperHorz);
	}
	
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
	const cpuLimitContent = document.createTextNode(userStorage.getItem('questionCpuLim')); //fetch data
	cpuLimit.appendChild(cpuLimitContent);
	
	//memory limit
	const memoryLimit = document.createElement('p');
	problemRight.appendChild(memoryLimit);
	
	const memoryLimitHeader = document.createElement('strong');
    const memoryLimitHeaderText = document.createTextNode("Memory Limit: ");
	memoryLimitHeader.appendChild(memoryLimitHeaderText);
	memoryLimit.appendChild(memoryLimitHeader);
	const memoryLimitContent = document.createTextNode(userStorage.getItem('questionMemLim')); //fetch data
	memoryLimit.appendChild(memoryLimitContent);
	
	//difficulty
	const difficulty = document.createElement('p');
	problemRight.appendChild(difficulty);
	
	const difficultyHeader = document.createElement('strong');
    const difficultyHeaderText = document.createTextNode("Difficulty: ");
	difficultyHeader.appendChild(difficultyHeaderText);
	difficulty.appendChild(difficultyHeader);
	const difficultyContent = document.createTextNode(userStorage.getItem('questionDiff')); //fetch data
	difficulty.appendChild(difficultyContent);
	
	//num of test cases
	const numTestCase = document.createElement('p');
	problemRight.appendChild(numTestCase);
	
	const numTestCaseHeader = document.createElement('strong');
    const numTestCaseHeaderText = document.createTextNode("Number of Test Cases: ");
	numTestCaseHeader.appendChild(numTestCaseHeaderText);
	numTestCase.appendChild(numTestCaseHeader);
	const numTestCaseContent = document.createTextNode(userStorage.getItem('questionNumTest')); //fetch data
	numTestCase.appendChild(numTestCaseContent);
	
	//author
	const author = document.createElement('p');
	problemRight.appendChild(author);
	
	const authorHeader = document.createElement('strong');
    const authorHeaderText = document.createTextNode("Author: ");
	authorHeader.appendChild(authorHeaderText);
	author.appendChild(authorHeader);
	const authorContent = document.createTextNode(userStorage.getItem('questionAuthor')); //fetch data
	author.appendChild(authorContent);
	
	//source
	const source = document.createElement('p');
	problemRight.appendChild(source);
	
	const sourceHeader = document.createElement('strong');
    const sourceHeaderText = document.createTextNode("Source: ");
	sourceHeader.appendChild(sourceHeaderText);
	source.appendChild(sourceHeader);
	const sourceContent = document.createTextNode(userStorage.getItem('questionSource')); //fetch data
	source.appendChild(sourceContent);

	document.getElementById('content').appendChild(problemWrapper);
}