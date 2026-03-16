(function () {
    'use strict';

    /* Constants */
    angular.module('adminportal.products.antispamsms.constants', []);

    var AntiSpamSMSConstants = angular.module('adminportal.products.antispamsms.constants');

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REJECT_METHODS_1', ['REJECT_WITH_NEGATIVE_ACK', 'SILENT_DISCARD', 'LOG_AND_ACCEPT']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REJECT_METHODS_2', ['REJECT_WITH_POSITIVE_ACK', 'REJECT_WITH_NEGATIVE_ACK', 'SILENTLY_DISCARD']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REJECT_METHODS_3', [
        {label: 'REJECT_WITH_POSITIVE_ACK', value: 0},
        {label: 'REJECT_WITH_POSITIVE_ACK_AND_ALERT', value: 4},
        {label: 'REJECT_WITH_NEGATIVE_ACK', value: 1},
        {label: 'REJECT_WITH_NEGATIVE_ACK_AND_ALERT', value: 5},
        {label: 'SILENTLY_DISCARD', value: 2},
        {label: 'LOG_AND_ACCEPT', value: 3},
        {label: 'ALERT_ONLY', value: 6}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_TYPE_OF_NUMBERS', ['SCCP_CALLING_GT', 'SCCP_CALLED_GT', 'SMSC_GT']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REJECTION_ERROR_CODES', ['ABSENT_SUBSCRIBER_SM', 'CALL_BARRED', 'DATA_MISSING', 'FACILITY_NOT_SUPPORTED', 'ILLEGAL_EQUIPMENT', 'ILLEGAL_SUBSCRIBER', 'SM_DELIVERY_FAILURE', 'SUBSCRIBER_BUSY_FOR_MT', 'SYSTEM_FAILURE', 'TELESERVICE_NOT_PROVISIONED', 'UNEXPECTED_DATA_VALUE', 'UNIDENTIFIED_SUBSCRIBER']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_SENDER_ADDRESS_TYPES', ['ALL', 'ALPHANUMERIC', 'INTERNATIONAL', 'NATIONAL', 'SUBSCRIBER', 'UNKNOWN', 'NETWORK_SPECIFIC', 'ABBREVIATED', 'RESERVED']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_INT_TO_INBOUND_TYPES', ['A_PARTY_MSISDN', 'SMSC_GT', 'SCCP_CALLING_GT']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_COUNTER_TYPES', ['SIMPLE', 'DISTINCT', 'CONTENT_SENSITIVE_SINGLE_RECIPIENT', 'CONTENT_SENSITIVE_MULTIPLE_RECIPIENT']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_CHECKING_PARAMETERS', ['ALL', 'CALLING_ADDRESS', 'NUMBER_AND_SERVICE_CENTRE']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_RANGE_POLICIES', [
        {label: 'NO POLICY', value: 'NO_POLICY'},
        {label: 'ENABLE AS BLACKLIST', value: 'BLACKLIST'},
        {label: 'ENABLE AS WHITELIST', value: 'WHITELIST'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_APPLICABLE_RANGES', [
        {label: 'A_PARTY', value: 'A_PARTY'},
        {label: 'APP_NAME', value: 'APP_NAME'},
        {label: 'SMSC_GT', value: 'SMSC_GT'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_EVALUATION_TYPES', [
        {label: 'CONTAINS', value: 'CONTAINS'},
        {label: 'REGULAR EXPRESSION', value: 'REGULAR_EXPRESSION'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_CASE_SENSITIVITY', [
        {label: 'SENSITIVE', value: 'SENSITIVE'},
        {label: 'INSENSITIVE', value: 'INSENSITIVE'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_EDR_TYPE', [
        {type_key: 100, text: 'MO SMS Received'},
        {type_key: 101, text: 'MO SMS Accepted'},
        {type_key: 102, text: 'MO SMS Rejected'},
        {type_key: 120, text: 'MT SMS Received'},
        {type_key: 121, text: 'MT SMS Accepted'},
        {type_key: 122, text: 'MT SMS Rejected'},
        {type_key: 130, text: 'SRI SM Received'},
        {type_key: 131, text: 'SRI SM Accepted'},
        {type_key: 132, text: 'SRI SM Rejected'},
        {type_key: 133, text: 'SRI SM HLR Error'},
        {type_key: 134, text: 'SRI SM Location Check'},
        {type_key: 141, text: 'Subscriber Blocked'},
        {type_key: 142, text: 'Subscriber Unblocked'},
        {type_key: 143, text: 'Subscriber Reblocked'},
        {type_key: 150, text: 'AO SMS Received'},
        {type_key: 151, text: 'AO SMS Accepted'},
        {type_key: 152, text: 'AO SMS Rejected'},
        {type_key: 161, text: 'Counter Accepted'},
        {type_key: 162, text: 'Counter / Content Filter Rejected'},
        {type_key: 163, text: 'Counter Proceeded'},
        {type_key: 172, text: 'External Rejected'},
        {type_key: 181, text: 'Screening Accepted'},
        {type_key: 182, text: 'Screening Rejected'},
        {type_key: 183, text: 'Screening Proceeded'},
        {type_key: 201, text: 'Route Error'},
        {type_key: 202, text: 'Relayed To SMSC'},
        {type_key: 203, text: 'Routed to SMSC'},
        {type_key: 204, text: 'Routed to MSC'},
        {type_key: 205, text: 'Routed To STP'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_TRAFFIC_TYPES', [
        {value: 11, text: 'MO'},
        {value: 12, text: 'MO Inbound'},
        {value: 13, text: 'MO Outbound'},
        {value: 21, text: 'MT'},
        {value: 22, text: 'MT Alphanumeric'},
        {value: 23, text: 'MT Shortcode'},
        {value: 24, text: 'MT Intl to Inbound'},
        {value: 31, text: 'SRI'},
        {value: 40, text: 'AO'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_OP_REJECT_REASONS', [
        {value: 0, text: 'No Error'},
        {value: 1, text: 'Spam'},
        {value: 2, text: 'Parameter Screening'},
        {value: 5, text: 'Fraud (MO Inbound)'},
        {value: 6, text: 'Fraud (MO Outbound)'},
        {value: 7, text: 'Fraud (MT)'},
        {value: 8, text: 'MT w/out SRI'},
        {value: 9, text: 'A2P SMS'},
        {value: 10, text: 'Intl to Inbound Roamer'},
        {value: 11, text: 'SRI Filter'},
        {value: 12, text: 'MO Spoofing'},
        {value: 13, text: 'MAP Error'},
        {value: 14, text: 'Fraud (MO BlackList)'},
        {value: 15, text: 'External Security'},
        {value: 16, text: 'Log and Accept'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_OP_REJECT_METHODS', [
        {value: 1, text: 'Reject with Positive Ack'},
        {value: 2, text: 'Reject with Negative Ack'},
        {value: 3, text: 'Silent Discard'},
        {value: 4, text: 'Log and Accept'},
        {value: 5, text: 'Reject with Positive Ack and Alert'},
        {value: 6, text: 'Reject with Negative Ack and Alert'},
        {value: 7, text: 'Alert Only'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_ACTIONS', [
        {label: 'ACCEPT', value: 'ACCEPT'},
        {label: 'REJECT', value: 'REJECT'},
        {label: 'PROCEED TO NEXT', value: 'PROCEED_TO_NEXT'}
    ]);

    AntiSpamSMSConstants.constant('ALARM_NOTIFICATIONS_ALARM_STATES', ['Created', 'Acknowledged']);

    AntiSpamSMSConstants.constant('ALARM_NOTIFICATIONS_NOTIFICATION_MODES', ['None', 'Email']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_OP_ERROR_CODES', [
        {value: -1, text: 'TCAP User Abort'},
        {value: -2, text: 'TCAP Provider Abort'},
        {value: -3, text: 'TCAP Notice'},
        {value: -4, text: 'TCAP Local Cancel'},
        {value: -5, text: 'Internal Timeout'},
        {value: 1, text: 'Unknown Subscriber'},
        {value: 5, text: 'Unidentified Subscriber'},
        {value: 6, text: 'Absent Subscriber SM'},
        {value: 9, text: 'Illegal Subscriber'},
        {value: 11, text: 'Teleservice Not Provisioned'},
        {value: 12, text: 'Illegal Equipment'},
        {value: 13, text: 'Call Barred'},
        {value: 21, text: 'Facility not Supported'},
        {value: 27, text: 'Absent Subscriber'},
        {value: 31, text: 'Subscriber Busy for MT'},
        {value: 32, text: 'SM Delivery Failure'},
        {value: 33, text: 'Message Waiting List Full'},
        {value: 34, text: 'System Failure'},
        {value: 35, text: 'Data Missing'},
        {value: 36, text: 'Unexpected Data Value'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REPORTING_FILTER_TYPES', ['AO-Spam', 'AO-External', 'MO-Spam', 'MO-External', 'MT-Spam', 'MT-External']);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REPORTING_COUNTER_NAMES', [
        {value: 'topMtRejectedGts', text: 'MT Rejected'},
        {value: 'topMtReceivedGts', text: 'MT Received'},
        {value: 'topMtSpamSmscGts', text: 'MT Spam'},
        {value: 'topMtWithoutSriGts', text: 'MT Without SRI'},
        {value: 'topSriReceivedGts', text: 'SRI Received'},
        {value: 'topSriRejectedGts', text: 'SRI Spam'}
    ]);

    AntiSpamSMSConstants.constant('SMS_ANTISPAM_REPORTING_OPERATORS', [
        {value: 'Fastweb', text: 'Fastweb'},
        {value: 'Virgin', text: 'Virgin'}
    ]);
})();
