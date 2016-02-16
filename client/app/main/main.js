'use strict';

angular.module('castifiApp')
  .config(function ($stateProvider,  $urlRouterProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('vip', {
        url: '/vip11',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        onEnter: function($state){
           $state.go('main')
        }
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/main/contact.html',
        controller: 'MainCtrl'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/main/about.html',
        controller: 'MainCtrl'
      });

       $urlRouterProvider.otherwise('/');
  });
