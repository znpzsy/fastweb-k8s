(function () {
    'use strict';

    angular.module("adminportal", [
        "ui.router",
        "ui.bootstrap",
        "ui.select",
        "ngSanitize",
        "ngCookies",
        "ngTable",
        "ngTableExport",
        "ngTagsInput",
        "ngFileUpload",
        "ngIdle",
        "pascalprecht.translate",
        "restangular",
        "notification",
        "hljs",
        "angular-loading-bar",
        "cfp.loadingBar",
        // Application specific modules
        "Application.constants",
        "Application.controllers",
        "Application.directives",
        "Application.filters",
        "Application.services",
        "Application.rest-services",
        "Application.authorization-services",
        "adminportal.config",
        "adminportal.usersettings",
        "adminportal.login",
        "adminportal.dashboards",
        "adminportal.products",
        "adminportal.subsystems",
        "adminportal.idleservice"
    ]);

    var AdmPortalApplicationModule = angular.module('adminportal');

    var DEFAULT_STATE_NAME = 'dashboards';

    AdmPortalApplicationModule.run(function ($rootScope, $log, $timeout, $translate, $document, $http, $window, notification, Restangular, SessionService, $sce, $state, $stateParams,
                                             IdleServiceFactory, UtilService, AuthorizationService, DateTimeConstants, CURRENCY, CMPFService, DEFAULT_REST_QUERY_LIMIT,
                                             AdmPortalMainPromiseTracker) {
        // Bind all events of the idle service to listen idle events when the application has loaded.
        IdleServiceFactory.bindEvents();

        $rootScope.UtilService = UtilService;

        $rootScope.Validators = UtilService.Validators;

        $rootScope.DateTimeConstants = DateTimeConstants;

        $rootScope.AuthorizationService = AuthorizationService;

        $rootScope.AdmPortalMainPromiseTracker = AdmPortalMainPromiseTracker;

        $rootScope.CURRENCY = CURRENCY;

        $rootScope.isArray = angular.isArray;

        SessionService.setResourceNameHeader();

        var isBMSAdminUserKey = UtilService.getFromSessionStore(UtilService.USER_BMS_ADMIN_KEY);
        $rootScope.isBMSAdminUser = (typeof isBMSAdminUserKey === 'boolean' ? isBMSAdminUserKey : false);

        if (SessionService.isSessionValid()) {
            // Start to watch idle state at browser refresh.
            IdleServiceFactory.idleWatch();

            // Get user rights from session storage
            var userRights = SessionService.getSessionUserRights();
            AuthorizationService.setUserRights(userRights);

            // Update current session token
            var sessionKey = SessionService.getSessionKey();
            SessionService.setAuthorizationHeader(sessionKey.token);
            var jwt = UtilService.parseJwt(sessionKey.token);

            $rootScope.systemUserId = jwt.sub.cmpfToken.uid;
            $rootScope.systemUserOrganizationId = UtilService.getFromSessionStore(UtilService.USER_ORGANIZATION_ID_KEY);
            $rootScope.systemUserOrganizationName = UtilService.getFromSessionStore(UtilService.USER_ORGANIZATION_NAME_KEY);
            
            // If no permission allowed, continue to the check list for admin portal.
            // Get groups of the user.
            CMPFService.getUserAccountGroups($rootScope.systemUserId, false, false).then(function (accountGroupsResponse) {
                UtilService.putToSessionStore(UtilService.USER_GROUPS_KEY, accountGroupsResponse.userGroups);

                // Check if Admin group member
                var vcpAdminGroup = _.findWhere(accountGroupsResponse.userGroups, {name: CMPFService.VCP_ADMIN_GROUP});
                $rootScope.isAdminUser = !_.isUndefined(vcpAdminGroup);
                UtilService.putToSessionStore(UtilService.USER_ADMIN_KEY, $rootScope.isAdminUser);

                // Check if BMS Admin group member
                $rootScope.isBMSAdminUser = !_.isUndefined(vcpAdminGroup) || AuthorizationService.canApproveCampaigns();
                UtilService.putToSessionStore(UtilService.USER_BMS_ADMIN_KEY, $rootScope.isBMSAdminUser);
            });
        } else {
            // Stop idle watch.
            IdleServiceFactory.idleUnwatch();
        }

        $rootScope.$state = $state;

        $rootScope.$stateParams = $stateParams;

        $rootScope.go = function (route) {
            $state.go(route);
        };

        $rootScope.reload = function () {
            $state.reload();
        };

        $rootScope.getSessionUserId = function () {
            return SessionService.getSessionUserId();
        };

        $rootScope.isSessionValid = function () {
            return SessionService.isSessionValid();
        };

        $rootScope.logout = function () {
            // Stop idle watch.
            IdleServiceFactory.idleUnwatch();

            return SessionService.logout();
        };

        // Gets site information
        $rootScope.getSiteInformation = function () {
            var siteInformation = SessionService.getSiteInformation();

            return siteInformation;
        };

        // Gets site name by state name.
        $rootScope.getSiteNameByState = function (state) {
            var siteInformation = SessionService.getSiteInformation();

            var isRemote = s.contains(state.current.name, 'remote');

            return isRemote ? siteInformation.remoteName : siteInformation.name;
        };

        // Gets username of the current logged in user
        $rootScope.getUsername = function () {
            var username = SessionService.getUsername();

            return username;
        };

        // Check the latest state and redirect there.
        $rootScope.redirectLatestState = function () {
            // Check the latest state requested by user. If there is any state saved then redirect to it instead
            // to redirect dashboard as default.
            var latestState = UtilService.getFromSessionStore(UtilService.LATEST_STATE);
            if (!_.isEmpty(latestState)) {
                UtilService.removeFromSessionStore(UtilService.LATEST_STATE);

                var latestStateDate = new Date(latestState.date);
                var currentDate = new Date();
                if ((currentDate.getTime() - latestStateDate.getTime()) < (60 * 60 * 1000)) {
                    event.preventDefault(); // Breaks continue to state changing.

                    $state.go(latestState.state, latestState.params);
                } else {
                    $state.go(DEFAULT_STATE_NAME, null);
                }
            } else {
                $state.go(DEFAULT_STATE_NAME, null);
            }
        };

        var deferreds = [];
        // Shows the main indicator while the loading time of templates.
        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
            deferreds[event.targetScope.$id] = AdmPortalMainPromiseTracker.createPromise();
        });
        $rootScope.$on('$viewContentLoaded', function (event) {
            $timeout(function () {
                deferreds[event.targetScope.$id].resolve();
            }, 1000);
        });

        // State change START event
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // Check session validity
            if (SessionService.isSessionValid()) {
                // Check toState if url is login then redirect to dashboard page.
                if (toState.name === 'login') {
                    event.preventDefault(); // Breaks continue to state changing.

                    $state.go(DEFAULT_STATE_NAME);
                } else {
                    event.preventDefault(); // Breaks continue to state changing.

                    var jwt = UtilService.parseJwt(SessionService.getSessionKey().token);
                    if (SessionService.getUsername() !== jwt.sub.username) {
                        // Stop idle watch.
                        IdleServiceFactory.idleUnwatch();

                        return SessionService.logout();
                    } else {
                        AuthorizationService.getPermissions($rootScope.systemUserId).then(function (authorizeResponse) {
                            var adminPortalPermissions = AuthorizationService.extractUserRights(authorizeResponse);
                            if (!_.isEmpty(adminPortalPermissions)) {
                                var isPermitted = true;

                                AuthorizationService.storeUserRights(adminPortalPermissions);

                                // Check the permissions of state.
                                if (toState.data && toState.data.permissions) {
                                    isPermitted = AuthorizationService.checkPermissionList(toState.data.permissions);
                                }

                                if (isPermitted) {
                                    // After the above checking, continues to the requested state.
                                    $state.go(toState.name, toParams, {
                                        reload: true,
                                        notify: false
                                    }).then(function (state) {
                                        $rootScope.$broadcast('$stateChangeSuccess', state, null);
                                    });
                                }
                            }
                        });
                    }
                }
            } else {
                $log.debug("Session is invalid!");

                if (toState.name !== 'login') {
                    // Save the requested state to the session storage to be able to use it after succeeded login.
                    UtilService.putToSessionStore(UtilService.LATEST_STATE, {
                        state: toState.name,
                        params: toParams,
                        date: new Date()
                    });
                }

                event.preventDefault(); // Breaks continue to state changing.

                // User redirecting to the login page without notifying if the session is invalid
                $state.go('login', null, {notify: false}).then(function (state) {
                    $rootScope.$broadcast('$stateChangeSuccess', state, null);
                });
            }
        });

        // State change SUCCESS event
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $log.debug('$stateChangeSuccess event: ', event, toState, toParams, fromState, fromParams);

            if (toState.data.headerKey !== undefined) {
                $translate(toState.data.headerKey).then(function (header) {
                    toState.data.title = $sce.trustAsHtml(header);

                    $translate('ApplicationTitle').then(function (title) {
                        // Remove the <sup> tag to be able to show in the browser title.
                        var headerPlain = header.replace('<sup>', '').replace('</sup>', '');

                        $document.prop('title', title + ' - ' + headerPlain);
                    });
                });
            }

            // Scroll top when state changed successfully
            $window.scrollTo(0, 0);
        });
    });

    AdmPortalApplicationModule.config(function ($translateProvider, RestangularProvider, $stateProvider, $urlRouterProvider, $logProvider, $qProvider,
                                                IdleConfServiceProvider, IdleProvider, KeepaliveProvider, $httpProvider, cfpLoadingBarProvider,
                                                hljsServiceProvider) {
        // Configure JSON highlighter
        hljsServiceProvider.setOptions({});

        // Loading bar settings
        cfpLoadingBarProvider.latencyThreshold = 50;

        // Configure Idle settings
        IdleProvider.idle(IdleConfServiceProvider.conf.idle);
        IdleProvider.timeout(IdleConfServiceProvider.conf.timeout);
        IdleProvider.windowInterrupt(IdleConfServiceProvider.conf.window_interrupt);
        IdleProvider.setLocalStorageKey('vcp-ap-vil-in');
        KeepaliveProvider.interval(IdleConfServiceProvider.conf.keepalive_interval);

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.storagePrefix('VCP_AP_VIL_IN_');

        // This intercepter overrided in order to be avoiding to send payload with DELETE requests
        // since the rest server throws 405 error.
        RestangularProvider.setRequestInterceptor(function (elem, operation, path, url) {
            if (operation === 'remove' && !s.include(url, "/pentaho/api") && !s.include(url, "/vcp-subscriptions-rest")) {
                return (_.isEmpty(elem) || (!_.isEmpty(elem) && _.isUndefined(elem.id) && _.isUndefined(elem.state))) ? undefined : elem;
            }
            return elem;
        });

        RestangularProvider.setDefaultHttpFields({timeout: 120000});

        // Debug logs can be make enable/disable according to your desire.
        $logProvider.debugEnabled(true);
        //$logProvider.debugEnabled(true);

        // This state has been defined for internal application based states for example setting state for logged in users.
        $stateProvider.state('application', {
            abstract: true
        });

        // For any unmatched url, send to /dashboard
        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get("$state");
            $state.go("dashboards");
        });

        $qProvider.errorOnUnhandledRejections(false);

        // General response interceptor for http provider to be able to handle error responses of rest requests.
        $httpProvider.interceptors.push(['$q', '$log', '$location', '$rootScope', 'UtilService', function ($q, $log, $location, $rootScope, UtilService) {
            return {
                'responseError': function (response) {
                    if (response.status === 0) {
                        $log.debug("Connection error...");
                    } else if (response.status === 400) {
                        $log.debug("Bad request...");
                    } else if (response.status === 401) {
                        $log.debug("Unauthorized!");
                    } else if (response.status === 403) {
                        $log.debug("Forbidden!");

                        // Logout the user from active session.
                        $rootScope.logout();
                    } else if (response.status === 404) {
                        $log.debug("Not available or resource not found...");
                    } else if (response.status === 504) {
                        $log.debug("Gateway Timeout...");

                        UtilService.showResponseErrorNotification(response);
                    } else {
                        $log.debug("Response received with HTTP error code: ", response.status);
                    }

                    if (!angular.isObject(response.data)) {
                        // In order to prevent request errors of pentaho authentication errors.
                        if (response.config) {
                            if (((response.config.url.indexOf('pentaho') === -1) && response.status !== 401 && response.status !== 406) || response.status > 500) {
                                UtilService.showResponseErrorNotification(response);
                            }
                        }
                    }

                    return $q.reject(response);
                }
            };
        }]);
    });

    AdmPortalApplicationModule.directive('adminportalCommonTemplates', function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/templates.html'
        };
    });

    // https://docs.angularjs.org/api/ng/function/angular.toJson
    // The Safari browser throws a RangeError instead of returning null when it tries to stringify a Date object with an invalid date value. The only reliable way to prevent this is to monkeypatch the Date.prototype.toJSON method as follows:
    var _dateToJSON = Date.prototype.toJSON;
    Date.prototype.toJSON = function () {
        try {
            return _dateToJSON.call(this);
        } catch (e) {
            if (e instanceof RangeError) {
                return null;
            }
            throw e;
        }
    };

})();
