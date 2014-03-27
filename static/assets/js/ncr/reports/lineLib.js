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
	
	var pendingData=[];
	var data = [];
	var pastData = [];
	
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
	
	var domainStart = -50;
	var domainEnd = 0;
	var domainInterval, domainBuffer = 2;
	var tickTime, differenceInPercent, oldTime;
	
	var lines;
	var drawing = false;
	
	var background;
	var recordTimer = -1;
	
	var xAxisPointer;
	
	var indexOflineRecentlyDeleted;
	


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
			.attr("id", graphID+"-xaxis")
			.attr("class", "axis xaxis")
			.attr("transform", "translate(0, "+(height-marginBottom)+")")
			.call(xAxis);
		

		

			

		  


		// simple plot basics using D3, help found here:
		//http://bl.ocks.org/bunkat/2595950


		reportingCells.forEach(function(d,i){
			data[i]=[];
			pastData[i]=[];
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
			.attr("d", line);
			
		svg.append("rect")
			.attr("id", graphID+"_whiteBgYaxisLeft")
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
			.call(yAxis);
		
		//$("#"+graphID+"-xaxis").attr("visibility","hidden");
		
		calculateDomainInterval();

	}
	
	var initDimensions = function(){
		width = $(containerName).width();
		height = $(containerName).height();
	}
	
	var calculateDomainInterval = function(){
		var domainDifference = domainEnd - domainStart;
		domainBuffer = domainDifference * .1;
		domainInterval = domainDifference + domainBuffer;
	}
	
	var setDimensions = function(){
		/*
		 * the Dimensions are set to the current width and height global variables.
		 * unless they are changed, dimensions stay the same
		 */
		 
//		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([0, width]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
			
//		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left").ticks(height/20);

		if((oldh-height)!=0){
		
			svg.selectAll(".yaxis")
				.call(yAxis);
				
				
			svg.selectAll("g .axis.xaxis")
				.transition()
				.duration(transitionDuration)
				.ease("linear")
				.call(xAxis);
				/*
			svg.selectAll(".xaxis")
				.transition()
				.duration(transitionDuration)
				.ease("linear").attr("transform", "translate(0, "+(height-marginBottom)+")");*/
		}
		/*
		svg.selectAll("g .axis.xaxis")
			.call(xAxis);
			
		svg.selectAll("g .axis.yaxis")
			.call(yAxis);
			*/
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
	

	
	var index = 0;
	
	var difference=0;
	
	var updateData = function(){
	

		var otherTick;
		var datum;

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
		
		if(pendingData.length>0){
			//console.log(pendingData[0].length+" "+data.length);
		}
		
		pendingData.forEach(function(d,i){

			datum=d.length;
			if(d.length>0){

				otherTick=d[0][0];
				if(otherTick>domainEnd)
					difference = otherTick-2-domainEnd;
			}
			d.forEach(function(d,i){
				data[i].push(d);
			});
		});
		
		pendingData=[];
		
console.log(domainEnd + " " + otherTick);
		
		if(typeof otherTick != 'undefined'){
		
			if(difference<domainInterval){
				difference*=.3;
				domainStart+=1+difference;
				domainEnd+=1+difference;
			}
			else{
				domainEnd=otherTick;
				domainStart=domainEnd-domainInterval;
			}
		}

		/*
		 * Cut off the tail of each data set and push them into past data
		 * so as to make sure the currently refreshing data set is within
		 * the domain interval
		 */
		data.forEach(function(d,i){
			while(d.length>domainInterval+3){
				var temp = d.shift();
				pastData[i].push(temp);
			}
		});
		
		
		/*
		 * If the SVG set representing the x axis ticks exceed a certain range,
		 * remove those ticks. Otherwise the x axis extends indefinitely.
		 */

		for(var k=0;$("#"+graphID+"-xaxis").children().length>20;k++){
			$("#"+graphID+"-xaxis g:first-child").remove();
		}
	}
	



	
	var tick = function (){
	
		//tickTime = Date().getTime() - oldTime;
		//oldTime = tickTime;
		var d = new Date().getTime();
		tickTime = d-oldTime;
		oldTime = d;
		
		differenceInPercent = (tickTime-transitionDuration)/transitionDuration;
		
		//console.log((differenceInPercent+1));
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([80, 0]).range([marginTop, height-marginBottom]);
		if(recordTimer>=0)
			recordTick();
		redrawXAxis();
		updateData();
	}
	
	//var readyStatus = [false, false, false, false]
	
	var redrawLines = function(){
	
		if(transitionsOn)
		{
/*
			if(oldw-width!=0) {
			
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
					});
			}
			else {
*/
				g.attr("d", line)
					.attr("transform", null)
				.transition()
					.duration(transitionDuration)
					.ease("linear")
					.attr("transform", "translate(" + (xDomain(-1)-xDomain(0))*(1+difference) + ")")
					.each("end", function(d,i){
					
						//console.log(i+" "+readyStatus[i]);
						//readyStatus[i]=true;
						//if(!(readyStatus[0]==true && readyStatus[1]==true && readyStatus[2]==true && readyStatus[3]==true));
						//readyStatus[i]=false;
						
						//console.log(readyStatus[i]);

						//readyStatus[i]=false;
						
						/*
						d3.timer(function(){
							if(readyStatus[0]==true && readyStatus[1]==true && readyStatus[2]==true && readyStatus[3]==true){
								redrawLines();
								if(i==0)
									tick();
								return true;
							}
							

						}, 10);
						*/
					redrawLines();
					if(i==0)
						tick();
						
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
				.attr("transform", "translate(" + (xDomain(-1)-xDomain(0)) + ")")
				.each("end", function(d,i){
					redrawLines();
					if(i==0)
						tick();
				});
		}
	}
	
	var redrawXAxis = function(){
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");

		if (transitionsOn){		
			svg.selectAll(".xaxis")
			.transition()
			.duration(transitionDuration)
			.ease("linear")
			.call(xAxis);
		}
		else{
			svg.selectAll(".xaxis")
			.call(xAxis);
		}
	}
	
	this.getReportingCells = function(){
		return reportingCells;
	}
	
	this.addLine = function(cellNumber){
		reportingCells.push(cellNumber);
		
		// extend data array by 1 set
		data[reportingCells.length-1]=[];
		pastData[reportingCells.length-1]=[];
		
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
		indexOflineRecentlyDeleted = reportingCells.indexOf(cellNumber);
		
		reportingCells.splice(indexOflineRecentlyDeleted, 1);
		data.splice(indexOflineRecentlyDeleted, 1);
		
		pendingData.forEach(function(d,i){
			d.splice(indexOflineRecentlyDeleted, 1);
		});
		
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
		domainStart += domainInterval*0.1;;
		calculateDomainInterval();
		redrawXAxis();
	}
	
	this.zoomOut = function(){
		domainStart -= domainInterval*0.1;
		calculateDomainInterval();;
		
		console.log( );
		
		if(pastData[0].length>0){
			data.forEach(function(d,i){
				var temp;
				while(domainInterval+3>d.length && pastData[i].length>0){
					temp=pastData[i].pop();
					d.unshift(temp);
				}
				console.log("domainInterval: " + domainInterval + ", data: " + d.length);
			});
		}
		
		redrawXAxis();
	}
	
	this.goToEnd = function(){
		console.log("test");
	}
	
	this.startRecording = function(){
	
		svgDocument = d3.selectAll("."+svgID)[0][0];

		serializer = new XMLSerializer();
		svg_str = serializer.serializeToString(svgDocument);

		encoder = new GIFEncoder();
		encoder.setRepeat(0);
		encoder.setDelay(250);
		encoder.start()
	
		recordTimer=0;
	}
	
	var recordTick = function(){
		var pointer;
		if (recordTimer==0){
			canvas = document.getElementById('canvasExample');

			/*
			 * show white background
			 * update its dimensions
			 */
			pointer = $("#"+graphID+"_whitebg");
			pointer.attr("visibility","visible");
			pointer.css("width", width.toString()+"px");
			pointer.css("height", height.toString()+"px");

			// update entire svg dimensions
			pointer = $("."+svgID).css("width", width.toString()+"px");
			pointer.css("height", height.toString()+"px");

			pointer.find(".line").css("fill","none");
			pointer.find(".line").css("stroke","#000");

			pointer = $(".axis").find("path, tick").css("fill","none");
			pointer.find("path, tick").css("stroke","#eee");

			pointer = $(".axis").find("text").css("font-family", "sans-serif");
			pointer.find("text").css("font-size", "8px");

			recordTimer++;
		}


		else if (recordTimer >=0 && recordTimer < 20){		
	//		if(recordTimer==10)
		//				console.log(svg_str);

			svg_str = serializer.serializeToString(svgDocument);

			canvg('canvasExample', svg_str);

			canvas = document.getElementById('canvasExample');
			
			context = canvas.getContext("2d");

			encoder.addFrame(context);
			recordTimer++;
		}

		else if (recordTimer==20){
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

			//console.log($("."+svgID).css("height"));

			recordTimer=-1;

			global_flag = false;
		}
	}
	

	
	this.pauseTransitions = function(){
		transitionsOn = false;
	}
	
	this.resumeTransitions = function(){
		transitionsOn = true;
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
			redrawLines();
		}
	}

	init();
};