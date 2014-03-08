function DBController($scope, $resource) {
	//display page sorting
	$scope.currentPage = 0;
    $scope.pageSize = 10;
    //search form variables
    $scope.izhBinary = false;
    $scope.HHBinary = false;
    $scope.NCRBinary = false;
    $scope.VGBinary = false;
    $scope.VGPBinary = false;
    $scope.VGIBinary = false;
    $scope.CDBinary = false;
    
 	//compute the number of pages of models based on the total models
    $scope.numberOfPages=function(){
        return Math.ceil($scope.dbmodels.length/$scope.pageSize);                
    }
       
    //define a model resource
    var DBModel = $resource('/dbmodels/:dbmodelname', { modelname: '@dbmodelname' },
        { save: { method: 'PUT', url: '/dbmodels/:dbmodelname' } }
        );
    //This is for getting all models
    var DBModels = $resource('/dbmodels');
    $scope.dbmodels = [];
    //loads all models from the server and updates the scopes
    
    function updateDBModels() {
        DBModels.query({}, function (result) {
            $scope.dbmodels = result;
        });
    }
    //delete a model and update the display
    $scope.deleteDBModel = function (dbmodelname) {
        DBModel.remove({ dbmodelname: dbmodelname });
        updateDBModels();
    }
    //create a new model and save as a new record if it doesn't exist, or update if it does
    //this is probably done by NCB, but can still tweak to have it work to promote or alter existing models.
    $scope.addUpdateDBModel = function () {
        var dbmodel = new DBModel({
            dbmodelname: $scope.dbmodelname,
        });
        dbmodel.$save();
        updateDBModels();
    };

    //update the models outright
    updateDBModels();
}
