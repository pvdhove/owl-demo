'use strict';


function dropzone() {

  return {
    restrict: 'A',
    //scope: {
    //  products: '=',
    //},
    link: function(scope, element, attrs) {
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
              var cls = response['srcElement']['response'];
              //console.log("directive's controller: " + JSON.stringify(scope.products));
              scope.$apply(function(){
                scope.classification = cls;
                //scope[attrs.ngModel] = cls //element.val();
              });
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
  };
}


/*

function dropzone() {


  return function(scope, element, attrs, $rootScope) {
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

            'success': function ($rootScope, file, response) {
              var cls = response['srcElement']['response'];
              scope.products = cls;
              //console.log("directive's controller: " + JSON.stringify(scope.products));
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
*/

angular.module('owlDemoApp')
  .directive('linearChart', function($window){
   return{
      restrict:'A',
      template:"<svg width='620' height='200'></svg>",
       link: function(scope, elem, attrs){

           console.log(scope);

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
     }

   };
});

angular.module('owlDemoApp')
  .directive('dropzone', ['$rootScope', dropzone])
