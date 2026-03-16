(function () {

    'use strict';

    angular.module('ccportal.services.personalizedsms.preferences', [
        'ccportal.services.personalizedsms.preferences.forward'
    ]);

    var PersonalizedSMSPreferencesModule = angular.module('ccportal.services.personalizedsms.preferences');

    PersonalizedSMSPreferencesModule.config(function ($stateProvider) {

        $stateProvider.state('services.personalizedsms.preferences', {
            abstract: true,
            url: "/preferences",
            templateUrl: 'services/smsplus/preferences/personalizedsms-preferences.html',
            resolve: {
                searchPreferences: function ($q, PersonalizedSMSSelfCareService, notification, $translate) {
                    var searchPreferences = _.debounce(function (serviceName, msisdn) {
                        var deferred = $q.defer();

                        PersonalizedSMSSelfCareService.getServiceSubscriberPreferences(serviceName, msisdn).then(function (response) {
                            if (response && response.errorCode) {
                                notification({
                                    type: 'danger',
                                    text: response.message
                                });
                            }

                            deferred.resolve(response);
                        });

                        return deferred.promise;
                    }, 500, {immediate: true});

                    return searchPreferences;
                }
            }
        });

    });

    PersonalizedSMSPreferencesModule.controller('PersonalizedSMSPreferencesCtrl', function ($scope, $state, $log, notification, $translate, Restangular, DateTimeConstants, UtilService,
                                                                                            PersonalizedSMSSelfCareService, serviceName, preferences) {
        $log.debug('PersonalizedSMSPreferencesCtrl');

        var msisdn = UtilService.getSubscriberMsisdn();

        preferences = ($scope.subscriptionPreferences ? $scope.subscriptionPreferences : Restangular.stripRestangular(preferences));
        $scope.subscriptionPreferences = _.defaults(preferences, {status: 'DISABLED', msisdn: msisdn});

        if (serviceName === PersonalizedSMSSelfCareService.SERVICES.COPY && $scope.subscriptionPreferences && $scope.subscriptionPreferences.destinationList) {
            $scope.subscriptionPreferences.destination = $scope.subscriptionPreferences.destinationList[0];
        }

        $scope.originalSubscriptionPreferences = angular.copy($scope.subscriptionPreferences);
        $scope.isNotChanged = function () {
            return angular.equals($scope.originalSubscriptionPreferences, $scope.subscriptionPreferences);
        };

        $scope.save = function (subscriptionPreferences) {
            var subscriptionPreferencesItem = angular.copy(subscriptionPreferences);

            if (serviceName === PersonalizedSMSSelfCareService.SERVICES.COPY) {
                subscriptionPreferencesItem.destinationList = [];
                subscriptionPreferencesItem.destinationList[0] = subscriptionPreferences.destination;

                delete subscriptionPreferencesItem.destination;
            }

            // Set permanent values.
            subscriptionPreferencesItem.routingCondition = "ALWAYS";
            subscriptionPreferencesItem.timeRestrictionMode = "UNRESTRICTED";

            var promise = null;
            if ($scope.originalSubscriptionPreferences.status === 'DISABLED' && subscriptionPreferences.status === 'ENABLED') {
                promise = PersonalizedSMSSelfCareService.subscribeServiceSubscription(serviceName, subscriptionPreferencesItem);
            } else if (subscriptionPreferences.status === 'DISABLED') {
                promise = PersonalizedSMSSelfCareService.unsubscribeServiceSubscription(serviceName, msisdn);
            } else {
                promise = PersonalizedSMSSelfCareService.updateServiceSubscriberPreferences(serviceName, msisdn, subscriptionPreferencesItem);
            }

            promise.then(function (response) {
                $log.debug('Update Success. Response: ', response);

                if (response && response.message) {
                    notification({
                        type: 'danger',
                        text: response.message
                    });
                } else {
                    $scope.originalSubscriptionPreferences = angular.copy(subscriptionPreferences);

                    notification({
                        type: 'success',
                        text: $translate.instant('CommonLabels.OperationSuccessful')
                    });
                }
            }, function (response) {
                $log.debug('Cannot update service. Error: ', response);
            });
        };

        $scope.cancel = function () {
            $state.reload();
        };
    });

})();
