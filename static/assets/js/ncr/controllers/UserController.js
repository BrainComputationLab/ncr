<<<<<<< HEAD
﻿var SessionID = 0;//Javascript Globals
var Logged = 0;

function UserController($scope, $resource) {
	$scope.sessionID = 0;
	$scope.logged = 0;
	$scope.route = '';
	$scope.securityQuestion = 0;
	
	$scope.registerUser = function () {
		finished = false;
		var formData = new FormData(document.getElementById("registrationForm"));
		
		request = $.ajax({
			url: "/users/no_id",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("Registration successful! You can now log in using your email and password.");				
			else
				alert("Registration failed: "+response.error);
			//Flip/change route to activation component
		});
        
		request.fail(function(jqXHR, textStatus, error) {
			alert("Unexpected error in user registration:" + error);
		});
	};
		
	$scope.loginUser = function () {
		finished = false;
		var formData = new FormData(document.getElementById("loginForm"));
		request = $.ajax({
			url: "/users/no_id",
			type: "PUT",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				alert("Logged in successfully as: "+response.logged);
				$scope.sessionID = response.session_id;
				SessionID = response.session_id;
				$scope.logged = response.logged; 
				Logged = response.logged;
				if(response.activation)
					$scope.route = "activation";
				else
					$scope.route = "preferences";
				$scope.$apply();
			}
			else
				alert("Login attempt failed: "+response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in user login:" + error);
			});
	};

	$scope.logoutUser = function () {
		finished = false;
		request = $.ajax({
			url: "/users/"+$scope.sessionID,
			type: "DELETE",
			data: 0,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				$scope.sessionID = 0;
				SessionID = 0;
				$scope.logged = 0;
				Logged = 0;
				$scope.$apply();
			}
			else
				alert("Logout failed: "+response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in user logout:" + error);
			});
	};
		
	$scope.resendActivation = function () {
		finished = false;
		var formData = new FormData(document.getElementById("activationForm"));
		request = $.ajax({
			url: "/activate/"+$scope.logged,
			type: "GET",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("Activation code transmitted to: "+$scope.logged);
			else
				alert("Activation failed: "+response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in activation:" + error);
			});
	};
	
	$scope.activateUser = function () {
		finished = false;
		var formData = new FormData(document.getElementById("activationForm"));
		request = $.ajax({
			url: "/activate/"+$scope.logged,
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				alert("Activation successful!");
				$scope.route = 'preferences';
				$scope.$apply;
			}
			else
				alert("Activation failed: "+response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in activation:" + error);
			});
	};  

	$scope.querySecurityQuestion = function () {
		finished = false;
		var formData = new FormData(document.getElementById("forgotForm"));
		request = $.ajax({
			url: "/forgot",
			type: "PUT",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				$scope.securityQuestion = response.question;
				$scope.$apply;
			}
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in email query:" + error);
			});
	};  

	$scope.forgotPassword = function () {
		finished = false;
		alert("entered");
		var formData = new FormData(document.getElementById("forgotForm"));
		request = $.ajax({
			url: "/forgot",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("You answered correctly! We are transmitting an email to you with your password enclosed now.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in password recovery:" + error);
			});
	};  
}
=======
﻿function UserController($scope, $resource) {
    //New Account
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.newUserEmail = "";
    $scope.choosePassword = "";
	$scope.confirmPassword = "";
    $scope.securityQuestion = ""; //Not sure how to handle this
	$scope.securityAnswer = "";

    //Forgot Password
    $scope.forgotPasswordEmail = 0;

    //User Login
    $scope.email = "";
	$scope.password = "";
	$scope.currentPage = 0;
    
    
    
    // Define a new user resource that will simplify interaction between
    // the web server and the client
    var User = $resource('/users/:username', { username: '@username' },
                         { save: { method: 'PUT', url: '/users/:username' } }
    );

    // Loads all the users from the server and updates the scopes
    // copy of users
    function updateUsers() {
        Users.query({}, function (result) {
            $scope.users = result;
        });
    }

    // Deletes a user and updates the display
    $scope.deleteUser = function (username) {
        User.remove({ username: username });
        updateUsers();
    }

    // Creates a new User resource and saves a new record
    // if it doesn't exist, and updates it if it does
    $scope.addUpdateUser = function () {
        var user = new User({
            username: $scope.username,
            firstName: $scope.firstName,
            lastName: $scope.lastName
        });
        user.$save();
        updateUsers();
    };
}
>>>>>>> 209097c3af7672b5f43ba068fe5702b08b4583e9
