//Creates a new Angular module for our UserManager application.
var DBManager = angular.module('DBManager', ['ngResource']);
//Register the controller with the module.
DBManager = DBManager.controller('DBController', DBController);