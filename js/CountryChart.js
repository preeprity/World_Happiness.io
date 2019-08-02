
var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip d3-tip.e')
            .offset([20, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Happiness Score: </strong><span class='details'>" + format(d.population) +"</span>" + "<br></span>" + "<strong>Happiness Rank: </strong><span class='details'>" + format(d.rank) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,NaN])
    .range(["rgb(174,18,56)", "rgb(206,58,13)", "rgb(236,106,106)", "rgb(256,146,146)", "rgb(250,206,206)", "rgb(204,255,204)","rgb(121,199,121)","rgb(63,198,63)","rgb(23,154,23)","rgb(7,118,7)","rgb(4,95,4)"]);

    
var ext_color_domain = [3,3.5,4,4.5,5,5.5,6,6.5,7,7.5];
//var legend_labels = ["< 3", "3 - 3.5", "3.5 - 4", "4 - 4.5", "4.5 - 5", " 5 - 5.5", " 5.5 - 6" ,"6 - 6.5"," 6.5 - 7 ", " 7 - 7.5"];
var legend_labels = ["Low Happiness","","","","","","","","","High happiness"];
var path = d3.geoPath();

var svg = d3.select("#viz")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geoPath().projection(projection);

svg.call(tip);

d3.queue()
    .defer(d3.json, "./data/world_countries.json")
    .defer(d3.csv, "./data/world_happiness.csv")
    .await(ready);

function ready(error, data, population) {
  var populationById = {};
  var rank = {};

  population.forEach(function(d) { populationById[d.name] = +d.Happiness; rank[d.name] = +d.rank });
  data.features.forEach(function(d) { d.population = populationById[d.properties.name] ; d.rank = rank[d.properties.name]});
  console.log(color(populationById["Canada"]));
  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(populationById[d.properties.name]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);
          console.log(d);
               

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          
          
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);

  var legend = svg.selectAll("g.legend")
  .data(ext_color_domain)
  .enter().append("g")
  .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

  legend.append("rect")
  .attr("x", 20)
  .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", 50)
  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });

}
