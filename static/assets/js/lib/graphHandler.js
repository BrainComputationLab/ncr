var createGraphHandler = function($scope){

	var domsArray = new Array();
	var graphID = 0;

	var graphsArray = new Array();
	var dataArray = new Array();

	var promptInputStr;
	var promptInputArr;

	var intervals = [];

	var dataInterval=300;

	$("#createGraphButton").click(function(){
		addElement();
	});
	
	$("#createPlotButton").click(function(){
		createPlot();
	});
	
	$("#control_panel-report-time_of_last").html("Status updated: "+Date());


	var addElement = function(){
		graphID++;
		
		// prompt user for neuron cells
		promptInputStr = prompt("Enter up to 4 neuron id's (eg: 1,2,3,4)","");
		
		if(promptInputStr == null)
			return false;
		
		promptInputArr = promptInputStr.split(",");
		
		// some temporary error functions
		if (promptInputArr.length > 4)
		{
			alert("Error: Too many cells");
			return false;
		}
		else if (promptInputArr.length <1)
		{
			alert("Error: Needs at least 1 cell");
			return false;
		}
		
		for (var i=0; i<promptInputArr.length; i++)
		{
			promptInputArr[i] = parseInt(promptInputArr[i]);
			if (promptInputArr[i]<0)
			{
				alert("Error: Negative cell detected");
				return false;
			}
		}
		
		var elementPntr;
		var graphPrefix = "graph"+graphID;
		var buttonSuffix;

		if($scope.putGraphsOnTop){
			$('#sortable-column'+$scope.activeReportingColumn).prepend(
				elementPntr = $('<li class="portlet_handle"></li>')
			);
		}
		else{
			$('#sortable-column'+$scope.activeReportingColumn).append(
				elementPntr = $('<li class="portlet_handle"></li>')
			);
		}
		
		

		elementPntr.append(
			elementPntr = $('<div id="'+graphPrefix+'-container" class="panel panel-default graph-unit" style="position:relative;height:auto;"></div>')
		);
		
		elementPntr.append(
			'<div id="'+graphPrefix+'-panel" class="panel-heading" style="position:relative;height:auto;display:flex;padding: 5px 5px;"></div>' +
			'<div id="'+graphPrefix+'-body" class="panel-body" style="width:100%;height:180px;"></div>'
		);
		
		/*
		 * Construct Panel to hold elements for graph
		 */
		
		elementPntr = $("#"+graphPrefix+"-panel");
		
		elementPntr.append(

		);
		
		/*
		 * button toolbar to hold buttons
		 */
//top:-42px;left:130px;
//top:-30px;left:95px;
		elementPntr.append(
			'<span style="font-size: 1.2em;position:relative; padding:5px 10px 5px 5px">Graph ' + graphID +'</span>'+
			'<div class="btn-toolbar" id='+graphPrefix+'-button_toolbar style="position:relative;">'+

				'<div class="btn-group button_list" id="'+graphPrefix+'-cell_button_list"></div>'+
				'<div class="btn-group button_list" id="'+graphPrefix+'-scale_button_list"></div>'+
				'<div class="btn-group button_list" id="'+graphPrefix+'-playback_button_list"></div>'+
			'</div>'
		);

		$('#'+graphPrefix+'-cell_button_list').append(
			'<div id="'+graphPrefix+'-menu-container" class="btn-group">'+
				'<button id="'+graphPrefix+'-menu-button" class="btn btn-default dropdown-toggle menu_button" data-toggle="dropdown">Main</button>'+
				'<ul id="'+graphPrefix+'-menu-dropdown" class="dropdown-menu">'+
					'<li><a id="'+graphPrefix+'-menu-button-add" href="#">Add Cell</a></li>'+
					'<li><a id="'+graphPrefix+'-menu-button-slider" href="#">Show Position Slider</a></li>'+
					'<li><a id="'+graphPrefix+'-menu-button-delete" href="#">Delete Graph</a></li>'+
				'</ul>'+
			'</div>'
		);
		
		$("#"+graphPrefix+"-menu-button-add").click(function(){
			var str = prompt("Enter 1 cell","");
			
			if(str == null)
				return false;
			
			var cell = parseInt(str);
			
			var graph = $(this).attr("id");
			graph = parseInt(graph.split("graph")[1]);

			addCellButton(graph,cell);
			lineGraph[graph].addLine(cell);
		});
		
		$("#"+graphPrefix+"-menu-button-delete").click(function(){
			var graph = $(this).attr("id");
			graph = parseInt(graph.split("graph")[1]);
			
			$("#graph"+graph+"-container").remove();
		});

		/*
		 * Construct Body to hold elements for graph
		 */
		
		elementPntr = $("#"+graphPrefix+"-body");
		
		elementPntr.append(
		'<div id="'+graphPrefix+'-graph" class="aGraph" style="position:relative;width:100%;height:100%;"></div>'
		)
		
		elementPntr.append(
		'<div id="positionSlider' + graphID +'" style="position:absolute;left:50px;bottom:15px;height:2px;width:90%;"></div>'
		)

		
		elementPntr = $("#"+graphPrefix+"-cell_button_list");
		
		
		
		for (var i=0; i<promptInputArr.length; i++)
			addCellButton(graphID, promptInputArr[i]);
		
		elementPntr = $("#"+graphPrefix+"-scale_button_list");
		elementPntr.append('<button id="'+graphPrefix+'-scale_button-" class="btn btn-default">-</button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button+" class="btn btn-default">+</button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button_up" class="btn btn-default">^</button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button_down" class="btn btn-default">v</button>');
		
		// jquery functionallity for menu. Help found here:
		// http://jqueryui.com/button/#splitbutton

		$("#"+graphPrefix+"-scale_button-").click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			lineGraph[graph].zoomOut();
		})
		.next()
		.click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			lineGraph[graph].zoomIn();
		})
		.next()
		.click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			var body = $("#graph"+graph+"-body");
			
			if(parseInt(body.css("height"))>70){
				body.css("height", "-="+10);
				
				var parent = body.parent();
				parent.css("height", "-="+10);
				
	//		height = parseInt(body.css("height"));
			}
		})
		.next()
		.click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			var body = $("#graph"+graph+"-body");
			
			if(parseInt(body.css("height"))<320){
			
				body.css("height", "+="+10);
				
				var parent = body.parent();
				parent.css("height", "+="+10);
			
	//		height = parseInt(body.css("height"));
			}
		});
		
		elementPntr = $("#"+graphPrefix+"-playback_button_list");
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-play" class="btn btn-default" type="button">></button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-pause" class="btn btn-default" type="button">||</button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-gotoend" class="btn btn-default" type="button">>></button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-record" class="btn btn-default" type="button">Rec</button>');
		
		$("#"+graphPrefix+"-playback_button-play").click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			lineGraph[graph].zoomOut();
		})
		.next()
		.click(function(){
		})
		.next()
		.click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			lineGraph[graph].goToEnd();
		})
		.next()
		.click(function(){
			var graph = parseInt($(this).attr('id').split("graph")[1]);
			
			if(rasterPlot!=undefined)
				rasterPlot.pauseTransitions();
			lineGraph.forEach(function(d){
				d.pauseTransitions();
			});
			
			global_flag = true;
			
			lineGraph[graph].startRecording();

			var wait = setInterval(function(){
				if(global_flag==false){
					if(rasterPlot!=undefined)
						rasterPlot.resumeTransitions();
					lineGraph.forEach(function(d){
						d.resumeTransitions();
					});
					clearInterval(wait);
				}
			}, 1000);
		});
		
		//$("#positionSlider" + graphID).slider();
		
		createGraph("#"+graphPrefix+"-graph");
	}

	var addCellButton = function (graphID, cell){
		var buttonSuffix = "-cell_button"+cell;
		var graphPrefix = "graph"+graphID;

		var id = graphPrefix+buttonSuffix; // essentially, id = graph#-cell_button#
		
		$("#"+graphPrefix+"-cell_button_list").append(		
			'<div id="'+id+'-cell-container" class="btn-group">'+
				'<button id="'+id+'-cell-button" class="btn btn-default dropdown-toggle cell_button" data-toggle="dropdown">'+cell+'</button>'+
				'<ul id="'+id+'-cell-menu" class="dropdown-menu">'+
					'<li><a id="'+id+'-cell-delete" href="#">Remove Cell</a></li>'+
				'</ul>'+
			'</div>'
		);
		
		$('#'+id+'-cell-delete').click(function () {
			// get cell and graph id's from drop-down id
			var cell = parseInt($(this).attr('id').split("cell_button")[1]);
			var graph = parseInt($(this).attr('id').split("graph")[1]);

			lineGraph[graph].deleteLine(cell);
			$("#graph"+graph+"-cell_button"+cell+"-cell-container").remove();
		})
		
		$('#'+id+'-cell-container').on('show.bs.dropdown', function () {
			// get cell and graph id's from drop-down id
			var cell = parseInt($(this).attr('id').split("cell_button")[1]);
			var graph = parseInt($(this).attr('id').split("graph")[1]);

			// update global graph and cell variables to button currently pressed
			activeCell = cell;
			activeGraph = graph;
		})
		scope = angular.element('#'+id+'-cell-menu').scope();
		scope.add('#'+id+'-cell-menu',id);

	}

	var dataSet=[];
	var dataSetFront=[];
	var totalValues;

	/* 
	 * hard copy sample data into dataSet
	 * dataSet will by cyclic
	 */

	var dataInit = function(){
		var i;
		var tempArray;
		totalValues = data["values"].length;
		
		dataSetFront = [];
		
		for(i=0; i<totalValues; i++)
		{
			dataSet[i] = data["values"][i].slice();
			dataSetFront[i]=dataSet[i][0];
		}
	}

	dataInit();
	var j=0;
	dataGenerator = setInterval(function(){
		var i, temp;
		j++;
		dataSetFront = [];
		
		for(i=0; i<totalValues; i++)
		{
			temp=dataSet[i].shift();
			dataSetFront[i]=temp;
			dataSet[i].push(temp);
		}
	},dataInterval);

	var lineGraph=[];
	var runningIntervals=[]

	var createGraph = function(containerName){
		var graphId = parseInt(containerName.split("graph")[1]);
		
		lineGraph[graphID] = new createLineGraph(containerName,promptInputArr);
		
		/*
		console.log(lineGraph);
		
		runningIntervals[graphId]=setInterval(function(){
			lineGraph[graphID].slideData(dataSet[promptInputArr[0]][0]);
		}, dataInterval);*/
	}


	var time = 0;
	var runningGraphs = setInterval(function(){

		var cells;
		var appendDataSet;
		
		time++;

		lineGraph.forEach(function(d,i){
			cells = d.getReportingCells();
			appendDataSet = [];

			cells.forEach(function(d,i){
				appendDataSet.push([time, dataSetFront[d]]);
			});



			d.slideData(appendDataSet);
		});
	},dataInterval);

	var rasterPlot;

	var createPlot = function(){
		$("#sortable-column"+activeReportingColumn).append(
			'<li class="portlet_handle">'+
				'<div id="plot-container" class="panel panel-default graph-unit" style="position:relative;width:100%;height:220px;">'+
					'<div class="panel-heading" style="position:relative;height:40px">'+
						'<p style="font-size: 1.2em;">Raster Plot</p>'+
					'</div>'+
					'<div class="panel-body" id="raster" style="width:100%;height:220px;"></div>'+
				'</div>'+
			'</li>');
			
		rasterPlot = new createRasterPlot("#raster");
		
		setInterval(function(){
			rasterPlot.slideData(dataSetFront);
		}, dataInterval);
	}
}
