//New Angular module for our DBManager application.
var DBManager = angular.module('DBManager', ['ngResource']);
//Register the controller with the module.
DBManager = DBManager.controller('DBController', DBController);

//Need to create a startFrom filter
DBManager.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

DBManager.filter('range', function() 
{
	return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

