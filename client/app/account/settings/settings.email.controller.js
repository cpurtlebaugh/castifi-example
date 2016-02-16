'use strict';

angular.module('castifiApp')
  .controller('SettingsEmailCtrl', function ($scope, User, Auth, Actor) {
    $scope.errors = {};
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.user = $scope.getCurrentUser();
    $scope.user.newEmail = '';

    $scope.changeEmail = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        User.update({id: $scope.user._id}, {email: $scope.user.newEmail},
          function success(data){
             $scope.emailMessage = 'Email successfully changed.';
             $scope.user.oldEmail = '';
             $scope.user.newEmail = '';
          });

        Actor.update({id: $scope.user.actorId._id }, {email: $scope.user.newEmail});
      }
      else {
          form.newEmail.$setValidity('mongoose', false);
          $scope.errors.other = 'Please provide a valid email format.';
          $scope.emailMessage = '';
        }
    };


});
