
function scatter() {

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

const scatter_annotations = [
  {     
      note: {
          label: "hiljkkldfcl;a."          
      },
      x: 0,
      y: 0,
      dy: 0,
      dx: 130
  }];

const makeAnnotations = d3.annotation()
  .type(d3.annotationLabel)
  .annotations(scatter_annotations);

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

var x = d3.scale.linear()
.range([0, width-70]);

var y = d3.scale.linear()
.range([height, 0]);

var r = d3.scale.linear()
.range([0.5,1.5]);

var color = d3.scale.category10();

var axisNames = { 
                Rank: 'Rank', 
                Score: 'Score', 
                GDP: 'GDP', 
                Life: 'Life Expectancy',
                Govt: 'Government Trust',
                Family: 'Family',
                Freedom: 'Freedom',
                Generosity: 'Generosity'
            };

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left");


var svg = d3.select("#viz").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/2017.csv", function(error, data) {
data.forEach(function(d) {
d.Rank = +d.Rank;
d.Score = +d.Score;
d.GDP = +d.GDP;
d.Life = +d.Life;
d.Family = +d.Family;
d.Freedom = +d.Freedom;
d.Govt = +d.Govt;
d.Generosity = +d.Generosity;
d.Dystopia = +d.Dystopia;
});

x.domain(d3.extent(data, function(d) { return d.Score; })).nice();
y.domain(d3.extent(data, function(d) { return d.GDP; })).nice();

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Score");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("GDP")


var f = d3.format(".2f"); 
var circles = svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", function(d) { return r(d.Score); })
  .attr("cx", function(d) { return x(d.Score); })
  .attr("cy", function(d) { return y(d.GDP); })
  .style("fill", function(d) { return color(d.Region); }) 
  .on("mouseover", function(d) {
    tooltip.transition()
         .duration(200)
         .style("opacity", .9);
    tooltip.html("Country Score : " + f(d.Score) + "<br>" + "Country : " +  d.Country)
         .style("left", (d3.event.pageX + 5) + "px")
         .style("top", (d3.event.pageY - 28) + "px");})
  .on("mouseout", function(d) {
    tooltip.transition()
         .duration(500)
         .style("opacity", 0);});


var legend = svg.selectAll(".legend")
  .data(color.domain())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


legend.append("rect")
  .attr("x", width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);


  legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d; });


d3.selectAll("[name=v]").on("change", function() {
  var selected = this.value;
  display = this.checked ? "inline" : "none";


  svg.selectAll(".dot")
  .filter(function(d) {return selected == d.species;})
  .attr("display", display)
  .call(makeAnnotations);
  });


d3.selectAll("[name=sepal]").on("change", function(d) {
 radius = this.value;

 svg.selectAll(".dot")
 console.log(radius);
 circles.attr("r", function(d) { return d[radius]; });
});



d3.select("[name=xAX]").on("change", function(){
xAxy = this.value;
console.log(xAxy)
x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();

svg.select(".x.axis").transition().call(xAxis);

svg.selectAll(".dot").transition().attr("cx", function(d) { 
    return x(d[xAxy]);
});
svg.selectAll(".x.axis").selectAll("text.label").text(axisNames[xAxy]);
});

d3.select("[name=yAX]").on("change", function(){
yAxy = this.value;
console.log(yAxy)
y.domain(d3.extent(data, function(d) { return d[yAxy]; })).nice();
svg.select(".y.axis").transition().call(yAxis);
svg.selectAll(".dot").transition().attr("cy", function(d) { 
    return y(d[yAxy]);
});
svg.selectAll(".y.axis").selectAll("text.label").text(axisNames[yAxy]);
});

});

}

scatter();