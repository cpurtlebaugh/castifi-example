// 'use strict';

// describe('Controller: ActorCtrl', function () {

// var ActorCtrl, scope, $httpBackend, User, Actor, currentUser;
// var mockUsersSvc = {}
//   // load the controller's module
//   beforeEach(module('castifiApp'));


//   beforeEach(inject(function ($q) {
//     mockUsersSvc.get = function () {
//       var deferred = $q.defer()
//       deferred.resolve([
//         {email: 'bobby@bobby.com'}
//       ])
//       return deferred.promise
//     }
//     mockUsersSvc.create = function () {
//       var deferred = $q.defer()
//       deferred.resolve()
//       return deferred.promise
//     }
//   }))



//   // Initialize the controller and a mock scope
//   beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
//     scope = $rootScope.$new();
//     User = mockUsersSvc;
//     currentUser = mockUsersSvc.get();
//     // Actor = Actor;

  

//     ActorCtrl = $controller('ActorCtrl', {
//       User: mockUsersSvc,
//       $scope: scope,
//       // Actor: Actor,
//       currentUser: mockUsersSvc.get()
//     });
//   }));

//   it('should return a currentUser from User service', function () {
//       scope.$digest()
//       console.log(User)
//       console.log(currentUser)
//       console.log(scope.user.$$state.value[0].email)
//       console.log(scope.user)
//       console.log(scope.actor)
//       scope.user = scope.user.$$state.value[0]
//       console.log(scope.user)
//       // jasmine.spyOn(mockUsersSvc, 'get')
//       // jasmine.spyOn
//       // expect(currentUser).toEqual({email: 'bobby@bobby.com'});
//       // expect(mockUsersSvc).to.have.been.calledWith({email: 'bobby@bobby.com'})
//        expect(scope.user).to.have.length(1)
//   });

//     // it('loads posts from the service', function () {
//     //   $scope.$digest()
//     //   expect($scope.posts).to.have.length(2)
//     // })

//   // it('should ...', function () {
//   //   expect(scope.title).toEqual('hellow guys');
//   //   console.log(currentUser)
//   //   console.log('hero')
//   //   //Actor object with some information
//   //   //pass new information into Actor object
//   //   //it should save and update the form information

//   //   // sinon.spy(mockPostsSvc, 'create')
//   //   // $scope.postBody = 'my new post'
//   //   // $scope.addPost()
//   //   // expect(mockPostsSvc.create).to.have.been.calledWith({body: 'my new post'})
    
//   //   //jasmine.spy
//   //   //form = { newInformation: true}
//   //   //scope.register(form);
//   //   //
//   // });

