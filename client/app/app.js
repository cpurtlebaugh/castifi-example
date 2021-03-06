'use strict';

angular.module('castifiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ngFileUpload',
  'ngImgCrop',
  'validation.match',
  'ngAutocomplete',
  'smart-table',
  'ui.mask'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })


  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        // if(response.status === 403){
        //   $location.path('/profile');
        // }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth, $state) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;

      Auth.isLoggedInAsync(function(loggedIn) {
        var admin = Auth.isAdmin();

        if(!admin && next.adminProtected && loggedIn){
            event.preventDefault();
           $location.path('/profile');
        }
        if(next.loginPrevent && loggedIn){
           event.preventDefault();
           $location.path('/profile');
        }
        if (next.authenticate && !loggedIn) {
          // event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
