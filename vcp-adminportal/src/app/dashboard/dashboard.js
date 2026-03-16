(function () {

    'use strict';

    angular.module('adminportal.dashboards', []);

    var DashboardModule = angular.module('adminportal.dashboards');

    DashboardModule.config(function ($stateProvider) {

        $stateProvider.state('dashboards', {
            url: "/dashboard",
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            data: {
                headerKey: 'Dashboard.PageHeader'
            },
            resolve: {
                serverConfiguration: function (ServerConfigurationService) {
                    return ServerConfigurationService.getAndUpdateServerConfiguration();
                }
            }
        });

    });

    DashboardModule.controller('DashboardCtrl', function ($scope, $log, $controller, $interval, serverConfiguration, ServerConfigurationService, AdmPortalDashboardPromiseTracker) {
        $scope.dashboardQueries = [];

        $controller('AccordionPrepareCtrl', {$scope: $scope, serverConfiguration: serverConfiguration});
        $controller('AccordionQueryCtrl', {$scope: $scope});
        $controller('CMPFQueryCtrl', {$scope: $scope});
        $controller('ProductsAndServicesQueryCtrl', {$scope: $scope});

        var rebuild = $interval(function () {
            $log.debug('reloading');

            // This server configuration freshener step is available, then it configures the server specific definitions.
            ServerConfigurationService.getAndUpdateServerConfiguration().then(function () {
                _.each($scope.dashboardQueries, function (dashboardQuery) {
                    dashboardQuery(AdmPortalDashboardPromiseTracker);
                });
            });
        }, 90000);

        $scope.$on('$destroy', function () {
            if (angular.isDefined(rebuild)) {
                $log.debug('Cancelled timer');
                $interval.cancel(rebuild);
                rebuild = undefined;
            }
        });
    });

    // Prepares accordion values.
    DashboardModule.controller('AccordionPrepareCtrl', function ($scope, serverConfiguration) {

        $scope.oneAtATime = false;
        $scope.status = {isFirstDisabled: false};

        $scope.hostnames = [];
        var clusters = angular.copy(serverConfiguration.clusters);
        $scope.clusters = [];

        var clustersCount = 0;
        var hostsCount = 0;

        _.each(clusters, function (cluster) {
            if (cluster.hosts) {
                var newCluster = {
                    "name": cluster.name,
                    "hosts": []
                };
                newCluster.hosts = _.map(cluster.hosts, function (host) {
                    hostsCount++;
                    if (typeof host === 'string') {
                        $scope.hostnames.push(host.toLowerCase());
                    }

                    return {"name": host};
                })
                $scope.clusters.push(newCluster);

                clustersCount++;
            } else if (cluster.virtualClusters) {
                var newVCluster = {
                    "name": cluster.name,
                    "virtualClusters": []
                };

                _.each(cluster.virtualClusters, function (vcluster) {
                    if (vcluster.hosts) {
                        var newVClusterHosts = {
                            "hosts": []
                        };
                        newVClusterHosts.hosts = _.map(vcluster.hosts, function (host) {
                            hostsCount++;
                            if (typeof host === 'string') {
                                $scope.hostnames.push(host.toLowerCase());
                            }

                            return {"name": host};
                        })
                        newVCluster.virtualClusters.push(newVClusterHosts);
                    }
                    clustersCount++;
                });

                $scope.clusters.push(newVCluster);
            }
        });

        if ($scope.hostnames && $scope.hostnames.length > 0) {
            $scope.hostnames = _.uniq($scope.hostnames);
        }

        $scope.limits = {
            clustersUnknown: -1,
            hostsUnknown: -1,
            allClustersDown: 0,
            allHostsDown: 0,
            clustersCount: clustersCount,
            hostsCount: hostsCount
        };

        $scope.clustersStatus = $scope.limits.clustersUnknown;
        $scope.hostsStatus = $scope.limits.hostsUnknown;
    });

    // Queries clusters and hosts states.
    DashboardModule.controller('AccordionQueryCtrl', function ($scope, $log, Restangular, DiagnosticsService) {
        var resetCounters = function () {
            $scope.aliveClusters = $scope.limits.allClustersDown;
            $scope.aliveHosts = $scope.limits.allHostsDown;
        };

        var fillHostStats = function (host, stats) {
            // First comparing the hostname and supposing fqdn value. If the hostname is same with the fqdn value then
            // it will be taking the required values from the set.
            var result = _.filter(stats, function (stat) {
                return stat._source.host.toLowerCase() === host.name.toLowerCase();
            })[0];

            // Checking the first statistics item's cpu.idle variable to be sure the host variable contains is cpu statistic values.
            if (stats.length > 0 && stats[0]._source['cpu.idle']) {
                host.idle = 0;
                host.iowait = 0;

                // Get values related the cpu statistics
                if (result) {
                    host.idle = result._source['cpu.idle'] ? result._source['cpu.idle'] : 0;
                    host.iowait = result._source['cpu.iowait'] ? result._source['cpu.iowait'] : 0;
                }
            }

            // Checking the first statistics item's mem.total variable to be sure the host variable contains is memory statistic values.
            var mem_total = 0, mem_used = 0;
            if (stats.length > 0 && stats[0]._source['mem.total']) {
                host.free = 0;

                // Get values related the mem statistics
                if (result) {
                    mem_total = result._source['mem.total'] ? result._source['mem.total'] : 0;
                    mem_used = result._source['mem.used'] ? result._source['mem.used'] : 0;
                }
            }

            // Calculate the alive host count finally.
            if (result) {
                if (host.idle || host.iowait || mem_total) {
                    $scope.aliveHosts++;
                }

                if (mem_total) {
                    host.free = ((mem_total - mem_used) / mem_total) * 100;
                }
            }
        };

        var processCluster = function (cluster, stats) {
            if (cluster.virtualClusters) {
                angular.forEach(cluster.virtualClusters, function (vcluster, index) {
                    processCluster(vcluster, stats);
                });
            } else {
                angular.forEach(cluster.hosts, function (host, index) {
                    fillHostStats(host, stats);
                });

                var atLeastOneHostIsUp = _.some(cluster.hosts, function (host) {
                    return !_.isUndefined(host.idle) && host.idle > 0;
                });

                if (atLeastOneHostIsUp) {
                    $scope.aliveClusters++;
                }
            }
        };

        var setFlags = function () {
            if ($scope.cpuStats && $scope.cpuStats.length === 0) {
                $scope.clustersStatus = $scope.limits.clustersUnknown;
                $scope.hostsStatus = $scope.limits.hostsUnknown;
            } else {
                $scope.clustersStatus = $scope.aliveClusters;
                $scope.hostsStatus = $scope.aliveHosts;
            }
        };

        var queryHostStats = function (query, promiseTracker) {
            return DiagnosticsService.queryHostStats(query, promiseTracker).then(function (response) {
                $log.debug('Last Minute CPU Stats : ', response);
                $scope.hostStats = response.aggregations.filtered.top_hosts_hits.hits.hits;

                angular.forEach($scope.clusters, function (cluster, index) {
                    processCluster(cluster, $scope.hostStats);
                });
            }, function (response) {
                $log.error('Cannot read CPU stats. Error: ', response);
            });
        };

        var lastTwoMinutesTopQueryMain = {
            "aggs": {
                "filtered": {
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "terms": {
                                        "host": $scope.hostnames
                                    }
                                },
                                {
                                    "range": {
                                        "timestamp": {
                                            "from": "now-3m",
                                            "to": "now"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "aggs": {
                        "top_hosts_hits": {
                            "top_hits": {
                                "sort": [
                                    {
                                        "timestamp": {
                                            "order": "desc"
                                        }
                                    }
                                ],
                                "_source": {
                                    "includes": ["mem.used", "mem.total", "cpu.iowait", "cpu.idle", "host", "timestamp"]
                                },
                                "size": Math.round($scope.hostnames.length * 3 / 2)
                            }
                        }
                    }
                }
            },
            "size": 0
        };

        var dashboardingAccordion = function (promiseTracker) {
            resetCounters();

            queryHostStats(lastTwoMinutesTopQueryMain, promiseTracker).then(setFlags);
        };

        dashboardingAccordion();

        // Push to the main query array
        $scope.dashboardQueries.push(dashboardingAccordion);
    });


    // Queries CMPF values.
    DashboardModule.controller('CMPFQueryCtrl', function ($scope, $log, Restangular, CMPFService, AuthorizationService) {
        $scope.serviceProviders = 0;
        $scope.services = 0;
        $scope.userAccounts = 0;
        $scope.userGroups = 0;

        var dashboardingCMPF = function (promiseTracker) {
            CMPFService.getPartners(0, 0, promiseTracker).then(function (response) {
                $scope.serviceProviders = Restangular.stripRestangular(response).metaData.totalCount;
            }, function (response) {
                $log.debug('Cannot read service providers. Error: ', response);
            });

            CMPFService.getServices(0, 0, false, false, promiseTracker).then(function (response) {
                $scope.services = Restangular.stripRestangular(response).metaData.totalCount;
            }, function (response) {
                $log.debug('Cannot read services. Error: ', response);
            });

            CMPFService.getUserAccounts(0, 0, false, promiseTracker).then(function (response) {
                $scope.userAccounts = Restangular.stripRestangular(response).metaData.totalCount;
            }, function (response) {
                $log.debug('Cannot read user accounts. Error: ', response);
            });

            CMPFService.getUserGroups(0, 0, promiseTracker).then(function (response) {
                $scope.userGroups = Restangular.stripRestangular(response).metaData.totalCount;
            }, function (response) {
                $log.debug('Cannot read user groups. Error: ', response);
            });
        };

        if (AuthorizationService.canSeeProvisioning()) {
            dashboardingCMPF();

            // Push to the main query array
            $scope.dashboardQueries.push(dashboardingCMPF);
        }
    });

    // Queries products and services healthes.
    DashboardModule.controller('ProductsAndServicesQueryCtrl', function ($scope, $log, Restangular, SmscConfService, SMSAntiSpamService, MmscConfService, AuthorizationService, CMPFService,
                                                                        ScreeningManagerService, DiagnosticsService, PentahoApiService) {
        $log.debug("ProductsAndServicesQueryCtrl") ;

        // Products
        $scope.smsc = 'unknown';
        $scope.antispamsms = 'unknown';
        $scope.mmsc = 'unknown';

        // Others
        $scope.cmpf = 'unknown';
        $scope.screeningmanagement = 'unknown';
        $scope.diagnostics = 'unknown';
        $scope.reportgeneration = 'unknown';

        var dashboardingProductsAndServices = function (promiseTracker) {

            // SMSC A2P Check
            if (AuthorizationService.canSeeSMSC()) {
                SmscConfService.getSFEStorage(promiseTracker).then(function (apiResponse) {
                    if (apiResponse.statusCode) {
                        $scope.smsc = 'warning';
                    } else {
                        $scope.smsc = 'success';
                    }
                }, function (response) {
                    $log.error('Cannot reach SMSC configuration. Error: ', response);
                    $scope.smsc = 'error';
                });
            }

            // AntiSpam Check
            if (AuthorizationService.canSeeAntiSpam()) {
                SMSAntiSpamService.getHeartBeat(promiseTracker).then(function (apiResponse) {
                    if (apiResponse && apiResponse.statusCode) {
                        $scope.antispamsms = 'warning';
                    } else {
                        $scope.antispamsms = 'success';
                    }
                }, function (response) {
                    $log.error('Cannot reach AntiSpam heart beat service. Error: ', response);
                    $scope.antispamsms = 'error';
                });
            }
            // MMSC Check
            if (AuthorizationService.canSeeMMSC()) {
                MmscConfService.getMm1Agent(promiseTracker).then(function (apiResponse) {
                    if (apiResponse.statusCode) {
                        $scope.mmsc = 'warning';
                    } else {
                        $scope.mmsc = 'success';
                    }
                }, function (response) {
                    $log.error('Cannot reach MMSC configuration. Error: ', response);
                    $scope.mmsc = 'error';
                });
            }


            // CMPF
            if (AuthorizationService.canSeeProvisioning()) {
                CMPFService.getAllPartners(0, 0, false, promiseTracker).then(function (response) {
                    $scope.cmpf = 'success';
                }, function (response) {
                    $log.debug('Cannot reach partners. Error: ', response);
                    $scope.cmpf = 'error';
                });
            }

            // Screening management
            if (AuthorizationService.canSeeScreeningMgmt()) {
                ScreeningManagerService.getScopes(promiseTracker).then(function (response) {
                    $scope.screeningmanagement = 'success';
                }, function (response) {
                    $log.debug('Failure. Response: ', response);
                    $scope.screeningmanagement = 'error';
                });
            }

            // Diagnostics
            if (AuthorizationService.canSeeScreeningMgmt()) {
                var query = {
                    "aggs": {
                        "filtered": {
                            "filter": {
                                "bool": {
                                    "must": [{
                                        "range": {
                                            "timestamp": {
                                                "from": "now-1y",
                                                "to": "now"
                                            }
                                        }
                                    }, {"range": {"count": {"lt": 0}}}, {"term": {"type": "SET"}}, {"terms": {"severity": ["INFO"]}}]
                                }
                            },
                            "aggs": {
                                "alarms": {
                                    "terms": {"field": "rawname", "min_doc_count": 1},
                                    "aggs": {"counts": {"stats": {"field": "count"}}}
                                }
                            }
                        }
                    }, "size": 0
                };

                DiagnosticsService.getAlarmsByQuery(query, promiseTracker).then(function (response) {
                    $scope.diagnostics = 'success';
                }, function (response) {
                    $log.debug('Failure. Response: ', response);
                    $scope.diagnostics = 'error';
                });
            }

            // Report generation
            if (AuthorizationService.canSeeReportGeneration()) {
                PentahoApiService.healthCheck(promiseTracker).then(function (response) {
                    $scope.reportgeneration = 'success';
                }, function (response) {
                    $log.debug('Failure. Response: ', response);
                    $scope.reportgeneration = 'error';
                });
            }
        };

        dashboardingProductsAndServices();

        // Push to the main query array
        $scope.dashboardQueries.push(dashboardingProductsAndServices);
    });

})();
