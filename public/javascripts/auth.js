/**
 * auth.js
 * handling of user authentication
 */
//successful auth, redirect to user page
function handleLoginSuccess(username) {
	console.log('login successful')
	tempStorage.setItem('loginFlag', 'TRUE');
	tempStorage.setItem('username', username);
	redirectUserPage();
}

//send POST request to server and handle appropriately
function handleLogin() {
	console.log('trying to login');
	if (document.getElementById('username').value && document.getElementById('password').value) {
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		var credentials = '{\"username": \"' + username + '\", \"password\": \"' + password + '\"}';
		//perform ajax query
		const requestURL = '/auth';
		$.ajax({
			url: requestURL,
			type: 'POST',			
			data: {
				"username": username,
				"password": password
			},
			dataType: 'json',
			success: (data) => {
				console.log(data);
				switch(data) {
					case '-1': //no credentials
						renderLoginError('Please enter in Username and Password.');
						break;
					case '1': //auth successful 
						removeLoginError();
						handleLoginSuccess(username);
						break;
					case '2': //wrong password
						renderLoginError('Password is wrong.');
						break;
					case '3': //invalid user
						renderLoginError('Invalid Username.');
						break;
					case '4': //not verified
						renderLoginError('User is not verified.');
						break;
				}
			},
			error: function(req, err){ console.log('[SRV] error occured: ' + err); }
			
		});
	} else {
		renderLoginError('Please enter in Username and Password.');
		console.log('no credentials');
	}
}

function handleLogout() {
	tempStorage.setItem('username', '');
	tempStorage.setItem('loginFlag', 'FALSE');
	location.href = '/';
}

function handleCreateAccount() {
	console.log('redirecting to createAccount.html');
	//perform ajax query
	const requestURL = '/create_account';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/create_account';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				console.log('not found');
			}
		}
	});
}

function handleLostPass() {
	console.log('redirecting to recover_password.html');
	//perform ajax query
	const requestURL = '/reset_password';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/reset_password';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				console.log('not found');
			}
		}
	});
}

//create account and send verification email
function createAccount() {
	console.log('trying to create account');
	if (document.getElementById('username').value && document.getElementById('password').value && document.getElementById('email').value) {
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		var email = document.getElementById('email').value;
		var credentials = '{\"username": \"' + username + '\", \"password\": \"' + password + '\", \"email\": \"' + email + '\"';
		//perform ajax query
		const requestURL = '/createUser';
		$.ajax({
			url: requestURL,
			type: 'POST',			
			data: {
				"username": username,
				"password": password,
				"email": email
			},
			dataType: 'json',
			success: (data) => {
				console.log(data);
				switch(data) {
					case '-1': //no credentials
						renderLoginError('Please fill in all 3 fields.');
						break;
					case '1': //auth successful 
						removeLoginError();
						//handleLoginSuccess(username);
						break;
					case '2': //wrong password
						renderLoginError('Username is already taken.');
						break;
					case '3': //server-side error
						renderLoginError('User creation failed, please try again.');
						break;
					case '4': //email parse error
						renderLoginError('Please enter a valid email.');
						break;
				}
			},
			error: function(req, err){ console.log('[SRV] error occured: ' + err); }
			
		});
		
	} else {
		renderLoginError('Please fill in all fields!');
	}
}

function handleVerify() {
	console.log('redirecting to verify.html');
	//perform ajax query
	const requestURL = '/verify';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/verify';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				console.log('not found');
			}
		}
	});
}

function verify() {
	console.log('trying to verify account');
	if (document.getElementById('username').value && document.getElementById('verification').value) {
		var username = document.getElementById('username').value;
		var verification = document.getElementById('verification').value;
		//perform ajax query
		const requestURL = '/verifyUser';
		$.ajax({
			url: requestURL,
			type: 'POST',			
			data: {
				"username": username,
				"verification": verification
			},
			dataType: 'json',
			success: (data) => {
				console.log(data);
				switch(data) {
					case '-1': //no credentials
						renderLoginError('Please fill in all 3 fields.');
						break;
					case '1': //auth successful 
						removeLoginError();
						//handleLoginSuccess(username);
						break;
					case '2': //wrong password
						renderLoginError('Verification failed.');
						break;
					case '3': //user not found
						renderLoginError('User not found.');
						break;
					case '4': //user is already verified
						renderLoginError('User is already verified.');
						break;
					case '5': //server error
						renderLoginError('User verification failed, please try again');
						break;
				}
			},
			error: function(req, err){ console.log('[SRV] error occured: ' + err); }
		});
	} else {
		renderLoginError('Please fill in all fields!');
	}
}

//password recovery
function resetPassword() {
	if (document.getElementById('username').value && document.getElementById('verification').value
	&& document.getElementById('password').value && document.getElementById('email').value) {
		var username = document.getElementById('username').value;
		var email = document.getElementById('email').value;
		var password = document.getElementById('password').value;
		var verification = document.getElementById('verification').value;
		
		//perform ajax query
		const requestURL = '/resetPassword';
		$.ajax({
			url: requestURL,
			type: 'POST',			
			data: {
				"username": username,
				"password": password,
				"verification": verification,
				"email": email
			},
			dataType: 'json',
			success: (data) => {
				console.log(data);
				switch(data) {
					case '-1': //no credentials
						renderLoginError('Please fill in all 4 fields.');
						break;
					case '1': //reset successful 
						removeLoginError();
						redirectLoginPage();
						//handleLoginSuccess(username);
						break;
					case '2': //wrong verification code
						renderLoginError('Recovery code failed.');
						break;
					case '3': //user not found
						renderLoginError('User not found.');
						break;
					case '4': //wrong email
						renderLoginError('Wrong email.');
						break;
					case '5': //server error
						renderLoginError('User verification failed, please try again');
						break;
				}
			},
			error: function(req, err){ console.log('[SRV] error occured: ' + err); }
		});
	} else {
		renderLoginError('Please fill in all fields!');
	}
}

//send recovery code
function sendPasswordCode() {
	if (document.getElementById('username').value && document.getElementById('email').value) {
		var username = document.getElementById('username').value;
		var email = document.getElementById('email').value;
		var credentials = '{\"username": \"' + username + '\", \"password\": \"' + password + '\", \"email\": \"' + email + '\"';
		//perform ajax query
		const requestURL = '/sendPasswordCode';
		$.ajax({
			url: requestURL,
			type: 'POST',			
			data: {
				"username": username,
				"email": email
			},
			dataType: 'json',
			success: (data) => {
				console.log(data);
				switch(data) {
					case '-1': //no credentials
						renderLoginError('Please fill in all 3 fields.');
						break;
					case '1': //recovery code sent successful 
						removeLoginError();
						//handleLoginSuccess(username);
						break;
					case '2': //user does not exist
						renderLoginError('User does not exist.');
						break;
					case '3': //email parse error
						renderLoginError('Please enter a valid email.');
						break;
					case '5': //server-side error
						renderLoginError('User creation failed, please try again.');
						break;
				}
			},
			error: function(req, err){ console.log('[SRV] error occured: ' + err); }
			
		});
		
	} else {
		renderLoginError('Please fill in all fields.');
	}
}

//send http request to redirect
function redirectUserPage() {
	//perform ajax query
	const requestURL = '/user';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/user';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				redirect404();
				console.log('not found');
			}
		}
	});
}

function redirectLoginPage() {
	//perform ajax query
	const requestURL = '/login';
	$.ajax({
		url: requestURL,
		type: 'GET',
		dataType: 'html',
		success: (data) => {
			console.log('redirecting');
			location = '/login';
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(xhr.status==404) {
				redirect404();
				console.log('not found');
			}
		}
	});
}