/**
 * recoverPassword.js
 * rendering of html elements in recoverPassword.html
 */
function onload() {
	console.log('rendering page');
	handleLoginStatus();
	generateErrorMsg();
}
window.addEventListener("load", onload);

//check status of user
function handleLoginStatus() {
	console.log(tempStorage.getItem('loginFlag'));
	if (tempStorage.getItem('loginFlag') == 'TRUE' && tempStorage.getItem('username') != '') {
		console.log('already logged in, redirecting...');
		redirectUserPage();
	} else {
		console.log('rendering login details');
		renderDetails();
	}
}

/**
 * generation and dynamic rendering of html elements
 */
function renderDetails() {
	const wrapper = document.createElement('div');
	wrapper.classList.add('contentBoxWrapper');
	document.getElementById('content').appendChild(wrapper);
	
	const loginBox = document.createElement('div');
	loginBox.classList.add('loginContentBox');
	wrapper.appendChild(loginBox);
	
	const title = document.createElement('div');
	title.classList.add('loginTitle');
	title.innerText = 'Recover Password';
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
	
	const loginTextEmail = document.createElement('div');
	loginTextEmail.classList.add('loginTextElement');
	loginTextEmail.innerText = 'Email';
	loginForm.appendChild(loginTextEmail);
	
	const loginTextEmailBox = document.createElement('input');
	loginTextEmailBox.type = 'text';
	loginTextEmailBox.classList.add('loginTextBox');
	loginTextEmailBox.id = 'email';
	loginForm.appendChild(loginTextEmailBox);
	
	const loginTextPassword = document.createElement('div');
	loginTextPassword.classList.add('loginTextElement');
	loginTextPassword.innerText = 'New Password';
	loginForm.appendChild(loginTextPassword);
	
	const loginTextPasswordBox = document.createElement('input');
	loginTextPasswordBox.type = 'password';
	loginTextPasswordBox.classList.add('loginTextBox');
	loginTextPasswordBox.id = 'password';
	loginForm.appendChild(loginTextPasswordBox);
	
	const loginTextConfirmPassword = document.createElement('div');
	loginTextConfirmPassword.classList.add('loginTextElement');
	loginTextConfirmPassword.innerText = 'Confirm New Password';
	loginForm.appendChild(loginTextConfirmPassword);
	
	const loginTextConfirmPasswordBox = document.createElement('input');
	loginTextConfirmPasswordBox.type = 'password';
	loginTextConfirmPasswordBox.classList.add('loginTextBox');
	loginTextConfirmPasswordBox.id = 'password2';
	loginForm.appendChild(loginTextConfirmPasswordBox);
	
	const loginTextVerification = document.createElement('div');
	loginTextVerification.classList.add('loginTextElement');
	loginTextVerification.innerText = 'Recovery Code';
	loginForm.appendChild(loginTextVerification);
	
	const loginTextVerificationBox = document.createElement('input');
	loginTextVerificationBox.type = 'text';
	loginTextVerificationBox.classList.add('loginTextBox');
	loginTextVerificationBox.id = 'verification';
	loginForm.appendChild(loginTextVerificationBox);
	
	const resetButton = document.createElement('button');
	resetButton.innerText = 'Reset Password';
	resetButton.setAttribute('onClick', 'resetPassword()');
	loginForm.appendChild(resetButton);
	
	const lostPassButton = document.createElement('button');
	lostPassButton.innerText = 'Request New Recovery Code';
	lostPassButton.setAttribute('onClick', 'sendPasswordCode()');
	loginForm.appendChild(lostPassButton);
	
	const altText = document.createElement('div');
	altText.classList.add('loginTextElement');
	altText.innerText = 'Already have an account? Or log in';
	loginForm.appendChild(altText);
	
	const loginButton = document.createElement('button');
	loginButton.innerText = 'Login';
	loginButton.setAttribute('onClick', 'redirectLoginPage()');
	loginForm.appendChild(loginButton);
	
	const createAccButton = document.createElement('button');
	createAccButton.innerText = 'Create Account';
	createAccButton.setAttribute('onClick', 'handleCreateAccount()');
	loginForm.appendChild(createAccButton);
	
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