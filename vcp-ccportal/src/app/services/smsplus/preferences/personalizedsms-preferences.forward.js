(function () {

    'use strict';

    angular.module('ccportal.services.personalizedsms.preferences.forward', []);

    var PersonalizedSMSPreferencesForwardModule = angular.module('ccportal.services.personalizedsms.preferences.forward');

    PersonalizedSMSPreferencesForwardModule.config(function ($stateProvider) {

        $stateProvider.state('services.personalizedsms.preferences.forward', {
            url: "/forward",
            templateUrl: 'services/smsplus/preferences/personalizedsms-preferences.details.main.html',
            data: {
                pageHeaderKey: 'Services.PersonalizedSMS.CommonPageLabels.Forward',
                otherFieldsTemplate: 'services/smsplus/preferences/personalizedsms-preferences.forward.html',
            },
            resolve: {
                serviceName: function (PersonalizedSMSSelfCareService) {
                    return PersonalizedSMSSelfCareService.SERVICES.FORWARD;
                },
                preferences: function (UtilService, PersonalizedSMSSelfCareService, searchPreferences) {
                    var msisdn = UtilService.getSubscriberMsisdn();

                    return searchPreferences(PersonalizedSMSSelfCareService.SERVICES.FORWARD, msisdn);
                }
            },
            controller: 'PersonalizedSMSPreferencesCtrl'
        });

    });

})();
