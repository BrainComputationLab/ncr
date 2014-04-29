//New Angular module for our DBReports application.
var ReportsManager = angular.module('ReportsManager', ['colorpicker.module']);
//Register the controller with the module.
ReportsManager = ReportsManager.controller('ReportsController', ['$scope', '$compile', '$window', ReportsController]);

ReportsManager.filter('range', function() 
{
	return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
