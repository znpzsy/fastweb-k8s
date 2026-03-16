(function () {
    'use strict';

    /* Filters */
    angular.module('adminportal.products.antispamsms.filters', []);

    var AntiSpamSMSFilters = angular.module('adminportal.products.antispamsms.filters');

    AntiSpamSMSFilters.filter('AntiSpamSMSEDRTypeFilter', function (SMS_ANTISPAM_EDR_TYPE) {
        return function (typeKey) {
            typeKey = s.toNumber(typeKey);
            var type;
            if (!_.isUndefined(typeKey)) {
                type = _.find(SMS_ANTISPAM_EDR_TYPE, function (edrType) {
                    return (edrType.type_key === typeKey);
                });
            }

            if (type)
                return type.text;
            else
                return typeKey;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSTrafficTypeFilter', function (SMS_ANTISPAM_TRAFFIC_TYPES) {
        return function (value) {
            value = s.toNumber(value);
            var type;
            if (!_.isUndefined(value)) {
                type = _.find(SMS_ANTISPAM_TRAFFIC_TYPES, function (edrType) {
                    return (edrType.value === value);
                });
            }

            if (type)
                return type.text;
            else
                return value;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSOpRejectReasonFilter', function (SMS_ANTISPAM_OP_REJECT_REASONS) {
        return function (value) {
            value = ((value === null || value === undefined) ? null : Number(value));
            var type;
            if (!_.isUndefined(value)) {
                type = _.find(SMS_ANTISPAM_OP_REJECT_REASONS, function (edrType) {
                    return (edrType.value === value);
                });
            }

            if (type)
                return type.text;
            else
                return value;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSOpRejectMethodFilter', function (SMS_ANTISPAM_OP_REJECT_METHODS) {
        return function (value) {
            value = value === null ? undefined : s.toNumber(value);
            var type;
            if (!_.isUndefined(value)) {
                type = _.find(SMS_ANTISPAM_OP_REJECT_METHODS, function (edrType) {
                    return (edrType.value === value);
                });
            }

            if (type)
                return type.text;
            else
                return value;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSOpErrorCodeFilter', function (SMS_ANTISPAM_OP_ERROR_CODES) {
        return function (value) {
            value = value === null ? undefined : s.toNumber(value);
            var type;
            if (!_.isUndefined(value)) {
                type = _.find(SMS_ANTISPAM_OP_ERROR_CODES, function (edrType) {
                    return (edrType.value === value);
                });
            }

            if (type)
                return type.text;
            else
                return value;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSRejectMethodFilter', function (SMS_ANTISPAM_REJECT_METHODS_3) {
        return function (value) {
            value = value === null ? undefined : s.toNumber(value);
            var rejectPolicy;
            if (!_.isUndefined(value)) {
                rejectPolicy = _.find(SMS_ANTISPAM_REJECT_METHODS_3, function (rejectPolicy) {
                    return (rejectPolicy.value === value);
                });
            }

            if (rejectPolicy)
                return rejectPolicy.label;
            else
                return value;
        };
    });

    AntiSpamSMSFilters.filter('AntiSpamSMSActionsFilter', function (SMS_ANTISPAM_ACTIONS) {
        return function (value) {
            value = value === null ? undefined : value;
            var action;
            if (!_.isUndefined(value)) {
                action = _.find(SMS_ANTISPAM_ACTIONS, function (action) {
                    return (action.value === value);
                });
            }

            if (action)
                return action.label;
            else
                return value;
        };
    });

})();
