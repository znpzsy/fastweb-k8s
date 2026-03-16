(function () {
    'use strict';

    /* Directives */
    angular.module('ccportal.services.personalizedsms.directives', []);

    var PersonalizedSMSDirectives = angular.module('ccportal.services.personalizedsms.directives');

    PersonalizedSMSDirectives.directive("shortCodeRangeCheck", function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                var rangeValidator = function (value) {
                    var values;
                    if (value) {
                        values = value.split('-');
                    }

                    if (values && values.length > 1) {
                        var left = values[0];
                        var right = values[1];

                        if (Number(left) >= Number(right) || left.length !== right.length) {
                            ctrl.$setValidity('shortCodeRangeCheck', false);
                        } else {
                            ctrl.$setValidity('shortCodeRangeCheck', true);
                        }
                    }

                    return value;
                };

                ctrl.$parsers.push(rangeValidator);
                ctrl.$formatters.push(rangeValidator);
            }
        };
    });

})();
