//Creates a new Angular module for our UserManager application.
var UserManager = angular.module('UserManager', ['ngResource']);
//Register the controller with the module.
UserManager = DBManager.controller('UserController', UserController);