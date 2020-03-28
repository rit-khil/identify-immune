function initMap() {

/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */


//Width and height of map
var width = 960;
var height = 500;

var projection = d3.geoAlbersUsa();
var path = d3.geoPath().projection(projection);

// D3 Projection
// var projection = d3.geo.albersUsa()
// 				   .translate([width/2, height/2])    // translate to center of screen
// 				   .scale([1000]);          // scale things down so see entire US

// Define path generator
// var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
// 		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = ["#dad1de","#836690","#471b59","#ffb7a5", "rgb(213,222,217)"];

var legendText = ["1-5 Volunteers", "6-10 Volunteers", "10+ Volunteers", "Volunteer Opportunity", "No Volunteers"];

var container = d3.select("#map-placeholder");

//Create SVG element and append map to the SVG
var svg = container
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = container
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in my states data
d3.csv("data-states.csv", function(data) {
//color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].State;

	// Grab data value
	var dataValue = data[i].Subjects;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.visited = dataValue;

		// Stop looking through the JSON
		break;
		}
	}
}

// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.visited;
	var state = d.properties.State;

	if (value) {
	//If value exists…
	if (value > 0 & value <= 5) {
		return color[0];
		//return color(1);
	}
	if (value > 5 & value <= 10) {
		return color[1];
		//return color(2);
	}
	if (value > 10) {
		return color[2];
		//return color(3);
	}
	//return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});


// Map the cities
d3.csv("map-city.csv", function(data) {

svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.lon, d.lat])[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(d.years) * 4;
	})
		.style("fill", color[3])
		.style("opacity", 0.85)

	// Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
	// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
	.on("mouseover", function(d) {
    	div.transition()
      	   .duration(200)
           .style("opacity", .9);
           div.text(d.place)
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
	})

    // fade out tooltip on mouse out
    .on("mouseout", function(d) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    });
});

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legend = container.append("svg")
      		.attr("class", "legend")
     			.attr("width", 180)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color)
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; });

  	legend.append("rect")
   		  .attr("width", 20)
   		  .attr("height", 20)
   		  .style("fill", function(d) { return d;});

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 30)
      	  .attr("y", 10)
      	  .attr("dy", ".35em")
					.style("font-size", "20px")
      	  .text(function(d) { return d; });
	});

});
}

function initBarGraph() {
    var container = d3.select("#map-placeholder");
    var svg = container.append("svg2");
    margin = {top: 20, right: 20, bottom: 60, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()			// x = d3.scaleBand()
    .rangeRound([0, height])	// .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, width]);	// .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#664174", "#f7dad4", "#ff896d", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("data-infections.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.total - a.total; });
  y.domain(data.map(function(d) { return d.Barcode; }));					// x.domain...
  x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();	// y.domain...
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
      .style("font-size", "20px")
    .selectAll("rect")
    .data(function(d) { return d; })
    .attr("font-size", 20)
    .enter().append("rect")
      .attr("y", function(d) { return y(d.data.Barcode); })    //.attr("x", function(d) { return x(d.data.State); })
      .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("height", y.bandwidth());

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .style("font-size", "20px") 						//  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .style("font-size", "20px")
	  .attr("transform", "translate(0,"+height +")")				// New line
      .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("y", 20)												//     .attr("y", 2)
      .attr("x", x(x.ticks().pop())) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.50em")										//     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("font-size", 20)
      .attr("text-anchor", "start")
      .text("Days Since Diagnosis")
	  .attr("transform", "translate("+ ((-width/2) - 50) +",20)");   	// Newline

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 20)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice())
    .enter().append("g")
    //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	 .attr("transform", function(d, i) { return "translate(-50," + (200 + i * 20) + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("font-size", 20)
      .text(function(d) { return d; });
});
}

initMap();
//initBarGraph();
