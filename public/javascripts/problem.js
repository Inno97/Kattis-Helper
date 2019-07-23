/**
 * problem.js
 * for use in problem.html
 * renders specific problem
 */
//global variable declaration
var problemSampleInput = {};
var problemSampleOutput = {};
var problemAllInput = {};
var problemAllOutput = {};

function onload(){
	console.log("problem.js loaded");
	
	console.log('parsing local storage test cases into JSON');
	problemSampleInput = JSON.parse(userStorage.getItem('problemSamInJSON'));
	problemSampleOutput = JSON.parse(userStorage.getItem('problemSamOutJSON'));
	problemAllInput = JSON.parse(userStorage.getItem('problemTestCaseInputJSON'));
	problemAllOutput = JSON.parse(userStorage.getItem('problemTestCaseOutputJSON'));
	
	//generate html components from local storage
	generateWrapper();
	generateDetails();
	generateTestCase();
	generateIDE();
	generateForum();
	generateForumPostBox();
	
	//render initial menu
	renderDetails();
	renderSidebar();
	
	//fetch forum data
	fetchForum(userStorage.getItem('problemID'));
	
}
window.addEventListener("load", onload);

function generateWrapper() {
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

function generateDetails() {
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
	for (var i = 1; i <= userStorage.getItem('problemNumSam'); i++) {
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
		testCaseInputContent.innerText = problemSampleInput[i - 1];
		problemSampleInput
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
		testCaseOutputContent.innerText = problemSampleOutput[i - 1];
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
		testCaseIconButton.setAttribute('src', '/static/test_case_icon_medium.png');
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
		testCaseInputContent.innerText = problemAllInput[i - 1];
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
		testCaseOutputContent.innerText = problemAllOutput[i - 1];
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
	inputWrapper.setAttribute("id", "inputcases");
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
	outputWrapper.setAttribute("id", "outputcases");
	outputWrapper.classList.add("testCaseWrapperVert");
	testCaseWrapperHorz.appendChild(outputWrapper);
	
	const outputBoxTitle = document.createElement("div");
	outputBoxTitle.innerText = "Output";
	outputBoxTitle.classList.add("testCaseTitle");
	outputWrapper.appendChild(outputBoxTitle);
	
	const outputBox = document.createElement("textarea");
	outputBox.readOnly = true;
	outputBox.setAttribute("id", "outputvalue");
	outputBox.classList.add("testCaseBox");
	outputWrapper.appendChild(outputBox);
	
	//compile button
	const compileButton = document.createElement("button");
	compileButton.innerText = "Compile";
	compileButton.setAttribute("onClick", "startcompling()");
	problemLeft.appendChild(compileButton);
	
}
function startcompling(){
	const source = document.querySelector(".compilerBox");
	const code = source.value;

	const input = document.querySelector("#inputcases textarea");
	const inputvalue = input.value;

	const executing = document.querySelector("#outputvalue");
	executing.value = "";
	executing.value = "Compiling";
	compiler(code , inputvalue);
}
function getdata(re){
    $.ajax({
        url: '/output',
        type: 'GET',
        data: {url: re.result.streams.output.uri},
        datatype: 'text',
        success: (res) => {
            console.log(res);
            //if(document.getElementById("output").value === "" || res === document.getElementById("output").value) {
				const text = document.querySelector("#outputvalue");
				text.value = res;

        //   }else{
		// 	document.querySelector("#outputcases textarea").value = "Wrong Ans: \n" + res;
        //   }
        },
        error: (req,err) => {console.log('result error:' + err); }
    });
}
function getresult(submission){
    $.ajax({
        url: '/result',
        type: 'GET',
        datatype: 'JSON',
        data: submission,
        success: (response2) => {
            console.log("loading");
            var re = JSON.parse(response2);
            console.log(re);
            if(re.executing){
                    getresult(submission);
            }else{
                if(re.result.status.name === "accepted"){
                    getdata(re);
                }else{
					document.querySelector("#outputcases textarea").value = re.result.status.name;
                }
            }

        },
        error: (req,err) => {console.log('result error:' + err); }
    });
}
function compiler(code , input){
    $.ajax({
        url: '/compile',
        type: 'GET',
        datatype: 'JSON',
        data: {
             source : code,
             input : input
        },
        success: (response) => {
        // process response
        console.log("success");
        const submission = JSON.parse(response); // id of submission
        console.log(submission);
        getresult(submission);
        },
        error: (req,err) => {console.log('error: ' + err); }
    });
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

function renderSidebar() {	
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
	const problemIDContent = document.createTextNode(userStorage.getItem('problemID')); //fetch data
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

function generateForumPostBox() {
	if (tempStorage.getItem('loginFlag') == 'TRUE') {
		//generate forum post text box (for logged in users)
		const forumInputBoxWrapper = document.createElement('div');
		forumInputBoxWrapper.classList.add('forumInputWrapper');
		document.getElementById('problemForum').appendChild(forumInputBoxWrapper);
		
		const forumInputBox = document.createElement('div');
		forumInputBox.classList.add('forumInputBox');
		forumInputBox.id = 'forumInputBox';
		forumInputBoxWrapper.appendChild(forumInputBox);
		
		const forumInputBoxHeader = document.createElement('div');
		forumInputBoxHeader.classList.add('forumTextHeader');
		forumInputBoxHeader.id = 'forumInputBoxHeader';
		forumInputBox.appendChild(forumInputBoxHeader);
		forumInputBoxHeader.innerText = 'Create New Forum Post';
		
		const forumInputBoxText = document.createElement('textarea');
		forumInputBoxText.classList.add('forumInputTextArea');
		forumInputBoxText.id = 'forumPostText';
		forumInputBox.appendChild(forumInputBoxText);
		
		const forumInputBoxHorzWrapper = document.createElement('div');
		forumInputBoxHorzWrapper.classList.add('forumInputBoxHorzWrapper');
		forumInputBoxHorzWrapper.id = 'forumInputBoxHorzWrapper';
		forumInputBox.appendChild(forumInputBoxHorzWrapper);
		
		const forumInputMakePost = document.createElement('button');
		forumInputMakePost.innerText = 'Submit';
		forumInputMakePost.id = 'postButton';
		forumInputBoxHorzWrapper.appendChild(forumInputMakePost);
		forumInputMakePost.setAttribute('onclick', 'createPost()');
		
		//create reply button and append to unused
		const forumInputMakeReply = document.createElement('button');
		forumInputMakeReply.innerText = 'Submit';
		forumInputMakeReply.id = 'replyButton';
		document.getElementById('menu').appendChild(forumInputMakeReply);
		
		const forumInputRerenderPost = document.createElement('button');
		forumInputRerenderPost.innerText = 'Make New Post';
		forumInputRerenderPost.id = 'makeNewPostButton';
		forumInputRerenderPost.setAttribute('onclick', 'handlePost()');
		document.getElementById('menu').appendChild(forumInputRerenderPost);
	}
}

function generateForumPosts(data) {
	console.log('generating forum posts');
	
	//generate forum post
	const forumWrapper = document.createElement('div');
	forumWrapper.classList.add('forumWrapper');
	forumWrapper.id = 'forumWrapper';
	document.getElementById('problemForum').appendChild(forumWrapper);
	
	if (data) { //check if forum posts have loaded properly
		if (data.posts.length > 0) {
			console.log(data.posts.length);
			for (let i = 0; i < data.posts.length; i++) {
				console.log('generating post: ' + (i + 1));
				//actual post
				const forumThreadWrapper = document.createElement('div');
				forumThreadWrapper.classList.add('forumPostWrapper');
				forumWrapper.appendChild(forumThreadWrapper);
				
				const forumThread = document.createElement('div');
				forumThread.classList.add('forumPost');
				forumThreadWrapper.appendChild(forumThread);
				
				const forumThreadHeader = document.createElement('div');
				forumThreadHeader.classList.add('forumTextHeader');
				forumThread.appendChild(forumThreadHeader);
				forumThreadHeader.innerText = data.posts[i][0][0] + ' (' + data.posts[i][0][2] + ')';
				
				const forumThreadText = document.createElement('div');
				forumThreadText.classList.add('forumTextContent');
				forumThread.appendChild(forumThreadText);
				forumThreadText.innerText = data.posts[i][0][1];
				
				const replyButton = document.createElement('button');
				replyButton.id = 'post' + i;
				forumThread.appendChild(replyButton);
				replyButton.innerText = 'Reply';
				replyButton.setAttribute('onclick', 'handleReply(' + i + ')');
				
				//add delete button if post belongs to user
				if (tempStorage.getItem('username') == data.posts[i][0][0]) {
					const deleteThreadButton = document.createElement('button');
					deleteThreadButton.innerText = 'Delete';
					forumThread.appendChild(deleteThreadButton);
					deleteThreadButton.setAttribute('onclick', 'deletePost(' + i + ')');
				}
				
				//replies
				console.log(data.posts[i].length);
				if (data.posts[i].length > 1) {
					const forumReplyWrapper = document.createElement('div');
					forumReplyWrapper.classList.add('forumReplyWrapper');
					forumThreadWrapper.appendChild(forumReplyWrapper);
					
					for (let j = 1; j < data.posts[i].length; j++) {
						const forumReply = document.createElement('div');
						forumReply.classList.add('forumReply');
						forumReplyWrapper.appendChild(forumReply);
						
						const forumReplyHeader = document.createElement('div');
						forumReplyHeader.classList.add('forumTextHeader');
						forumReplyHeader.id = 'forumReplyHeader';
						forumReply.appendChild(forumReplyHeader);
						forumReplyHeader.innerText = data.posts[i][j][0] + ' (' + data.posts[i][j][2] + ')';
						
						const forumReplyText = document.createElement('div');
						forumReplyText.classList.add('forumTextContent');
						forumReply.appendChild(forumReplyText);
						forumReplyText.innerText = data.posts[i][j][1];
						
						//add delete button if post belongs to user
						if (tempStorage.getItem('username') == data.posts[i][j][0]) {
							const deleteReplyButton = document.createElement('button');
							deleteReplyButton.innerText = 'Delete';
							forumReply.appendChild(deleteReplyButton);
							deleteReplyButton.setAttribute('onclick', 'deleteReply(' + i + ', ' + j + ')');
						}
					}
				}
			}
			return;
		} else { //render placeholder forum page
			const placeholderElementBox = document.createElement('div');
			placeholderElementBox.classList.add('forumPlaceholderBox');
			document.getElementById('forumWrapper').appendChild(placeholderElementBox);
			
			const placeholderElementText = document.createElement('div');
			placeholderElementText.classList.add('forumPlaceholderText');
			placeholderElementText.innerText = 'There\'s no posts here yet!\nLogin to start some discussion on this problem.';
			placeholderElementBox.appendChild(placeholderElementText);
		}
	} else { //render placeholder element
		console.log('error in reading forum data');
		const placeholderElementBox = document.createElement('div');
		placeholderElementBox.classList.add('forumPlaceholderBox');
		document.getElementById('forumWrapper').appendChild(placeholderElementBox);
		
		const placeholderElementText = document.createElement('div');
		placeholderElementText.classList.add('forumPlaceholderText');
		placeholderElementText.innerText = 'There seems to be something wrong with loading the forum posts...\nPlease refresh the page and try again!';
		placeholderElementBox.appendChild(placeholderElementText);
	}
}

function removeForumPosts() {
	document.getElementById('forumWrapper').parentNode.removeChild(document.getElementById('forumWrapper'));
}

function clearForumPostBox() {
	document.getElementById('forumPostText').value = "";
}

//handle switching of forum input text box
function handleReply(postNum) {
	document.getElementById('forumInputBoxHorzWrapper').appendChild(document.getElementById('replyButton'));
	document.getElementById('forumInputBoxHorzWrapper').appendChild(document.getElementById('makeNewPostButton'));
	document.getElementById('menu').appendChild(document.getElementById('postButton'));
	document.getElementById('replyButton').setAttribute('onclick', 'createReply(' + postNum + ')');
	document.getElementById('forumInputBoxHeader').innerText = 'Create Reply';
}

function handlePost() {
	document.getElementById('forumInputBoxHorzWrapper').appendChild(document.getElementById('postButton'));
	document.getElementById('menu').appendChild(document.getElementById('replyButton'));
	document.getElementById('menu').appendChild(document.getElementById('makeNewPostButton'));
	document.getElementById('forumInputBoxHeader').innerText = 'Create New Forum Post';
}	

/**
 * http requests related function
 */
function fetchForum(problem) {
	console.log('fetching forum for problem: ' + problem);
	
	const requestURL = '/forum/?problem=' + problem;
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log(data);
			generateForumPosts(data);
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

//create new reply to a post
function createReply(postNum) {
	console.log('sending request to make new reply');
	console.log('replying to post ' + postNum);
	var newPost = document.getElementById('forumPostText').value;
	console.log(newPost);
	
	//grab current date and time
	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth()+1) + '/' + Math.floor((today.getFullYear() % 100));
	var period = (today.getHours() > 12 ?  'PM' : 'AM');
	var hours = today.getHours() == 0 ? 12 : today.getHours() % 12;
	var minutes = today.getMinutes() < 10 ? '0'.toString() + today.getMinutes().toString() : today.getMinutes().toString();
	var time = hours + ":" + minutes + " " + period;
	var dateTime = date + ' ' + time;

	if (newPost != '') { //check for non-empty post
		const requestURL = '/forumPost/reply';
		$.ajax({
			url: requestURL,
			type: 'POST',
			dataType: 'JSON',
			data: {
				"problem": userStorage.getItem('problemName'),
				"problemID": userStorage.getItem('problemID'),
				"postNum": postNum,
				"username": tempStorage.getItem('username'),
				"text": newPost,
				"date": dateTime
			},
			success: (data) => {
				//reload forum posts
				console.log(data);
				removeForumPosts();
				fetchForum(userStorage.getItem('problemID'));
				clearForumPostBox();
			},
			error:function (xhr, ajaxOptions, thrownError){
				if(xhr.status==404) {
					alert(thrownError);
					console.log('not found');
				}
			}
		});
	}
}

function createPost() {
	console.log('sending request to make new post');
	var newPost = document.getElementById('forumPostText').value;
	console.log(newPost);
	
	//grab current date and time
	var today = new Date();
	var date = today.getDate() + '/' + (today.getMonth()+1) + '/' + Math.floor((today.getFullYear() % 100));
	var period = (today.getHours() > 12 ?  'PM' : 'AM');
	var hours = today.getHours() == 0 ? 12 : today.getHours() % 12;
	var minutes = today.getMinutes() < 10 ? '0'.toString() + today.getMinutes().toString() : today.getMinutes().toString();
	var time = hours + ":" + minutes + " " + period;
	var dateTime = date + ' ' + time;

	if (newPost != '') { //check for non-empty post
		const requestURL = '/forumPost/thread';
		$.ajax({
			url: requestURL,
			type: 'POST',
			dataType: 'JSON',
			data: {
				"problem": userStorage.getItem('problemName'),
				"problemID": userStorage.getItem('problemID'),
				"username": tempStorage.getItem('username'),
				"text": newPost,
				"date": dateTime
			},
			success: (data) => {
				//reload forum posts
				console.log(data);
				removeForumPosts();
				fetchForum(userStorage.getItem('problemID'));
				clearForumPostBox();
			},
			error:function (xhr, ajaxOptions, thrownError){
				if(xhr.status==404) {
					alert(thrownError);
					console.log('not found');
				}
			}
		});
	}
}

function deleteReply(postNum, itemNum) {
	console.log('sending request to delete reply');
	const requestURL = '/forumPost/deleteReply';
	$.ajax({
		url: requestURL,
		type: 'POST',
		dataType: 'JSON',
		data: {
			"problem": userStorage.getItem('problemID'),
			"postNum": postNum,
			"itemNum": itemNum
		},
		success: (data) => {
			//reload forum posts
			console.log(data);
			removeForumPosts();
			fetchForum(userStorage.getItem('problemID'));
			clearForumPostBox();
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

function deletePost(postNum) {
	console.log('sending request to delete thread');

	const requestURL = '/forumPost/deleteThread';
	$.ajax({
		url: requestURL,
		type: 'POST',
		dataType: 'JSON',
		data: {
			"problem": userStorage.getItem('problemID'),
			"postNum": postNum
		},
		success: (data) => {
			//reload forum posts
			console.log(data);
			removeForumPosts();
			fetchForum(userStorage.getItem('problemID'));
			clearForumPostBox();
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}