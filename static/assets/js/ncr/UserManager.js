<<<<<<< HEAD
﻿//New Angular module for our UserManager application.
var UserManager = angular.module('UserManager', ['ngResource']);
//Register the controller with the module.
UserManager = UserManager.controller('UserController', UserController);
 'use strict';
 
UserManager.directive('equals', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;
        // set validity
        ngModel.$setValidity('equals', val1 === val2);
      };
    }
  }
});
=======
﻿//Creates a new Angular module for our UserManager application.
var UserManager = angular.module('UserManager', ['ngResource']);
//Register the controller with the module.
UserManager = UserManager.controller('UserController', UserController);
>>>>>>> 209097c3af7672b5f43ba068fe5702b08b4583e9
