'use strict';

function dropzone() {
  return {
      restrict: 'EA',
      scope: {
        chartData: '='
      },
      link: function(scope, element, attrs) {

        //console.log(scope.chartData);

      /*  element.on('click', function() {
          scope.$emit('cliked-from-directive', {a:10})
        }); */

        var config = {
            url: 'http://localhost:5000/upload',
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 10,
            parallelUploads: 1,
            thumbnailWidth: 250,
            thumbnailHeight: 250,
            autoProcessQueue: true
        };

        var eventHandlers = {
            'addedfile': function(file) {
                scope.file = file;
                if (this.files[1]!=null) {
                    this.removeFile(this.files[0]);
                }
                scope.$apply(function() {
                    scope.fileAdded = true;
                });
            },

            'success': function (file, response) {
                var cls = JSON.parse(response);
                scope.chartData = cls;
                scope.$emit('cliked-from-directive', cls)
                //alert(response);
            }
        };

        var mydropzone = new Dropzone(element[0], config);

        angular.forEach(eventHandlers, function(handler, event) {
            mydropzone.on(event, handler);
        });

        scope.processDropzone = function() {
            mydropzone.processQueue();
        };

        scope.resetDropzone = function() {
            mydropzone.removeAllFiles();
        }
    }
  }
}

angular.module('owlDemoApp')
  .directive('linearChart', function($parse, $window){
    return{
      restrict:'EA',
      template:"<svg width='620' height='200'></svg>",
      link: function(scope, elem, attrs){
        var exp = $parse(attrs.chartData);
        var salesDataToPlot=exp(scope);
        var padding = 20;
        var pathClass="path";

        var d3 = $window.d3;
        var rawSvg=elem.find('svg');
        var svg = d3.select(rawSvg[0]);
        var w = rawSvg.attr("width");
        var h = rawSvg.attr("height");
        var margin = {top: 20, right: 30, bottom: 40, left: 30};
        var width  = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;
        var color  = d3.scale.category20();

        var xScale = d3.scale.linear()
          .range([padding + (width / 2), width - padding])
          .domain([0, 1.0]);
        var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
        //xScale.domain(d3.extent(salesDataToPlot, function(d) { return d.value; })).nice();

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxisGen);


        function wrap(text, width) {
          text.each(function() {
            var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", -10).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
              line.push(word);
              tspan.text(line.join(" "));
              if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                  .attr("x", 0)
                  .attr("y", y)
                  .attr("dy", ++lineNumber * lineHeight + dy + "em")
                  .text(word);
              }
            }
          });
        }

        function drawLineChart() {
          svg.selectAll("*").remove();
          salesDataToPlot.sort((a, b) => b.prop - a.prop);

          var yScale = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);
          yScale.domain(salesDataToPlot.map(function(d) { return d.class; }));

          var yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize(0)
            .tickPadding(6);

          svg.select(".y").remove();
          svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xScale(0) + ",0)")
            .call(yAxisGen)//;
            .selectAll(".y text")
            .call(wrap, (width / 2));


          var bars = svg.selectAll(".bar").data(salesDataToPlot);

          bars
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.prop < 0 ? "negative" : "positive"); }); // Do NOT connect this part to the next. VERY IMPORTANT!!!

          bars
            .attr("x", function(d) { return xScale(Math.min(0, d.prop)); })
            .attr("y", function(d) { return yScale(d.class); })
            .attr("width", function(d) { return Math.abs(xScale(d.prop) - xScale(0)); })
            .attr('fill', function(d) { return color(d.prop); })
            .attr("height", yScale.rangeBand());


          bars
            .enter()
            .append("text")
            .attr("fill", "#fff")
            .attr("y", function(d, i) {return i * 26 + 25;})
            .attr("x", function(d) { return xScale(d.prop) + 20; })
            .text(function(d){return (d.prop * 100).toFixed(1) + '%';});
        }

        scope.$watchCollection(exp, function(newVal, oldVal){
          //alert("old:", oldVal);
          salesDataToPlot = newVal;
          //console.log('fuck', salesDataToPlot);
          //svg.selectAll('*').remove();
          drawLineChart();
        });

        drawLineChart();
      }
    }
});

angular.module('owlDemoApp')
  .directive('dropzone', dropzone)
