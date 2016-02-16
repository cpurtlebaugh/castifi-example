'use strict';

angular.module('castifiApp')

	.filter('capitalize', function() {
         return function(input, scope) {
            if(input === null || input === undefined){
               return '';
            }
            input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
         }
	})

   .filter('strictFilter', function($filter){
          return function(input, predicate){
              return $filter('filter')(input, predicate, true);
          }
   })

   .filter('customFilter', ['$filter', function ($filter) {
            var filterFilter = $filter('filter');
            var standardComparator = function standardComparator(obj, text) {
                text = ('' + text).toLowerCase();
                return ('' + obj).toLowerCase().indexOf(text) > -1;
            };

            return function customFilter(array, expression) {
                function customComparator(actual, expected) {

                    var isBeforeActivated = expected.before;
                    var isAfterActivated = expected.after;
                    var isLower = expected.lower;
                    var isHigher = expected.higher;
                    var higherLimit;
                    var lowerLimit;
                    var itemDate;
                    var queryDate;


                    if (angular.isObject(expected)) {

                        //date range
                        if (expected.before || expected.after) {
                            try {
                                if (isBeforeActivated) {
                                    higherLimit = expected.before;

                                    itemDate = new Date(actual);
                                    queryDate = new Date(higherLimit);

                                    if (itemDate > queryDate) {
                                        return false;
                                    }
                                }

                                if (isAfterActivated) {
                                    lowerLimit = expected.after;


                                    itemDate = new Date(actual);
                                    queryDate = new Date(lowerLimit);

                                    if (itemDate < queryDate) {
                                        return false;
                                    }
                                }

                                return true;
                            } catch (e) {
                                return false;
                            }

                        } else if (isLower || isHigher) {
                            //number range
                            if (isLower) {
                                higherLimit = expected.lower;

                                if (actual > higherLimit) {
                                    return false;
                                }
                            }

                            if (isHigher) {
                                lowerLimit = expected.higher;
                                if (actual < lowerLimit) {
                                    return false;
                                }
                            }

                            return true;
                        }
                        //etc

                        return true;

                    }
                    return standardComparator(actual, expected);
                }

                var output = filterFilter(array, expression, customComparator);
                return output;
            }
         }])

	.filter('tel', function () {
         return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
               return tel;
            }

            var country, city, number;

            switch (value.length) {
               case 10: // +1PPP####### -> C (PPP) ###-####
                  country = 1;
                  city = value.slice(0, 3);
                  number = value.slice(3);
                  break;

               case 11: // +CPPP####### -> CCC (PP) ###-####
                  country = value[0];
                  city = value.slice(1, 4);
                  number = value.slice(4);
                  break;

               case 12: // +CCCPP####### -> CCC (PP) ###-####
                  country = value.slice(0, 3);
                  city = value.slice(3, 5);
                  number = value.slice(5);
                  break;

               default:
                  return tel;
            }

            if (country == 1) {
               country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
         };
      });
