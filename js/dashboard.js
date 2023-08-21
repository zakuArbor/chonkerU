var drawGraph = function(){
  //number of circles to color in to visualize percent
	var percentNumber = 369 / 24679;

	//variables for the font family, and some colors
	var fontFamily = "helvetica";
	var twitterFill = "#888";
	var twitterFillActive = "#2f3337";
  var translate = 120;
  var radius = 15;
  var range = 312.5;
	//width and height of the SVG
  let width = 500; 
  let height = 500;

  if (window.screen.width < 600) {
    width = 300;
    height = 300;
    translate = 20;
    radius = 12;
    range = 250
  }

	//create an svg with width and height
	var svg = d3.select('#picto-pop')
		.append('svg')
		.attr("width", width)
		.attr("height", height)

	//10 rows and 10 columns 
	var numRows = 10;
	var numCols = 10;

	//x and y axis scales
	var y = d3.scaleBand()
		.range([0,range])
		.domain(d3.range(numRows));

	var x = d3.scaleBand()
		.range([0, range])
		.domain(d3.range(numCols));

	//the data is just an array of numbers for each cell in the grid
	var data = d3.range(numCols*numRows);

	//container to hold the grid
	var container = svg.append("g")
		.attr("transform", "translate(" + translate + "," + translate + ")");
	

	container.selectAll("circle")
			.data(data)
			.enter().append("circle")
			.attr("id", function(d){return "id"+d;})
			.attr('cx', function(d){return x(d%numCols);})
			.attr('cy', function(d){return y(Math.floor(d/numCols));})
			.attr('r', radius)
			.attr('fill', function(d){return d < percentNumber ? twitterFillActive : twitterFill;})
}

drawGraph();
