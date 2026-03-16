(function () {
    'use strict';

    /* Authorization Services */
    angular.module('Application.authorization-services', []);

    var ApplicationAuthorizationServices = angular.module('Application.authorization-services');

    ApplicationAuthorizationServices.factory('AuthorizationService', function ($q, $log, UtilService, CMPFService, Restangular, RESOURCE_NAME) {
        return {
            userRights: [],
            permissions: {
                // Advertisements related permissions
                CREATE_ADVERTISEMENTS: "Advertisements:All:Create",
                READ_ADVERTISEMENTS: "Advertisements:All:Read",
                UPDATE_ADVERTISEMENTS: "Advertisements:All:Update",
                DELETE_ADVERTISEMENTS: "Advertisements:All:Delete",

                // Campaigns
                CREATE_CAMPAIGNS: "Campaigns:All:Create",
                READ_CAMPAIGNS: "Campaigns:All:Read",
                UPDATE_CAMPAIGNS: "Campaigns:All:Update",
                DELETE_CAMPAIGNS: "Campaigns:All:Delete",
                APPROVE_CAMPAIGNS: "Campaigns:All:Approve",

                // Charging
                CHARGING_ALL_REFUND: "Charging:All:Refund",

                // Configuration
                READ_CONFIGURATION: "Configuration:All:Read",
                UPDATE_CONFIGURATION: "Configuration:All:Update",

                // Distribution Lists
                CREATE_DISTRIBUTION_LISTS: "DistributionLists:All:Create",
                DELETE_DISTRIBUTION_LISTS: "DistributionLists:All:Delete",
                READ_DISTRIBUTION_LISTS: "DistributionLists:All:Read",
                UPDATE_DISTRIBUTION_LISTS: "DistributionLists:All:Update",

                // Distribution lists related permissions
                CREATE_GLOBAL_DISTRIBUTION_LISTS: "DistributionLists:Global:Create",
                DELETE_GLOBAL_DISTRIBUTION_LISTS: "DistributionLists:Global:Delete",
                READ_GLOBAL_DISTRIBUTION_LISTS: "DistributionLists:Global:Read",
                UPDATE_GLOBAL_DISTRIBUTION_LISTS: "DistributionLists:Global:Update",
                CREATE_ORGANIZATION_DISTRIBUTION_LISTS: "DistributionLists:Organization:Create",
                DELETE_ORGANIZATION_DISTRIBUTION_LISTS: "DistributionLists:Organization:Delete",
                READ_ORGANIZATION_DISTRIBUTION_LISTS: "DistributionLists:Organization:Read",
                UPDATE_ORGANIZATION_DISTRIBUTION_LISTS: "DistributionLists:Organization:Update",
                CREATE_USER_DISTRIBUTION_LISTS: "DistributionLists:User:Create",
                DELETE_USER_DISTRIBUTION_LISTS: "DistributionLists:User:Delete",
                READ_USER_DISTRIBUTION_LISTS: "DistributionLists:User:Read",
                UPDATE_USER_DISTRIBUTION_LISTS: "DistributionLists:User:Update",

                // Monitoring
                READ_MONITORING: "Monitoring:All:Read",
                UPDATE_MONITORING: "Monitoring:All:Update",
                DELETE_MONITORING: "Monitoring:All:Delete",

                // Generic Operations
                CREATE_OPERATIONS: "Operations:All:Create",
                READ_OPERATIONS: "Operations:All:Read",
                UPDATE_OPERATIONS: "Operations:All:Update",
                DELETE_OPERATIONS: "Operations:All:Delete",

                // Offer
                CREATE_OPERATIONS_OFFER: "Operations:Provisioning:Offer:Create",
                READ_OPERATIONS_OFFER: "Operations:Provisioning:Offer:Read",
                UPDATE_OPERATIONS_OFFER: "Operations:Provisioning:Offer:Update",
                DELETE_OPERATIONS_OFFER: "Operations:Provisioning:Offer:Delete",

                // Operator
                CREATE_OPERATIONS_OPERATOR: "Operations:Provisioning:Operator:Create",
                READ_OPERATIONS_OPERATOR: "Operations:Provisioning:Operator:Read",
                UPDATE_OPERATIONS_OPERATOR: "Operations:Provisioning:Operator:Update",
                DELETE_OPERATIONS_OPERATOR: "Operations:Provisioning:Operator:Delete",

                // Service
                CREATE_OPERATIONS_SERVICE: "Operations:Provisioning:Service:Create",
                READ_OPERATIONS_SERVICE: "Operations:Provisioning:Service:Read",
                UPDATE_OPERATIONS_SERVICE: "Operations:Provisioning:Service:Update",
                DELETE_OPERATIONS_SERVICE: "Operations:Provisioning:Service:Delete",

                // Service Provider
                CREATE_OPERATIONS_SERVICE_PROVIDER: "Operations:Provisioning:ServiceProvider:Create",
                READ_OPERATIONS_SERVICE_PROVIDER: "Operations:Provisioning:ServiceProvider:Read",
                UPDATE_OPERATIONS_SERVICE_PROVIDER: "Operations:Provisioning:ServiceProvider:Update",
                DELETE_OPERATIONS_SERVICE_PROVIDER: "Operations:Provisioning:ServiceProvider:Delete",

                // Subscriber
                CREATE_OPERATIONS_SUBSCRIBER: "Operations:Provisioning:Subscriber:Create",
                READ_OPERATIONS_SUBSCRIBER: "Operations:Provisioning:Subscriber:Read",
                UPDATE_OPERATIONS_SUBSCRIBER: "Operations:Provisioning:Subscriber:Update",
                DELETE_OPERATIONS_SUBSCRIBER: "Operations:Provisioning:Subscriber:Delete",

                // Subscription
                READ_OPERATIONS_SUBSCRIPTION: "Operations:Provisioning:Subscription:Read",

                // User Account
                CREATE_OPERATIONS_USERACCOUNT: "Operations:Provisioning:UserAccount:Create",
                READ_OPERATIONS_USERACCOUNT: "Operations:Provisioning:UserAccount:Read",
                UPDATE_OPERATIONS_USERACCOUNT: "Operations:Provisioning:UserAccount:Update",
                DELETE_OPERATIONS_USERACCOUNT: "Operations:Provisioning:UserAccount:Delete",

                // User Group
                CREATE_OPERATIONS_USERGROUP: "Operations:Provisioning:UserGroup:Create",
                READ_OPERATIONS_USERGROUP: "Operations:Provisioning:UserGroup:Read",
                UPDATE_OPERATIONS_USERGROUP: "Operations:Provisioning:UserGroup:Update",
                DELETE_OPERATIONS_USERGROUP: "Operations:Provisioning:UserGroup:Delete",

                // Products
                PRODUCTS_SMSC: "Products:SMSC",
                PRODUCTS_ANTISPAM: "Products:AntiSpam",
                PRODUCTS_BMS: "Products:BMS",
                PRODUCTS_LCGW: "Products:LCGW",
                PRODUCTS_MMSC: "Products:MMSC",

                // Reports
                READ_REPORTS_ONDEMAND: "Reports:OnDemand:Read",
                CREATE_REPORTS_SCHEDULED: "Reports:Scheduled:Create",
                READ_REPORTS_SCHEDULED: "Reports:Scheduled:Read",
                UPDATE_REPORTS_SCHEDULED: "Reports:Scheduled:Update",
                DELETE_REPORTS_SCHEDULED: "Reports:Scheduled:Delete",

                // Screening Lists
                CREATE_SCREENING_LISTS: "ScreeningLists:All:Create",
                READ_SCREENING_LISTS: "ScreeningLists:All:Read",
                UPDATE_SCREENING_LISTS: "ScreeningLists:All:Update",
                DELETE_SCREENING_LISTS: "ScreeningLists:All:Delete",

                // Distribution black lists related permissions
                CREATE_GLOBAL_SCREENING_LISTS: "ScreeningLists:Global:Create",
                READ_GLOBAL_SCREENING_LISTS: "ScreeningLists:Global:Read",
                UPDATE_GLOBAL_SCREENING_LISTS: "ScreeningLists:Global:Update",
                DELETE_GLOBAL_SCREENING_LISTS: "ScreeningLists:Global:Delete",
                CREATE_ORGANIZATION_SCREENING_LISTS: "ScreeningLists:Organization:Create",
                DELETE_ORGANIZATION_SCREENING_LISTS: "ScreeningLists:Organization:Delete",
                READ_ORGANIZATION_SCREENING_LISTS: "ScreeningLists:Organization:Read",
                UPDATE_ORGANIZATION_SCREENING_LISTS: "ScreeningLists:Organization:Update",
                CREATE_USER_SCREENING_LISTS: "ScreeningLists:User:Create",
                DELETE_USER_SCREENING_LISTS: "ScreeningLists:User:Delete",
                READ_USER_SCREENING_LISTS: "ScreeningLists:User:Read",
                UPDATE_USER_SCREENING_LISTS: "ScreeningLists:User:Update",

                // Subsystems
                SUBSYSTEMS_DIAGNOSTICS: "Subsystems:Diagnostics",
                SUBSYSTEMS_LICENSE_MGMT: "Subsystems:LicenseMgmt",
                SUBSYSTEMS_PROVISIONING: "Subsystems:Provisioning",
                SUBSYSTEMS_REPORT_GENERATION: "Subsystems:ReportGeneration",
                SUBSYSTEMS_SCREENING_MGMT: "Subsystems:ScreeningMgmt",


                // Templates related permissions
                CREATE_TEMPLATES: "Templates:All:Create",
                READ_TEMPLATES: "Templates:All:Read",
                UPDATE_TEMPLATES: "Templates:All:Update",
                DELETE_TEMPLATES: "Templates:All:Delete",

                // Troubleshooting
                READ_ALL_TROUBLESHOOTING: "Troubleshooting:All:Read",
                UPDATE_ALL_TROUBLESHOOTING: "Troubleshooting:All:Update",
                DELETE_ALL_TROUBLESHOOTING: "Troubleshooting:All:Delete",

                // Quota History
                READ_ALL_QUOTA_HISTORY: "QuotaHistory:All:Read",

                // SMSC Content View
                SMSC_A2P_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:A2P:Peek",
                SMSC_P2A_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:P2A:Peek",
                SMSC_P2P_PEEK_TROUBLESHOOTING: "Troubleshooting:SMSC:P2P:Peek",

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
            isOperationsPermitted: function (operationNames, otherUserRights) {
                var userRights = otherUserRights || this.getUserRights();

                var operationNameArray = _.isArray(operationNames) ? operationNames : [operationNames];

                var rightIntersection = _.intersection(userRights, operationNameArray);

                //$log.debug("Right intersection: ", rightIntersection);

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

            // Advertisements
            canCreateAdvertisements: function () {
                return this.canDo(this.permissions.CREATE_ADVERTISEMENTS);
            },
            canReadAdvertisements: function () {
                return this.canDo(this.permissions.READ_ADVERTISEMENTS);
            },
            canUpdateAdvertisements: function () {
                return this.canDo(this.permissions.UPDATE_ADVERTISEMENTS);
            },
            canDeleteAdvertisements: function () {
                return this.canDo(this.permissions.DELETE_ADVERTISEMENTS);
            },
            // Campaigns
            canCreateCampaigns: function () {
                return this.canDo(this.permissions.CREATE_CAMPAIGNS);
            },
            canReadCampaigns: function () {
                return this.canDo(this.permissions.READ_CAMPAIGNS);
            },
            canUpdateCampaigns: function () {
                return this.canDo(this.permissions.UPDATE_CAMPAIGNS);
            },
            canDeleteCampaigns: function () {
                return this.canDo(this.permissions.DELETE_CAMPAIGNS);
            },
            canApproveCampaigns: function () {
                return this.canDo(this.permissions.APPROVE_CAMPAIGNS);
            },
            // Charging
            canChargingAllRefund: function () {
                return this.canDo(this.permissions.CHARGING_ALL_REFUND);
            },
            // Configuration
            canReadConfiguration: function () {
                return this.canDo(this.permissions.READ_CONFIGURATION);
            },
            canUpdateConfiguration: function () {
                return this.canDo(this.permissions.UPDATE_CONFIGURATION);
            },
            // Distribution lists related permissions,
            canCreateDistributionListsAll: function () {
                return this.canDo(this.permissions.CREATE_DISTRIBUTION_LISTS);
            },
            canReadDistributionListsAll: function () {
                return this.canDo(this.permissions.READ_DISTRIBUTION_LISTS);
            },
            canUpdateDistributionListsAll: function () {
                return this.canDo(this.permissions.UPDATE_DISTRIBUTION_LISTS);
            },
            canDeleteDistributionListsAll: function () {
                return this.canDo(this.permissions.DELETE_DISTRIBUTION_LISTS);
            },
            canCreateDistributionLists: function (distListType) {
                var permission = this.permissions.CREATE_GLOBAL_DISTRIBUTION_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.CREATE_ORGANIZATION_DISTRIBUTION_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.CREATE_USER_DISTRIBUTION_LISTS;
                }

                return this.canDo(permission);
            },
            canReadDistributionLists: function (distListType) {
                var permission = this.permissions.READ_GLOBAL_DISTRIBUTION_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.READ_ORGANIZATION_DISTRIBUTION_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.READ_USER_DISTRIBUTION_LISTS;
                }

                return this.canDo(permission);
            },
            canUpdateDistributionLists: function (distListType) {
                var permission = this.permissions.UPDATE_GLOBAL_DISTRIBUTION_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.UPDATE_ORGANIZATION_DISTRIBUTION_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.UPDATE_USER_DISTRIBUTION_LISTS;
                }

                return this.canDo(permission);
            },
            canDeleteDistributionLists: function (distListType) {
                var permission = this.permissions.DELETE_GLOBAL_DISTRIBUTION_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.DELETE_ORGANIZATION_DISTRIBUTION_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.DELETE_USER_DISTRIBUTION_LISTS;
                }

                return this.canDo(permission);
            },
            // Monitoring
            canReadMonitoring: function () {
                return this.canDo(this.permissions.READ_MONITORING);
            },
            canUpdateMonitoring: function () {
                return this.canDo(this.permissions.UPDATE_MONITORING);
            },
            canDeleteMonitoring: function () {
                return this.canDo(this.permissions.DELETE_MONITORING);
            },
            // Generic Operation
            canCreate: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS);
            },
            canRead: function () {
                return this.canDo(this.permissions.READ_OPERATIONS);
            },
            canUpdate: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS);
            },
            canDelete: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS);
            },
            // Offer
            canCreateOffer: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_OFFER);
            },
            canReadOffer: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_OFFER);
            },
            canUpdateOffer: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_OFFER);
            },
            canDeleteOffer: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_OFFER);
            },
            // Operator
            canCreateOperator: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_OPERATOR);
            },
            canReadOperator: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_OPERATOR);
            },
            canUpdateOperator: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_OPERATOR);
            },
            canDeleteOperator: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_OPERATOR);
            },
            // Service
            canCreateService: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_SERVICE);
            },
            canReadService: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_SERVICE);
            },
            canUpdateService: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_SERVICE);
            },
            canDeleteService: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_SERVICE);
            },
            // ServiceProvider
            canCreateServiceProvider: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_SERVICE_PROVIDER);
            },
            canReadServiceProvider: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_SERVICE_PROVIDER);
            },
            canUpdateServiceProvider: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_SERVICE_PROVIDER);
            },
            canDeleteServiceProvider: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_SERVICE_PROVIDER);
            },
            // Subscriber
            canCreateSubscriber: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_SUBSCRIBER);
            },
            canReadSubscriber: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_SUBSCRIBER);
            },
            canUpdateSubscriber: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_SUBSCRIBER);
            },
            canDeleteSubscriber: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_SUBSCRIBER);
            },
            // Subscription
            canReadSubscription: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_SUBSCRIPTION);
            },
            // User Account
            canCreateUserAccount: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_USERACCOUNT);
            },
            canReadUserAccount: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_USERACCOUNT);
            },
            canUpdateUserAccount: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_USERACCOUNT);
            },
            canDeleteUserAccount: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_USERACCOUNT);
            },
            // User Group
            canCreateUserGroup: function () {
                return this.canDo(this.permissions.CREATE_OPERATIONS_USERGROUP);
            },
            canReadUserGroup: function () {
                return this.canDo(this.permissions.READ_OPERATIONS_USERGROUP);
            },
            canUpdateUserGroup: function () {
                return this.canDo(this.permissions.UPDATE_OPERATIONS_USERGROUP);
            },
            canDeleteUserGroup: function () {
                return this.canDo(this.permissions.DELETE_OPERATIONS_USERGROUP);
            },

            // Products
            canSeeSMSC: function () {
                return this.canDo(this.permissions.PRODUCTS_SMSC);
            },
            canSeeAntiSpam: function () {
                return this.canDo(this.permissions.PRODUCTS_ANTISPAM);
            },
            canSeeMMSC: function () {
                return this.canDo(this.permissions.PRODUCTS_MMSC);
            },

            // Reports
            canReadReportOnDemand: function () {
                return this.canDo(this.permissions.READ_REPORTS_ONDEMAND);
            },
            canCreateReportSchedule: function () {
                return this.canDo(this.permissions.CREATE_REPORTS_SCHEDULED);
            },
            canReadReportSchedule: function () {
                return this.canDo(this.permissions.READ_REPORTS_SCHEDULED);
            },
            canUpdateReportSchedule: function () {
                return this.canDo(this.permissions.UPDATE_REPORTS_SCHEDULED);
            },
            canDeleteReportSchedule: function () {
                return this.canDo(this.permissions.DELETE_REPORTS_SCHEDULED);
            },
            // Screening List
            canCreateScreeningLists: function () {
                return this.canDo(this.permissions.CREATE_SCREENING_LISTS);
            },
            canReadScreeningLists: function () {
                return this.canDo(this.permissions.READ_SCREENING_LISTS);
            },
            canUpdateScreeningLists: function () {
                return this.canDo(this.permissions.UPDATE_SCREENING_LISTS);
            },
            canDeleteScreeningLists: function () {
                return this.canDo(this.permissions.DELETE_SCREENING_LISTS);
            },
            // Distribution black lists related permissions
            canCreateDistributionBlackLists: function (distListType) {
                var permission = this.permissions.CREATE_GLOBAL_SCREENING_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.CREATE_ORGANIZATION_SCREENING_LISTS;
                }
                if (distListType === 'USER') {
                    permission = this.permissions.CREATE_USER_SCREENING_LISTS;
                }

                return this.canDo(permission);
            },
            canReadDistributionBlackLists: function (distListType) {
                var permission = this.permissions.READ_GLOBAL_SCREENING_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.READ_ORGANIZATION_SCREENING_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.READ_USER_SCREENING_LISTS;
                }

                return this.canDo(permission);
            },
            canUpdateDistributionBlackLists: function (distListType) {
                var permission = this.permissions.UPDATE_GLOBAL_SCREENING_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.UPDATE_ORGANIZATION_SCREENING_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.UPDATE_USER_SCREENING_LISTS;
                }

                return this.canDo(permission);
            },
            canDeleteDistributionBlackLists: function (distListType) {
                var permission = this.permissions.DELETE_GLOBAL_SCREENING_LISTS;
                if (distListType === 'ORGANIZATION') {
                    permission = this.permissions.DELETE_ORGANIZATION_SCREENING_LISTS;
                } else if (distListType === 'USER') {
                    permission = this.permissions.DELETE_USER_SCREENING_LISTS;
                }

                return this.canDo(permission);
            },

            // Subsystems
            canSeeDiagnostics: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_DIAGNOSTICS);
            },
            canSeeLicenseMgmt: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_LICENSE_MGMT);
            },
            canSeeProvisioning: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_PROVISIONING);
            },
            canSeeReportGeneration: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_REPORT_GENERATION);
            },
            canSeeScreeningMgmt: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_SCREENING_MGMT);
            },
            canSeeSubscriptionMgmt: function () {
                return this.canDo(this.permissions.SUBSYSTEMS_SUBSCRIPTION_MGMT);
            },
            // Templates
            canCreateTemplates: function () {
                return this.canDo(this.permissions.CREATE_TEMPLATES);
            },
            canReadTemplates: function () {
                return this.canDo(this.permissions.READ_TEMPLATES);
            },
            canUpdateTemplates: function () {
                return this.canDo(this.permissions.UPDATE_TEMPLATES);
            },
            canDeleteTemplates: function () {
                return this.canDo(this.permissions.DELETE_TEMPLATES);
            },
            // Quota History
            canReadQuotaHistory: function () {
                return this.canDo(this.permissions.READ_ALL_QUOTA_HISTORY);
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

        };
    });

})();
