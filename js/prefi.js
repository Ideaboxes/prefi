(function(){

var Prefi = function() {
  var self = this;
  this.enum = {
    "friend" : 1,
    "me" : 0,
    "book" : 2,
  }
  this.width = 960, self.height = 500;
  this.color = d3.scale.category20();
  self.force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([this.width, this.height]);

  this.render = function(nodes, links){
    console.log(nodes)
    self.svg = d3.select("graph").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    self.force
      .nodes(nodes)
      .links(links)
      .start();

    var svgLink = self.svg.selectAll(".link")
      .data(links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 1);
    var svgNode = self.svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 7)
        .style("fill", function(d){ return self.color(self.enum[d.type]); })
        .call(self.force.drag);
    svgNode.append("title")
      .text(function(d){ return d.name; });

    self.force.on("tick", function() {
      svgLink.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      svgNode.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
  }
}

window.onload = function(){
  console.log("Loaded")
  if(!window.Prefi){
    window.Prefi = new Prefi();
  }
}
})();