function UserController($scope, $resource) {
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