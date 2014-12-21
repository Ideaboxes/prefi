var width = 960, height = 500;
var color = d3.scale.category20();
var force = d3.layout.force()
  .charge(-120)
  .linkDistance(30)
  .size([width, height]);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

window.render = function(nodes, links){
  force
    .nodes(nodes)
    .links(links)
    .start();

  var svgLink = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 1);
  var svgNode = svg.selectAll(".ndoe")
    .data(nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", color(1))
      .call(force.drag);
  svgNode.append("title")
    .text(function(d){ return d.name; });

  force.on("tick", function() {
    svgLink.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    svgNode.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
}