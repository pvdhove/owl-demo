'use strict';

function dropzone() {
  return {
      restrict: 'EA',
      scope: {
        chartData: '='
      },
      link: function(scope, element, attrs) {

        console.log(scope.chartData);

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
                //var exp = $parse(attrs.chartData);
                //console.log(exp);
                //var salesDataToPlot=exp(scope);
                // console.log(salesDataToPlot);
                var cls = JSON.parse(response);
                //scope.chartData.push(cls);
                scope.chartData = cls;
                alert(response);
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
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;

        var xScale = d3.scale.linear()
          .range([padding + 5, width - padding])
          .domain([0, 1.0]);
        var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom");
        //xScale.domain(d3.extent(salesDataToPlot, function(d) { return d.value; })).nice();

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxisGen);

        function drawLineChart() {

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
            .call(yAxisGen);

          var bars = svg.selectAll(".bar").data(salesDataToPlot);

          bars
            .enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.prop < 0 ? "negative" : "positive"); }); // Do NOT connect this part to the next. VERY IMPORTANT!!!

          bars
            .attr("x", function(d) { return xScale(Math.min(0, d.prop)); })
            .attr("y", function(d) { return yScale(d.class); })
            .attr("width", function(d) { return Math.abs(xScale(d.prop) - xScale(0)); })
            .attr("height", yScale.rangeBand());
          //bars.exit().remove();
        }

        scope.$watchCollection(exp, function(newVal, oldVal){
          salesDataToPlot = newVal;
          console.log('fuck', salesDataToPlot);
          drawLineChart();
        });

        drawLineChart();

      }
    }
});

angular.module('owlDemoApp')
  .directive('dropzone', dropzone)
