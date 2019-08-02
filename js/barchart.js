
function toggle() {
    console.log("hi");
    var b = document.getElementById("btn");
    var x = document.getElementById("vizbar");
    var y = document.getElementById("vizbar1");
    if(x.style.display == "block")
    {        
        console.log("hi");
        document.getElementById("btn").innerHTML = "Happiness";
        x.style.display ="none";
        y.style.display ="block";
    }
    else
    {
        console.log("hi1");
        document.getElementById("btn").innerHTML = "Detailed Contributors";
        y.style.display ="none";
        x.style.display="block";
    }    
}
var color = d3.scaleOrdinal()
    .domain(["Asia","Africa","Australia","NorthAmerica","SouthAmerica","Europe"])
    .range(["rgb(256,146,146)","rgb(174,18,56)", "rgb(4,95,4)","rgb(121,199,121)","rgb(63,198,63)","rgb(63,198,63)"]);

var svg = d3.select('#vizbar').append('svg').attr("width","1024").attr("height","600");

var margin = 80;
var width = 1000 - 2 * margin;
var height = 600 - 2 * margin;

var chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

d3.csv("data/BarChart.csv", function(error, data) {

    var xScale = d3.scaleBand()
        .range([0, width])
        .domain(data.map((s) => s.Region))
        .padding(0.2)

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([1, 7]);


    var makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    chart.append('g')
        .call(d3.axisLeft(yScale));


    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        );

    var barGroups = chart.selectAll()
        .data(data)
        .enter()
        .append('g');
    
    barGroups
        .append('rect')
        .attr('class', 'bar')
        .style('fill',function(d) { return color(d.Region); })        
        .attr('x', (g) => xScale(g.Region))
        .attr('y', (g) => yScale(g.Score))
        .attr('height', (g) => height - yScale(g.Score))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
            d3.selectAll('.value')
                .attr('opacity', 0);

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .attr('x', (a) => xScale(a.Region) - 5)
                .attr('width', xScale.bandwidth() + 10);

            var y = yScale(actual.Score);

            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => xScale(a.Region) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(a.Score) + 30)
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                .text((a, idx) => {
                    var divergence = (a.Score - actual.Score).toFixed(1)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}%`

                    return idx !== i ? text : '';
                })

        })
        .on('mouseleave', function () {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .attr('x', (a) => xScale(a.Region))
                .attr('width', xScale.bandwidth())

            chart.selectAll('#limit').remove()
            chart.selectAll('.divergence').remove()
        })

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.Region) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.Score) + 30)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.Score}%`)
});

svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Happiness Score')

svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    .text('Continents')

svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Happiness Score of Continents')
