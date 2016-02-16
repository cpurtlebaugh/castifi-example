'use strict';

angular.module('castifiApp')
  .controller('ActorUploadCtrl', function ($scope, $http, socket, Auth, User, $state,
    Actor, Upload, $timeout, currentUser, $rootScope) {

       $scope.user = currentUser;
       $scope.actor = $scope.user.actorId;
       $scope.errMsg = null;
       $scope.dynamic = 0;

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
                            $state.go('actor.edit.photos',{reload:true});
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
                    $scope.errMsg = 'Sorry, your file is over 4MB.'
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
