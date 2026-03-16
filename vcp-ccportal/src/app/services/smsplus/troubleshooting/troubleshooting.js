(function () {

    'use strict';

    angular.module('ccportal.services.personalizedsms.troubleshooting', []);

    var PersonalizedSMSTroubleshootingModule = angular.module('ccportal.services.personalizedsms.troubleshooting');

    PersonalizedSMSTroubleshootingModule.config(function ($stateProvider) {

        $stateProvider.state('services.personalizedsms.troubleshooting', {
            url: "/troubleshooting",
            templateUrl: "services/smsplus/troubleshooting/troubleshooting.html",
            controller: 'PersonalizedSMSTroubleshootingCtrl',
            resolve: {}
        });

    });

    PersonalizedSMSTroubleshootingModule.controller('PersonalizedSMSTroubleshootingCtrl', function ($scope, $log, $controller, $timeout, $filter, DateTimeConstants,
                                                                                                    UtilService) {
        $log.debug('PersonalizedSMSTroubleshootingCtrl');

        var msisdn = UtilService.getSubscriberMsisdn();

        // Calling the date time controller which initializes date/time pickers and necessary functions.
        $controller('GenericDateTimeCtrl', {$scope: $scope});

        // Filter initializations
        $scope.dateFilter.startDate = $scope.getOneWeekAgo();
        $scope.dateFilter.startTime = $scope.getOneWeekAgo();

        $scope.filterFormLayer = {
            isFilterFormOpen: false
        };

        $scope.reloadTable = function (tableParams, _pageNumber) {
            var pageNumber = _pageNumber ? _pageNumber : 1;
            if (tableParams.page() === pageNumber) {
                tableParams.reload();
            } else {
                $timeout(function () {
                    tableParams.page(pageNumber);
                }, 0);
            }
        };

        $scope.prepareFilter = function (dateFilter, tableParams) {
            var result = {};

            var startDateIso = $filter('date')(dateFilter.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.sss' + DateTimeConstants.OFFSET);
            var endDateIso = $filter('date')(dateFilter.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss.sss' + DateTimeConstants.OFFSET);

            result.filter = {
                startDate: startDateIso,
                endDate: endDateIso,
                msisdn: msisdn
            };

            result.additionalFilterFields = {
                originalSender: dateFilter.originalSender,
                originalReceiver: dateFilter.originalReceiver
            };

            if (tableParams) {
                result.filter.sortFieldName = s.words(tableParams.orderBy()[0], /\-|\+/)[0];
                result.filter.sortOrder = s.include(tableParams.orderBy()[0], '+') ? '"asc"' : '"desc"';
                result.filter.limit = tableParams.count();
                result.filter.offset = (tableParams.page() - 1) * tableParams.count();

                result.filter.queryString = tableParams.settings().$scope.quickSearchText;
                result.filter.quickSearchColumns = tableParams.settings().$scope.quickSearchColumns;
            }

            return result;
        };

        $scope.throttledReloadTable = _.throttle(function () {
            $scope.reloadTable($scope.activityHistory.tableParams);
        }, 500);

        $scope.filterTable = _.debounce(function (text, columns) {
            $scope.activityHistory.tableParams.settings().$scope.quickSearchText = text;
            $scope.activityHistory.tableParams.settings().$scope.quickSearchColumns = columns;

            $scope.reloadTable($scope.activityHistory.tableParams);
        }, 500);

        // Calling the table controller which initializes ngTable objects, filters and listeners.
        $controller('PersonalizedSMSTroubleshootingTableCtrl', {$scope: $scope});
        $controller('PersonalizedSMSTroubleshootingHistoryCtrl', {$scope: $scope});
    });

    PersonalizedSMSTroubleshootingModule.controller('PersonalizedSMSTroubleshootingTableCtrl', function ($scope, $log, $q, $filter, UtilService, NgTableParams, notification, $translate,
                                                                                                         GeneralESService, DateTimeConstants) {
        $scope.exportFileName = 'SMSPlusServiceActivityHistoryRecords';

        $scope.exportOptions = {
            columns: [
                {
                    fieldName: 'date',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.Date',
                    filter: {name: 'date', params: ['yyyy-MM-dd HH:mm:ss', DateTimeConstants.OFFSET]}
                },
                {
                    fieldName: 'serviceTypeText',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.ServiceType'
                },
                {
                    fieldName: 'originalSender',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OriginalSender'
                },
                {
                    fieldName: 'originalReceiver',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OriginalReceiver'
                },
                {
                    fieldName: 'revisedSender',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.RevisedSender'
                },
                {
                    fieldName: 'revisedReceiver',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.RevisedReceiver'
                },
                {
                    fieldName: 'origMscAddress',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OrigMscAddress'
                },
                {
                    fieldName: 'result',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.Result'
                },
                {
                    fieldName: 'status',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.Status'
                },
                {
                    fieldName: 'executionStatusCodeShortLabel',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.ExecutionStatusCodeShortLabel'
                },
                {
                    fieldName: 'executionStatusCodeText',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.ExecutionStatusCode'
                },
                {
                    fieldName: 'correlatorId',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.CorrelatorId'
                },
                {
                    fieldName: 'transactionId',
                    headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.TransactionId'
                }
            ]
        };

        // Activity history list of current scope definitions
        $scope.activityHistory = {
            list: [],
            showTable: true,
            tableParams: {}
        };

        $scope.activityHistory.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {
                "date": 'desc'
            }
        }, {
            $scope: $scope,
            getData: function ($defer, params) {
                var preparedFilter = $scope.prepareFilter($scope.dateFilter, params);

                var filter = preparedFilter.filter;
                var additionalFilterFields = preparedFilter.additionalFilterFields;

                var deferredRecordsQuery = $q.defer();
                GeneralESService.findPersonalizedSMSHistory(filter, additionalFilterFields).then(function (response) {
                    $log.debug("Found records: ", response);

                    deferredRecordsQuery.resolve(response);
                }, function (error) {
                    deferredRecordsQuery.reject(error);
                });

                // Listen the response of the above query.
                deferredRecordsQuery.promise.then(function (response) {
                    $scope.activityHistory.list = response.hits.hits;

                    _.each($scope.activityHistory.list, function (record) {
                        record._source.executionStatusCodeShortLabel = (record._source.executionStatusCode === 102 ? 'SUCCESS' : 'BLOCKED');
                        record._source.serviceTypeText = $filter('PersonalizedSMSServiceTypeFilter')(record._source.serviceType);
                        record._source.executionStatusCodeText = $filter('PersonalizedSMSEventIDFilter')(record._source.executionStatusCode);
                    });

                    // Hide the filter form.
                    $scope.filterFormLayer.isFilterFormOpen = false;

                    $scope.activityHistory.showTable = true;

                    params.total(response.hits.total.value);
                    $defer.resolve($scope.activityHistory.list);
                }, function (error) {
                    $log.debug('Error: ', error);

                    // Hide the filter form.
                    $scope.filterFormLayer.isFilterFormOpen = false;

                    $scope.activityHistory.showTable = true;

                    params.total(0);
                    $defer.resolve([]);
                });
            }
        });
        // END - Activity history list definitions
    });

    PersonalizedSMSTroubleshootingModule.controller('PersonalizedSMSTroubleshootingHistoryCtrl', function ($scope, $log, $filter, notification, $translate, $uibModal, NgTableParams,
                                                                                                           DateTimeConstants) {
        $log.debug('PersonalizedSMSTroubleshootingHistoryCtrl');

        // SMS Plus detail history list
        var personalizedSMSEdrHistoryList = {
            list: [],
            tableParams: {}
        };
        personalizedSMSEdrHistoryList.tableParams = new NgTableParams({
            page: 1,
            count: 10,
            sorting: {
                "_source.date": 'desc'
            }
        }, {
            $scope: $scope,
            getData: function ($defer, params) {
                var orderedData = params.sorting() ? $filter('orderBy')(personalizedSMSEdrHistoryList.list, params.orderBy()) : personalizedSMSEdrHistoryList.list;
                params.total(orderedData.length); // set total for recalc pagination
                if ((params.total() > 0) && (params.total() === (params.count() * (params.page() - 1)))) {
                    params.page(params.page() - 1);
                }

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        // END - SMS Plus detail history list

        // History modal window.
        $scope.showPersonalizedSmsHistory = function (edrRecord) {
            edrRecord.rowSelected = true;

            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'services/smsplus/troubleshooting/troubleshooting.edr.history.html',
                controller: function ($scope, $filter, $uibModalInstance, personalizedSMSEdrs, edrRecord, personalizedSMSEdrHistoryList) {

                    $scope.historyExportOptions = {
                        columns: [
                            {
                                fieldName: 'date',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.HistoryEventDate',
                                filter: {name: 'date', params: ['yyyy-MM-dd HH:mm:ss', DateTimeConstants.OFFSET]}
                            },
                            {
                                fieldName: 'serviceTypeText',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.ServiceType'
                            },
                            {
                                fieldName: 'originalSender',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OriginalSender'
                            },
                            {
                                fieldName: 'originalReceiver',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OriginalReceiver'
                            },
                            {
                                fieldName: 'revisedSender',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.RevisedSender'
                            },
                            {
                                fieldName: 'revisedReceiver',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.RevisedReceiver'
                            },
                            {
                                fieldName: 'origMscAddress',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.OrigMscAddress'
                            },
                            {
                                fieldName: 'result',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.Result'
                            },
                            {
                                fieldName: 'status',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.Status'
                            },
                            {
                                fieldName: 'executionStatusCodeText',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.ExecutionStatusCode'
                            },
                            {
                                fieldName: 'correlatorId',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.CorrelatorId'
                            },
                            {
                                fieldName: 'transactionId',
                                headerKey: 'Services.PersonalizedSMS.Troubleshooting.TableColumns.TransactionId'
                            }
                        ]
                    };

                    $scope.origAddress = (edrRecord.originalSender ? edrRecord.originalSender : edrRecord.origAddress);
                    $scope.destAddress = (edrRecord.originalReceiver ? edrRecord.originalReceiver : edrRecord.destAddress);

                    $scope.personalizedSMSEdrHistoryList = personalizedSMSEdrHistoryList;

                    $scope.personalizedSMSEdrHistoryList.list = $filter('orderBy')(personalizedSMSEdrs.hits.hits, '_source.date');

                    var currentList = $scope.personalizedSMSEdrHistoryList.list;
                    if (currentList.length > 0) {
                        $scope.submitDate = currentList[0]._source.date;
                        $scope.completionDate = currentList[currentList.length - 1]._source.date;
                    }

                    // Remove new born and completion events from the list.
                    $scope.personalizedSMSEdrHistoryList.list = _.reject($scope.personalizedSMSEdrHistoryList.list, function (edr) {
                        return (edr._source.executionStatusCode === 101 || edr._source.executionStatusCode === 102 || edr._source.executionStatusCode === 103);
                    });

                    _.each($scope.personalizedSMSEdrHistoryList.list, function (record) {
                        record._source.serviceTypeText = $filter('PersonalizedSMSServiceTypeFilter')(record._source.serviceType);
                        record._source.executionStatusCodeText = $filter('PersonalizedSMSEventIDFilter')(record._source.executionStatusCode);
                    });

                    $scope.personalizedSMSEdrHistoryList.tableParams.page(1);
                    $scope.personalizedSMSEdrHistoryList.tableParams.reload();

                    $scope.isHighlightHistoryRecord = function (executionStatusCode) {
                        return ((executionStatusCode >= 30 && executionStatusCode <= 33) || executionStatusCode === 60);
                    };

                    $scope.close = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg',
                resolve: {
                    personalizedSMSEdrs: function (GeneralESService) {
                        // Checks below two correlator id properties so that there are two correlator ids on the SMSC (smartSmsCorrId) and
                        // SMS Plus (correlatorId) records. We have to check which one is available in the passed edr record.
                        var correlatorId = (edrRecord.correlatorId ? edrRecord.correlatorId : edrRecord.smartSmsCorrId);

                        return GeneralESService.findPersonalizedSMSDetailedHistory(correlatorId);
                    },
                    edrRecord: function () {
                        return edrRecord;
                    },
                    personalizedSMSEdrHistoryList: function () {
                        return personalizedSMSEdrHistoryList;
                    }
                }
            });

            modalInstance.result.then(function () {
                edrRecord.rowSelected = false;
            }, function () {
                edrRecord.rowSelected = false;
            });
        };

    });

})();
