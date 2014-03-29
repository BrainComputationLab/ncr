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
	
	var transitionDuration=300;
	
	var svgDocument;
	var serializer;
	
	var svg_str;
	
	var encoder;
	var transitionsOn = true;
	
	var domainStart = 0;
	var domainEnd = 23;
	var domainInterval = domainEnd-domainStart;

	var init = function(){
		
		initDimensions();
		
		marginTop = 10;
		marginBottom = 50;
		marginLeft = 40;
		marginRight = 20;
		yAxisBuffer = 20;
			
		svg = d3.select(containerName)
			.append("svg")
			.attr("class", "raster_SVG")
			.attr("width", "100%")
			.attr("height", "100%");
	
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([50, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left");

		svg.append("rect")
			.attr("width", "100%")
			.attr("height", height-marginBottom)
			.attr("fill", "white");	

		svg.append("g")
			.attr("class", "axis xaxis")
			.attr("transform", "translate(0, "+(height-marginBottom)+")")
			.call(xAxis);
		
		svg.append("g")
			.attr("class", "axis yaxis")
			.attr("transform", "translate("+(marginLeft-yAxisBuffer)+", 0)")
			.call(yAxis);
		



		// simple plot basics using D3, help found here:
		//http://bl.ocks.org/bunkat/2595950
		g = svg.append("svg:g")

		g.selectAll("scatter-dots")
			.data(data)
				.enter().append("svg:circle")
				.attr("class", "rasterData")
				.attr("cx", function (d) { return xDomain(d[0]); } )
				.attr("cy", function (d) { return yDomain(d[1]); } )
				.attr("r", 2);





		svgDocument = d3.selectAll(".raster_SVG")[0][0];

		serializer = new XMLSerializer();
		svg_str = serializer.serializeToString(svgDocument);

		encoder = new GIFEncoder();
		encoder.setRepeat(0);
		encoder.setDelay(250);
		encoder.start()





	}
	
	var initDimensions = function(){
		width = $(containerName).width();
		height = $(containerName).height();
	}
	
	var setDimensions = function(){
	
		/*
		 * the Dimensions are set to the current width and height global variables.
		 * unless they are changed, dimensions will stay the same
		 */
		 
		xDomain = d3.scale.linear().domain([domainStart, domainEnd]).range([marginLeft, width-marginRight]);
		yDomain = d3.scale.linear().domain([50, 0]).range([marginTop, height-marginBottom]);
			
		xAxis = d3.svg.axis().scale(xDomain).orient("bottom");
		yAxis = d3.svg.axis().scale(yDomain).orient("left");

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
		
			svg.selectAll(".rasterData")
				.transition()
					.duration(300)
					.ease("linear")
					.attr("cx", function (d) { return xDomain(d[0]); } )
					.attr("cy", function (d) { return yDomain(d[1]); } );

			svg.selectAll(".xaxis")
				.transition()
					.duration(300)
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

	this.pauseTransitions = function(){
		transitionsOn = false;
	}
	
	this.resumeTransitions = function(){
		transitionsOn = true;
	}
	
	this.slideData = function(addedData){
	
		if (dimensionsChanged())
			setDimensions();
		
		
		svg_str = serializer.serializeToString(svgDocument);
		//document.getElementById("para1").innerHTML = svg_str;
	/*
		if (false)
		{
			canvas = document.getElementById('canvasExample');

			$(".axis").find("path, tick").css("fill","none");
			$(".axis").find("path, tick").css("stroke","#eee");
			
			$(".axis").find("text").css("font-family", "sans-serif");
			$(".axis").find("text").css("font-size", "11px");
			
			
		}
		*/
		/*
		if (i < 21)
		{		
			transitionsOn=false;
			canvg('canvasExample', svg_str);


			
			canvas = document.getElementById('canvasExample');

			
			
			context = canvas.getContext("2d");
	
			encoder.addFrame(context);
			
		}
		
		else if (i==21)
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
			transitionsOn=true;
		}
		
		
		*/
		
		domainStart+=.5;
		domainEnd+=.5;

		addedData.forEach(function(d,i){
			if(d>32){
				g.selectAll("scatter-dots")
					.data([[domainEnd-3,i]])
						.enter().append("svg:circle")
						.attr("class", "rasterData")
						.attr("cx", function (d) { return xDomain(d[0]); })
						.attr("cy", function (d) { return yDomain(d[1]); })
						.attr("r", 2);
			}
		});
		
		redrawXAxis();
	}
	init();
};