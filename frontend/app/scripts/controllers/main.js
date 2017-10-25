'use strict';

/**
 * @ngdoc function
 * @name owlDemoApp.controller:FileCtrl
 * @description
 * # fileCtrl
 * Controller of the owlDemoApp
 */


 function fileCtrl ($scope) {
     $scope.partialDownloadLink = 'http://localhost:5000/download?filename=';
     $scope.filename = '';

     $scope.uploadFile = function() {
         $scope.processDropzone();
     };

     $scope.reset = function() {
         $scope.resetDropzone();
     };
 }

angular.module('owlDemoApp')
   .controller('fileCtrl', fileCtrl);

angular.module('owlDemoApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

angular.module('owlDemoApp')
  .controller('SalesController', ['$scope', '$interval', '$http', function($scope, $interval, $http){
    $scope.salesData= [];
    $scope.processed = 0;

    $http.get('http://localhost:5000/counter')
      .then(
        function (data) {
          $scope.processed = data.data;
        },

        function (error){}
      );

    /*
    $scope.$watch('salesData', function() {
        alert('hey, myVar has changed!');
    })
    */


    $scope.$on('cliked-from-directive', function(event, data){
        //console.log("from controller:", data);
        // $scope.salesData = data; --> the source of lag
        $scope.$apply(function() {
          $scope.salesData = data[1];
          $scope.processed = data[0];
        });
    })

    /*
    $interval(function() {
      $scope.salesData.splice(Math.floor(Math.random() *  $scope.salesData.length), 1);
      $scope.salesData.push({
        name: Math.random()
          .toString(36)
          .substring(7),
        value: Math.random()
      });

    }, 1000); */
}]);
