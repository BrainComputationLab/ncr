





var createGraphManager = function(){

	var domsArray = new Array();
	var graphID = 0;
	var plotID = 0;

	var graphsArray = new Array();
	var dataArray = new Array();
/*
	var activeCell;
	var activeGraph;
*/
	var promptInputStr;
	var promptInputArr;

	var intervals = [];

	var dataInterval = 300;
	
	var lineGraphs = [];
	var rasterPlots = [];
	var runningIntervals = [];
	
	var time = 0;
	var dataGenerator;
	var runningGraphs;
	
	var dataSet=[];
	var dataSetFront=[];
	var totalValues;

	var getGraph = function(type, ID){
		if(type == "GRAPH")
			return lineGraphs[ID];
		else if(type == "PLOT")
			return rasterPlots[ID];
		else
			return null;

	}
	
	var getID = function(type, container){
		return parseInt($(container).attr("id").split(type)[1]);
	}


	
	var promptForCells = function(){
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
		return true;
	}
	
	var constructContainer = function(type, graphPrefix){
		var elementPntr;
		
		if(putGraphsOnTop){
			$('#sortable-column'+activeReportingColumn).prepend(
				elementPntr = $('<li class="portlet_handle"></li>')
			);
		}
		else{
			$('#sortable-column'+activeReportingColumn).append(
				elementPntr = $('<li class="portlet_handle"></li>')
			);
		}

		elementPntr.append(
			elementPntr = $('<div id="'+graphPrefix+'-container" class="panel panel-default graph-unit" style="position:relative;"></div>')
		);
		
		var height;
		if(type == "GRAPH")
			height = "180px";
		else
			height = "220px";
		
		elementPntr.append(
			'<div id="'+graphPrefix+'-panel" class="panel-heading" style="position:relative;display:flex;padding: 5px 5px;"></div>' +
			'<div id="'+graphPrefix+'-body" class="panel-body" style="position:relative;width:100%;height:'+ height +';"></div>'+
			'<div id="'+graphPrefix+'-footer" class="panel-footer" style="position:relative;display:none;"></div>'
		);
	}
	
	
	var addMainButtons = function(type, containerID, graphPrefix){
		 
		$("#"+graphPrefix+"-panel").append(
			'<span style="font-size: 1.2em;position:relative; padding:5px 10px 5px 5px">' + type + ' ' + containerID + '</span>'+
			'<div class="btn-toolbar" id='+graphPrefix+'-button_toolbar style="position:relative;">'+
				'<div class="btn-group button_list" id="'+graphPrefix+'-cell_button_list"></div>'+
				'<div class="btn-group button_list" id="'+graphPrefix+'-scale_button_list"></div>'+
				'<div class="btn-group button_list" id="'+graphPrefix+'-playback_button_list"></div>'+
			'</div>'
		);
		
		
		var cellButtonList;
		if(type == "GRAPH")
			cellButtonList = '<li><a id="'+graphPrefix+'-menu-button-add" href="#">Add Cell</a></li>';
		else
			cellButtonList = '';
			
		$('#'+graphPrefix+'-cell_button_list').append(
			'<div id="'+graphPrefix+'-menu-container" class="btn-group">'+
				'<button id="'+graphPrefix+'-menu-button" class="btn btn-default dropdown-toggle menu_button" data-toggle="dropdown">Main</button>'+
				'<ul id="'+graphPrefix+'-menu-dropdown" class="dropdown-menu">'+
					cellButtonList +
					'<li><a id="'+graphPrefix+'-menu-button-slider" href="#">Toggle Position Slider</a></li>'+
					'<li><a id="'+graphPrefix+'-menu-button-delete" href="#">Delete Graph</a></li>'+
				'</ul>'+
			'</div>'
		);
		
		if(type == "GRAPH"){

			$("#"+graphPrefix+"-menu-button-add").click(function(){
				var str = prompt("Enter 1 cell","");
				
				if(str == null)
					return false;
				
				var cell = parseInt(str);
				var graph = getID(type, this);

				addCellButton(graph,cell);
				lineGraphs[graph].addLine(cell);
			});
			
			for (var i = 0; i<promptInputArr.length; i++)
				addCellButton(containerID, promptInputArr[i]);
		}
		
		$("#"+graphPrefix+"-menu-button-slider").click(function(){
			var graph = getID(type, this);
			
			var slider = $("#" + type + graph + "-footer");
			
			var visibility = slider.css("display");
			if(visibility != "none")
				slider.css("display", "none");
			else
				slider.css("display", "block");
		});
		
		$("#"+graphPrefix+"-menu-button-delete").click(function(){
			var graph = getID(type, this);
			
			$("#"+type+graph+"-container").remove();
		});

	}
	
	var addCellButton = function (graphID, cell){
		var buttonSuffix = "-cell_button"+cell;
		var graphPrefix = "GRAPH"+graphID;

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
			var graph = getID("GRAPH", this);

			lineGraphs[graph].deleteLine(cell);
			$("#GRAPH"+graph+"-cell_button"+cell+"-cell-container").remove();
		})
		
		$('#'+id+'-cell-container').on('show.bs.dropdown', function () {
			// get cell and graph id's from drop-down id
			var cell = parseInt($(this).attr('id').split("cell_button")[1]);
			var graph = getID("GRAPH", this);

			// update global graph and cell variables to button currently pressed
			activeCell = cell;
			activeGraph = graph;
		})
		
		scope = angular.element('#'+id+'-cell-menu').scope();
		scope.add('#'+id+'-cell-menu',id);

	}
	
	var addScaleButtons = function(type, graphPrefix){
		
		var elementPntr = $("#"+graphPrefix+"-scale_button_list");
		elementPntr.append('<button id="'+graphPrefix+'-scale_button-" class="btn btn-default"><span class="glyphicon glyphicon-zoom-out"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button+" class="btn btn-default"><span class="glyphicon glyphicon-zoom-in"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button_up" class="btn btn-default"><span class="glyphicon glyphicon-chevron-up"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-scale_button_down" class="btn btn-default"><span class="glyphicon glyphicon-chevron-down"></span></button>');
		
		
		// jquery functionallity for menu. Help found here:
		// http://jqueryui.com/button/#splitbutton

		//console.log($("#"+graphPrefix+"-scale_button-"));
		
		$("#"+graphPrefix+"-scale_button-").click(function(){
			var graph = getID(type, this);
			getGraph(type, graph).zoomOut();
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			getGraph(type, graph).zoomIn();
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			var body = $("#" + type + graph + "-body");
			
			if(parseInt(body.css("height"))>70){
				body.css("height", "-="+10);
			}
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			var body = $("#" + type + graph+"-body");
			
			if(parseInt(body.css("height"))<320){
				body.css("height", "+="+10);
			}
		});
	}
	
	var addPlaybackButtons = function(type, graphPrefix){
		
		var elementPntr = $("#"+graphPrefix+"-playback_button_list");
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-play" class="btn btn-default" type="button"><span class="glyphicon glyphicon-pause"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-gotoend" class="btn btn-default" type="button"><span class="glyphicon glyphicon-fast-forward"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-record" class="btn btn-default" type="button"><span class="glyphicon glyphicon-film"></span></button>');
		elementPntr.append('<button id="'+graphPrefix+'-playback_button-picture" class="btn btn-default" type="button"><span class="glyphicon glyphicon-camera"></span></button>');
		
		
		$("#"+graphPrefix+"-playback_button-play").click(function(){
			var graph = getID(type, this);
			var icon = $(this).children();

			console.log();
			if(icon.attr("class").split("glyphicon-")[1] == "play"){
				getGraph(type, graph).play();
				icon.attr("class", "glyphicon glyphicon-pause");
			}
			else{
				getGraph(type, graph).pause();
				icon.attr("class", "glyphicon glyphicon-play");
			}
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			getGraph(type, graph).play();
			getGraph(type, graph).goToEnd();
			
			$("#" + type + graph + "-playback_button-play").children().attr("class", "glyphicon glyphicon-pause");
			
			var slider = $("#" + type + graph + "-slider");

			var newMax = getGraph(type, graph).getDomainEnd();
			slider.slider("option", "max", newMax); 
			slider.slider("value", newMax);
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			/*
			if(rasterPlot!=undefined)
				rasterPlot.pauseTransitions();*/
			lineGraphs.forEach(function(d){
				d.pauseTransitions();
			});
			
			global_flag = true;
			
			lineGraphs[graph].startRecording(20, "GIF");

			var wait = setInterval(function(){
				if(global_flag==false){
					/*if(rasterPlot!=undefined)
						rasterPlot.resumeTransitions();*/
					lineGraphs.forEach(function(d){
						d.resumeTransitions();
					});
					clearInterval(wait);
				}
			}, 1000);
		})
		.next()
		.click(function(){
			var graph = getID(type, this);
			getGraph(type, graph).takePicture(pictureFormat);
		});
		
	}

	var addSlider = function(type, graphPrefix){
		
		$("#"+graphPrefix+"-footer").append(
			'<div id="'+graphPrefix+'-slider" style="position:relative;margin:5px 5px;height:2px;"></div>'
		)
		
		$("#"+graphPrefix+"-slider").slider({
			max: 50,
			min: 0,
			step: 1,
			create: function() {
				var graph = getID(type, this);
				var slider = $("#" + type + graph + "-slider");

				var max = slider.slider( "option", "max" );
				
				slider.slider("value", max);
			},
			start: function(){
				var graph = getID(type, this);
				var slider = $("#" + type + graph + "-slider");

				getGraph(type, graph).pause();
				$("#" + type + graph + "-playback_button-play").children().attr("class", "glyphicon glyphicon-play");
				
				var max = slider.slider( "option", "max" );
				
				if(slider.slider("value") == max){
					var newMax = getGraph(type, graph).getDomainEnd();
					slider.slider("option", "max", newMax); 
					slider.slider("value", newMax);
				}
			},
			slide: function(event, ui){
				var graph = getID(type, this);
				var slider = $("#" + type + graph + "-slider");
				
				getGraph(type, graph).updateToSlider(ui.value);
			},
			stop: function(){}
		});
	}
	
	var createGraph = function(type, containerName){
		var id;

		if(type == "GRAPH"){
			id = parseInt(containerName.split("GRAPH")[1]);
			lineGraphs[id] = new createLineGraph(containerName, promptInputArr);
		}
		else if(type == "PLOT"){
			id = parseInt(containerName.split("PLOT")[1]);
			rasterPlots[id] = new createRasterPlot(containerName);
		}
	}
	
	var addElement = function(type){

		var graphPrefix;
		var buttonSuffix;
		var containerID;
	
		if(type == "GRAPH"){
			graphID++;
			containerID = graphID;
			graphPrefix = "GRAPH"+graphID;

			// prompt user for neuron cells			
			if(!promptForCells())
				return false;
		}
		else if(type == "PLOT"){
			plotID++;
			containerID = plotID;
			graphPrefix = "PLOT"+plotID;
		}
	
		constructContainer(type, graphPrefix);
		addMainButtons(type, containerID, graphPrefix);
		addScaleButtons(type, graphPrefix);
		addPlaybackButtons(type, graphPrefix);
		addSlider(type, graphPrefix);
		
		$("#"+graphPrefix+"-body").append(
			'<div id="'+graphPrefix+'-graph" class="aGraph" style="position:relative;width:100%;height:100%;"></div>'
		)

		createGraph(type, "#"+graphPrefix+"-graph");
	}
	
	var initializeControlPanel = function(){
		$("#createGraphButton").click(function(){
			addElement("GRAPH");
		});
		
		$("#createPlotButton").click(function(){
			addElement("PLOT");
		});
		
		$("#control_panel-report-time_of_last").html("Status updated: "+Date());
	}
	
	var dataInit = function(){
	
		/* 
		 * hard copy sample data into dataSet
		 * dataSet will by cyclic
		 */
	
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

	var runData = function(){
		dataGenerator = setInterval(function(){
			var i, temp;
			dataSetFront = [];
			
			time++;
			
			for(i=0; i<totalValues; i++)
			{
				temp=dataSet[i].shift();
				dataSetFront[i]=[time, temp];
				dataSet[i].push(temp);
			}
		},dataInterval);
	}

	var runGraphs = function(){
		runningGraphs = setInterval(function(){

			var cells;
			var appendDataSet;
			

				
			rasterPlots.forEach(function(d,i){
				d.slideData(time, dataSetFront);
			});
			
			lineGraphs.forEach(function(d,i){
				cells = d.getReportingCells();
				appendDataSet = [];

				cells.forEach(function(d,i){
					appendDataSet.push(dataSetFront[d]);
				});

				d.slideData(appendDataSet);
			});
		},dataInterval);
	}

	initializeControlPanel();
	dataInit();
	runData();
	runGraphs();

}