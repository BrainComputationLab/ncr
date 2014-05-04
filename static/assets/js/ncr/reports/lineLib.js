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
	
	var pendingData = [];
	var data = [];
	var pastData = [];
	var forwardData = [];
	
	var dataBuffer = 3;
	
	var g;
	var line;
	var graphID = parseInt(containerName.split("GRAPH")[1])
	var svgID = "GRAPH"+graphID+"_SVG";
	var slider = $("#GRAPH"+graphID+"-slider");
	
	var transitionDuration = 300;
	
	var svgDocument;
	var serializer;
	
	var svg_str;
	
	var encoder;
	var transitionsOn = true;
	
	var domainStart = -40;
	var domainEnd = 0;
	var difference = 0;
	var domainInterval, domainBuffer, domainBufferScale = .2;
	var tickTime, differenceInPercent, oldTime;
	
	var lines;
	var pauseDataUpdate = false;
	var allowAlternateAnimation = false;
	var drawing = false;
	var captureFormat = "GIF";
	
	var recordTimer = -1;
	var numberOfSlides;
	
	var indexOflineRecentlyDeleted;
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
			
		svg = d3.select(containerName)
			.append("svg")
			.attr("class", svgID)
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("xmlns", "http://www.w3.org/2000/svg");
			
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left");


		
		svg.append("rect")
			.attr("id", "graph"+graphID+"_whitebg")
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


		reportingCells.forEach(function(d,i){
			data[i] = [];
			pastData[i] = [];
			forwardData[i] = [];
		});
		

		line = d3.svg.line()
			.interpolate("linear")
			.x(function(d, i) {
				return xDomain(d[0]);
			})
			.y(function(d, i) { return yDomain(d[1]); });
		  
		lines = svg.append("svg:g")
				.attr("class", "lines")
			.selectAll("path")
				.data(data);
		
		g = lines.enter().append("path")
			.attr("id", function(d,i){
				return "line-"+graphID+"-"+reportingCells[i];
			})
			.attr("class", "line")
			.attr("d", line)
			.style("fill", "none")
			.style("stroke", "#000")
			.style("stroke-width", "1.5px");
			
		svg.append("rect")
			.attr("id", "graph"+graphID+"_whiteBgYaxisLeft")
			.attr("width", (marginLeft-yAxisBuffer)+"px")
			.attr("height", "100%")
			.attr("fill", "white");
		/*
		svg.append("rect")
			.attr("id", graphID+"_whiteBgYaxisRight")
			.attr("width", marginRight+"px")
			.attr("height", "100%")
			.attr("fill", "white")
			.attr("transform", "translate("+(width-marginRight)+", 0)");
			*/
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
		
		//$("#"+graphID+"-xaxis").attr("visibility","hidden");
		
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
		 * unless they are changed, dimensions stay the same
		 */
		 
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
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
			if(paused)
				redrawLinesOnce();
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
	

	var updateData = function(){
	

		var otherTick;
		var datum;
		var temp;

		/*
		var newData;
		
		newData = pendingData.shift();
		
		data.forEach(function(d,i){
			datum=d.length;
			if(d.length>0){

				otherTick=d[0][0];
				if(otherTick>domainEnd)
					difference = otherTick-domainEnd;
			}
			d.forEach(function(d,i){
				d.push(pendingData[i]);
			});
		});
		*/

		if(pendingData.length > 0){
			//console.log(pendingData[0].length+" "+data.length);
		}
		//console.log(pendingData.length);
		pendingData.forEach(function(d,i){

			datum = d.length;
			if(d.length > 0){

				otherTick = d[0][0];
				if(otherTick >= domainEnd)
					difference = (otherTick-Math.min(5,domainInterval*.1))-domainEnd;
			}
			d.forEach(function(d,i){
				//data[i].push(d);
				forwardData[i].push(d);
			});
		});
		
		pendingData = [];
		

		if(updating){
			forwardData.forEach(function(d,i){
				var temp;
				while(d.length > 0){
					temp = d.shift();
					data[i].push(temp);
				}
			});
		}
		
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
		}
		
		//console.log(domainStart + " " + domainEnd + " " + domainInterval + " " + otherTick + " " + difference);

		//difference *= .1;
		//increment = 1 + difference;
		
		domainEnd += 1 + difference;
		//console.log(difference + " " + increment);
		domainStart += 1 + difference;
		
//		console.log("update: " + domainStart + " " + domainEnd + " " + (domainStart-domainEnd));

	/*
		console.log(difference);
		if(difference<domainInterval){
			difference*=.3;
			domainStart+=1+difference;
			domainEnd+=1+difference;
		}
		else{
			domainEnd=otherTick;
			domainStart=domainEnd-domainInterval;
		}
		*/

		/*
		 * Cut off the tail of each data set and push them into past data
		 * so as to make sure the currently refreshing data set is within
		 * the domain interval
		 */
		
//		if(!pauseDataUpdate && !allowAlternateAnimation){
//		console.log("UPDATING");
		
		clipGraph();
			
/*
			data.forEach(function(d,i){
				while(d.length < domainInterval + dataBuffer && pastData[i].length>0){
					temp=pastData[i].pop();
					d.unshift(temp);
				}
			});
			*/
/*			
		}
		else{
		console.log("NOT UPDATING");
		pauseDataUpdate = false;
		}
	*/	
		
		
		/*
		 * If the SVG set representing the x axis ticks exceed a certain range,
		 * remove those ticks. Otherwise the x axis extends indefinitely.
		 */

		for(var k=0;$("#"+graphID+"-xaxis").children().length>20;k++){
			$("#"+graphID+"-xaxis g:first-child").remove();
		}
	}
	

	var findLowerBound = function(dataSet){
		var lowerBound = null;
	
		if(data[dataSet].length > 0)
			if(data[dataSet][0].length == 2)
				lowerBound = data[dataSet][0][0];
					
		return lowerBound;
	};
	
	var findUpperBound = function(dataSet){
		var upperBound = null;
	
		if(data[dataSet].length > 0)
			if(data[dataSet][0].length == 2)
				upperBound = data[dataSet][data[dataSet].length - 1][0];

		return upperBound;
	};
	
	var getDataMaxLength = function(sampleDataSet){
		var maxLength = 0;
		
		sampleDataSet.forEach(function(d,i){
			if(d.length > maxLength)
				maxLength = d.length;
		});
		return maxLength;
	}
	
	var clipGraph = function(){
		var lowerBound, upperBound;
		
		data.forEach(function(d,i){
			lowerBound = findLowerBound(i);
			var counter = 0;
			while(lowerBound < domainStart - domainBuffer && counter < 10 && lowerBound != null){
				counter++;
				temp = d.shift();
				pastData[i].push(temp);
				lowerBound = findLowerBound(i);
			}
		});
		
		if(getDataMaxLength(pastData) > 0){
			data.forEach(function(d,i){
				var temp;
				lowerBound = findLowerBound(i);
				while(lowerBound > domainStart - dataBuffer && pastData[i].length > 0){
					temp = pastData[i].pop();
					d.unshift(temp);
					lowerBound = findLowerBound(i);
				}
			});
		}
		
		data.forEach(function(d,i){
			upperBound = findUpperBound(i);
			
//			console.log(upperBound + " " + domainEnd + " " + (domainEnd + domainBuffer));
			
			//var counter = 0;
			while(upperBound > domainEnd + domainBuffer && upperBound != null){
				//counter++;
				temp = d.pop();
				forwardData[i].unshift(temp);
				upperBound = findUpperBound(i);
			}
		});
		
		if(getDataMaxLength(forwardData) > 0){
			data.forEach(function(d,i){
				var temp;
			console.log(upperBound + " " + domainEnd + " " + (domainEnd + domainBuffer));
				upperBound = findUpperBound(i);
				while(upperBound < domainEnd + domainBuffer && forwardData[i].length > 0){
					temp = forwardData[i].shift();
					d.push(temp);
					upperBound = findUpperBound(i);
				}
			});
		}
	};


	
	var tick = function (){
	
		//tickTime = Date().getTime() - oldTime;
		//oldTime = tickTime;
		var d = new Date().getTime();
		tickTime = d-oldTime;
		oldTime = d;
		
		//differenceInPercent = (tickTime-transtionDuration)/transitionDuration;
		
		//console.log((differenceInPercent+1));
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
		
		if(recordTimer>=0)
			recordTick(captureFormat);
/*			
		if(zoomClicked){
			redrawXAxis(false);
			zoomClicked = false;
		}
		else*/
			redrawXAxis(transitionsOn);

		updateData();
		updateSlider();
	}
	
	//var readyStatus = [false, false, false, false]
	
	var redrawLinesOnce = function(){
		g.attr("d", line)
			.attr("transform", null);
	}

	var redrawLines = function(transitions, lineID){
		var shiftModifier;
		var s;
		if(paused){
			shiftModifier = 0;
			paused = false;

			}
		else
			shiftModifier = 1 + difference;
						s = new Date().getTime()
//			console.log("start:" + s);
		if(transitions)// && oldw-width==0)
		{

//			if(oldw-width!=0) {
/*
				g.attr("transform", "translate(" + (xDomain(-1)-xDomain(0)) + ")")
				.transition()
					.duration(transitionDuration)
					.ease("linear")
					.attr("d", line)
					.each("end", function(d,i){
						redrawLines();
						if(i==0){
							tick();
						}
					});*/
//			}
//			else {
	/*
			if(pauseDataUpdate && allowAlternateAnimation){
				g.transition()
					.duration(transitionDuration)
					.ease("linear")
					.attr("d", line)
					.each("end", function(d,i){
						redrawLines();
						if(i==0){
						
							tick();
							allowAlternateAnimation = false;
							}
					});
					
			}
//			else{
*/
				g.attr("d", line)
					.attr("transform", null)
				.transition()
					.duration(transitionDuration)
					.ease("linear")
					.attr("transform", "translate(" + (xDomain(-1)-xDomain(0))*shiftModifier + ")")
					
					.each("start", function(d,i){
						
					})
					.each("end", function(d,i){
						if(!paused){
							redrawLines(transitionsOn, i);
							/*
							var d = new Date().getTime()
							console.log("end " + i + ": " + d + ", " + (d-s));*/
							if(i==0){
								tick();
							}
						}
						
					});
			//}
		
		}

		else
		{
			g.attr("d", line)
				.attr("transform", null)
			.transition()
				.duration(0)
				.delay(transitionDuration)
				.ease("linear")
				.attr("transform", "translate(" + (xDomain(-1)-xDomain(0))*shiftModifier + ")")
				.each("end", function(d,i){
					if(!paused){
						redrawLines(transitionsOn);
						if(i==0)
							tick();
					}
				});
		}
	}
	
	var redrawXAxis = function(transitions){
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");

		if(transitions){// && oldw-width==0){		
			svg.selectAll(".xaxis")
			.transition()
			.duration(transitionDuration)
			.ease("linear")
			.call(xAxis);
		}
		else{
			svg.selectAll(".xaxis")
			/*
			.transition()
			.duration(0)
			.delay(transitionDuration)
			.ease("linear")*/
			.call(xAxis);
		}
	}
	
	this.getReportingCells = function(){
		return reportingCells;
	}
	
	this.addLine = function(cellNumber){
		reportingCells.push(cellNumber);
		
		// extend data array by 1 set
		data[reportingCells.length-1] = [];
		pastData[reportingCells.length-1] = [];
		forwardData[reportingCells.length-1] = [];
		
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
			.attr("d", line)
			.style("fill", "none")
			.style("stroke", "#000")
			.style("stroke-width", "1.5px");
		
		// find all lines and include into update variable
		g = svg.selectAll(".line").filter("path");
	}
	
	this.deleteLine = function(cellNumber){
		indexOflineRecentlyDeleted = reportingCells.indexOf(cellNumber);
		
		reportingCells.splice(indexOflineRecentlyDeleted, 1);
		data.splice(indexOflineRecentlyDeleted, 1);
		pastData.splice(indexOflineRecentlyDeleted, 1);
		forwardData.splice(indexOflineRecentlyDeleted, 1);
		
		pendingData.forEach(function(d,i){
			d.splice(indexOflineRecentlyDeleted, 1);
		});
		
		// remove SVG path
		svg.select("#line-"+graphID+"-"+cellNumber).remove();
	}
	
	this.zoomIn = function(){
		domainStart += domainInterval*zoomModifier;
		calculateDomainInterval();
		//redrawXAxis(false);
		if(paused)
			redrawLinesOnce();
			
		zoomClicked = true;
		if(paused){
			redrawXAxis();
			redrawLinesOnce();
		}
	}
	
	this.zoomOut = function(){
		pauseDataUpdate = true;
		allowAlternateAnimation = true;
		domainStart -= domainInterval*zoomModifier;
		calculateDomainInterval();


		//redrawXAxis(false);
		if(paused){
			redrawXAxis();
			redrawLinesOnce();
		}
			
		zoomClicked = true;
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
			pointer = $("#graph"+graphID+"_whitebg");
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

		$("#graph"+graphID+"_whitebg").attr("visibility","hidden");

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
		//paused = false;
		//tick();
		//redrawXAxis(true);
		redrawLines(true);
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
		
		
		clipGraph();
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
		
		redrawLinesOnce();
	}
	
	var updateSlider = function updateSlider(){
		if(!upToDate && slider.slider("option", "value") != slider.slider("option", "max")){
			slider.slider("value", domainEnd);
		}
	}

	this.slideData = function(incomingData){
	
		if (dimensionsChanged())
			setDimensions();
		
		/*
		 * In the case of asynchronous data sliding, if amount of data
		 * about to be appended to "pendingData" is not equal to amount
		 * of data sets (if a line was removed right after data sliding tick),
		 * remove that data set from incoming data
		 */
		if(incomingData.length != data.length){
			incomingData.splice(indexOflineRecentlyDeleted, 1);
		}

		
		pendingData.push(incomingData);

		if(drawing==false){
			oldTime = new Date().getTime();
			drawing = true;
			redrawLines(transitionsOn);
		}
	}

	init();
};