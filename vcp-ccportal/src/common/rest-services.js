(function () {
    'use strict';

    /* Restful Services */
    angular.module('Application.rest-services', []);

    var ApplicationRestServices = angular.module('Application.rest-services');

    // Restangular service which connects to CMPF rest service
    ApplicationRestServices.factory('CMPFAuthRestangular', function (Restangular, SessionService, RESOURCE_NAME) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setDefaultHeaders({
                'Channel': 'CC',
                'Username': (_.isEmpty(SessionService.getUsername()) ? undefined : SessionService.getUsername()),
                'TransactionId': new Date().getTime(),
                'ServiceLabel': 'CMPF Authorization',
                'ResourceName': RESOURCE_NAME
            });
            RestangularConfigurer.setBaseUrl('/cmpf-auth-rest');
        });
    });

    ApplicationRestServices.constant('SERVICES_BASE', '/vcp/services');

    ApplicationRestServices.factory('MainRestangularConfService', function (Restangular, SessionService, SERVICES_BASE, RESOURCE_NAME) {
        return {
            prepareRestangularConf: function (restangularInstance, serviceLabel, baseUrl) {
                return restangularInstance.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                        headers.Channel = 'CC';
                        headers.Username = SessionService.getUsername();
                        headers.TransactionId = new Date().getTime();
                        headers.ServiceLabel = serviceLabel;
                        headers.ResourceName = RESOURCE_NAME;

                        return {
                            headers: headers
                        };
                    });

                    RestangularConfigurer.setBaseUrl(SERVICES_BASE + baseUrl);
                });
            }
        };
    });

    // Server Information and Configuration Restangular
    ApplicationRestServices.factory('ServerInformationRestangular', function (Restangular, SessionService, RESOURCE_NAME) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setDefaultHeaders({
                'Channel': 'CC',
                'Username': (_.isEmpty(SessionService.getUsername()) ? undefined : SessionService.getUsername()),
                'TransactionId': new Date().getTime(),
                'ServiceLabel': 'Server Information',
                'ResourceName': RESOURCE_NAME
            });
            RestangularConfigurer.setBaseUrl('/');
        });
    });

    ApplicationRestServices.factory('CMPFRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'CMPF', '/cmpf-rest');
    });
    ApplicationRestServices.factory('CMPFCacheRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'CMPF Cache', '/cmpf-cache-rest');
    });

    // Restangular service which connects to SSM rest service
    ApplicationRestServices.factory('SSMSubscribersRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SSM Subscribers Service', '/ssm-subscribers-rest/v1');
    });
    ApplicationRestServices.factory('VCPSubscribersRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'VCP Subscribers Service', '/vcp-subscriptions-rest/v1');
    });

    // Restangular service which connects to Screening Manager rest service
    ApplicationRestServices.factory('ScreeningManagerRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Screening Manager', '/screening-manager-rest/v2');
    });
    ApplicationRestServices.factory('ScreeningManagerV3Restangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Screening Manager V3', '/screening-manager-rest/v3');
    });
    ApplicationRestServices.factory('ScreeningManagerStatsRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Screening Manager Statistics', '/screening-manager-stats-rest/v1');
    });

    //  SMSC rest services
    ApplicationRestServices.factory('SmscConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Configuration', '/smsc-rest/configuration/v1');
    });
    ApplicationRestServices.factory('SmscProvRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Provisioning', '/smsc-rest/provisioning/v1');
    });
    ApplicationRestServices.factory('SmscOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Operation', '/smsc-operation-local-rest/v1');
    });
    ApplicationRestServices.factory('SmscRemoteOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Remote Operation', '/smsc-operation-remote-rest/v1');
    });
    ApplicationRestServices.factory('SfeReportingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SFE Reporting', '/smsc-sfe-reporting-local-rest/v1');
    });
    ApplicationRestServices.factory('SfeRemoteReportingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SFE Remote Reporting', '/smsc-sfe-reporting-remote-rest/v1');
    });
    ApplicationRestServices.factory('SmscSenderApplicationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Sender Application', '/smsc-sender-application-local-rest/application/sender');
    });
    ApplicationRestServices.factory('SmscRemoteSenderApplicationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Sender Remote Application', '/smsc-sender-application-remote-rest/application/sender');
    });

    // SMS AntiSpam Services
    ApplicationRestServices.factory('SMSAntiSpamRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMS Anti-Spam', '/smsantispam-core-rest');
    });
    ApplicationRestServices.factory('SMSAntiSpamConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMS Anti-Spam Configuration', '/smsantispam-config-rest/v1');
    });

    // Restangular service that MMSC troubleshooting rest service uses
    ApplicationRestServices.factory('MmscTroubleshootingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Troubleshooting', '/mmsc-troubleshooting-local-rest/v2');
    });
    ApplicationRestServices.factory('MmscRemoteTroubleshootingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Troubleshooting Remote', '/mmsc-troubleshooting-remote-rest/v2');
    });

    // USSD Gateway restangular definitions
    ApplicationRestServices.factory('UssdBrowserRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'USSD Browser', '/ussd-browser-rest/v1');
    });

    // Bulk Messaging Services
    ApplicationRestServices.factory('BulkMessagingOperationsV2Restangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Bulk Messaging Operations v2', '/bms-bulkmsg-operations-rest/v2');
    });

    // Missed Call Notification
    ApplicationRestServices.factory('MCAProvRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Missed Call Notification', '/mcn-provisioning-rest/v3');
    });
    ApplicationRestServices.factory('MCAConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Missed Call Notification Configuration', '/mcn-configuration-rest/v5');
    });
    ApplicationRestServices.factory('MCAMainRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Missed Call Notification Main Rest', '/mcn-main-rest/v1');
    });
    ApplicationRestServices.factory('MCATasRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Missed Call Notification Tas Rest', '/tas-main-rest/v1');
    });

    // Voice Mail
    ApplicationRestServices.factory('VMConfigurationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Voice Mail Configuration', '/voicemail-rest/configuration/v1');
    });
    ApplicationRestServices.factory('VMSelfCareRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Voice Mail Self Care', '/voicemail-rest/cc/v4');
    });
    ApplicationRestServices.factory('VMProvisioningRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Voice Mail Provisioning', '/voicemail-rest/provisioning/v1');
    });

    // My New Number
    ApplicationRestServices.factory('MNNConfigurationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'My New Number Configuration', '/churnin-configuration-rest/v1');
    });

    // Personalized SMS Services
    ApplicationRestServices.factory('PersonalizedSMSSelfCareRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMS Plus Self Care', '/sms-plus-rest/self-care/v1');
    });

    // Welcome SMS Services
    ApplicationRestServices.factory('WelcomeSMSOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Welcome SMS Operation', '/welcome-sms-operation-rest/v1');
    });

    // P4M
    ApplicationRestServices.factory('P4MRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'P4M Service', '/p4m-rest/v3');
    });

    // Elastic search services
    ApplicationRestServices.service('ESClient', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search Main Local', '/es-local-rest');
    });
    ApplicationRestServices.service('ESClientRemote', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search Main Remote', '/es-remote-rest');
    });
    ApplicationRestServices.service('SmscESClient', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMSC Local', '/smsc-es-local-rest');
    });
    ApplicationRestServices.service('SmscESClientRemote', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMSC Remote', '/smsc-es-remote-rest');
    });
    ApplicationRestServices.service('SmscESAdapterClient', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search Adapter SMSC Local', '/smsc-es-adapter-local-rest');
    });
    ApplicationRestServices.service('SmscESAdapterClientRemote', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search Adapter SMSC Remote', '/smsc-es-adapter-remote-rest');
    });
    ApplicationRestServices.service('SMSAntiSpamESClient', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMS Anti-Spam Local', '/smsantispam-es-local-rest');
    });
    ApplicationRestServices.service('SMSAntiSpamESClientRemote', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMS Anti-Spam Remote', '/smsantispam-es-remote-rest');
    });
    ApplicationRestServices.service('SMSAntiSpamESAdapterClient', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMS Anti-Spam Adapter Local', '/smsantispam-es-adapter-local-rest');
    });
    ApplicationRestServices.service('SMSAntiSpamESAdapterClientRemote', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Elastic Search SMS Anti-Spam Adapter Remote', '/smsantispam-es-adapter-remote-rest');
    });

})();
