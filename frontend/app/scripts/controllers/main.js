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
  .controller('SalesController', ['$scope', function($scope){
    $scope.salesData=[
        {name: "panda", value: 0.95},
        {name: "little panda", value: 0.02},
        {name: "monkey", value: 0.015},
        {name: "tiger, india tiger", value: 0.01},
        {name: "oven", value: 0.005}
    ];

    setInterval(function() {
      $scope.salesData.splice(Math.floor(Math.random() *  $scope.salesData.length), 1);
      $scope.salesData.push({
        name: Math.random()
          .toString(36)
          .substring(7),
        value: Math.random()
      });

      }, 1000
    );

}]);
