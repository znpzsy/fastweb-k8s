(function () {
    'use strict';

    /* Restful Services */
    angular.module('Application.rest-services', []);

    var ApplicationRestServices = angular.module('Application.rest-services');

    // Restangular service which connects to CMPF rest service
    ApplicationRestServices.factory('CMPFAuthRestangular', function (Restangular, RESOURCE_NAME) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setDefaultHeaders({
                'ServiceLabel': 'CMPF Authorization',
                'ResourceName': RESOURCE_NAME
            });
            RestangularConfigurer.setBaseUrl('/cmpf-auth-rest');
        });
    });

    ApplicationRestServices.constant('SERVICES_BASE', '/vcp/services');

    ApplicationRestServices.factory('MainRestangularConfService', function (Restangular, SERVICES_BASE, SessionService) {
        return {
            prepareRestangularConf: function (restangularInstance, serviceLabel, baseUrl) {
                return restangularInstance.withConfig(function (RestangularConfigurer) {
                    RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                        headers.Channel = 'CC';
                        headers.Username = SessionService.getUsername();
                        headers.TransactionId = new Date().getTime();
                        headers.ServiceLabel = serviceLabel;

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
    ApplicationRestServices.factory('ServerInformationRestangular', function (Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('/');
        });
    });
    ApplicationRestServices.factory('ServerConfigurationRestangular', function (Restangular, SessionService) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
                headers.Channel = 'CC';
                headers.Username = SessionService.getUsername();
                headers.TransactionId = new Date().getTime();
                headers.ServiceLabel = 'Server Configuration';

                return {
                    headers: headers
                };
            });

            RestangularConfigurer.setBaseUrl('/conf');
        });
    });

    ApplicationRestServices.factory('CMPFRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'CMPF', '/cmpf-rest');
    });
    ApplicationRestServices.factory('CMPFCacheRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'CMPF Cache', '/cmpf-cache-rest');
    });

    // Restangular service which connects to Screening Manager rest service
    ApplicationRestServices.factory('ScreeningManagerRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Screening Manager', '/screening-manager-rest/v2');
    });

    ApplicationRestServices.factory('ScreeningManagerStatsRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Screening Manager Statistics', '/screening-manager-stats-rest/v1');
    });

    //  SMSC rest services
    ApplicationRestServices.factory('SmscConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Configuration', '/smsc-gr-rest/configuration/v1');
    });
    ApplicationRestServices.factory('SmscProvRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Provisioning', '/smsc-gr-rest/provisioning/v1');
    });
    ApplicationRestServices.factory('SmscDashboardRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Dashboard', '/smsc-gr-rest/dashboard/smsc/v1');
    });
    ApplicationRestServices.factory('SmscOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Operation', '/smsc-operation-local-rest/v1');
    });
    ApplicationRestServices.factory('SmscRemoteOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC Remote Operation', '/smsc-operation-remote-rest/v1');
    });
    ApplicationRestServices.factory('SfeDashboardRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SFE Dashboard', '/smsc-sfe-dashboard-local-rest/v1');
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
    ApplicationRestServices.factory('SmscEDRReportingServiceRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMSC EDR Reporting Service', '/smsc-edr-reporting-rest');
    });

    // MMSC rest services
    ApplicationRestServices.factory('MmscConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Configuration', '/mmsc-config-gr-rest/v2');
    });
    ApplicationRestServices.factory('MmscOperationRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Operation', '/mmsc-operation-gr-rest/v1');
    });
    ApplicationRestServices.factory('MmscDashboardRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Dashboard', '/mmsc-dashboard-local-rest/v2');
    });
    ApplicationRestServices.factory('MmscTroubleshootingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Troubleshooting', '/mmsc-troubleshooting-local-rest/v2');
    });
    ApplicationRestServices.factory('MmscRemoteTroubleshootingRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'MMSC Troubleshooting Remote', '/mmsc-troubleshooting-remote-rest/v2');
    });

    // SMS AntiSpam Services
    ApplicationRestServices.factory('SMSAntiSpamRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMS Anti-Spam', '/smsantispam-core-gr-rest');
    });
    ApplicationRestServices.factory('SMSAntiSpamConfigRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'SMS Anti-Spam Configuration', '/smsantispam-config-gr-rest/v1');
    });

    // License Manager
    ApplicationRestServices.factory('LicenseManagerRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'License Manager', '/license-manager-rest');
    });

    // Pentaho
    ApplicationRestServices.factory('PentahoRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Pentaho', '/pentaho');
    });
    ApplicationRestServices.factory('PentahoApiRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Pentaho API', '/pentaho/api');
    });

    // Diagnostics
    ApplicationRestServices.factory('DiagnosticsRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Diagnostics', '/diagnostics-rest');
    });

    // Subscription Management Services
    ApplicationRestServices.factory('SubscriptionManagementRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Subscription Management', '/subscription-management-rest');
    });

    // Subscription Management Services
    ApplicationRestServices.factory('SubscriptionManagementRestangular', function (Restangular, MainRestangularConfService) {
        return MainRestangularConfService.prepareRestangularConf(Restangular, 'Subscription Management', '/subscription-management-rest');
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
