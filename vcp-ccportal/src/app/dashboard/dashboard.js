(function () {

    'use strict';

    angular.module('ccportal.dashboard', []);

    var DashboardModule = angular.module('ccportal.dashboard');

    DashboardModule.config(function ($stateProvider) {

        $stateProvider.state('dashboards', {
            url: "/dashboard",
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            data: {
                headerKey: 'Dashboard.PageHeader'
            }
        });

    });

    DashboardModule.controller('DashboardCtrl', function ($rootScope, $scope, $log, $location, $state, $stateParams, $translate, notification, UtilService,
                                                          SSMSubscribersService) {
        // Remove subscriber profile information from session store
        UtilService.removeFromSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY);

        $scope.find = function (subscriber) {
            // TODO: FASTWEB - unclear if the profiles will be checked from SSM or from the cmpf
            var subscriberProfile =  {
                "id": undefined,
                "msisdn": subscriber.msisdn,
                //"paymentType": null,
                "contractId": subscriber.msisdn,
                //"lang": undefined,
                "state": {
                    "currentState": undefined,
                    "oldState": undefined
                },
                "version": undefined,
                "subscriptions": [],
                "attributes": []
            }
            SSMSubscribersService.prepareSubscriberProfile(subscriberProfile);
            $log.debug('Prepared subscriber profile for the msisdn: ', subscriberProfile.msisdn, ', SubscriberProfile: ', subscriberProfile);


            // Here is writing application styled json object to the current session
            UtilService.putToSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY, subscriberProfile);
            UtilService.putToSessionStore(UtilService.MSISDN_KEY, subscriberProfile.msisdn);

            $state.params.doNotQuerySubscriber = true;
            $state.go('subscriber-info.subscriber-profile');
        };
    });

})();
