var SessionID = 0;//Javascript Globals
var Logged = 0;
var Rank = 0;

function UserController($scope, $resource) {
	$scope.sessionID = 0;
	$scope.logged = 0;
	$scope.rank = 0;
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
				Rank = 0;
				$scope.rank = 0;
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
				$scope.securityQuestionQueried = response.question;
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
	
	$scope.addRegion = function () {
		finished = false;
		var formData = new FormData(document.getElementById("regionForm"));
		formData.append("sessionID", SessionID);
		formData.append("logged", Logged);

		request = $.ajax({
			url: "/regions",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("The region "+$scope.regionAdd+" has been added.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in region add:" + error);
			});
	};  
	
	$scope.removeRegion = function () {
		finished = false;
		var formData = new FormData(document.getElementById("regionForm"));
		formData.append("sessionID", SessionID);
		formData.append("logged", Logged);
		request = $.ajax({
			url: "/regions",
			type: "DELETE",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("The region "+$scope.regionRemove+" has been deleted.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in region delete:" + error);
			});
	};

	$scope.addLab = function () {
		finished = false;
		var formData = new FormData(document.getElementById("labForm"));
		request = $.ajax({
			url: "/labs",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("The lab "+$scope.labAdd+" has been added.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in lab add:" + error);
			});
	};
	
	$scope.deleteLab = function () {
		finished = false;
		var formData = new FormData(document.getElementById("labForm"));
		request = $.ajax({
			url: "/labs",
			type: "DELETE",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("The lab "+$scope.labRemove+" has been deleted.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in lab delete:" + error);
			});
	};

	$scope.joinLab = function () {
		finished = false;
		var formData = new FormData(document.getElementById("joinForm"));
		request = $.ajax({
			url: "/lab",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
				alert("The lab "+$scope.labJoin+" has been joined.")
			else
				alert(response.error);
			});        
			request.fail(function(jqXHR, textStatus, error) {
				alert("Unexpected error in lab join:" + error);
			});
	};

}
