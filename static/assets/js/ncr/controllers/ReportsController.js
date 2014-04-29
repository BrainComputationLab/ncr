function ReportsController($scope, $compile, $window)
{
	var graphHandler = new createGraphHandler($scope);	

	$scope.canvasShow = true;
	$scope.pictureFormat = 'gif';
	$scope.activeGraph = 0;
	$scope.activeCell = 0;
	$scope.activeReportingColumn = 0;
	$scope.putGraphsOnTop = true;
	$scope.reportingColumns = 2;
	$scope.canvasShow = 0;
	$scope.color = '';
	
	$scope.$watch('color', function(){
		var lineId = "#line-"+$window.activeGraph + "-" + $window.activeCell;
		var buttonId = "#GRAPH"+$window.activeGraph + "-cell_button" + $window.activeCell + "-cell-button";

		$(buttonId).css("color", $scope.color);
		$(lineId).css("stroke", $scope.color);
	});
	
	$scope.getColor = function(){
		var buttonId = "#GRAPH"+$window.activeGraph + "-cell_button" + $window.activeCell + "-cell-button";
		$scope.color = $(buttonId).css("color");
	};
	
	$scope.add = function(element,id){
		$(element).append(
			$compile(
			'<li><a id="'+id+'-change_color" colorpicker ng-click="getColor()" ng-model="color" type="text" href="#" >Change color</a></li>'
			)($scope)
		);
		$scope.$apply();
	};
	
	$scope.addColumn = function()
	{
		if($scope.reportingColumns <4)
			$scope.reportingColumns++;
		else
			$scope.reportingColumns = 6;
	}
	
	$scope.removeColumn = function()
	{
		if($scope.reportingColumns == 6)
			$scope.reportingColumns-2;
		else if($scope.reportingColumns > 1)
			$scope.reportingColumns--;
	}
}
