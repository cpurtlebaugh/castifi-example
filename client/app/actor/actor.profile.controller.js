'use strict';

angular.module('castifiApp')
  .controller('ActorProfileCtrl', function ($scope, Auth, User, $state,
    Actor, currentUser) {

       $scope.user = currentUser;
       $scope.actor = $scope.user.actorId;

       if($scope.actor !== undefined){
           if($scope.actor.dob !== undefined){$scope.actor.dob = new Date($scope.actor.dob)}
           if($scope.actor.info !== undefined){$scope.actor.info.actingSince  = new Date($scope.actor.info.actingSince)}
           if($scope.actor.appearance !== undefined){$scope.actor.appearance.pregnantDueDate = new Date($scope.actor.appearance.pregnantDueDate)}
       }

      // console.log($scope.actor)
      // angular.forEach($scope.actor, function(value, key){
      //   console.log(value)
      //   console.log(value.keys().length)
      // })

  });