/**
 * createAccount.js
 * rendering of html elements in createAccount.html
 */
function onload() {
	console.log('rendering page');
	renderDetails();
	generateErrorMsg();
}
window.addEventListener("load", onload);

/**
 * generation and dynamic rendering of html elements
 */
//render create account details
function renderDetails() {
	const wrapper = document.createElement('div');
	wrapper.classList.add('contentBoxWrapper');
	document.getElementById('content').appendChild(wrapper);
	
	const loginBox = document.createElement('div');
	loginBox.classList.add('loginContentBox');
	wrapper.appendChild(loginBox);
	
	const title = document.createElement('div');
	title.classList.add('loginTitle');
	title.innerText = 'Sign up for Kattis Helper';
	loginBox.appendChild(title);
	
	const loginForm = document.createElement('div');
	loginForm.classList.add('loginForm');
	loginForm.id = 'loginForm';
	loginBox.appendChild(loginForm);
	
	const loginTextUser = document.createElement('div');
	loginTextUser.classList.add('loginTextElement');
	loginTextUser.innerText = 'Username';
	loginForm.appendChild(loginTextUser);
	
	const loginTextUserBox = document.createElement('input');
	loginTextUserBox.type = 'text';
	loginTextUserBox.classList.add('loginTextBox');
	loginTextUserBox.id = 'username';
	loginForm.appendChild(loginTextUserBox);
	
	const loginTextPassword = document.createElement('div');
	loginTextPassword.classList.add('loginTextElement');
	loginTextPassword.innerText = 'Password';
	loginForm.appendChild(loginTextPassword);
	
	const loginTextPasswordBox = document.createElement('input');
	loginTextPasswordBox.type = 'password';
	loginTextPasswordBox.classList.add('loginTextBox');
	loginTextPasswordBox.id = 'password';
	loginForm.appendChild(loginTextPasswordBox);
	
	const loginTextConfirmPassword = document.createElement('div');
	loginTextConfirmPassword.classList.add('loginTextElement');
	loginTextConfirmPassword.innerText = 'Confirm Password';
	loginForm.appendChild(loginTextConfirmPassword);
	
	const loginTextConfirmPasswordBox = document.createElement('input');
	loginTextConfirmPasswordBox.type = 'password';
	loginTextConfirmPasswordBox.classList.add('loginTextBox');
	loginTextConfirmPasswordBox.id = 'password2';
	loginForm.appendChild(loginTextConfirmPasswordBox);
	
	const loginTextEmail = document.createElement('div');
	loginTextEmail.classList.add('loginTextElement');
	loginTextEmail.innerText = 'Email';
	loginForm.appendChild(loginTextEmail);
	
	const loginTextEmailBox = document.createElement('input');
	loginTextEmailBox.type = 'text';
	loginTextEmailBox.classList.add('loginTextBox');
	loginTextEmailBox.id = 'email';
	loginForm.appendChild(loginTextEmailBox);
	
	const createAccButton = document.createElement('button');
	createAccButton.innerText = 'Create Account';
	createAccButton.setAttribute('onClick', 'createAccount()');
	loginForm.appendChild(createAccButton);
	
	const altText = document.createElement('div');
	altText.classList.add('loginTextElement');
	altText.innerText = 'Already have an account?';
	loginForm.appendChild(altText);
	
	const loginButton = document.createElement('button');
	loginButton.innerText = 'Login';
	loginButton.setAttribute('onClick', 'redirectLoginPage()()');
	loginForm.appendChild(loginButton);
	
	const lostPassButton = document.createElement('button');
	lostPassButton.innerText = 'Forgot Your Password?';
	lostPassButton.setAttribute('onClick', 'handleLostPass()');
	loginForm.appendChild(lostPassButton);
	
	const verifyButton = document.createElement('button');
	verifyButton.innerText = 'Verify User';
	verifyButton.setAttribute('onClick', 'handleVerify()');
	loginForm.appendChild(verifyButton);
	
	const unusedRender = document.createElement('div');
	unusedRender.classList.add('unusedObj');
	unusedRender.id = 'unused';
	document.getElementById('content').appendChild(unusedRender);
}

//generate and render HTML elements for displaying authentication errors
function generateErrorMsg() {
	const errorBox = document.createElement('div');
	errorBox.classList.add('loginErrorBox');
	errorBox.id = 'errorBox';
	document.getElementById('unused').appendChild(errorBox);
}

function renderLoginError(text) {
	document.getElementById('loginForm').appendChild(document.getElementById('errorBox'));
	document.getElementById('errorBox').innerText = text;
}

function removeLoginError() {
	document.getElementById('unused').appendChild(document.getElementById('errorBox'));
}