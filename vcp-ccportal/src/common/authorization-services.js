(function () {
    'use strict';

    /* Authorization Services */
    angular.module('Application.authorization-services', []);

    var ApplicationAuthorizationServices = angular.module('Application.authorization-services');

    ApplicationAuthorizationServices.factory('AuthorizationService', function ($q, $log, UtilService, CMPFService, Restangular, RESOURCE_NAME) {
        return {
            userRights: [],
            permissions: {
                // Charging
                CHARGING_ALL_REFUND: "Charging:All:Refund",

                // Preferences
                PREFERENCES_ALL_READ: "Preferences:All:Read",
                PREFERENCES_ALL_UPDATE: "Preferences:All:Update",

                // Products
                PRODUCTS_ANTISPAM: "Products:AntiSpam",
                PRODUCTS_BMS: "Products:BMS",
                PRODUCTS_LCGW: "Products:LCGW",
                PRODUCTS_MMSC: "Products:MMSC",
                PRODUCTS_SMSC: "Products:SMSC",
                PRODUCTS_USC: "Products:USC",

                // Screening List
                CREATE_ALL_SCREENING_LISTS: "ScreeningLists:All:Create",
                READ_ALL_SCREENING_LISTS: "ScreeningLists:All:Read",
                UPDATE_ALL_SCREENING_LISTS: "ScreeningLists:All:Update",
                DELETE_ALL_SCREENING_LISTS: "ScreeningLists:All:Delete",

                // Services
                SERVICES_CC: "Services:CC",
                SERVICES_CMB: "Services:CMB",
                SERVICES_MCN: "Services:MCN",
                SERVICES_MNN: "Services:MNN",
                SERVICES_PC: "Services:PC",
                SERVICES_SMS_PLUS: "Services:SMSPlus",
                SERVICES_VM: "Services:VM",
                SERVICES_WELCOME_SMS: "Services:WelcomeSMS",

                // Subscription
                SUBSCRIPTION_ALL_SUBSCRIBE: "Subscription:All:Subscribe",
                SUBSCRIPTION_ALL_UNSUBSCRIBE: "Subscription:All:Unsubscribe",

                // Troubleshooting
                READ_ALL_TROUBLESHOOTING: "Troubleshooting:All:Read",
                UPDATE_ALL_TROUBLESHOOTING: "Troubleshooting:All:Update",
                DELETE_ALL_TROUBLESHOOTING: "Troubleshooting:All:Delete",

                // AntiSpam Content View
                ANTISPAM_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:AntiSpam:A2P:Peek",
                ANTISPAM_P2A_PEEK_TROUBLESHOOTING: "Troubleshooting:AntiSpam:P2A:Peek",
                ANTISPAM_P2P_PEEK_TROUBLESHOOTING: "Troubleshooting:AntiSpam:P2P:Peek",

                // BMS SMS Content View
                BMS_SMS_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:BMS:SMS:A2P:Peek",

                // MMSC Content View
                MMSC_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:MMSC:A2P:Peek",
                MMSC_P2A_PEEK_TROUBLESHOOTING: "Troubleshooting:MMSC:P2A:Peek",
                MMSC_P2P_PEEK_TROUBLESHOOTING: "Troubleshooting:MMSC:P2P:Peek",

                // SMSC Content View
                SMSC_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:A2P:Peek",
                SMSC_P2A_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:P2A:Peek",
                SMSC_P2P_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:P2P:Peek",

                // USSD Content View
                USSD_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:USC:A2P:Peek",
                USSD_P2A_PEEK_TROUBLESHOOTING: "Troubleshooting:USC:P2A:Peek"
            },
            // Main Methods
            getPermissions: function (uid) {
                return CMPFService.getUserAccountRights(uid);
            },
            extractUserRights: function (allRights) {
                this.removeUserRights();

                var foundUserRights = _.where(allRights, {resourceName: RESOURCE_NAME});

                $log.debug("Found resource rights: ", foundUserRights);

                return foundUserRights;
            },
            storeUserRights: function (userRights) {
                // Convert to map which contains only rights
                var availableRights = _.map(userRights, _.iteratee('operationName'));

                $log.debug("Found available user rights: ", availableRights);

                // Store session and this service
                UtilService.putToSessionStore(UtilService.USER_RIGHTS, availableRights);
                this.setUserRights(availableRights);
            },
            removeUserRights: function () {
                UtilService.removeFromSessionStore(UtilService.USER_RIGHTS);
                this.canDo.cache = {};
            },
            // User rights getter and setter
            setUserRights: function (userRights) {
                this.userRights = userRights;
            },
            getUserRights: function () {
                return this.userRights;
            },
            // The operationName can be an item or can be an array. This method checks all passed permissions with the argument is defined for our resource.
            isOperationsPermitted: function (operationNames) {
                var userRights = this.getUserRights();

                var operationNameArray = _.isArray(operationNames) ? operationNames : [operationNames];

                var rightIntersection = _.intersection(userRights, operationNameArray);

                $log.debug("Right intersection: ", rightIntersection);

                return rightIntersection.length === operationNameArray.length;
            },
            canDo: _.memoize(function (operation) {
                return this.isOperationsPermitted(operation);
            }),
            // Check permission list
            checkPermissionList: function (permissions) {
                var isPermitted = true, _self = this;
                if (permissions && _.isArray(permissions)) {
                    _.each(permissions, function (permission) {
                        var permission = _self.permissions[permission];

                        isPermitted = isPermitted && _self.canDo(permission);
                    });
                }

                return isPermitted;
            },
            // Specific permission checks.
            // Charging
            canChargingAllRefund: function () {
                return this.canDo(this.permissions.CHARGING_ALL_REFUND);
            },
            // Preferences
            canPreferencesAllRead: function () {
                return this.canDo(this.permissions.PREFERENCES_ALL_READ);
            },
            canPreferencesAllUpdate: function () {
                return this.canDo(this.permissions.PREFERENCES_ALL_UPDATE);
            },
            // Products
            canSeeAntiSpam: function () {
                return this.canDo(this.permissions.PRODUCTS_ANTISPAM);
            },
            canSeeBMS: function () {
                return this.canDo(this.permissions.PRODUCTS_BMS);
            },
            canSeeLCGW: function () {
                return this.canDo(this.permissions.PRODUCTS_LCGW);
            },
            canSeeMMSC: function () {
                return this.canDo(this.permissions.PRODUCTS_MMSC);
            },
            canSeeSMSC: function () {
                return this.canDo(this.permissions.PRODUCTS_SMSC);
            },
            canSeeUSC: function () {
                return this.canDo(this.permissions.PRODUCTS_USC);
            },
            // Screening List
            canCreateScreeningListsAll: function () {
                return this.canDo(this.permissions.CREATE_ALL_SCREENING_LISTS);
            },
            canReadScreeningListsAll: function () {
                return this.canDo(this.permissions.READ_ALL_SCREENING_LISTS);
            },
            canUpdateScreeningListsAll: function () {
                return this.canDo(this.permissions.UPDATE_ALL_SCREENING_LISTS);
            },
            canDeleteScreeningListsAll: function () {
                return this.canDo(this.permissions.DELETE_ALL_SCREENING_LISTS);
            },
            // Services
            canSeeCC: function () {
                return this.canDo(this.permissions.SERVICES_CC);
            },
            canSeeCMB: function () {
                return this.canDo(this.permissions.SERVICES_CMB);
            },
            canSeeMCN: function () {
                return this.canDo(this.permissions.SERVICES_MCN);
            },
            canSeeMNN: function () {
                return this.canDo(this.permissions.SERVICES_MNN);
            },
            canSeePokeCall: function () {
                return this.canDo(this.permissions.SERVICES_PC);
            },
            canSeeSmsPlus: function () {
                return this.canDo(this.permissions.SERVICES_SMS_PLUS);
            },
            canSeeVM: function () {
                return this.canDo(this.permissions.SERVICES_VM);
            },
            canSeeWelcomeSMS: function () {
                return this.canDo(this.permissions.SERVICES_WELCOME_SMS);
            },
            // Subscription
            canSubscriptionAllSubscribe: function () {
                return this.canDo(this.permissions.SUBSCRIPTION_ALL_SUBSCRIBE);
            },
            canSubscriptionAllUnsubscribe: function () {
                return this.canDo(this.permissions.SUBSCRIPTION_ALL_UNSUBSCRIBE);
            },
            // Troubleshooting
            canReadTroubleshooting: function () {
                return this.canDo(this.permissions.READ_ALL_TROUBLESHOOTING);
            },
            canUpdateTroubleshooting: function () {
                return this.canDo(this.permissions.UPDATE_ALL_TROUBLESHOOTING);
            },
            canDeleteTroubleshooting: function () {
                return this.canDo(this.permissions.DELETE_ALL_TROUBLESHOOTING);
            },
            // AntiSpamSMS Content View
            canPeekAntiSpamSMSTroubleshooting: function (trafficType) {
                // MO (trafficType == 11|12|13)
                // P2P MT (trafficType == 21)
                // A2P MT (trafficType == 22|23)
                // AO (trafficType == 40)
                //
                // A2P = (A2P MT AO)
                // P2P = (MO + P2P MT)

                var A2P = [22, 23, 40];
                var P2P = [11, 12, 13, 21, 24];

                var trafficTypeNumber = s.toNumber(trafficType);

                var isPermitted = false;
                if (_.contains(A2P, trafficTypeNumber)) {
                    isPermitted = this.canDo(this.permissions.ANTISPAM_A2P_PEEK_TROUBLESHOOTING);
                } else if (_.contains(P2P, trafficTypeNumber)) {
                    isPermitted = this.canDo(this.permissions.ANTISPAM_P2A_PEEK_TROUBLESHOOTING) || this.canDo(this.permissions.ANTISPAM_P2P_PEEK_TROUBLESHOOTING);
                }

                return isPermitted;
            },
            // BMS Content View
            canPeekBMSSMSTroubleshooting: function () {
                var isPermitted = this.canDo(this.permissions.BMS_SMS_A2P_PEEK_TROUBLESHOOTING);

                return isPermitted;
            },
            // MMSC Content View
            canPeekMMSCTroubleshooting: function (senderAgentType, recipientAgentType) {
                var PEER = 1, APPLICATION = 3, UNKNOWN = 0;

                var isPermitted = false;
                if (Number(senderAgentType) === APPLICATION) {
                    isPermitted = this.canDo(this.permissions.MMSC_A2P_PEEK_TROUBLESHOOTING);
                } else if (Number(recipientAgentType) === APPLICATION) {
                    isPermitted = this.canDo(this.permissions.MMSC_P2A_PEEK_TROUBLESHOOTING);
                } else if (senderAgentType === PEER && (recipientAgentType === PEER || recipientAgentType === UNKNOWN)) {
                    isPermitted = this.canDo(this.permissions.MMSC_P2P_PEEK_TROUBLESHOOTING);
                }

                return isPermitted;
            },
            // SMSC Content View
            canPeekSMSCTroubleshooting: function (origAgentType, destAgentType) {
                var UNKNOWN = 0, APPLICATION = 1, PEER = 3;

                var isPermitted = false;
                if (origAgentType === APPLICATION && (destAgentType === PEER || destAgentType === UNKNOWN)) {
                    isPermitted = this.canDo(this.permissions.SMSC_A2P_PEEK_TROUBLESHOOTING);
                } else if (origAgentType === PEER && destAgentType === APPLICATION) {
                    isPermitted = this.canDo(this.permissions.SMSC_P2A_PEEK_TROUBLESHOOTING);
                } else if (origAgentType === PEER && (destAgentType === PEER || destAgentType === UNKNOWN)) {
                    isPermitted = this.canDo(this.permissions.SMSC_P2P_PEEK_TROUBLESHOOTING);
                }

                return isPermitted;
            },
            // USSD Content View
            canPeekUSSDTroubleshooting: function (isServiceInitiated) {
                var isPermitted = false;
                if (isServiceInitiated) {
                    isPermitted = this.canDo(this.permissions.USSD_A2P_PEEK_TROUBLESHOOTING);
                } else {
                    isPermitted = this.canDo(this.permissions.USSD_P2A_PEEK_TROUBLESHOOTING);
                }

                return isPermitted;
            }
        };
    });

})();
