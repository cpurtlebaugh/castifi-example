'use strict';

angular.module('castifiApp')
  .controller('AdminActorsCtrl', function ($scope, $http, Auth, User, Actor, $window, $state, $filter, actorModel, userModel) {

    // Use the User $resource to fetch all users
    $scope.actors = actorModel;
    $scope.users  = userModel;

    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.displayActors = [].concat($scope.actors);
    // console.log($scope.displayActors)


    $scope.delete = function(actor) {
        var confirm = $window.confirm("Are you sure you want to permanently delete " + actor.email + " ?")

        if(confirm){
            Actor.remove({ id: actor._id });
            angular.forEach($scope.actors, function(a, i) {
              if (a === actor) {
                $scope.actors.splice(i, 1);
              }
            });
            User.remove({ id: actor.ownedBy});
        }
    }

    $scope.deactive = function(actor){
      if(actor.active === true){
        Actor.update({ id: actor._id}, {active: false}, function success(data){
          $state.reload()
        })
      }
      else {
        Actor.update({ id: actor._id}, {active: true}, function success(data){
          $state.reload()
        })
      }
    }

  });


