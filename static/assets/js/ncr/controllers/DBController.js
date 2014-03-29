function DBController($scope, $resource) {
	//display page sorting
	$scope.currentPage = 0;
	$scope.pageOffset = 0;
    $scope.pageSize = 10;
    $scope.predicateSort = "_id";
    $scope.reverseSort = false;
    //search form variables
    $scope.izhBinary = true;
    $scope.HHBinary = true;
    $scope.NCSBinary = true;
    $scope.HHVGIBinary = true;
    $scope.HHVGIParams = [ ["","","","","",""] , ["","","","","",""] ,"",""];// Alpha, Beta, Power, X-Initial
    $scope.LIFVGIBinary = true;
    $scope.LIFCDBinary = true;
    $scope.nameFilter = "";
    $scope.detailsFilter = "";
    $scope.authorFilter = "";

    //----------------model display handlers---------------------------------------------------------------------
  	//compute the number of pages of models based on the total models
    $scope.numberOfPages=function(){
        return Math.ceil($scope.dbdisplay.length/$scope.pageSize);                
    }
    $scope.goToPage=function(go){
		if(go < 0 || go >= $scope.numberOfPages())
			return;//out of bounds
		$scope.currentPage = go;
	    if ($scope.currentPage < 7)
			$scope.pageOffset = 0;
		else if($scope.currentPage > $scope.numberOfPages()-8)
		{
			tmp = $scope.currentPage-16;
			if($tmp < 0)
				$scope.pageOffset = 0;
			else
				$scope.pageOffset = tmp;
		}
		else
			$scope.pageOffset = $scope.currentPage-7;                
    }
	//filter model database by types of models
	$scope.filterModels = function () {
		var tmp = [];
		//check each model/channel type
		for (var i=0; i<$scope.dbmodels.length; i++)
		{
			if($scope.dbmodels[i].specification.type == "hh_voltage_gated_ion") //includes particles
			{
				if($scope.HHVGIBinary == true)
				{
					//also do HHVGIParams[0]
					//also do HHVGIParams[1]
					if($scope.HHVGIParams[2] == "")
						tmp.push($scope.dbmodels[i]);					
					else//test filter
					{
						if($scope.HHVGIParams[2].search("-") == -1)//single value filter
						{
							if(parseFloat($scope.HHVGIParams[2]) != null)
							{//okay to filter	
								$scope.HHVGIParams[2] = ""+parseFloat($scope.HHVGIParams[2]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.power != parseFloat($scope.HHVGIParams[2]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[2] = "";//clear garbage
						}
						else//range value filter
						{
							var range = $scope.HHVGIParams[2].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.HHVGIParams[2] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.power < parseFloat(range[0]) || 
								$scope.dbmodels[i].specification.particles.power > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[2] = "";//clear garbage
						}
						//also do HHVGIParams[3]
						//made it this far! passed all filters!
						tmp.push($scope.dbmodels[i]);
					}
				}
				//else false
			}
			else if($scope.dbmodels[i].specification.type == "lif_voltage_gated_ion")
			{
				if($scope.LIFVGIBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
			else if($scope.dbmodels[i].specification.type == "lif_calcium_dependant")
			{
				if($scope.LIFCDBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
            else if($scope.dbmodels[i].specification.type == "izhikevich")
			{
				if($scope.izhBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
            else if($scope.dbmodels[i].specification.type == "hh")
			{
				if($scope.HHBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}            
            else if($scope.dbmodels[i].specification.type == "ncs")
			{
				if($scope.NCSBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}

		}		
		$scope.dbsecondary = tmp;
		$scope.filterModelsByString();
	}  
	//filter (already filtered by type) models by general string filters for a final search product
	$scope.filterModelsByString = function () {
		var tmp = [];
		for (var i=0; i<$scope.dbsecondary.length; i++)
		{
			if( (($scope.nameFilter == "") || ($scope.dbsecondary[i]._id.search($scope.nameFilter) != -1)) &&
			(($scope.authorFilter == "") || ($scope.dbsecondary[i].author.search($scope.authorFilter) != -1)) &&
			(($scope.detailsFilter == "") || ($scope.dbsecondary[i].description.search($scope.detailsFilter) != -1)) )
				tmp.push($scope.dbsecondary[i]);
			//else does not match
		}	
		$scope.dbdisplay = tmp;
	} 
    //define a model resource
    var DBModel = $resource('/dbmodels/:dbmodelname', { modelname: '@dbmodelname' },
        { save: { method: 'PUT', url: '/dbmodels/:dbmodelname' } }
        );
    //This is for getting all models
    var DBModels = $resource('/dbmodels');
    $scope.dbmodels = [];//all models
    $scope.dbsecondary = [];//models from dbmodels that match up with types and ranges
    $scope.dbdisplay = [];//models from dbsecondary that match up with name, author, and description filters
    //----------------model update handlers---------------------------------------------------------------------
    //loads all models from the server and updates the scopes
    function updateDBModels() {
        DBModels.query({}, function (result) {
            $scope.dbmodels = result;
            $scope.filterModels();
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
