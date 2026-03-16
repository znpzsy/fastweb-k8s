(function () {

    'use strict';

    angular.module('adminportal.products.antispamsms.operations.scamodifiers', []);

    var AntiSpamSMSOperationsSCAModifiersModule = angular.module('adminportal.products.antispamsms.operations.scamodifiers');

    AntiSpamSMSOperationsSCAModifiersModule.config(function ($stateProvider) {

        $stateProvider.state('products.antispamsms.operations.scamodifiers', {
            url: "/sca-modifiers",
            template: '<div ui-view></div>'
        }).state('products.antispamsms.operations.scamodifiers.list', {
            url: "/list",
            templateUrl: "products/antispamsms/operations/operations.scamodifiers.html",
            controller: 'AntiSpamSMSOperationsSCAModifiersCtrl',
            resolve: {
                scaModifiers: function (SMSAntiSpamConfigService) {
                    return SMSAntiSpamConfigService.getSCAModifierList();
                }
            }
        }).state('products.antispamsms.operations.scamodifiers.new', {
            url: "/new",
            templateUrl: "products/antispamsms/operations/operations.scamodifiers.detail.html",
            controller: 'AntiSpamSMSOperationsSCAModifiersNewCtrl'
        }).state('products.antispamsms.operations.scamodifiers.update', {
            url: "/update/:callingGt/:mscGt",
            templateUrl: "products/antispamsms/operations/operations.scamodifiers.detail.html",
            controller: 'AntiSpamSMSOperationsSCAModifiersUpdateCtrl',
            resolve: {
                scaModifiersEntry: function ($stateParams, SMSAntiSpamConfigService) {
                    return SMSAntiSpamConfigService.getSCAModifierListEntry($stateParams.callingGt, $stateParams.mscGt);
                }
            }
        });

    });

    AntiSpamSMSOperationsSCAModifiersModule.controller('AntiSpamSMSOperationsSCAModifiersCommonCtrl', function ($scope, $log) {
        $log.debug('AntiSpamSMSOperationsSCAModifiersCommonCtrl');

        $scope.listState = "products.antispamsms.operations.scamodifiers.list";
        $scope.newState = "products.antispamsms.operations.scamodifiers.new";
        $scope.updateState = "products.antispamsms.operations.scamodifiers.update";
        $scope.pageHeaderKey = "Products.AntiSpamSMS.Operations.SCAModifiers.Title";
    });

    AntiSpamSMSOperationsSCAModifiersModule.controller('AntiSpamSMSOperationsSCAModifiersCtrl', function ($scope, $log, $controller, $uibModal, $filter, $translate, notification, NgTableParams, NgTableService,
                                                                                                          SMSAntiSpamConfigService, scaModifiers) {
        $log.debug('AntiSpamSMSOperationsSCAModifiersCtrl');

        $controller('AntiSpamSMSOperationsSCAModifiersCommonCtrl', {$scope: $scope});

        $scope.exportOptions = {
            columns: [
                {
                    fieldName: 'callingGt',
                    headerKey: 'Products.AntiSpamSMS.Operations.SCAModifiers.CallingGT'
                },
                {
                    fieldName: 'mscGt',
                    headerKey: 'Products.AntiSpamSMS.Operations.SCAModifiers.MSCGT'
                },
                {
                    fieldName: 'imsi',
                    headerKey: 'Products.AntiSpamSMS.Operations.SCAModifiers.IMSI'
                },
                {
                    fieldName: 'status',
                    headerKey: 'CommonLabels.State',
                    filter: {name: 'StatusTypeFilter'}
                }
            ]
        };

        // SCA Modifiers list
        $scope.scaModifiers = {
            list: scaModifiers && scaModifiers.allScaModifierEntries ? scaModifiers.allScaModifierEntries : [],
            tableParams: {}
        };

        $scope.scaModifiers.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {
                "callingGt": 'asc'
            }
        }, {
            total: $scope.scaModifiers.list.length, // length of data
            $scope: $scope,
            getData: function ($defer, params) {
                var filterText = params.settings().$scope.filterText;
                var filterColumns = params.settings().$scope.filterColumns;
                var filteredListData = NgTableService.filterList(filterText, filterColumns, $scope.scaModifiers.list);
                var orderedData = params.sorting() ? $filter('orderBy')(filteredListData, params.orderBy()) : $scope.scaModifiers.list;
                params.total(orderedData.length); // set total for recalc pagination
                if ((params.total() > 0) && (params.total() === (params.count() * (params.page() - 1)))) {
                    params.page(params.page() - 1);
                }

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        // END - SCA Modifiers list

        $scope.filterTable = _.debounce(function (filterText, filterColumns) {
            $scope.scaModifiers.tableParams.settings().$scope.filterText = filterText;
            $scope.scaModifiers.tableParams.settings().$scope.filterColumns = filterColumns;
            $scope.scaModifiers.tableParams.page(1);
            $scope.scaModifiers.tableParams.reload();
        }, 500);

        $scope.remove = function (entry) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/modal/modal.confirmation.html',
                controller: 'ConfirmationModalInstanceCtrl',
                size: 'sm'
            });

            modalInstance.result.then(function () {
                $log.debug('Removing SCA Modifier entry: ', entry);

                SMSAntiSpamConfigService.deleteSCAModifierListEntry(entry.callingGt, entry.mscGt).then(function (response) {
                    $log.debug('Removed SCA Modifier entry: ', entry, ', response: ', response);

                    var deletedListItem = _.findWhere($scope.scaModifiers.list, {
                        callingGt: entry.callingGt,
                        mscGt: entry.mscGt
                    });
                    $scope.scaModifiers.list = _.without($scope.scaModifiers.list, deletedListItem);

                    $scope.scaModifiers.tableParams.reload();

                    notification({
                        type: 'success',
                        text: $translate.instant('CommonLabels.OperationSuccessful')
                    });
                }, function (response) {
                    $log.debug('Cannot delete SCA Modifier entry: ', entry, ', response: ', response);
                });
            });
        };
    });

    AntiSpamSMSOperationsSCAModifiersModule.controller('AntiSpamSMSOperationsSCAModifiersNewCtrl', function ($scope, $log, $state, $controller, $translate, notification, STATES, SMSAntiSpamConfigService) {
        $controller('AntiSpamSMSOperationsSCAModifiersCommonCtrl', {$scope: $scope});

        $scope.STATES = STATES;

        $scope.entry = {
            status: $scope.STATES[0]
        };

        $scope.isNotChanged = function () {
            return false;
        };

        $scope.save = function (entry) {
            var entryItem = {
                callingGt: entry.callingGt,
                mscGt: entry.mscGt,
                imsi: entry.imsi,
                status: (entry.status === $scope.STATES[0])
            };

            SMSAntiSpamConfigService.createSCAModifierListEntry(entryItem).then(function (response) {
                if (response && response.value === "ALREADY_SUBSCRIBED") {
                    $log.debug('Cannot add SCA Modifier entry: ', entryItem, ', response: ', response);

                    notification({
                        type: 'warning',
                        text: $translate.instant('Products.AntiSpamSMS.Operations.SCAModifiers.Messages.EntryAlreadyDefinedError', {
                            callingGt: entryItem.callingGt,
                            mscGt: entryItem.mscGt
                        })
                    });
                } else {
                    $log.debug('Added SCA Modifier entry: ', entryItem);

                    notification({
                        type: 'success',
                        text: $translate.instant('CommonLabels.OperationSuccessful')
                    });

                    $state.go($scope.listState);
                }
            }, function (response) {
                $log.debug('Cannot add SCA Modifier entry: ', entryItem, ', response: ', response);
            });
        };

        $scope.cancel = function () {
            $state.go($scope.listState);
        };
    });

    AntiSpamSMSOperationsSCAModifiersModule.controller('AntiSpamSMSOperationsSCAModifiersUpdateCtrl', function ($scope, $log, $state, $controller, $translate, notification, STATES, SMSAntiSpamConfigService, scaModifiersEntry) {
        $controller('AntiSpamSMSOperationsSCAModifiersCommonCtrl', {$scope: $scope});

        $scope.STATES = STATES;

        $scope.entry = scaModifiersEntry;
        $scope.entry.id = _.uniqueId();
        $scope.entry.status = ($scope.entry.status ? $scope.STATES[0] : $scope.STATES[1]);

        $scope.originalEntry = angular.copy($scope.entry);
        $scope.isNotChanged = function () {
            return angular.equals($scope.originalEntry, $scope.entry);
        };

        $scope.save = function (entry) {
            var entryItem = {
                callingGt: $scope.originalEntry.callingGt,
                mscGt: $scope.originalEntry.mscGt,
                imsi: entry.imsi,
                status: (entry.status === $scope.STATES[0])
            };

            SMSAntiSpamConfigService.updateSCAModifierListEntry(entryItem).then(function (response) {
                $log.debug('Updated SCA Modifier entry: ', entryItem);

                notification({
                    type: 'success',
                    text: $translate.instant('CommonLabels.OperationSuccessful')
                });

                $state.go($scope.listState);
            }, function (response) {
                $log.debug('Cannot update SCA Modifier entry: ', entryItem, ', response: ', response);
            });
        };

        $scope.cancel = function () {
            $state.go($scope.listState);
        };
    });


})();
