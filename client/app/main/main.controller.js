'use strict';

angular.module('castifiApp')
  .controller('MainCtrl', function ($scope, $location, $anchorScroll) {
      $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
      $location.hash(null);
   }

   $scope.title = 'hellow guys';
 });
