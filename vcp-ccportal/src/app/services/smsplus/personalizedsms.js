(function () {

    'use strict';

    angular.module('ccportal.services.personalizedsms', [
        "ccportal.services.personalizedsms.constants",
        "ccportal.services.personalizedsms.filters",
        "ccportal.services.personalizedsms.directives",
        "ccportal.services.personalizedsms.preferences",
        "ccportal.services.personalizedsms.troubleshooting"
    ]);

    var PersonalizedSMSModule = angular.module('ccportal.services.personalizedsms');

    PersonalizedSMSModule.config(function ($stateProvider) {

        $stateProvider.state('services.personalizedsms', {
            abstract: true,
            url: "/sms-plus",
            templateUrl: 'services/smsplus/personalizedsms.html',
            data: {
                headerKey: 'Services.PersonalizedSMS.PageHeader',
                permissions: [
                    'SERVICES_SMS_PLUS'
                ]
            }
        });

    });

})();
