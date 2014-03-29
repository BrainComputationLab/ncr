<<<<<<< HEAD
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
=======
﻿//Creates a new Angular module for our DBManager application.
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

DBManager.filter('modelFilter', function() {
    return function(input) {
		compare vals
		switch type of neuron/channel
		checkbox checked? ok add to array
		
		name filter
		desc filter
		author filter
		
		[[check data ranges after each type]]
		
		
		spit back input if valid
		
		HAVE THIS CALLED EVERY few seconds of typing?
    return input ? '\u2713' : '\u2718';
    };
});
>>>>>>> 209097c3af7672b5f43ba068fe5702b08b4583e9
