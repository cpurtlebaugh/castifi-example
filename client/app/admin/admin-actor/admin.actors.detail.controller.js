'use strict';

angular.module('castifiApp')
  .controller('AdminActorsDetailCtrl', function ($scope, $stateParams, Actor) {

    $scope.actor = Actor.get({id: $stateParams.id})

});
