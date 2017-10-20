'use strict';

function dropzone() {

    return function(scope, element, attrs) {

        var config = {
            url: 'http://localhost:5000/upload',
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 10,
            parallelUploads: 1,
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
                alert(response)
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

        var xScale, yScale, xAxisGen, yAxisGen, width, height;

        /*
        scope.$watchCollection(exp, function(newVal, oldVal)){
          salesDataToPlot = newVal;
          redrawLineChart();
        }) */

        function setChartParameters() {
          var w = rawSvg.attr("width");
          var h = rawSvg.attr("height");
          var margin = {top: 20, right: 30, bottom: 40, left: 30};
          width = w - margin.left - margin.right;
          height = h - margin.top - margin.bottom;

          xScale = d3.scale.linear().range([padding + 5, width - padding]);
          yScale = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);

          xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
          yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize(0)
            .tickPadding(6);

          xScale.domain(d3.extent(salesDataToPlot, function(d) { return d.value; })).nice();
          yScale.domain(salesDataToPlot.map(function(d) { return d.name; }));

        }

        function drawLineChart() {
          setChartParameters();

          svg.selectAll(".bar")
            .data(salesDataToPlot)
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return xScale(Math.min(0, d.value)); })
            .attr("y", function(d) { return yScale(d.name); })
            .attr("width", function(d) { return Math.abs(xScale(d.value) - xScale(0)); })
            .attr("height", yScale.rangeBand());

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisGen);

          svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + xScale(0) + ",0)")
            .call(yAxisGen);
        }

        drawLineChart();

      }
    }
});

angular.module('owlDemoApp')
  .directive('dropzone', dropzone)
