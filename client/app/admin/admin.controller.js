'use strict';

angular.module('castifiApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Actor, $window, $filter, actorModel, userModel) {

    // Use the User $resource to fetch all users
    $scope.users = userModel;
    $scope.actors = actorModel;
    var averageProfile = 0;

    $scope.facebookSignups = $filter('filter')(userModel, {facebookSignup: false})
    $scope.emailSignups = ($filter('filter')(userModel, {facebookSignup: undefined}));
    $scope.maleCount = $filter('filter')(actorModel, {gender: "male"})
    $scope.femaleCount = $filter('filter')(actorModel, {gender: "female"})
    $scope.neutralCount = $filter('filter')(actorModel, {gender: "neutral"})
    $scope.unionCount = $filter('filter')(actorModel, {info :{union: true}})
    $scope.nonUnionCount = $filter('filter')(actorModel, {info :{union: false}})
    $scope.sagEligibleCount = $filter('filter')(actorModel, {info :{sagEligible: false}})

    angular.forEach( $scope.actors, function(value){
      averageProfile += value.profileMetrics.profileComplete
      return averageProfile
    })

    $scope.averageProfile = Math.floor(averageProfile / $scope.actors.length)

    $scope.delete = function(user) {
      var confirm = $window.confirm("Are you sure you want to permanently delete " + user.email + " ?")

      if(confirm){
        Actor.remove({ id: user.actorId});
        User.remove({ id: user._id });
        angular.forEach($scope.users, function(u, i) {
          if (u === user) {
            $scope.users.splice(i, 1);
          }
        });
      }
    };


  });
