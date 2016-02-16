'use strict';

angular.module('castifiApp')
  .controller('AdminActorsEditCtrl', function(  $scope, $http, socket, Auth, User, $state,
    Actor, Upload, $timeout, $rootScope, $stateParams) {

   $scope.actor = Actor.get({id: $stateParams.id});
   $scope.errMsg = null;
   $scope.dynamic = 0; 
  
   $scope.minAgeOptions = _.range(12, 61);
   $scope.maxAgeOptions = _.range(18, 101);
   $scope.heightFeetOptions = _.range(0, 8);
   $scope.heightInchesOptions = _.range(0, 12);
   $scope.weightOptions = _.range(60, 301);



   $scope.register = function register(form) {
       $scope.submitted = true;
            if($scope.actor){
                Actor.update({id: $scope.actor._id }, $scope.actor,
                      function success(){
                        $state.go('admin.actors.detail', {id: $scope.actor._id})
                    }),
                    function error(){
                      $state.go('admin.actors.edit', {id: $scope.actor._id})
                    }

             }
    };


     $scope.uniqueString = function() {
                var text     = '';
                var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                for( var i=0; i < 8; i++ ) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
        };

        $scope.removePhoto = function removePhoto(type){
               if (type === 'headShot'){
                    $scope.actor.headShot = null;
                    $scope.headShot = null;
                  }
                  else if (type === 'headToToe'){
                    $scope.actor.headToToe = null;
                    $scope.headToToe = null;
                  }
                  else if (type === 'realLife'){
                    $scope.actor.realLife = null;
                    $scope.realLife = null;
                  }

                  Actor.update({id: $scope.actor._id }, $scope.actor,
                          function success(data){
                            $state.go('admin.actors.edit', {id: $scope.actor._id}, {reload:true});
                          });
          };



          $scope.uploadFiles = function(file, errFiles, type) {
                  var unique = $scope.uniqueString();

                  if(file){
                    if (type === 'headShot'){
                      $scope.actor.headShot = 'https://s3-us-west-1.amazonaws.com/actortest/' + unique + file.name;
                       $scope.headShow = true;
                    }
                    else if (type === 'headToToe'){
                      $scope.actor.headToToe = 'https://s3-us-west-1.amazonaws.com/actortest/' + unique + file.name;
                         $scope.toeShow = true;
                    }
                    else if (type === 'realLife'){
                      $scope.actor.realLife = 'https://s3-us-west-1.amazonaws.com/actortest/' + unique + file.name;
                      $scope.realShow = true;
                    }
                  }

                  $scope.f = file;
                  $scope.errFile = errFiles && errFiles[0];
                  if(errFiles.length >0){
                    if (type === 'headShot'){
                      $scope.headShow = true;
                    }
                    else if (type === 'headToToe'){
                      $scope.toeShow = true;
                    }
                    else if (type === 'realLife'){
                      $scope.realShow = true;
                    }
                    $scope.errMsg = 'Sorry, your file is over 2MB.'
                  }
                  else{

                    $scope.errMsg = null;
                  }
                  //if there are no errors
                  if (file) {
                      file.upload = Upload.upload({
                          url: 'api/actors/uploads',
                          data: {file: file, 'unique': unique}
                      });

                      file.upload.then(function (response) {
                          $timeout(function () {
                              file.result = response.data;
                          });
                      }, function (response) {
                          if (response.status > 0){
                              $scope.errorMsg = response.status + ': ' + response.data;
                          }
                      }, function (evt) {
                          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                          $scope.dynamic = file.progress;
                      });
                  }


                  if(file){
                    Actor.update({id: $scope.actor._id }, $scope.actor)
                  }
              }

});