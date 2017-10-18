'use strict';

/**
 * @ngdoc function
 * @name owlDemoApp.controller:MainCtrl
 * @description
 * # fileCtrl
 * Controller of the owlDemoApp
 */


 function fileCtrl ($scope) {
     $scope.partialDownloadLink = 'http://localhost:8080/download?filename=';
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
}]);
