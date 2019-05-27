/**
 * Dashboard HTML output
 
	<div class="dashboard">
		<a href="/">
			<img class="icon" src="./assets/royalty_free_kattis_icon.jpg" type="image" id="iconHome" alt="well there should've been a crudely drawn Kattis the cat here"> 
		</a>
		<div class="dashboardLeft">
			<div class="title">Kattis Helper</div>
			<div class="dashboardText">
				<a class="dashboardTextElement" href="./problems.html">Problems</a>
				<a class="dashboardTextElement">Rankings</a>
				<a class="dashboardTextElement" href="./help.html">Help</a>
			</div>
	</div>
	<div class="dashboardRight">
		<div class="searchboxWrapper">
			<textarea id="searchText" class="searchbox" placeholder="Search bootleg Kattis" style="border: none"></textarea>
			<input class="searchIcon" type="image" id="image" alt="search" src="./assets/search_icon.jpg">
			</img>
		</div>
	</div>
	</div>
	
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
	icon.src = "./assets/royalty_free_kattis_icon.jpg";
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
	problems.href = "./problems.html";
	problems.innerText = "Problems";
	
	const rankings = document.createElement("a");
	rankings.classList.add("dashboardTextElement");
	//rankings.href = "./problems.html";
	rankings.innerText = "rankings";
	
	const help = document.createElement("a");
	help.classList.add("dashboardTextElement");
	help.href = "./help.html";
	help.innerText = "Help";
	
	dashboardLeftText.appendChild(problems);
	dashboardLeftText.appendChild(rankings);
	dashboardLeftText.appendChild(help);
	dashboardLeft.appendChild(title);
	dashboardLeft.appendChild(dashboardLeftText);
	dashboard.appendChild(iconAnchor);
	dashboard.appendChild(dashboardLeft);
	
	//render right side of dashboard
	const dashboardRight = document.createElement("div");
	dashboardRight.classList.add("dashboardRight");
	
	const searchboxWrapper = document.createElement("div");
	searchboxWrapper.classList.add("searchboxWrapper");
	
	const searchText = document.createElement("textarea");
	searchText.id = "searchText";
	searchText.classList.add("searchbox");
	searchText.placeholder = "Search bootleg Kattis";
	searchText.style = "border:none";
	
	const searchIcon = document.createElement("button");
	searchIcon.id = "searchIconImage";
	searchIcon.classList.add("searchIcon");
	searchIcon.setAttribute("onClick", "queryProblem(document.getElementById('searchText').value)");
	
	const userIconAnchor = document.createElement("a");
	userIconAnchor.href = "/";
	userIconAnchor.classList.add("userIconAnchor");
	const userIcon = document.createElement("img");
	userIcon.classList.add("userIcon");
	userIcon.src = "./assets/user_icon.jpg";
	userIcon.type = "image";
	userIcon.id = "iconUser";
	userIcon.alt = "user's icon";
	userIconAnchor.appendChild(userIcon);
	
	searchboxWrapper.appendChild(searchText);
	searchboxWrapper.appendChild(searchIcon);
	dashboardRight.appendChild(searchboxWrapper);
	dashboard.appendChild(dashboardRight);
	dashboard.appendChild(userIconAnchor);
	
	dashboardLocation.appendChild(dashboard);
}