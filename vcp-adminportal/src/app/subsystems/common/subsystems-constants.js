(function () {
    'use strict';

    /* Constants */
    angular.module('adminportal.subsystems.constants', []);

    var SubsystemsConstants = angular.module('adminportal.subsystems.constants');

    // Reporting related constants
    SubsystemsConstants.constant('REPORTING_SCHEDULE_RECURRENCE', ['DAILY', 'WEEKLY', 'MONTHLY']);

    SubsystemsConstants.constant('REPORTING_QUALIFIERS', [
        {id: 0, label: 'First'},
        {id: 1, label: 'Second'},
        {id: 2, label: 'Third'},
        {id: 3, label: 'Fourth'},
        {id: 4, label: 'Last'}
    ]);

    SubsystemsConstants.constant('OPERATORS', [
        {text: 'ALL', value:null},
        {text: 'Vodafone', value:'VF'},
        {text: 'Idea', value:'Idea'},
        {text: 'Airtel', value:'Airtel'},
        {text: 'BSNL', value:'BSNL'}
    ]);

    SubsystemsConstants.constant('DESTINATION_NETWORKS', [
        {name: 'ALL', mcc: null, mnc: null},
        {name: 'Vodafone Andhra Pradesh',mcc:  '404',mnc:'13'},
        {name: 'Vodafone Assam',mcc:  '405',mnc:'751'},
        {name: 'Vodafone Bihar',mcc:  '405',mnc:'752'},
        {name: 'Vodafone Delhi',mcc:  '404',mnc:'11'},
        {name: 'Vodafone Gujarat',mcc:  '404',mnc:'05'},
        {name: 'Vodafone Haryana',mcc:  '404',mnc:'01'},
        {name: 'Vodafone Himachal Pradesh',mcc:  '405',mnc:'754'},
        {name: 'Vodafone Jammu & Kashmir',mcc:  '405',mnc:'750'},
        {name: 'Vodafone Karnataka',mcc:  '404',mnc:'86'},
        {name: 'Vodafone Kerala',mcc:  '404',mnc:'46'},
        {name: 'Vodafone Kolkata',mcc:  '404',mnc:'30'},
        {name: 'Vodafone Madhya Pradesh',mcc:  '405',mnc:'756'},
        {name: 'Vodafone Maharashtra',mcc:  '404',mnc:'27'},
        {name: 'Vodafone Mumbai',mcc:  '404',mnc:'20'},
        {name: 'Vodafone North East',mcc:  '405',mnc:'755'},
        {name: 'Vodafone Orissa',mcc:  '405',mnc:'753'},
        {name: 'Vodafone Punjab',mcc:  '404',mnc:'88'},
        {name: 'Vodafone Rajasthan',mcc:  '404',mnc:'60'},
        {name: 'Vodafone Tamil Nadu',mcc:  '404',mnc:'43'},
        {name: 'Vodafone Uttar Pradesh (East)',mcc:  '404',mnc:'15'},
        {name: 'Vodafone Uttar Pradesh (West)',mcc:  '405',mnc:'66'},
        {name: 'Vodafone West Bengal',mcc:  '405',mnc:'67'},
        {name: 'Vodafone Chennai',mcc:  '404',mnc:'84'},
        {name: 'Idea Andhra Pradesh',mcc:  '404',mnc:'07'},
        {name: 'Idea Assam',mcc:  '405',mnc:'845'},
        {name: 'Idea Bihar',mcc:  '405',mnc:'70'},
        {name: 'Idea Delhi',mcc:  '404',mnc:'04'},
        {name: 'Idea Gujarat',mcc:  '404',mnc:'24'},
        {name: 'Idea Haryana',mcc:  '404',mnc:'12'},
        {name: 'Idea Himachal Pradesh',mcc:  '404',mnc:'82'},
        {name: 'Idea Jammu & Kashmir',mcc:  '405',mnc:'846'},
        {name: 'Idea Karnataka',mcc:  '405',mnc:'847'},
        {name: 'Idea Kerala',mcc:  '404',mnc:'19'},
        {name: 'Idea Kolkata',mcc:  '405',mnc:'848'},
        {name: 'Idea Madhya Pradesh',mcc:  '404',mnc:'78'},
        {name: 'Idea Maharashtra',mcc:  '404',mnc:'22'},
        {name: 'Idea Mumbai',mcc:  '405',mnc:'799'},
        {name: 'Idea North East',mcc:  '405',mnc:'849'},
        {name: 'Idea Orissa',mcc:  '405',mnc:'850'},
        {name: 'Idea Punjab',mcc:  '405',mnc:'851'},
        {name: 'Idea Rajasthan',mcc:  '404',mnc:'87'},
        {name: 'Idea Tamil Nadu',mcc:  '405',mnc:'852'},
        {name: 'Idea Uttar Pradesh (East)',mcc:  '404',mnc:'89'},
        {name: 'Idea Uttar Pradesh (West)',mcc:  '404',mnc:'56'},
        {name: 'Idea West Bengal',mcc:  '405',mnc:'853'},

        {name: 'CUSTOM', mcc: null, mnc: null}
    ]);

    SubsystemsConstants.constant('XSM_SMS_PROFILE_LANGUAGES', [
        {key: 'AR', label: 'Languages.AR'},
        {key: 'EN', label: 'Languages.EN'}
    ]);

    // Provisioning
    SubsystemsConstants.constant('PROVISIONING_STATUSES', [
        {label: 'ProvisioningStatusTypes.Active', value: 'Active'},
        {label: 'ProvisioningStatusTypes.Inactive', value: 'Inactive'}
    ]);

    SubsystemsConstants.constant('PROVISIONING_PAYMENT_TYPES', [
        {label: 'PaymentTypes.Prepaid', value: 'Prepaid', cmpf_value: 0},
        {label: 'PaymentTypes.Postpaid', value: 'Postpaid', cmpf_value: 1},
        {label: 'PaymentTypes.VIP', value: 'VIP', cmpf_value: 3}
    ]);

    SubsystemsConstants.constant('PROVISIONING_LANGUAGES', [
        {label: 'Languages.AR', value: 'AR'},
        {label: 'Languages.EN', value: 'EN'}
    ]);

    SubsystemsConstants.constant('HTTP_METHODS', ['POST', 'PUT', 'DELETE']);

    // Subscription
    SubsystemsConstants.constant('SUBSCRIPTION_MANAGEMENT_CHANNEL_TYPES', [
        {value: 'IVR', text: 'IVR'},
        {value: 'USSD', text: 'USSD'},
        {value: 'SMS', text: 'SMS'},
        {value: 'WEB', text: 'WEB'},
        {value: 'DOB', text: 'DCB'},
        {value: 'SSM', text: 'SSM'},
        {value: 'CC', text: 'CC'},
        {value: 'PROV', text: 'PROV'},
        {value: 'TP', text: 'TP'},
        {value: 'MOA', text: 'MOA'},
        {value: 'OTHER', text: 'OTHER'}
    ]);
    SubsystemsConstants.constant('SUBSCRIPTION_MANAGEMENT_ERROR_CODES', [
        {key: 0, text: 'SUCCESS'},
        {key: 5200000, text: 'GENERAL_ERROR'},
        {key: 5200001, text: 'CMPF_CONFIGURATION_MISSING'},
        {key: 5200002, text: 'XSGW_CONFIGURATION_MISSING'},
        {key: 5201000, text: 'MANDATORY_PARAMETER_MISSING'},
        {key: 5201001, text: 'ERR_LAST_SUBSCRIPTION_DATE_PASSED'},
        {key: 5201002, text: 'ERR_START_DATE_INVALID'},
        {key: 5201003, text: 'ERR_ILLEGAL_SUBSCRIBER_STATE'},
        {key: 5201004, text: 'ERR_GIFTED_OFFER_SUBSCRIPTION_EXISTS'},
        {key: 5201005, text: 'ERR_OFFER_SUBSCRIPTION_EXISTS'},
        {key: 5201006, text: 'ERR_GIFTED_SERVICE_SUBSCRIPTION_EXISTS'},
        {key: 5201007, text: 'ERR_SERVICE_SUBSCRIPTION_EXISTS'},
        {key: 5201008, text: 'ERR_OFFER_SUBSCRIPTION_DOESNOT_EXIST'},
        {key: 5201009, text: 'ERR_INVALID_DURATION_FORMAT'},
        {key: 5201010, text: 'ERR_EVENT_SCHEDULING_FAILED'},
        {key: 5201011, text: 'ERR_PROFILEDEF_NOT_EXISTS'},
        {key: 5201012, text: 'ERR_OFFER_NOT_EXISTS'},
        {key: 5201013, text: 'ERR_NEXT_OFFER_NOT_EXISTS'},
        {key: 5201014, text: 'ERR_SUBSCRIBER_NOT_FOUND'},
        {key: 5201015, text: 'ERR_SERVICE_NOT_FOUND'},
        {key: 5201016, text: 'ERR_SERVICE_SUBSCRIPTION_NOT_FOUND'},
        {key: 5201017, text: 'ERR_DIFFERENT_OPERATOR_SUBSCRIBER'},
        {key: 5201018, text: 'ERR_OFFER_NOT_FOUND'},
        {key: 5201019, text: 'ERR_INVALID_MSISDN_FORMAT'},
        {key: 5201020, text: 'ERR_INVALID_OFFER_STATE'},
        {key: 5201021, text: 'ERR_EVENT_REMOVAL_FAILED'},
        {key: 5201022, text: 'ERR_SERVICE_NOTIFICATION_FAILED'},
        {key: 5201023, text: 'ERR_SUBSCRIBER_NOTIFICATION_FAILED'},
        {key: 5201024, text: 'ERR_CHARGING_EVENT_FAILED'},
        {key: 5201025, text: 'ERR_INACTIVATED_BY_SUBSCRIBER'},
        {key: 5201026, text: 'ERR_NEXT_SUBSCRIPTION_FAILED'},
        {key: 5201027, text: 'ERR_CREATE_SUBSCRIPTION_FAILED'},
        {key: 5201028, text: 'ERR_SETSTATE_OF_SUBSCRIPTION_FAILED'},
        {key: 5201029, text: 'ERR_HLR_FLAG_SETTING_FAILED'},
        {key: 5201030, text: 'ERR_SERVICE_IS_NOT_OWNED_BY_PROVIDER'},
        {key: 5201031, text: 'ERR_INVALID_SERVICE_STATE'},
        {key: 5201032, text: 'ERR_DELETE_SERVICE_SUBSCRIPTION'},
        {key: 5201033, text: 'ERR_HLR_FLAG_UNSETTING_FAILED'},
        {key: 5201034, text: 'ERR_IS_SUBSCRIBED_CHECK_FAILED'},
        {key: 5201035, text: 'ERR_SUBSCRIBE_TO_SERVICE_FAILED'},
        {key: 5201036, text: 'ERR_UNSUBSCRIBE_FROM_SERVICE_FAILED'},
        {key: 5201037, text: 'ERR_TERMINATION_OF_TRIAL_SUBSCRIPTION_FAILED'},
        {key: 5201038, text: 'ERR_INVALID_CHANNEL'},
        {key: 5201039, text: 'ERR_TRIAL_SUBSCRIPTION_NOT_ALLOWED_MORE_THAN_ONCE'},
        {key: 5201040, text: 'ERR_NO_REMAINING_DAYS_FOR_SUBSCRIPTION'},
        {key: 5201041, text: 'ERR_SUBSCRIBER_NOTIFICATION_NOT_ENABLED'},
        {key: 5201042, text: 'ERR_COULD_NOT_PROCESS_CONFIRMATION'},
        {key: 5201043, text: 'ERR_ORGANIZATION_NOT_FOUND'},
        {key: 5201044, text: 'ERR_USER_NOT_FOUND'},
        {key: 5201045, text: 'MANDATORY_PROFILE_MISSING'},
        {key: 5201046, text: 'MANDATORY_ATTRIBUTE_MISSING'},
        {key: 5201047, text: 'SERVICE_SUBSCRIPTION_IS_IN_PENDING_STATE'},
        {key: 5201048, text: 'ERR_SUBSCRIBER_ALREADY_CREATED'},
        {key: 5201049, text: 'ERR_SUBSCRIBER_IS_NOT_ELIGIBLE'},
        {key: 5201050, text: 'ERR_SCREENING_FAILED'},
        {key: 5201051, text: 'ERR_SUBSCRIBER_IS_NOT_ACTIVE'},
        {key: 5201100, text: 'ERR_METHOD_NOT_IMPLEMENTED'},
        {key: 5202000, text: 'ERR_MNP_NOT_INITIALIZED'},
        {key: 5202001, text: 'ERR_GETMNP_FAILURE'},
        {key: 5202002, text: 'ERR_CHARGING_NOT_INITIALIZED'},
        {key: 5202003, text: 'ERR_CHARGING_INSUFFICIENT_CREDIT'},
        {key: 5202004, text: 'ERR_CHARGING_FAILED'},
        {key: 5202005, text: 'ERR_REQUEST_ALREADY_IN_QUEUE'},
        {key: 5202006, text: 'ERR_INITIAL_CHARGING_RETRY_DUE_TO_CONNECTION_ERROR_NOT_NEEDED'},
        {key: 5202007, text: 'ERR_INITIAL_CHARGING_RETRY_DUE_TO_INSUFFICIENT_CREDIT_NOT_NEEDED'},
        {key: 5203000, text: 'ERR_CONSENT_STATE_DENIED'},
        {key: 5203001, text: 'ERR_CONSENT_STATE_NORESPONSE'},
        {key: 5203002, text: 'ERR_CONSENT_STATE_WAITING'},
        {key: 5203003, text: 'ERR_CONSENT_STATE_EXPIRED'},
        {key: 5203004, text: 'ERR_CONSENT_EXCEPTION'},
        {key: 5203005, text: 'ERR_NO_SUBSCRIPTION_FOR_RECEIVED_CONSENT'},
        {key: 5203006, text: 'ERR_COULD_NOT_PROCESS_CONSENT'},
        {key: 5204000, text: 'ERR_HLR_FLAG_ERROR'},
        {key: 5205000, text: 'ERR_DB_CONFIGURATION_ERROR'},
        {key: 5206000, text: 'ERR_LICENSE_EXPIRED'},
        {key: 5206001, text: 'ERR_LICENSE_LIMIT_REACHED'},
        {key: 5206002, text: 'GENERAL_LICENSE_ERROR'},
        {key: 5206003, text: 'ERR_CACHED_OBJECT_NULL'}
    ]);

    SubsystemsConstants.constant('SUBSCRIPTION_MANAGEMENT_EVENT_TYPES', [
        {key: 1, text: 'SUBSCRIBE_TO_OFFER_ATTEMPT'},
        {key: 2, text: 'SUBSCRIBE_TO_OFFER_SUCCESS'},
        {key: 3, text: 'SUBSCRIBE_TO_OFFER_FAIL'},
        {key: 4, text: 'UNSUBSCRIBE_FROM_OFFER_ATTEMPT'},
        {key: 5, text: 'UNSUBSCRIBE_FROM_OFFER_SUCCESS'},
        {key: 6, text: 'UNSUBSCRIBE_FROM_OFFER_FAIL'},
        {key: 7, text: 'CHARGING_ATTEMPT'},
        {key: 8, text: 'CHARGING_SUCCESS'},
        {key: 9, text: 'CHARGING_FAIL'},
        {key: 10, text: 'INITIAL_CHARGING_ATTEMPT'},
        {key: 11, text: 'INITIAL_CHARGING_SUCCESS'},
        {key: 12, text: 'INITIAL_CHARGING_FAIL'},
        {key: 13, text: 'DEBT_CHARGING_ATTEMPT'},
        {key: 14, text: 'DEBT_CHARGING_SUCCESS'},
        {key: 15, text: 'DEBT_CHARGING_FAIL'},
        {key: 16, text: 'CHARGING_EVENT_ATTEMPT'},
        {key: 17, text: 'CHARGING_EVENT_SUCCESS'},
        {key: 18, text: 'CHARGING_EVENT_FAIL'},
        {key: 19, text: 'CHARGING_RETRY_EVENT_ATTEMPT'},
        {key: 20, text: 'CHARGING_RETRY_EVENT_SUCCESS'},
        {key: 21, text: 'CHARGING_RETRY_EVENT_FAIL'},
        {key: 22, text: 'SERVICE_SUBSCRIPTION_STATE_NOTIFICATION_ATTEMPT'},
        {key: 23, text: 'SERVICE_SUBSCRIPTION_STATE_NOTIFICATION_SUCCESS'},
        {key: 24, text: 'SERVICE_SUBSCRIPTION_STATE_NOTIFICATION_FAIL'},
        {key: 25, text: 'SUBSCRIBER_NOTIFICATION_ATTEMPT'},
        {key: 26, text: 'SUBSCRIBER_NOTIFICATION_SUCCESS'},
        {key: 27, text: 'SUBSCRIBER_NOTIFICATION_FAIL'},
        {key: 28, text: 'SETSTATEOF_SUBSCRIPTION_ATTEMPT'},
        {key: 29, text: 'SETSTATEOF_SUBSCRIPTION_SUCCESS'},
        {key: 30, text: 'SETSTATEOF_SUBSCRIPTION_FAIL'},
        {key: 31, text: 'RENEW_SUBSCRIPTION_ATTEMPT'},
        {key: 32, text: 'RENEW_SUBSCRIPTION_SUCCESS'},
        {key: 33, text: 'RENEW_SUBSCRIPTION_FAIL'},
        {key: 34, text: 'NEXT_SUBSCRIPTION_ATTEMPT'},
        {key: 35, text: 'NEXT_SUBSCRIPTION_SUCCESS'},
        {key: 36, text: 'NEXT_SUBSCRIPTION_FAIL'},
        {key: 37, text: 'EXTEND_SUBSCRIPTION_ATTEMPT'},
        {key: 38, text: 'EXTEND_SUBSCRIPTION_SUCCESS'},
        {key: 39, text: 'EXTEND_SUBSCRIPTION_FAIL'},
        {key: 40, text: 'PROCESS_CONFIRMATION_ATTEMPT'},
        {key: 41, text: 'PROCESS_CONFIRMATION_SUCCESS'},
        {key: 42, text: 'PROCESS_CONFIRMATION_FAIL'},
        {key: 43, text: 'SUBSCRIBE_TO_SERVICE_ATTEMPT'},
        {key: 44, text: 'SUBSCRIBE_TO_SERVICE_SUCCESS'},
        {key: 45, text: 'SUBSCRIBE_TO_SERVICE_FAIL'},
        {key: 46, text: 'UNSUBSCRIBE_FROM_SERVICE_ATTEMPT'},
        {key: 47, text: 'UNSUBSCRIBE_FROM_SERVICE_SUCCESS'},
        {key: 48, text: 'UNSUBSCRIBE_FROM_SERVICE_FAIL'},
        {key: 49, text: 'IS_SUBSCRIBED_TO_SERVICE_ATTEMPT'},
        {key: 50, text: 'IS_SUBSCRIBED_TO_SERVICE_SUCCESS'},
        {key: 51, text: 'IS_SUBSCRIBED_TO_SERVICE_FAIL'},
        {key: 52, text: 'ASKED_CONSENT_FOR_SERVICE'},
        {key: 53, text: 'RECEIVED_CONSENT_RESULT_NOTIFICATION_FOR_SERVICE'},
        {key: 54, text: 'SETTING_HLR_FLAG_SUCCESS'},
        {key: 55, text: 'SETTING_HLR_FLAG_FAILED'},
        {key: 56, text: 'SUBSCRIBE_TO_OFFER_AFTER_TRIAL_PERIOD_ATTEMPT'},
        {key: 57, text: 'SUBSCRIBE_TO_OFFER_AFTER_TRIAL_PERIOD_SUCCESS'},
        {key: 58, text: 'SUBSCRIBE_TO_OFFER_AFTER_TRIAL_PERIOD_FAIL'},
        {key: 59, text: 'TERMINATE_TRIAL_SUBSCRIPTION_ATTEMPT'},
        {key: 60, text: 'TERMINATE_TRIAL_SUBSCRIPTION_SUCCESS'},
        {key: 61, text: 'TERMINATE_TRIAL_SUBSCRIPTION_FAIL'},
        {key: 62, text: 'INITIAL_CHARGING_RETRY_EVENT_ATTEMPT'},
        {key: 63, text: 'INITIAL_CHARGING_RETRY_EVENT_SUCCESS'},
        {key: 64, text: 'INITIAL_CHARGING_RETRY_EVENT_FAIL'},
        {key: 65, text: 'INITIAL_CONNECTION_RETRY_EVENT_ATTEMPT'},
        {key: 66, text: 'INITIAL_CONNECTION_RETRY_EVENT_SUCCESS'},
        {key: 67, text: 'INITIAL_CONNECTION_RETRY_EVENT_FAIL'},
        {key: 70, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_GRACE'},
        {key: 71, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_SUSPEND'},
        {key: 72, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_INACTIVE'},
        {key: 73, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_SUSPEND'},
        {key: 74, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_ACTIVE'},
        {key: 75, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_INACTIVE'},
        {key: 76, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_ACTIVE'},
        {key: 77, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_INACTIVE'},
        {key: 78, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_GRACE'},
        {key: 79, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_ACTIVE'},
        {key: 80, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_SUSPEND'},
        {key: 81, text: 'OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_GRACE'},
        {key: 82, text: 'SUBSCRIPTION_MANAGER_RESPONSE'},
        {key: 83, text: 'SET_NEXT_STEP_OF_SUBSCRIPTION_ATTEMPT'},
        {key: 84, text: 'SET_NEXT_STEP_OF_SUBSCRIPTION_SUCCESS'},
        {key: 85, text: 'SET_NEXT_STEP_OF_SUBSCRIPTION_FAIL'},
        {key: 86, text: 'SKIPPED_CONSENT_FOR_SERVICE'},
        {key: 87, text: 'GET_HLR_FLAG_ATTEMPT'},
        {key: 88, text: 'GET_HLR_FLAG_SUCCESS'},
        {key: 89, text: 'GET_HLR_FLAG_FAIL'},
        {key: 90, text: 'SET_HLR_FLAG_ATTEMPT'},
        {key: 91, text: 'SET_HLR_FLAG_SUCCESS'},
        {key: 92, text: 'SET_HLR_FLAG_FAIL'},
        {key: 93, text: 'CLEAR_HLR_FLAG_ATTEMPT'},
        {key: 94, text: 'CLEAR_HLR_FLAG_SUCCESS'},
        {key: 95, text: 'CLEAR_HLR_FLAG_FAIL'}
    ]);

    SubsystemsConstants.constant('USER_ACCOUNT_QUOTA_CYCLES', ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']);

})();

