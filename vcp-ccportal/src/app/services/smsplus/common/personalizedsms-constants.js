(function () {
    'use strict';

    /* Constants */
    angular.module('ccportal.services.personalizedsms.constants', []);

    var PersonalizedSMSConstants = angular.module('ccportal.services.personalizedsms.constants');

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_GENERIC_PROFILE', 'SmsPlusGenericProfile');

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_AD_INSERTION_SERVICE_PROFILE', 'SmsPlusAdInsertionServiceProfile');
    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_COPY_SERVICE_PROFILE', 'SmsPlusCopyServiceProfile');
    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_FORWARD_SERVICE_PROFILE', 'SmsPlusForwardServiceProfile');
    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_LAST_RESORT_SERVICE_PROFILE', 'SmsPlusLastResortServiceProfile');
    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_ROUTING_CONDITIONS', ['ALWAYS', 'ROAMING', 'ABSENT']);
    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_TIME_RESTRICTION_MODES', ['RESTRICTED', 'UNRESTRICTED']);

    PersonalizedSMSConstants.constant('AD_LISTING_MASK', {
        'NONE': 'NONE',
        'BOTH': 'BOTH',
        'DAYS_OF_WEEK': 'DAYS_OF_WEEK',
        'HOUR_OF_DAY': 'HOUR_OF_DAY'
    });

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_SUBSCRIPTION_TYPES', {
        'NONE': 'NONE',
        'THIRD_PARTY': 'THIRD_PARTY',
        'OPERATOR': 'OPERATOR',
        'BOTH': 'BOTH'
    });

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_LIST_TYPES', [
        {value: 'WHITELIST', text: 'ScreeningLists.ModeTypes.AcceptWhiteList'},
        {value: 'NOT_USED', text: 'ScreeningLists.ModeTypes.AcceptAll'},
        {value: 'BLACKLIST', text: 'ScreeningLists.ModeTypes.RejectBlackList'}
    ]);

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_EVENT_IDS', [
        {type_key: 0, text: "PASSED_BY"},
        {type_key: 1, text: "SILENT_DISCARD"},
        {type_key: 10, text: "INTERNAL_ERROR"},
        {type_key: 11, text: "SERVICE_DISABLED"},
        {type_key: 12, text: "MAX_LIMIT_EXCEEDED"},
        {type_key: 13, text: "CONSENT_NOT_ALLOWED"},
        {type_key: 14, text: "TIME_CONSTRAINT_NOT_MATCHED"},
        {type_key: 15, text: "ROAMING_NOT_ALLOWED"},
        {type_key: 16, text: "INFINITE_LOOP"},
        {type_key: 17, text: "FETCH_USER_PERSISTENCE_INFO_ERROR"},
        {type_key: 18, text: "BLACKLIST_WHITELIST_NOT_ALLOWED"},
        {type_key: 19, text: "ABSENT_SUBSCRIBER_ONLY"},
        {type_key: 20, text: "CHARGING_ERROR"},
        {type_key: 21, text: "MESSAGE_DIVERTED"},
        {type_key: 22, text: "NO_ROUTE"},
        {type_key: 23, text: "OTHER_OPERATOR_NOT_ALLOWED"},
        {type_key: 24, text: "NO_ADVERT_MATCH"},
        {type_key: 30, text: "RECEIVER_SCREENING"},
        {type_key: 31, text: "SENDER_SCREENING"},
        {type_key: 32, text: "OPERATOR_PREMIUM_SCREENING"},
        {type_key: 33, text: "THIRD_PARTY_PREMIUM_SCREENING"},
        {type_key: 40, text: "AUTO_REPLY_MESSAGE_COULD_NOT_BE_SENT"},
        {type_key: 41, text: "AUTO_REPLY_ALREADY_SENT"},
        {type_key: 50, text: "ARCHIVE_MESSAGE_COULD_NOT_BE_SET"},
        {type_key: 60, text: "APPLICATION_SCREENING"},
        {type_key: 101, text: "ROUTER_PASS_SMSC_TO_SERVICES"},
        {type_key: 102, text: "ROUTER_PASS_SERVICE_TO_SMSC"},
        {type_key: 103, text: "ROUTER_BLOCK_SERVICE_TO_SMSC"}
    ]);

    PersonalizedSMSConstants.constant('PERSONALIZED_SMS_SERVICE_TYPES', [
        {type_key: 0, text: "ROUTER"},
        {type_key: 1, text: "FORWARD"},
        {type_key: 2, text: "COPY"},
        {type_key: 3, text: "LAST_RESORT"},
        {type_key: 4, text: "BLOCK_MOBILE"},
        {type_key: 5, text: "AUTO_REPLY"},
        {type_key: 6, text: "BLOCK_PREMIUM"},
        {type_key: 7, text: "ARCHIVE"},
        {type_key: 9, text: "AUTO_SIGNATURE"},
        {type_key: 10, text: "AD_INSERTION"},
        {type_key: 11, text: "BLOCK_APPLICATION"}
    ]);

})();
