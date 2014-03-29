function createLineGraph(containerName, cells) {

	// D3 plot basics for drawing axes found here:
	// http://swizec.com/blog/quick-scatterplot-tutorial-for-d3-js/swizec/5337

	var context;
	var canvas;
	
	var reportingCells=cells.slice(0);
	
	var width, height, oldw, oldh;
	var Data_url;
	
	var marginTop, marginBottom, marginLeft, marginRight,
		yAxisBuffer;
	
	var svg;
	
	var xDomain, yDomain;
	var xAxis, yAxis;
	
	var data = [];
	var g;
	var line;
	var graphID = parseInt(containerName.split("graph")[1])
	var svgID = "graph"+graphID+"_SVG";
	
	var transitionDuration=300;
	
	var svgDocument;
	var serializer;
	
	var svg_str;
	
	var encoder;
	var transitionsOn=true;
	
	var domainStart = 0;
	var domainEnd = 23;
	var domainInterval = domainEnd-domainStart;
	
	var lines;
	
	var background;
	var recordTimer = -1;

	var init = function(){
		
		initDimensions();

		marginTop = 10;
		marginBottom = 18;
		marginLeft = 40;
		marginRight = 20;
		yAxisBuffer = 20;
			
		svg = d3.select(containerName)
			.append("svg")
			.attr("class", svgID)
			.attr("width", "100%")
			.attr("height", "100%");
			
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left");

		background = svg.append("rect")
			.attr("id", graphID+"_whitebg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", "white")
			.attr("visibility", "hidden");	

		svg.append("g")
			.attr("class", "axis xaxis")
			.attr("transform", "translate(0, "+(height-marginBottom)+")")
			.call(xAxis);
		
		svg.append("g")
			.attr("class", "axis yaxis")
			.attr("transform", "translate("+(marginLeft-yAxisBuffer)+", 0)")
			.call(yAxis);
			
		line = d3.svg.line()
		  .interpolate("linear")
		  .x(function(d, i) { return xDomain(d[0]); })
		  .y(function(d, i) { return yDomain(d[1]); });
		  
		  


		// simple plot basics using D3, help found here:
		//http://bl.ocks.org/bunkat/2595950


		reportingCells.forEach(function(d,i){
			data[i]=[];
		});
		
		lines = svg.append("svg:g")
				.attr("class", "lines")
			.selectAll("path")
				.data(data);

		g = lines.enter().append("path")
			.attr("id", function(d,i){
				return "line-"+graphID+"-"+reportingCells[i];
			})
			.attr("class", "line")
			.attr("d", line);
	}
	
	var initDimensions = function(){
		width = $(containerName).width();
		height = $(containerName).height();
	}
	
	var setDimensions = function(){
		/*
		 * the Dimensions are set to the current width and height global variables.
		 * unless they are changed, dimensions stay the same
		 */
		 
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left").ticks(height/20);

		if((oldh-height)!=0){
			svg.selectAll(".yaxis").transition()
				.duration(300)
				.ease("linear")
				.call(yAxis);
				
			svg.selectAll("g .axis.xaxis")
				.transition()
				.duration(200)
				.ease("cubic")
				.call(xAxis);
				
			svg.selectAll(".xaxis").attr("transform", "translate(0, "+(height-marginBottom)+")");
		}
		
		svg.selectAll("g .axis.xaxis")
			.call(xAxis);
			
		svg.selectAll("g .axis.yaxis")
			.call(yAxis);
	}
	
	var dimensionsChanged = function(){
		oldw = width;
		oldh = height;
		
		// refresh width and height variables
		initDimensions();
		
		if(oldw-width != 0 || oldh-height != 0)
			return true;
		else
			return false;
	}
	
	var redrawXAxis = function(){
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");

		
		if(transitionsOn)
		{
		
		
			g.transition()
				.duration(300)
				.ease("linear")
				.attr("d", line);
				
				/*
			g.attr("d", line);

				
			
			g.transition()
				.duration(300)
				.ease("linear")
				.attr("transform", "translate(" + -100 + ",0)");
			*/
			svg.selectAll(".xaxis")
				.transition()
					.duration(300)
					.ease("linear")
					.call(xAxis);
		}
		else
		{
			g.attr("d", line);
				
			svg.selectAll(".xaxis")
				.call(xAxis);
		}
		/*
		data.forEach(function(d,i){
			if(d.length>20)
				d.shift();
			});
			*/
	}
	
	this.getReportingCells = function(){
		return reportingCells;
	}
	
	this.addLine = function(cellNumber){
		reportingCells.push(cellNumber);
		
		// extend data array by 1 set
		data[reportingCells.length-1]=[];

		// include new line
		svg.selectAll(".lines")
			.selectAll("path")
			.data(data)
			.enter()
			.append("path")
			.attr("id", function(d,i){
				return "line-"+graphID+"-"+reportingCells[i];
			})
			.attr("class", "line")
			.attr("d", line);
		
		// find all lines and include into update variable
		g = svg.selectAll(".line").filter("path");
	}
	
	this.deleteLine = function(cellNumber){
		var index = reportingCells.indexOf(cellNumber);
		
		reportingCells.splice(index, 1);
		data.splice(index, 1);
		
		// remove SVG path
		svg.select("#line-"+graphID+"-"+cellNumber).remove();
	}
	
	/*
	this.editLine = function(cellNumberBefore, cellNumberAfter){
		
		var index = reportingCells.indexOf(cellNumberBefore);
		console.log("before: "+reportingCells);
		reportingCells.splice(index, 1, cellNumberAfter);
		console.log("after: "+reportingCells);
		data.splice(index, 1);
		
		svg.select("#line-"+graphID+"-"+cellNumberBefore).attr("d", "");
		svg.select("#line-"+graphID+"-"+cellNumberBefore).attr("d", line);

	}
	*/
	
	this.zoomIn = function(){
		domainStart += domainInterval*0.1;
		domainInterval = domainEnd-domainStart;
		redrawXAxis();
	}
	
	this.zoomOut = function(){
		domainStart -= domainInterval*0.1;
		domainInterval = domainEnd-domainStart;
		redrawXAxis();
	}
	
	this.record = function(){
	
		svgDocument = d3.selectAll("."+svgID)[0][0];

		serializer = new XMLSerializer();
		svg_str = serializer.serializeToString(svgDocument);

		encoder = new GIFEncoder();
		encoder.setRepeat(0);
		encoder.setDelay(250);
		encoder.start()
	
		recordTimer=0;
	}
	

	
	this.pauseTransitions = function(){
		transitionsOn = false;
	}
	
	this.resumeTransitions = function(){
		transitionsOn = true;
	}

	this.slideData = function(addedData){
	
		//console.log(height);
	
		if (dimensionsChanged())
			setDimensions();


		
	
	
		if (recordTimer==0)
		{
			canvas = document.getElementById('canvasExample');
			
			$("#"+graphID+"_whitebg").attr("visibility","visible");
			
/*			
			$("#"+graphID+"_whitebg").css("width", width.toString()+"px");
			$("#"+graphID+"_whitebg").css("height", height.toString()+"px");
	*/		
	
			$("."+svgID).css("width", width.toString()+"px");
			$("."+svgID).css("height", height.toString()+"px");
		
			$("."+svgID).find(".line").css("fill","none");
			$("."+svgID).find(".line").css("stroke","#000");
			
			$(".axis").find("path, tick").css("fill","none");
			$(".axis").find("path, tick").css("stroke","#eee");
			
			$(".axis").find("text").css("font-family", "sans-serif");
			$(".axis").find("text").css("font-size", "11px");
			
			recordTimer++;
			

			
		}
		
		
		else if (recordTimer >=0 && recordTimer < 20)
		{		

			if(recordTimer==10)
			console.log(svg_str);
			
			svg_str = serializer.serializeToString(svgDocument);
			
			canvg('canvasExample', svg_str);
			
			canvas = document.getElementById('canvasExample');

			
			
			context = canvas.getContext("2d");
	
			encoder.addFrame(context);
			recordTimer++;
		}
		
		else if (recordTimer==20)
		{

			
			encoder.finish();
			
			var binary_gif = encoder.stream().getData()
			var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
			
			var a         = document.createElement('a');
			a.href        = data_url;
			a.target      = '_blank';
			a.download    = 'myFile.gif';

			document.body.appendChild(a);
			a.click();
/*			
			$("#"+graphID+"_whitebg").css("width", "0px");
			$("#"+graphID+"_whitebg").css("height", "0px");
	*/		
	
			$("."+svgID).css("width", "100%");
			$("."+svgID).css("height", "100%");
	
			$("#"+graphID+"_whitebg").attr("visibility","hidden");
	
			console.log($("."+svgID).css("height"));
			
			recordTimer=-1;
			
			global_flag = false;
		}

		
		domainStart+=.5;
		domainEnd+=.5;
		
		data.forEach(function(d,j){
			d.push([domainEnd,addedData[j]])
		});
		
		redrawXAxis();
	}
	init();
};