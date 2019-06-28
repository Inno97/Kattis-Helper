import "./css/default.scss";
import "./css/problemPage.scss";

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
	console.log("domain name");
	console.log(location.href.includes("/problemPage.html"));
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
			userStorage.setItem('problemName', problem);
			userStorage.setItem('problemID', sidebar.problemID);
			//userStorage.setItem('problemUrl', url);
			userStorage.setItem('problemCat', data.category);
			userStorage.setItem('problemDiff', sidebar.difficulty);
			userStorage.setItem('problemDesc', body.question);
			userStorage.setItem('problemIn', body.input);
			userStorage.setItem('problemOut', body.output);
			userStorage.setItem('problemCpuLim', sidebar.CPU);
			userStorage.setItem('problemMemLim', sidebar.memory);
			userStorage.setItem('problemNumTest', testCases.numTestCases);
			userStorage.setItem('problemSamIn', table.input);
			userStorage.setItem('problemSamOut', table.output);
			userStorage.setItem('problemAuthor', content.author);
			userStorage.setItem('problemSource', content.source);
			
			
			userStorage.setItem('problemNumSample', table.input.length);
			var numSampleCases = 0;
			var inputStringName = "";
			var outputStringName = "";
			console.log(userStorage.getItem('problemNumTest'));
			testCases.input.forEach( function(input) {
				inputStringName = "input" + numSampleCases;
				outputStringName = "output" + numSampleCases;
				console.log(numSampleCases);
				console.log(inputStringName);
				userStorage.setItem(inputStringName.toString(), testCases.input[numSampleCases]);
				userStorage.setItem(outputStringName.toString(), testCases.output[numSampleCases]);
				//console.log(userStorage.getItem('input0'));
				numSampleCases++;
			});
			
			renderWrapper();
			generateDetails(sidebar.problemID);
			generateTestCase(sidebar.problemID);
			generateIDE(sidebar.problemID);
			generateForum(sidebar.problemID);
			renderDetails(sidebar.problemID);
			renderSidebar(sidebar.problemID);
			return 0;
		}
	});
	if (verifyFlag == false) {window.location.href = "problemNotFound.html"; }
}

function renderWrapper() {
	//overall wrapper
	const problemWrapper = document.createElement("div");
	problemWrapper.classList.add("problemWrapper");
	problemWrapper.id = "problemWrapper";
	document.getElementById('content').appendChild(problemWrapper);
	
	//create temp left menu
	const problemLeft = document.createElement("div");
	problemLeft.classList.add("problemLeft");
	problemLeft.id = "problemLeft";
	document.getElementById('problemWrapper').appendChild(problemLeft);
	
	//generate menus
	const menu = document.createElement("div");
	menu.classList.add('unusedRender');
	menu.id = "menu";
	problemWrapper.appendChild(menu);
}

function generateDetails(problem) {
	console.log("generating details");
	//left side / content
	const problemLeft = document.createElement("div");
	problemLeft.id = "problemDetails";
	document.getElementById('menu').appendChild(problemLeft);
	
	const problemTitle = document.createElement("div");
	problemTitle.classList.add("problemTitle");
	problemTitle.innerText = userStorage.getItem('problemName');
	problemLeft.appendChild(problemTitle);
	
	const problemDesc = document.createElement("div");
	problemDesc.classList.add("problemContent");
	problemDesc.innerText = userStorage.getItem('problemDesc');
	problemLeft.appendChild(problemDesc);
	
	//input
	const problemInputHeader = document.createElement("div");
	problemInputHeader.classList.add("problemHeaderLarge");
	problemInputHeader.innerText = "Input";
	problemLeft.appendChild(problemInputHeader);
	
	const problemInput = document.createElement("div");
	problemInput.classList.add("problemContent");
	problemInput.innerText = userStorage.getItem('problemIn');
	problemLeft.appendChild(problemInput);
	
	//output
	const problemOutputHeader = document.createElement("div");
	problemOutputHeader.classList.add("problemHeaderLarge");
	problemOutputHeader.innerText = "Output";
	problemLeft.appendChild(problemOutputHeader);
	
	const problemOutput = document.createElement("div");
	problemOutput.classList.add("problemContent");
	problemOutput.innerText = userStorage.getItem('problemOut');
	problemLeft.appendChild(problemOutput);
	
	//render all sample test cases
	const testCaseHeader = document.createElement("div");
	testCaseHeader.classList.add("problemHeaderLarge");
	testCaseHeader.innerText = "Sample Test Cases";
	problemLeft.appendChild(testCaseHeader);
	
	const testCaseWrapper = document.createElement("div");
	testCaseWrapper.classList.add("testCaseWrapper");
	problemLeft.appendChild(testCaseWrapper);
	
	console.log("generating sample test cases");
	for (var i = 1; i <= userStorage.getItem('problemNumSample'); i++) {
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
}

function generateTestCase() {
	console.log("generating test case");
	//left side / content
	const problemLeft = document.createElement("div");
	problemLeft.id = "problemTestCase";
	document.getElementById('menu').appendChild(problemLeft);
	
	const title = document.createElement("div");
	title.classList.add("problemTitle");
	title.innerText = userStorage.getItem('problemName');
	problemLeft.appendChild(title);
	
	const testCaseTitle = document.createElement("div");
	testCaseTitle.classList.add("testCaseHeader");
	testCaseTitle.innerText = "Test Cases";
	problemLeft.appendChild(testCaseTitle);
	
	//generate all test cases
	const iconWrapper = document.createElement("div");
	iconWrapper.id = "problemTestCaseIconWrapper";
	iconWrapper.classList.add("testCaseMenuIconWrapper");
	problemLeft.appendChild(iconWrapper);
	
	const testCaseUnused = document.createElement("div");
	testCaseUnused.classList.add("unusedRender");
	testCaseUnused.id = "testCaseUnused";
	problemLeft.appendChild(testCaseUnused);
	
	console.log("generating all test cases");
	for (var i = 1; i <= userStorage.getItem('problemNumTest'); i++) {
		const testCaseIconButton = document.createElement("input");
		testCaseIconButton.setAttribute('type', 'image');
		testCaseIconButton.setAttribute('src', './assets/test_case_icon_medium.png');
		testCaseIconButton.setAttribute('onclick', "renderSpecificTestCase(" + (i - 1) + ")");
		iconWrapper.appendChild(testCaseIconButton);
		
		const testCaseWrapper = document.createElement("div");
		testCaseWrapper.id = "testCase" + (i - 1);
		
		const testCaseWrapperHorz = document.createElement("div");
		testCaseWrapperHorz.classList.add("testCaseWrapperHorz");
		console.log(i); //debug
		
		//input
		var inputName = "input" + (i - 1);
		const testCaseInput = document.createElement("div");
		testCaseWrapperHorz.appendChild(testCaseInput);
		
		const testCaseInputHeader = document.createElement("div");
		testCaseInputHeader.classList.add("testCaseHeader");
		testCaseInputHeader.innerText = "Input " + i;
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
		testCaseOutputHeader.innerText = "Output " + i;
		testCaseOutput.appendChild(testCaseOutputHeader);
		
		const testCaseOutputContent = document.createElement("div");
		testCaseOutputContent.classList.add("testCaseBox");
		testCaseOutputContent.innerText = userStorage.getItem(outputName.toString());
		testCaseOutput.appendChild(testCaseOutputContent);
		testCaseWrapper.appendChild(testCaseWrapperHorz);
		
		testCaseUnused.appendChild(testCaseWrapper);
	}
	problemLeft.appendChild(document.getElementById("testCase0"));
}


function generateIDE() {
	console.log("generating IDE");
	//left side / content
	const problemLeft = document.createElement("div");
	problemLeft.id = "problemIDE";
	document.getElementById('menu').appendChild(problemLeft);
	
	//compiler box
	const compilerBox = document.createElement("textarea");
	compilerBox.classList.add("compilerBox");
	compilerBox.id = "compilerTextBox";
	problemLeft.appendChild(compilerBox);
	
	const testCaseWrapperHorz = document.createElement("div");
	testCaseWrapperHorz.classList.add("testCaseWrapperHorz");
	problemLeft.appendChild(testCaseWrapperHorz);
	
	//input
	const inputWrapper = document.createElement("div");
	inputWrapper.classList.add("testCaseWrapperVert");
	testCaseWrapperHorz.appendChild(inputWrapper);
	
	const inputBoxTitle = document.createElement("div");
	inputBoxTitle.classList.add("testCaseTitle");
	inputBoxTitle.innerText = "Input";
	inputWrapper.appendChild(inputBoxTitle);
	
	const inputBox = document.createElement("textarea");
	inputBox.classList.add("testCaseBox");
	inputBox.placeholder = "> Insert Input Here";
	inputWrapper.appendChild(inputBox);
	
	//output
	const outputWrapper = document.createElement("div");
	outputWrapper.classList.add("testCaseWrapperVert");
	testCaseWrapperHorz.appendChild(outputWrapper);
	
	const outputBoxTitle = document.createElement("div");
	outputBoxTitle.innerText = "Output";
	outputBoxTitle.classList.add("testCaseTitle");
	outputWrapper.appendChild(outputBoxTitle);
	
	const outputBox = document.createElement("div");
	outputBox.classList.add("testCaseBox");
	outputWrapper.appendChild(outputBox);
	
	//compile button
	const compileButton = document.createElement("button");
	compileButton.innerText = "Compile";
	problemLeft.appendChild(compileButton);
	
}

function generateForum() {
	console.log("generating forum");
	//left side / content
	const problemLeft = document.createElement("div");
	problemLeft.id = "problemForum";
	document.getElementById('menu').appendChild(problemLeft);
	
}

//included in localStorageHandler.js because js apparently doesn't recognize this here
function renderDetails() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemDetails'))) {
		console.log("already at details menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemDetails'));
	
	userStorage.setItem('problemStatus', 'details');
}

function renderTestCase() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemTestCase'))) {
		console.log("already at test case menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemTestCase'));
	
	userStorage.setItem('problemStatus', 'testCase');
}

function renderSpecificTestCase(num) {
	console.log("rendering specific test case");
	if (document.getElementById('problemTestCase').childNodes.item(4) == ("testCase" + num).toString()) {
		console.log("already at test case" + num);
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('testCaseUnused').appendChild(document.getElementById('problemTestCase').childNodes.item(4));
	}
	document.getElementById('problemTestCase').appendChild(document.getElementById("testCase" + num));
}

function renderIDE() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemIDE'))) {
		console.log("already at IDE menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemIDE'));
	
	userStorage.setItem('problemStatus', 'ide');
}

function renderForum() {
	console.log("rendering problem");
	console.log(userStorage.getItem('problem'));
	
	if (document.getElementById('problemLeft').contains(document.getElementById('problemForum'))) {
		console.log("already at forum menu");
		return;
	} else if (document.getElementById('problemLeft').hasChildNodes()) {
		document.getElementById('menu').appendChild(document.getElementById('problemLeft').firstChild);
	}
	document.getElementById('problemLeft').appendChild(document.getElementById('problemForum'));
	
	userStorage.setItem('problemStatus', 'forum');
}

function renderSidebar(problem) {	
	//right side / sidebar
	const problemRight = document.createElement("div");
	problemRight.classList.add("problemRight");
	document.getElementById('problemWrapper').appendChild(problemRight);
	
	//sidebar helper wrapper
	const sidebarHelper = document.createElement('div');
	sidebarHelper.classList.add("sidebarHelperWrapper");
	problemRight.appendChild(sidebarHelper);
	
	//question details
	const detailsButton = document.createElement('button');
	detailsButton.innerText = "Details";
	detailsButton.classList.add("sidebarHelperButton");
	detailsButton.setAttribute("onClick", "renderDetails()");
	sidebarHelper.appendChild(detailsButton);
	
	//test cases
	const testCaseButton = document.createElement('button');
	testCaseButton.innerText = "Test Cases";
	testCaseButton.classList.add("sidebarHelperButton");
	sidebarHelper.appendChild(testCaseButton);
	testCaseButton.setAttribute("onClick", "renderTestCase()");
	
	//IDE / online compiler
	const ideButton = document.createElement('button');
	ideButton.innerText = "IDE";
	ideButton.classList.add("sidebarHelperButton");
	sidebarHelper.appendChild(ideButton);
	ideButton.setAttribute("onClick", "renderIDE()");
	
	//forum
	const forumButton = document.createElement('button');
	forumButton.innerText = "Forum";
	forumButton.classList.add("sidebarHelperButton");
	sidebarHelper.appendChild(forumButton);	
	forumButton.setAttribute("onClick", "renderForum()");
	
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
	const cpuLimitContent = document.createTextNode(userStorage.getItem('problemCpuLim')); //fetch data
	cpuLimit.appendChild(cpuLimitContent);
	
	//memory limit
	const memoryLimit = document.createElement('p');
	problemRight.appendChild(memoryLimit);
	
	const memoryLimitHeader = document.createElement('strong');
    const memoryLimitHeaderText = document.createTextNode("Memory Limit: ");
	memoryLimitHeader.appendChild(memoryLimitHeaderText);
	memoryLimit.appendChild(memoryLimitHeader);
	const memoryLimitContent = document.createTextNode(userStorage.getItem('problemMemLim')); //fetch data
	memoryLimit.appendChild(memoryLimitContent);
	
	//difficulty
	const difficulty = document.createElement('p');
	problemRight.appendChild(difficulty);
	
	const difficultyHeader = document.createElement('strong');
    const difficultyHeaderText = document.createTextNode("Difficulty: ");
	difficultyHeader.appendChild(difficultyHeaderText);
	difficulty.appendChild(difficultyHeader);
	const difficultyContent = document.createTextNode(userStorage.getItem('problemDiff')); //fetch data
	difficulty.appendChild(difficultyContent);
	
	//num of test cases
	const numTestCase = document.createElement('p');
	problemRight.appendChild(numTestCase);
	
	const numTestCaseHeader = document.createElement('strong');
    const numTestCaseHeaderText = document.createTextNode("Number of Test Cases: ");
	numTestCaseHeader.appendChild(numTestCaseHeaderText);
	numTestCase.appendChild(numTestCaseHeader);
	const numTestCaseContent = document.createTextNode(userStorage.getItem('problemNumTest')); //fetch data
	numTestCase.appendChild(numTestCaseContent);
	
	//author
	const author = document.createElement('p');
	problemRight.appendChild(author);
	
	const authorHeader = document.createElement('strong');
    const authorHeaderText = document.createTextNode("Author: ");
	authorHeader.appendChild(authorHeaderText);
	author.appendChild(authorHeader);
	const authorContent = document.createTextNode(userStorage.getItem('problemAuthor')); //fetch data
	author.appendChild(authorContent);
	
	//source
	const source = document.createElement('p');
	problemRight.appendChild(source);
	
	const sourceHeader = document.createElement('strong');
    const sourceHeaderText = document.createTextNode("Source: ");
	sourceHeader.appendChild(sourceHeaderText);
	source.appendChild(sourceHeader);
	const sourceContent = document.createTextNode(userStorage.getItem('problemSource')); //fetch data
	source.appendChild(sourceContent);
	
}