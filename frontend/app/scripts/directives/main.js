'use strict';

function dropzone() {

    return function(scope, element, attrs) {

        var config = {
            url: 'http://localhost:8080/upload',
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 10,
            parallelUploads: 1,
            autoProcessQueue: false
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
            }
        };

        dropzone = new Dropzone(element[0], config);

        angular.forEach(eventHandlers, function(handler, event) {
            dropzone.on(event, handler);
        });

        scope.processDropzone = function() {
            dropzone.processQueue();
        };

        scope.resetDropzone = function() {
            dropzone.removeAllFiles();
        }
    }
}

angular.module('owlDemoApp')
  .directive('linearChart', function($window){
   return{
      restrict:'EA',
      template:"<svg width='620' height='200'></svg>",
       link: function(scope, elem, attrs){
           var salesDataToPlot=scope[attrs.chartData];
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

           var x = d3.scale.linear().range([padding + 5, width - padding]);
           var y = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);

           var xAxis = d3.svg.axis().scale(x).orient("bottom");
           var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickSize(0)
              .tickPadding(6);


            x.domain(d3.extent(salesDataToPlot, function(d) { return d.value; })).nice();
            y.domain(salesDataToPlot.map(function(d) { return d.name; }));

            svg.selectAll(".bar")
                .data(salesDataToPlot)
              .enter().append("rect")
                .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
                .attr("x", function(d) { return x(Math.min(0, d.value)); })
                .attr("y", function(d) { return y(d.name); })
                .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
                .attr("height", y.rangeBand());

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + x(0) + ",0)")
                .call(yAxis);

           /* function setChartParameters(){

               xScale = d3.scale.linear()
                   .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(salesDataToPlot, function (d) {
                       return d.sales;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(salesDataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.hour);
                   })
                   .y(function (d) {
                       return yScale(d.sales);
                   })
                   .interpolate("basis");
           }

         function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           drawLineChart();
       */
     }

   };
});

angular.module('owlDemoApp')
  .directive('dropzone', dropzone)
