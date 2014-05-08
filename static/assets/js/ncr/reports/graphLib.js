function createRasterPlot(containerName) {

	// D3 plot basics for drawing axes found here:
	// http://swizec.com/blog/quick-scatterplot-tutorial-for-d3-js/swizec/5337

	var context;
	var canvas;
	
	var width, height, oldw, oldh;
	var Data_url;
	
	var marginTop, marginBottom, marginLeft, marginRight,
		yAxisBuffer;
	
	var svg;
	
	var xDomain, yDomain;
	var xAxis, yAxis;
	
	var data = [];
	var g;
	/*
	var graphID = parseInt(containerName.split("graph")[1])
	var svgID = "graph"+graphID+"_SVG";
	*/
	
	var graphID = parseInt(containerName.split("PLOT")[1])
	var svgID = "PLOT"+graphID+"_SVG";
	var slider = $("#PLOT"+graphID+"-slider");
	
	var transitionDuration = 300;
	
	var svgDocument;
	var serializer;
	
	var svg_str;
	
	var encoder;
	var transitionsOn = true;
	
	var domainStart = -40;
	var domainEnd = 0;
	var domainInterval, domainBuffer, domainBufferScale = .2;

	var pauseDataUpdate = false;

	var drawing = false;
	var captureFormat = "GIF";
	
	var recordTimer = -1;
	var numberOfSlides;
	
	var zoomModifier = 0.1;
	var zoomClicked = false;
	
	var updating = true;
	var upToDate = true;
	var paused = false;
	
	var init = function(){
		
		initDimensions();
		
		marginTop = 10;
		marginBottom = 17;
		marginLeft = 40;
		marginRight = 20;
		yAxisBuffer = 20;
			
		console.log(height);
			
		svg = d3.select(containerName)
			.append("svg")
			.attr("class", svgID)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("xmlns", "http://www.w3.org/2000/svg");
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([50, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left");

		svg.append("rect")
			.attr("width", "100%")
			.attr("height", height-marginBottom)
			.attr("fill", "white");	
			
		svg.append("rect")
			.attr("id", "plot"+graphID+"_whitebg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("fill", "white")
			.attr("visibility", "hidden");	

		svg.append("g")
			.attr("id", graphID+"-xaxis")
			.attr("class", "axis xaxis")
			.attr("transform", "translate(0, "+(height-marginBottom)+")")
			.call(xAxis)
			.selectAll("path, line")
			.style("fill", "none")
			.style("stroke", "#eee");

		



		// simple plot basics using D3, help found here:
		//http://bl.ocks.org/bunkat/2595950
		g = svg.append("svg:g").attr("id", "dots");

		g.selectAll("scatter-dots")
			.data(data)
				.enter().append("svg:circle")
				.attr("class", "rasterData")
				.attr("cx", function (d) { return xDomain(d[0]); } )
				.attr("cy", function (d) { return yDomain(d[1]); } )
				.attr("r", 2);

		svg.append("rect")
			.attr("id", "plot"+graphID+"_whiteBgYaxisLeft")
			.attr("width", (marginLeft-yAxisBuffer)+"px")
			.attr("height", "100%")
			.attr("fill", "white");

		svg.append("g")
			.attr("class", "axis yaxis")
			.attr("transform", "translate("+(marginLeft-yAxisBuffer)+", 0)")
			.call(yAxis)
			.selectAll("path, line")
			.style("fill", "none")
			.style("stroke", "#eee");
			
		svg.selectAll("text")
			.style("font-family", "sans-serif")
			.style("font-size", "11px");

		calculateDomainInterval();
	}
	
	var initDimensions = function(){
		width = $(containerName).width();
		height = $(containerName).height();
	}
	
	var calculateDomainInterval = function(){
		var domainDifference = domainEnd - domainStart;
		domainBuffer = domainDifference * domainBufferScale;
		domainInterval = domainDifference + domainBuffer;
	}
	
	var setDimensions = function(){
	
		/*
		 * the Dimensions are set to the current width and height global variables.
		 * unless they are changed, dimensions will stay the same
		 */

		yDomain = d3.scale.linear().domain([50, 0]).range([marginTop, height-marginBottom]);
		yAxis = d3.svg.axis().scale(yDomain).orient("left").ticks(height/20);

		if((oldh-height)!=0){
		
			svg.selectAll(".yaxis")
				.call(yAxis);
				
				
			svg.selectAll("g .axis.xaxis")
				.transition()
				.duration(transitionDuration)
				.ease("linear")
				.call(xAxis);
				
			svg.selectAll(".xaxis")
				.attr("transform", "translate(0, "+(height-marginBottom)+")");
		}
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
		
			svg.selectAll(".rasterData")
				.transition()
					.duration(transitionDuration)
					.ease("linear")
					.attr("cx", function (d) { return xDomain(d[0]); } )
					.attr("cy", function (d) { return yDomain(d[1]); } );

			svg.selectAll(".xaxis")
				.transition()
					.duration(transitionDuration)
					.ease("linear")
					.call(xAxis);
		}		
		else
		{
			svg.selectAll(".rasterData")
					.attr("cx", function (d) { return xDomain(d[0]); } )
					.attr("cy", function (d) { return yDomain(d[1]); } );
					
			svg.selectAll(".xaxis")
					.call(xAxis);
		}
	}
	

	
	this.getReportingCells = function(){
	//	return reportingCells;
	}
	
	this.zoomIn = function(){
		domainStart += domainInterval * zoomModifier;
		calculateDomainInterval();
		redrawXAxis();
	}
	
	this.zoomOut = function(){
		domainStart -= domainInterval * zoomModifier;
		calculateDomainInterval();
		redrawXAxis();
	}

	this.startRecording = function(slideLength, pictureFormatInit){
	
		svgDocument = d3.selectAll("."+svgID)[0][0];

		serializer = new XMLSerializer();
		svg_str = serializer.serializeToString(svgDocument);

		encoder = new GIFEncoder();
		encoder.setRepeat(0);
		encoder.setDelay(250);
		encoder.start()
	
		captureFormat = pictureFormatInit;

		numberOfSlides = slideLength;
	
		if(captureFormat == "SVG")
			numberOfSlides = 1;
	
		recordTimer=0;
	}
	
	var recordTick = function(format){

		var pointer;
		if (recordTimer==0){
			canvas = document.getElementById('canvasExample');

			/*
			 * show white background
			 * update its dimensions
			 */
			pointer = $("#plot"+graphID+"_whitebg");
			pointer.attr("visibility","visible");
			pointer.css("width", width.toString()+"px");
			pointer.css("height", height.toString()+"px");
			

			svg.style("width", width.toString()+"px")
				.style("height", height.toString()+"px");
				
			svg.select(".axis")
				.selectAll("path, line")
				.style("fill", "none")
				.style("stroke", "#eee");

			svg.select(".axis")
				.selectAll("text")
				.style("font-family", "sans-serif")
				.style("font-size", "11px");
			
			recordTimer++;
		}


		if (recordTimer >= 0 && recordTimer <= numberOfSlides){	

			svg.select(".axis")
				.selectAll("path, line")
				.style("fill", "none")
				.style("stroke", "#eee");

			svg.select(".axis")
				.selectAll("text")
				.style("font-family", "sans-serif")
				.style("font-size", "11px");
		
			svg_str = serializer.serializeToString(svgDocument);

			canvg('canvasExample', svg_str);

			canvas = document.getElementById('canvasExample');
			
			context = canvas.getContext("2d");

			encoder.addFrame(context);
			recordTimer++;
		}
		else if (recordTimer >= numberOfSlides)
			finalizeRecording();
	}
	
	var finalizeRecording = function(){

		encoder.finish();

		var binary_gif = encoder.stream().getData()
		var data_url;
		
		var a = document.createElement('a');
		a.target = '_blank';
		
		if(captureFormat == "SVG"){
			data_url = 'data:application/octet-stream;base64,' + btoa(svg_str);
			a.download    = 'myFile.svg';
		}
		else{
			data_url = 'data:image/gif;base64,'+encode64(binary_gif);
			a.download    = 'myFile.gif';
		}

		a.href = data_url;

		document.body.appendChild(a);
		a.click();

		$("."+svgID).css("width", "100%");
		$("."+svgID).css("height", "100%");

		$("#plot"+graphID+"_whitebg").attr("visibility","hidden");

		recordTimer=-1;

		global_flag = false;
	}
	
	this.takePicture = function(captureFormatInit){
		this.startRecording(1, captureFormatInit);
		recordTick(captureFormatInit);
		finalizeRecording();
	}
	
	this.pauseTransitions = function(){
		transitionsOn = false;
	}
	
	this.resumeTransitions = function(){
		transitionsOn = true;
	}
	

	
	this.pause = function(){
		updating = false;
		upToDate = false;
		paused = true;
	}
	
	this.play = function(){
		paused = false;
		//tick();
		//redrawXAxis(true);
	}
	
	this.goToEnd = function(){
		updating = true;
	}
	
	this.getDomainEnd = function(){
		return domainEnd;
	}
	
	this.updateToSlider = function(newDomainEnd){

		domainEnd = newDomainEnd;
		domainStart = domainEnd - domainInterval + domainBuffer;
		
		//console.log("slider: " + domainStart + " " + domainEnd + " " + (domainStart-domainEnd));
		
		
		/*
		
		if(pastData[0].length>0){
			data.forEach(function(d,i){
				var temp;
				console.log(d[0][0] + " " +	domainStart);
				while(d[0][0] > domainStart - dataBuffer && pastData[i].length > 0){
					temp=pastData[i].pop();
					d.unshift(temp);
				}
			});
		}*/
		
		redrawXAxis(false);
	}
	
	var updateSlider = function updateSlider(){
		if(!upToDate && slider.slider("option", "value") != slider.slider("option", "max")){
			slider.slider("value", domainEnd);
		}
	}

	
	this.slideData = function(time, addedData){
	
		if (dimensionsChanged())
			setDimensions();

		difference = (time - Math.min(5, domainInterval*.1)) - domainEnd;
		
		if(typeof otherTick != 'undefined' && updating){
			if(difference < 0){
//			console.log("1");
				difference *= Math.pow((Math.exp(difference*.1)-1), 2);
				upToDate = true;
			}
			else if(difference < domainInterval && upToDate){
//			console.log("2");
				difference *= .1;
//				upToDate = true;
			}
			else{
//			console.log("3");
				difference *= Math.pow((Math.exp(-difference*.1)-1), 2);
				upToDate = true;
			}
		}
		
		if(!updating){
			difference = 0;
			updateSlider();
		}
		

		if(!paused){
		
			domainEnd += 1 + difference;
			domainStart += 1 + difference;

			addedData.forEach(function(d,i){
				if(d[1]>32){
					g.selectAll("scatter-dots")
						.data([[d[0],i]])
							.enter().append("svg:circle")
							.attr("class", "rasterData")
							.attr("cx", function (d) { return xDomain(d[0]); })
							.attr("cy", function (d) { return yDomain(d[1]); })
							.attr("r", 2);
				}
			});
		}
		//console.log($("#dots").children().length);
		
		for(var l = 0; $("#dots").children().length > 100; l++){
			$("#dots circle:first-child").remove();
		}
		
		for(var k = 0; $("#raster-xaxis").children().length > 20; k++){
			$("#raster-xaxis g:first-child").remove();
		}
		
		redrawXAxis();
	}
	

	
	init();
};