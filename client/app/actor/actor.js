'use strict';

angular.module('castifiApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('actor', {
        url: '/actor',
        templateUrl: 'app/actor/actor.html',
        controller: 'ActorCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(User){
            return User.get().$promise;
          }
        }
      })
      //BASIC ACTOR PROFILE VIEW
        .state('profile', {
        url: '/profile',
        templateUrl: 'app/actor/actor-profile.html',
        controller: 'ActorProfileCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(User){
            return User.get().$promise;
          }
        }
      })
      //EDIT NESTED VIEW WITH ACTOR NAVBAR
        .state('actor.basic', {
        url: '/basic',
        templateUrl: 'app/actor/actor-basic.html',
        controller: 'ActorBasicCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })  
      //EDIT NESTED VIEW WITH ACTOR NAVBAR
        .state('actor.edit', {
        url: '/edit',
        templateUrl: 'app/actor/actor-edit.html',
        controller: 'ActorCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })
       //OVERVIEW EDIT
        .state('actor.edit.overview', {
        url: '/overview',
        templateUrl: 'app/actor/actor-edit-overview.html',
        controller: 'ActorCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })
      //PHOTOS EDIT
        .state('actor.edit.photos', {
        url: '/photos',
        templateUrl: 'app/actor/actor-edit-photos.html',
        controller: 'ActorUploadCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })
       //PHYSICAL APPEARANCE EDIT
       .state('actor.edit.physical', {
        url: '/physical',
        templateUrl: 'app/actor/actor-edit-physical.html',
        controller: 'ActorCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })
      //WARDROBE EDIT
       .state('actor.edit.wardrobe', {
        url: '/wardrobe',
        templateUrl: 'app/actor/actor-edit-wardrobe.html',
        controller: 'ActorCtrl',
        authenticate: true,
        resolve:{
          currentUser: function(currentUser){
            return currentUser;
          }
        }
      })
       //WELCOME
       .state('welcome', {
        url: '/welcome',
        templateUrl: 'app/actor/actor-welcome.html',
        authenticate: true
      })
      //CONFIRMATION
      .state('confirmation', {
        url: '/confirmation',
        templateUrl: 'app/actor/actor-confirmation.html',
        authenticate: true,
      });


      $urlRouterProvider.otherwise('/profile');

  });
