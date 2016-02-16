'use strict';

angular.module('castifiApp')
  .controller('ActorBasicCtrl', function ($scope, Auth, User, $state,
    Actor, currentUser, Upload, $timeout, $http, $rootScope) {

       $scope.user = currentUser;
       $scope.actor = $scope.user.actorId;
       $scope.minAgeOptions = _.range(12, 61);
       $scope.maxAgeOptions = _.range(18, 101);
       $scope.errMsg = null;
       $scope.dynamic = 0;
       $scope.photoErr = null;

       $scope.pickGender = function(value){
          console.log(value)
          // $event.stopPropagation;
          // $event.preventDefault;
       }

         $scope.register = function register(form) {
               $scope.submitted = true;
                if($scope.actor.headShot){
                  if(form.$valid){
                      if($scope.actor){
                            Actor.update({id: $scope.actor._id }, $scope.actor,
                              function success(){
                                 if($state.is('actor.basic')){ $state.go('confirmation')}

                                }),
                                function error(){
                                  $state.go('actor.basic')
                                }

                         }
                  }
                  else{
                      document.body.scrollTop = document.documentElement.scrollTop = 0;
                  }
                }
                else{
                   $scope.photoErr = 'A headshot is required'
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
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
                  Actor.update({id: $scope.actor._id }, $scope.actor,
                      function success(data){
                        $state.go('actor.basic',{reload:true});
                  });
          };


          $scope.uploadFiles = function(file, errFiles, type) {
                  var unique = $scope.uniqueString();
                  if(file){
                    if (type === 'headShot'){
                      $scope.actor.headShot = 'https://s3-us-west-1.amazonaws.com/actortest/' + unique + file.name;
                      $scope.photoErr = null;
                    }
                  }

                  $scope.f = file;
                  $scope.errFile = errFiles && errFiles[0];
                  if(errFiles.length >0){
                    if (type === 'headShot'){
                      // $scope.headShow = true;
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
