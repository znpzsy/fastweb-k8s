(function () {

    'use strict';

    angular.module('adminportal.subsystems.subscriptionmanagement.operations.subscribers', []);

    var SubscriptionManagementOperationsSubscribersModule = angular.module('adminportal.subsystems.subscriptionmanagement.operations.subscribers');

    SubscriptionManagementOperationsSubscribersModule.config(function ($stateProvider) {

        $stateProvider.state('subsystems.subscriptionmanagement.operations.subscribers', {
            abstract: true,
            url: "/subscribers",
            template: "<div ui-view></div>"
        }).state('subsystems.subscriptionmanagement.operations.subscribers.list', {
            url: "/list",
            templateUrl: "subsystems/subscriptionmanagement/operations/subscribers/operations.subscribers.html",
            controller: 'SubscriptionManagementOperationsSubscribersCtrl'
        }).state('subsystems.subscriptionmanagement.operations.subscribers.view', {
            url: "/:id",
            templateUrl: "subsystems/subscriptionmanagement/operations/subscribers/operations.subscribers.detail.html",
            controller: 'SubscriptionManagementOperationsSubscribersViewCtrl',
            resolve: {
                subscriber: function ($stateParams, SSMSubscribersService) {
                    return SSMSubscribersService.getSubscriberById($stateParams.id, false);
                }
            }
        });

    });

    SubscriptionManagementOperationsSubscribersModule.controller('SubscriptionManagementOperationsSubscribersCommonCtrl', function ($scope, $log, $q, notification, $translate, $uibModal, CMPFService) {
        $log.debug('SubscriptionManagementOperationsSubscribersCommonCtrl');

        $scope.showOperators = function (subscriber) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/modal/modal.organizations.html',
                controller: 'OrganizationsModalInstanceCtrl',
                size: 'lg',
                resolve: {
                    organizationParameter: function () {
                        return angular.copy($scope.selectedOrganization);
                    },
                    itemName: function () {
                        return subscriber.subscriberProfile ? subscriber.subscriberProfile.msisdn : '';
                    },
                    allOrganizations: function (CMPFService, DEFAULT_REST_QUERY_LIMIT) {
                        return CMPFService.getAllOperators(0, DEFAULT_REST_QUERY_LIMIT);
                    },
                    organizationsModalTitleKey: function () {
                        return 'Subsystems.SubscriptionManagement.Operations.Subscribers.OperatorsModalTitle';
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.subscriber.organization = selectedItem.organization;
                $scope.subscriber.organizationId = selectedItem.organization.id;
            }, function () {
                //
            });
        };

        $scope.showSuccessMessage = function () {
            notification.flash({
                type: 'success',
                text: $translate.instant('CommonLabels.OperationSuccessful')
            });

            $scope.cancel();
        };

        $scope.cancel = function () {
            $scope.go('subsystems.subscriptionmanagement.operations.subscribers.list');
        };
    });

    SubscriptionManagementOperationsSubscribersModule.controller('SubscriptionManagementOperationsSubscribersCtrl', function ($scope, $log, $q, $controller, $timeout, $translate, notification, $uibModal, NgTableParams, UtilService,
                                                                                                                              Restangular, SSMSubscribersService, CMPFService) {
        $log.debug('SubscriptionManagementOperationsSubscribersCtrl');

        $scope.subscriberList = {
            list: [],
            tableParams: {}
        };

        // Subscriber list of current scope definitions
        $scope.subscriberList.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {
                "msisdn": 'desc'
            }
        }, {
            total: $scope.subscriberList.list.length, // length of data
            $scope: $scope,
            getData: function ($defer, params) {
                var msisdnFilterText = params.settings().$scope.msisdnFilterText;

                var deferred = $q.defer();

                SSMSubscribersService.getSubscribers(params.page() - 1, params.count(), msisdnFilterText).then(function (response) {
                    $log.debug('Subscribers: ', response);

                    var subscribersResponse = Restangular.stripRestangular(response);
                    if (subscribersResponse) {
                        deferred.resolve({
                            total: subscribersResponse.totalElements,
                            list: subscribersResponse.content
                        });
                    } else {
                        deferred.resolve({total: 0, list: []});
                    }
                }, function (response) {
                    $log.debug('Cannot read subscribers. Error: ', response);

                    deferred.resolve({total: 0, list: []});
                });

                deferred.promise.then(function (response) {
                    $scope.subscriberList.list = response.list;

                    params.total(response.total);
                    $defer.resolve(response.list);
                });
            }
        });
        // END - Subscriber list of current scope definitions

        $scope.filterTableByMsisdn = _.throttle(function (msisdnFilterText) {
            $scope.subscriberList.tableParams.settings().$scope.msisdnFilterText = msisdnFilterText;
            $scope.subscriberList.tableParams.page(1);
            $scope.subscriberList.tableParams.reload();
        }, 2000);
        $scope.filterTableByMsisdnChange = function (msisdnFilterText) {
            if (!msisdnFilterText) {
                $scope.filterTableByMsisdn(null);
            }
        };

        $scope.showOfferSubscriptions = function (subscriber) {
            subscriber.rowSelected = true;

            var modalInstance = $uibModal.open({
                templateUrl: 'subsystems/subscriptionmanagement/operations/subscribers/operations.subscribers.modal.subscriptions.html',
                controller: 'SubscriptionManagementOperationsSubscribersOfferSubscriptionsModalCtrl',
                size: 'lg',
                resolve: {
                    subscriberParameter: function () {
                        return subscriber;
                    },
                    offerSubscriptions: function (SSMSubscribersService, DEFAULT_REST_QUERY_LIMIT) {
                        return SSMSubscribersService.getOfferSubscriptionsByMsisdn(0, DEFAULT_REST_QUERY_LIMIT, subscriber.msisdn);
                    }
                }
            });

            modalInstance.result.then(function () {
                subscriber.rowSelected = false;
            }, function () {
                subscriber.rowSelected = false;
            });
        };
    });

    SubscriptionManagementOperationsSubscribersModule.controller('SubscriptionManagementOperationsSubscribersViewCtrl', function ($scope, $controller, $state, $log, $uibModal, $translate, notification, CMPFService, Restangular,
                                                                                                                                  PROVISIONING_PAYMENT_TYPES, PROVISIONING_LANGUAGES, PROVISIONING_STATUSES, subscriber) {
        $log.debug('SubscriptionManagementOperationsSubscribersViewCtrl');

        $controller('SubscriptionManagementOperationsSubscribersCommonCtrl', {$scope: $scope});

        $scope.subscriber = Restangular.stripRestangular(subscriber);

        /*
        $scope.PROVISIONING_PAYMENT_TYPES = PROVISIONING_PAYMENT_TYPES;
        $scope.PROVISIONING_LANGUAGES = PROVISIONING_LANGUAGES;
        $scope.PROVISIONING_STATUSES = PROVISIONING_STATUSES;

        $scope.subscriber = Restangular.stripRestangular(subscriber);
        var subscriberProfile = CMPFService.extractSubscriberProfile($scope.subscriber);
        $scope.subscriber.subscriberProfile = subscriberProfile;

        $scope.subscriberOriginal = angular.copy($scope.subscriber);
        $scope.isNotChanged = function () {
            return angular.equals($scope.subscriberOriginal, $scope.subscriber);
        };

        $scope.save = function (subscriber) {
            var subscriberItem = {
                // Set originals
                id: $scope.subscriberOriginal.id,
                // Editable fields on the update mode
                organizationId: subscriber.organizationId,
                state: subscriber.subscriberProfile.Status.toUpperCase(),
                profiles: $scope.subscriberOriginal.profiles
            };

            // SubscriberProfile related steps
            var originalSubscriberProfileDef = CMPFService.getSubscriberProfile(subscriberItem);
            if (!_.isEmpty(originalSubscriberProfileDef) && !_.isUndefined(originalSubscriberProfileDef)) {
                _.each(subscriber.subscriberProfile, function (originalSubscriberProfileValue, key) {
                    var originalSubscriberProfileAttr = _.findWhere(originalSubscriberProfileDef.attributes, {name: key});
                    if (originalSubscriberProfileAttr) {
                        originalSubscriberProfileAttr.value = originalSubscriberProfileValue;
                    }
                });
            } else {
                var originalSubscriberProfile = $scope.prepareNewSubscriberProfile(subscriber.originalSubscriberProfile);

                // If there is no profile definition in the profiles array then put in it the new one.
                subscriberItem.profiles.push(originalSubscriberProfile);
            }

            CMPFService.updateSubscriber(subscriberItem).then(function (response) {
                $log.debug('Update Success. Response: ', response);

                if (response && response.errorCode) {
                    CMPFService.showApiError(response);
                } else {
                    notification.flash({
                        type: 'success',
                        text: $translate.instant('Subsystems.SubscriptionManagement.Operations.Subscribers.Messages.SubscriberUpdatingSucceded')
                    });

                    $scope.go('subsystems.subscriptionmanagement.operations.subscribers.list');
                }
            }, function (response) {
                $log.debug('Cannot update subscriber. Error: ', response);

                if (!_.isUndefined(response.data) && !_.isUndefined(response.data.message)) {
                    notification({
                        type: 'warning',
                        text: response.data.message
                    });
                } else {
                    notification({
                        type: 'danger',
                        text: $translate.instant('Subsystems.SubscriptionManagement.Operations.Subscribers.Messages.SubscriberUpdatingError')
                    });
                }
            });
        };
        */
    });

    SubscriptionManagementOperationsSubscribersModule.controller('SubscriptionManagementOperationsSubscribersOfferSubscriptionsModalCtrl', function ($scope, $uibModalInstance, $log, $timeout, $filter, NgTableParams, NgTableService, Restangular, SSMSubscribersService,
                                                                                                                                                     subscriberParameter, offerSubscriptions) {
        $log.debug('SubscriptionManagementOperationsSubscribersOfferSubscriptionsModalCtrl');

        $scope.subscriber = subscriberParameter;

        $scope.offerSubscriptions = Restangular.stripRestangular(offerSubscriptions);

        $scope.exportOptions = {
            columns: [
                {
                    fieldName: 'id',
                    headerKey: 'Subsystems.SubscriptionManagement.Operations.Subscribers.TableColumns.OfferId'
                },
                {
                    fieldName: 'name',
                    headerKey: 'Subsystems.SubscriptionManagement.Operations.Subscribers.TableColumns.OfferName'
                },
                {
                    fieldName: 'subscriptionState',
                    headerKey: 'Subsystems.SubscriptionManagement.Operations.Subscribers.TableColumns.SubscriptionState'
                },
                {
                    fieldName: 'lastSubscriptionDate',
                    headerKey: 'Subsystems.SubscriptionManagement.Operations.Subscribers.TableColumns.LastSubscriptionDate',
                    filter: {name: 'date', params: ['yyyy-MM-dd HH:mm:ss']}
                }
            ]
        };

        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {
                "id": 'asc'
            }
        }, {
            $scope: $scope,
            total: 0,
            getData: function ($defer, params) {
                var filterText = params.settings().$scope.filterText;
                var filterColumns = params.settings().$scope.filterColumns;
                var filteredListData = NgTableService.filterList(filterText, filterColumns, $scope.offerSubscriptions.content);
                var orderedData = params.sorting() ? $filter('orderBy')(filteredListData, params.orderBy()) : $scope.offerSubscriptions.content;
                params.total(orderedData.length); // set total for recalc pagination
                if ((params.total() > 0) && (params.total() === (params.count() * (params.page() - 1)))) {
                    params.page(params.page() - 1);
                }

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.filterTable = _.debounce(function (filterText, filterColumns) {
            $scope.tableParams.settings().$scope.filterText = filterText;
            $scope.tableParams.settings().$scope.filterColumns = filterColumns;
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }, 500);

        $scope.close = function () {
            $uibModalInstance.close();
        };

        $uibModalInstance.result.then(function () {
            $scope.isDataFetchingInProgress = false;
        }, function () {
            $scope.isDataFetchingInProgress = false;
        });
    });

})();