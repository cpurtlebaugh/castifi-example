'use strict';

angular.module('castifiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true,
        adminProtected: true,
         resolve:{
          actorModel: function(Actor){
            return Actor.query().$promise;
          },
          userModel: function(User){
            return User.query().$promise;
          }
        }
      })
      .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/admin/admin-dashboard.html',
        controller: 'AdminCtrl',
        authenticate: true,
        adminProtected: true,
         resolve:{
          actorModel: function(actorModel){
            return actorModel;
          },
          userModel: function(userModel){
            return userModel;
          }
        }
      })
      .state('admin.users', {
        url: '/users',
        templateUrl: 'app/admin/admin-users.html',
        controller: 'AdminCtrl',
        authenticate: true,
        adminProtected: true
      })
      .state('admin.actors', {
        url: '/actors',
        templateUrl: 'app/admin/admin-actor/admin-actors.html',
        controller: 'AdminActorsCtrl',
        authenticate: true,
        adminProtected: true,
        resolve:{
          actorModel: function(actorModel){
            return actorModel;
          },
          userModel: function(userModel){
            return userModel;
          }
        }
      })
      .state('admin.actors.list', {
        url: '/list',
        templateUrl: 'app/admin/admin-actor/admin-actors-list.html',
        controller: 'AdminActorsCtrl',
        authenticate: true,
        adminProtected: true,
        resolve:{
          actorModel: function(actorModel){
            return actorModel;
          },
          userModel: function(userModel){
            return userModel;
          }
        }
      })
      .state('admin.table', {
        url: '/table',
        templateUrl: 'app/admin/admin-actor/admin-actors-table.html',
        controller: 'AdminActorsCtrl',
        authenticate: true,
        adminProtected: true,
        resolve:{
          actorModel: function(actorModel){
            return actorModel;
          },
          userModel: function(userModel){
            return userModel;
          }
        }
      })
      .state('admin.actors.detail', {
        url: '/:id',
        templateUrl: 'app/admin/admin-actor/admin-actors-detail.html',
        controller: 'AdminActorsDetailCtrl',
        authenticate: true,
        adminProtected: true
      })
      .state('admin.actors.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/admin-actor/admin-actors-edit.html',
        controller: 'AdminActorsEditCtrl',
        authenticate: true,
        adminProtected: true
      })
       .state('admin.actors.photos', {
        url: '/:id/photos',
        templateUrl: 'app/admin/admin-actor/admin-actors-photos.html',
        controller: 'AdminActorsPhotosCtrl',
        authenticate: true,
        adminProtected: true
      });

  });
