'use strict';

angular.module('castifiApp')
  .controller('ActorCtrl', function ($scope, Auth, User, $state,
    Actor, currentUser) {

       $scope.user = currentUser;
       $scope.actor = $scope.user.actorId;
       $scope.onlyNumbers = /^[0-9]+$/;
       $scope.minAgeOptions = _.range(12, 61);
       $scope.maxAgeOptions = _.range(18, 101);
       $scope.heightFeetOptions = _.range(0, 8);
       $scope.heightInchesOptions = _.range(0, 12);
       $scope.weightOptions = _.range(60, 301);
       $scope.title = 'hellow guys';

       $scope.options= {
         country: 'usa',
         type: 'establishment'
      };


      $scope.details;
      $scope.$watch('details', function(valueNew, valueOld){
        if(valueNew !== undefined){
            var fullAddress   = valueNew.formatted_address;
            var addressArray  = fullAddress.split(',');
            var stateAndZip   = addressArray[addressArray.length - 2].split(' ');
            
            $scope.actor.contact.address       = addressArray[0];
            $scope.actor.contact.city          = addressArray[1];
            $scope.actor.contact.state         = stateAndZip[1];
            $scope.actor.contact.zipCode       = stateAndZip[2];
            $scope.actor.contact.country       = addressArray[addressArray.length - 1]
            console.log(valueNew.formatted_address)
        }
      }, true);

       $scope.open = function($event) {
           $event.preventDefault();
           $event.stopPropagation();

            $scope.opened = true;
      };

         $scope.register = function register(form) {
               $scope.submitted = true;
               if(form.$valid){
                    if($scope.actor){
                          Actor.update({id: $scope.actor._id }, $scope.actor,
                                function success(){
                                   if($state.is('actor.basic')){ $state.go('confirmation')}
                                   if($state.is('actor.edit.overview')){ $state.go('actor.edit.photos')}
                                   if($state.is('actor.edit.photos')){ $state.go('actor.edit.physical')}
                                   if($state.is('actor.edit.physical')){ $state.go('actor.edit.wardrobe')}
                                   if($state.is('actor.edit.wardrobe')){ $state.go('profile')}
                              }),
                              function error(){
                                $state.go('actor.edit.overview')
                              }

                       }


                }
                else{
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
            };

  });
