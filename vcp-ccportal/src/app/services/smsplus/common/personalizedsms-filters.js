(function () {
    'use strict';

    /* Filters */
    angular.module('ccportal.services.personalizedsms.filters', []);

    var PersonalizedSMSFilters = angular.module('ccportal.services.personalizedsms.filters');

    PersonalizedSMSFilters.filter('PersonalizedSMSEventIDFilter', function (PERSONALIZED_SMS_EVENT_IDS) {
        return function (typeKey) {
            var typeKey = s.toNumber(typeKey);
            var type;
            if (!_.isUndefined(typeKey)) {
                type = _.find(PERSONALIZED_SMS_EVENT_IDS, function (edrType) {
                    return (edrType.type_key === typeKey);
                });
            }

            if (type)
                return type.text;
            else
                return typeKey;
        };
    });

    PersonalizedSMSFilters.filter('PersonalizedSMSServiceTypeFilter', function (PERSONALIZED_SMS_SERVICE_TYPES) {
        return function (typeKey) {
            var typeKey = s.toNumber(typeKey);
            var type;
            if (!_.isUndefined(typeKey)) {
                type = _.find(PERSONALIZED_SMS_SERVICE_TYPES, function (edrType) {
                    return (edrType.type_key === typeKey);
                });
            }

            if (type)
                return type.text;
            else
                return typeKey;
        };
    });

})();
