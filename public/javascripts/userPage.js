/**
 * userPage.js
 * handles rendering of html elements in a user page
 */
 
/*
	stuff to display:
	username				forum posts (include link to problem)
	email
	
	problems solved
	name / date
 */

function onload() {
	console.log('userPage.js loaded');
	
	fetchProfile()
}
window.addEventListener("load", onload);

function fetchProfile() {
	//perform ajax query
	const requestURL = '/fetchProfile/?username=' + tempStorage.getItem('username');
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'JSON',
		success: (data) => {
			console.log(data);
			renderProfile(data)
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert(thrownError);
				console.log('not found');
			}
		}
	});
}

/**
 email: "mostlytoss@gmail.com"
forumPosts: Array(1)
0: (3) ["sampleProblem", "sampleDate", "sampleText"]
length: 1
__proto__: Array(0)
problemsSolved: [Array(2)]
username: "thomas"
 */
function renderProfile(userProfile) {
	const userProfileBox = document.createElement('div');
	userProfileBox.classList.add('userBox');
	document.getElementById('content').appendChild(userProfileBox);
	
	//generate overall wrapper and both sides
	const userProfileWrapper = document.createElement('div');
	userProfileWrapper.classList.add('userHorzWrapper');
	userProfileBox.appendChild(userProfileWrapper);
	
	const userProfileLeft = document.createElement('div');
	userProfileLeft.id = 'userProfileLeft';
	userProfileLeft.classList.add('userVertWrapper');
	userProfileWrapper.appendChild(userProfileLeft);
	
	const userProfileRight = document.createElement('div');
	userProfileRight.id = 'userProfileRight';
	userProfileRight.classList.add('userVertWrapper');
	userProfileWrapper.appendChild(userProfileRight);
	
	//information header
	const userProfileUsername = document.createElement('div');
	userProfileUsername.classList.add('userTextHeader');
	userProfileUsername.innerText = userProfile.username;
	userProfileLeft.appendChild(userProfileUsername);
	
	const userProfileEmail = document.createElement('div');
	userProfileEmail.classList.add('userTextElement');
	userProfileEmail.innerText = userProfile.email;
	userProfileLeft.appendChild(userProfileEmail);
	
	//problems solved
	const padding1 = document.createElement('div');
	padding1.classList.add('filler');
	padding1.innerText = '1\n1\n';
	userProfileLeft.appendChild(padding1);
	
	const problemsSolvedBoxHeader = document.createElement('div');
	problemsSolvedBoxHeader.classList.add('userTextHeader');
	problemsSolvedBoxHeader.innerText = 'Problems Solved';
	userProfileLeft.appendChild(problemsSolvedBoxHeader);
	
	const problemsSolvedBox = document.createElement('div');
	problemsSolvedBox.classList.add('userProblemBox');
	userProfileLeft.appendChild(problemsSolvedBox);
	problemsSolvedBox.appendChild(document.getElementById('problemSolvedTable'));
	
	//generate all problems
	for (let i = 0; i < userProfile.problemsSolved.length; i++) {
		console.log('got new problem with id ' + userProfile.problemsSolved[i][1]);
		console.log(userProfile.problemsSolved[i]);
		const detailsContainer = document.createElement('tr');
		document.getElementById('problemSolvedTable').appendChild(detailsContainer);

		const problemName = document.createElement('td');
		const problemNameAnchor = document.createElement('a');
		const problemDate = document.createElement('td');
		
		//name
		problemNameAnchor.setAttribute("onClick", "fetchProblem('" + userProfile.problemsSolved[i][1] + "')");
		problemNameAnchor.innerText = userProfile.problemsSolved[i][0];
		problemName.appendChild(problemNameAnchor);
		detailsContainer.appendChild(problemName);
		
		//date
		problemDate.innerText = userProfile.problemsSolved[i][2];
		detailsContainer.appendChild(problemDate);
		
	}
	
	console.log('finished rendering problems solved');
	
	
	//forum posts
	const forumPostsHeader = document.createElement('div');
	forumPostsHeader.classList.add('userTextHeader');
	forumPostsHeader.innerText = 'Recent Forum Posts';
	userProfileRight.appendChild(forumPostsHeader);
	
	const forumBox = document.createElement('div');
	forumBox.classList.add('userForumBox');
	document.getElementById('userProfileRight').appendChild(forumBox);
	forumBox.appendChild(document.getElementById('forumTable'));
	
	//generate all forum posts
	var endIndex = userProfile.forumPosts.length < 50 ? 0 : userProfile.forumPosts.length - 50;
	for (let i = userProfile.forumPosts.length - 1; i >= endIndex ; i--) {
		console.log('got new post with id ' + userProfile.forumPosts[i][1]);
		console.log(userProfile.forumPosts[i]);
		const detailsContainer = document.createElement('tr');

		const postProblemName = document.createElement('td');
		const postProblemNameAnchor = document.createElement('a');
		const postDate = document.createElement('td');
		const postText = document.createElement('td');
		
		//name
		postProblemNameAnchor.setAttribute("onClick", "fetchProblem('" + userProfile.forumPosts[i][1] + "')");
		postProblemNameAnchor.innerText = userProfile.forumPosts[i][0];
		postProblemName.appendChild(postProblemNameAnchor);
		detailsContainer.appendChild(postProblemName);
		document.getElementById('forumTable').appendChild(detailsContainer);
		
		//text
		postText.innerText = userProfile.forumPosts[i][3];
		detailsContainer.appendChild(postText);
		
		//date
		postDate.innerText = userProfile.forumPosts[i][2];
		detailsContainer.appendChild(postDate);
	}
	
	console.log('finished rendering forum posts');
	
	console.log(userProfile.username);
	console.log(userProfile.problemsSolved);
	console.log(userProfile.forumPosts);
	console.log(userProfile.email);
}