'use strict';

angular.module('castifiApp')
  .factory('Actor', function ($resource) {
     return $resource('api/actors/:id', { id: '@_id' },
           {
              update: {
                  method: 'PUT'
              },

             //  get: {
             //      isArray: true,
             //      method: 'GET'
             //  },

             // query: {
             //      isArray: true,
             //      method: 'GET'
             // }
   });
});
