/**
 * dashboardHandler.js
 * renders dashboard in any page
 */
function onload(){
	console.log("dashboard loading...");
	renderDashboard();
	console.log("dashboard loaded");
}
window.addEventListener("load", onload);

function renderDashboard() {
	const dashboard = document.createElement("div");
	dashboard.classList.add("dashboard");
	
	//render icon
	const iconAnchor = document.createElement("a");
	iconAnchor.href = "/";
	const icon = document.createElement("img");
	icon.classList.add("icon");
	icon.src = "/static/royalty_free_kattis_icon.jpg";
	icon.type = "image";
	icon.id = "iconHome";
	icon.alt = "well there should've been a crudely drawn Kattis the cat here";
	iconAnchor.appendChild(icon);
	
	//render left side of dashboard
	const dashboardLeft = document.createElement("div");
	dashboardLeft.classList.add("dashboardLeft");
	const title = document.createElement("div");
	title.classList.add("title");
	title.innerText = "Kattis Helper";
	
	const dashboardLeftText = document.createElement("div");
	dashboardLeftText.classList.add("dashboardText");
	
	const problems = document.createElement("a");
	problems.classList.add("dashboardTextElement");
	problems.href = "/problemsList";
	problems.innerText = "Problems";
	dashboardLeftText.appendChild(problems);
	
	const help = document.createElement("a");
	help.classList.add("dashboardTextElement");
	help.href = "/help";
	help.innerText = "Help";
	dashboardLeftText.appendChild(help);
	
	dashboardLeft.appendChild(title);
	dashboardLeft.appendChild(dashboardLeftText);
	dashboard.appendChild(iconAnchor);
	dashboard.appendChild(dashboardLeft);
	
	//render right side of dashboard
	const dashboardRight = document.createElement("div");
	dashboardRight.classList.add("dashboardRight");
	
	const searchBoxVertWrapper = document.createElement("div");
	searchBoxVertWrapper.classList.add('vertWrapper');
	dashboardRight.appendChild(searchBoxVertWrapper);
	
	const searchboxWrapper = document.createElement("div");
	searchboxWrapper.classList.add("searchboxWrapper");
	searchBoxVertWrapper.appendChild(searchboxWrapper);
	
	const searchBoxHorzWrapper = document.createElement("div");
	searchBoxHorzWrapper.classList.add('horzWrapper');
	searchBoxVertWrapper.appendChild(searchBoxHorzWrapper);
	
	const searchProblem = document.createElement("button");
	searchProblem.innerText = "Find Problem";
	searchProblem.classList.add('searchButton');
	searchBoxHorzWrapper.appendChild(searchProblem);
	searchProblem.setAttribute("onClick", "queryProblem(document.getElementById('searchText').value)");
	
	const searchUser = document.createElement("button");
	searchUser.innerText = "Find User";
	searchUser.classList.add('searchButton');
	searchBoxHorzWrapper.appendChild(searchUser);
	searchUser.setAttribute("onClick", "location.href=('/user/?q=' + document.getElementById('searchText').value)");
	
	const searchText = document.createElement("textarea");
	searchText.id = "searchText";
	searchText.classList.add("searchbox");
	searchText.placeholder = "Search Kattis Helper";
	searchText.style = "border:none";
	
	const userIconWrapper = document.createElement("div");
	userIconWrapper.classList.add('userIconWrapper');
	userIconWrapper.id = 'userIconWrapper';
	
	const userIconAnchor = document.createElement("a");
	if (tempStorage.getItem('loginFlag') == 'TRUE') {
		userIconAnchor.href = "/user/?q=" + tempStorage.getItem('username');
	} else {
		userIconAnchor.href = "/login";
	}
	userIconAnchor.classList.add("userIconAnchor");
	
	const userIcon = document.createElement("img");
	userIcon.classList.add("userIcon");
	userIcon.src = "/static/user_icon.jpg";
	userIcon.type = "image";
	userIcon.id = "iconUser";
	userIcon.alt = "user's icon";
	userIconAnchor.appendChild(userIcon);
	userIconWrapper.appendChild(userIconAnchor);
	
	searchboxWrapper.appendChild(searchText);
	dashboard.appendChild(dashboardRight);
	dashboardRight.appendChild(userIconWrapper);
	
	dashboardLocation.appendChild(dashboard);
	
	
	
	//render login / logout button
	console.log(tempStorage.getItem('loginFlag'));
	if (tempStorage.getItem('loginFlag') == 'TRUE') {
		console.log('rendering logout button');
		const logoutButton = document.createElement('button');
		logoutButton.innerText = 'Logout';
		
		logoutButton.setAttribute('onClick', 'handleLogout()');
		userIconWrapper.appendChild(logoutButton);
	} else {
		console.log('rendering login button');
		const loginButton = document.createElement('button');
		loginButton.innerText = 'Login';
		loginButton.setAttribute('onClick', 'location.href=\'/login\'');
		userIconWrapper.appendChild(loginButton);
	}
}

/**
 * Error handling
 */
//404 not found redirect
function redirect404() {
	//perform ajax query
	const requestURL = '/error';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/error';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				alert('Even the 404 cannot handle itself. This is embarassing...');
				console.log('not found');
			}
		}
	});	
}