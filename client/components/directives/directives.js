'use strict';

angular.module('castifiApp')
  .directive('file', function() {
  return {
    restrict: 'AE',
    scope: {
      file: '@'
    },
    link: function(scope, el, attrs){
      el.bind('change', function(event){
        var files = event.target.files;
        var file = files[0];
        scope.file = file;
        scope.$parent.file = file;
        scope.$apply();
      });
    }
  };
})


.directive('stNumberRange', ['$timeout', function ($timeout) {
          return {
              restrict: 'E',
              require: '^stTable',
              scope: {
                  lower: '=',
                  higher: '='
              },
              templateUrl: 'components/directives/stNumberRange.html',
              link: function (scope, element, attr, table) {
                  var inputs = element.find('input');
                  var inputLower = angular.element(inputs[0]);
                  var inputHigher = angular.element(inputs[1]);
                  var predicateName = attr.predicate;


                  [inputLower, inputHigher].forEach(function (input, index) {

                      input.bind('blur', function () {
                          var query = {};

                          if (scope.lower) {
                              query.lower = scope.lower;
                          }

                          if (scope.higher) {
                              query.higher = scope.higher;
                          }

                          scope.$apply(function () {
                              table.search(query, predicateName)
                          });
                      });
                  });
              }
          };
      }]);
