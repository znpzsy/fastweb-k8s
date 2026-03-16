(function () {
    'use strict';

    /* Services */
    angular.module('Application.services', []);

    var ApplicationServices = angular.module('Application.services');

    // Utility Services
    ApplicationServices.factory('UtilService', function ($window, $log, notification, $translate, $timeout, DURATION_UNITS,
                                                         CCPortalMainPromiseTracker, cfpLoadingBar) {
        return {
            COUNTRY_CODE: "993",
            SESSION_KEY: '_it_fswb_vcp_c_sk',
            USERNAME_KEY: '_it_fswb_vcp_c_un',
            SITE_INFORMATION_KEY: '_it_fswb_vcp_c_si',
            MSISDN_KEY: '_it_fswb_vcp_c_mk',
            LATEST_STATE: '_it_fswb_vcp_c_lst',
            USER_RIGHTS: '_it_fswb_vcp_c_ur',
            CMPF_SUBSCRIBER_KEY: '_it_fswb_vcp_c_csk',
            SUBSCRIBER_PROFILE_KEY: '_it_fswb_vcp_c_spk',
            USER_ORGANIZATION_KEY: '_it_fswb_vcp_c_uok',
            USER_ORGANIZATION_ID_KEY: '_it_fswb_vcp_c_uoik',
            USER_ORGANIZATION_NAME_KEY: '_it_fswb_vcp_c_onk',
            USER_ADMIN_KEY: '_it_fswb_vcp_c_uak',
            USER_BMS_ADMIN_KEY: '_it_fswb_vcp_c_ubak',
            // Created with this command: node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
            MEG_WHITE: "602beb2435b48b18b54030ac1a8847c29f2a67d1c8a2cae31a12101d2ffc1943",
            Validators: {
                Msisdn: /^[0-9]{0,15}$/,
                ScreeningListValidPhoneNumber: /^[0-9]{1,30}(\*){0,1}$/,
                IntegerNumber: /^[0-9]+$/
            },
            calculateDaysAgo: function (dayCount) {
                return moment().startOf('day').subtract(dayCount, 'days').toDate();
            },
            calculateMonthssAgo: function (monthCount) {
                return moment().startOf('day').subtract(monthCount, 'months').toDate();
            },
            calculateYearsAgo: function (yearCount) {
                return moment().startOf('day').subtract(yearCount, 'years').toDate();
            },
            getCurrentNanoTime: function () {
                return (new Date()).getTime();
            },
            getOneWeekAgo: function () {
                return moment().startOf('day').subtract(7, 'days').toDate();
            },
            getOneDayAgo: function () {
                return moment().startOf('day').subtract(1, 'days').toDate();
            },
            getTodayBegin: function () {
                return moment().startOf('day').toDate();
            },
            getTodayEnd: function () {
                return moment().endOf('day').toDate();
            },
            calculateDate: function (date, hour, minute) {
                var dateObj = new Date(date);
                dateObj.setHours(hour, minute, 0, 0);
                return dateObj;
            },
            showDummySpinner: function () {
                cfpLoadingBar.start();
                cfpLoadingBar.inc();
            },
            hideDummySpinner: function () {
                cfpLoadingBar.complete();
            },
            getFromSessionStore: function (key) {
                var objectCipherText = $window.localStorage.getItem(key);
                if (_.isEmpty(objectCipherText))
                    return {};

                // Decrypt
                try {
                    var bytes = CryptoJS.AES.decrypt(objectCipherText, this.MEG_WHITE);
                    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                    return decryptedData;
                } catch (error) {
                    return {};
                }
            },
            putToSessionStore: function (key, object) {
                var jsonStringOfObj = JSON.stringify(object);

                // Encrypt
                var objectCipherText = CryptoJS.AES.encrypt(jsonStringOfObj, this.MEG_WHITE);

                $window.localStorage.setItem(key, objectCipherText.toString());
            },
            removeFromSessionStore: function (key) {
                $window.localStorage.removeItem(key);
            },
            msisdnWithoutCountryCode: function (msisdn) {
                return s.strRight(msisdn, this.COUNTRY_CODE);
            },
            getSubscriberMsisdn: function () {
                var _self = this;

                var subscriberAttributes = _self.getFromSessionStore(_self.SUBSCRIBER_PROFILE_KEY);
                var msisdn = subscriberAttributes.msisdn;

                return msisdn;
            },
            injectStringIntoAText: function (text, string, position) {
                if (!_.isEmpty(text) && !_.isEmpty(text)) {
                    text = text.substr(0, position) + string + text.substr(position);
                }
                return text;
            },
            convertPeriodStringToSimpleObject: function (string) {
                var periodAndTime = s.words(s.words(string, 'P'), 'T');

                var period = periodAndTime[0];
                var year = s.toNumber(s.strLeft(period, 'Y'));
                if (year) {
                    return {unit: DURATION_UNITS[3].key, duration: year};
                }
                var month = s.toNumber(s.strLeft(s.strRight(period, 'Y'), 'M'));
                if (month) {
                    return {unit: DURATION_UNITS[2].key, duration: month};
                }
                var day = s.toNumber(s.strLeft(s.strRight(period, 'M'), 'D'));
                if (day) {
                    return {unit: DURATION_UNITS[0].key, duration: day};
                }

                var time = periodAndTime[1];
                var hour = s.toNumber(s.strLeft(time, 'H'));
                if (hour) {
                    return {unit: DURATION_UNITS[4].key, duration: hour};
                }
                var minute = s.toNumber(s.strLeft(s.strRight(time, 'H'), 'M'));
                if (minute) {
                    return {unit: DURATION_UNITS[5].key, duration: minute};
                }
                var second = s.toNumber(s.strLeft(s.strRight(time, 'M'), 'S'));
                if (second) {
                    return {unit: DURATION_UNITS[6].key, duration: second};
                }

                return {unit: DURATION_UNITS[0].key, duration: 1};
            },
            convertSimpleObjectToPeriod: function (obj) {
                var year = '000';
                var day = '000';
                var month = '000';
                var hour = '00';
                var minute = '00';
                var second = '00';

                if (obj.unit === 'Days') {
                    day = obj.duration;
                } else if (obj.unit === 'Weeks') {
                    day = obj.duration * 7;
                } else if (obj.unit === 'Months') {
                    month = obj.duration;
                } else if (obj.unit === 'Hours') {
                    hour = obj.duration;
                } else if (obj.unit === 'Minutes') {
                    minute = obj.duration;
                } else if (obj.unit === 'Seconds') {
                    second = obj.duration;
                } else {
                    year = obj.duration;
                }

                year = s.lpad(year, 3, '0');
                day = s.lpad(day, 3, '0');
                month = s.lpad(month, 3, '0');

                hour = s.lpad(hour, 2, '0');
                minute = s.lpad(minute, 2, '0');
                second = s.lpad(second, 2, '0');

                return 'P' + year + 'Y' + month + 'M' + day + 'D' + 'T' + hour + 'H' + minute + 'M' + second + 'S';
            },
            convertPeriodStringToHumanReadable: function (string) {
                var periodAndTime = s.words(s.words(string, 'P'), 'T');
                var period = periodAndTime[0];
                var year = s.toNumber(s.strLeft(period, 'Y'));
                var month = s.toNumber(s.strLeft(s.strRight(period, 'Y'), 'M'));
                var day = s.toNumber(s.strLeft(s.strRight(period, 'M'), 'D'));

                var time = periodAndTime[1];
                var hour = s.toNumber(s.strLeft(time, 'H'));
                var minute = s.toNumber(s.strLeft(s.strRight(time, 'H'), 'M'));
                var second = s.toNumber(s.strLeft(s.strRight(time, 'M'), 'S'));

                var text = '';
                text += (year !== 0) ? year + ' ' + $translate.instant('Period.Year') + (year > 1 ? 's' : '') : '';
                text += (month !== 0) ? month + ' ' + $translate.instant('Period.Month') + (month > 1 ? 's' : '') : '';
                text += (day !== 0) ? day + ' ' + $translate.instant('Period.Day') + (day > 1 ? 's' : '') : '';
                text += (hour !== 0) ? hour + ' ' + $translate.instant('Period.Hour') + (hour > 1 ? 's' : '') : '';
                text += (minute !== 0) ? minute + ' ' + $translate.instant('Period.Minute') + (minute > 1 ? 's' : '') : '';
                text += (second !== 0) ? second + ' ' + $translate.instant('Period.Second') + (second > 1 ? 's' : '') : '';

                return text === '' ? '0 ' + $translate.instant('Period.Day') : text;
            },
            escapeRegExp: function (text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\\\$&');
            },
            setError: function (form, fieldName, validation, validationValue) {
                form[fieldName].$dirty = true;
                form[fieldName].$setValidity(validation, validationValue);
            },
            removeReservedCharacters: function (text) {
                text = text.replace(/\+/g, '');
                text = text.replace(/\-/g, '');
                text = text.replace(/\&/g, '');
                text = text.replace(/\|/g, '');
                text = text.replace(/\!/g, '');
                text = text.replace(/\(/g, '');
                text = text.replace(/\)/g, '');
                text = text.replace(/\{/g, '');
                text = text.replace(/\}/g, '');
                text = text.replace(/\[/g, '');
                text = text.replace(/\]/g, '');
                text = text.replace(/\^/g, '');
                text = text.replace(/\"/g, '');
                text = text.replace(/\~/g, '');

                if (text !== "*")
                    text = text.replace(/\*/g, '');

                text = text.replace(/\?/g, '');
                text = text.replace(/\:/g, '');
                text = text.replace(/\\/g, '');
                text = text.replace(/\//g, '');

                return text;
            },
            addPromiseToTracker: function (promise, promiseTracker) {
                if (_.isUndefined(promiseTracker))
                    CCPortalMainPromiseTracker.addPromise(promise);
                else
                    promiseTracker.addPromise(promise);
            },
            parseJwt: function (token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');

                return JSON.parse(atob(base64));
            },
            showResponseErrorNotification: function (response) {
                var serviceLabel = response.config ? response.config.headers.ServiceLabel : 'N/A';

                $translate("CommonMessages.ServerError", {
                    status: response.status,
                    message: response.statusText + (serviceLabel ? ' (' + serviceLabel + ')' : '')
                }).then(function (message) {
                    notification({
                        type: 'warning',
                        text: message
                    });
                });
            }
        };
    });

    ApplicationServices.factory('FileDownloadService', function ($log, $q, $window, $timeout, SERVICES_BASE, RESOURCE_NAME, SessionService, UtilService) {
        return {
            extractFileNameFromContentDisposition: function (contentDisposition) {
                var filename = '';

                if (contentDisposition && (contentDisposition.indexOf('inline') !== -1 || contentDisposition.indexOf('attachment') !== -1)) {
                    var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(contentDisposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].trim().replace(/UTF-8|\'|\"/g, '');
                    }
                }

                return filename;
            },
            downloadFile: function (url, callback) {
                UtilService.showDummySpinner();

                var _self = this;

                var sessionKey = SessionService.getSessionKey();

                var xhr = new XMLHttpRequest();
                xhr.open('GET', SERVICES_BASE + url, true);
                xhr.setRequestHeader("Authorization", 'Bearer ' + sessionKey.token);
                xhr.setRequestHeader("Channel", 'CC ');
                xhr.setRequestHeader("Username", SessionService.getUsername());
                xhr.setRequestHeader("TransactionId", new Date().getTime());
                xhr.setRequestHeader("ServiceLabel", 'Download Service');
                xhr.setRequestHeader("ResourceName", RESOURCE_NAME);
                xhr.responseType = "blob";
                xhr.onreadystatechange = function () {
                    if (callback && (this.readyState == this.DONE)) {
                        UtilService.hideDummySpinner();

                        if (this.status === 200) {
                            var contentDisposition = this.getResponseHeader('content-disposition');
                            var fileName = _self.extractFileNameFromContentDisposition(contentDisposition);

                            callback(this.response, fileName, this.status);
                        } else {
                            callback(null, null, this.status);
                        }
                    }
                };
                xhr.send(null);
            },
            downloadFileAndGetBlob: function (srcUrl, callback) {
                this.downloadFile(srcUrl, function (blob, fileName, status) {
                    callback(blob, fileName, status);
                });
            },
            downloadFileAndGenerateUrl: function (srcUrl, callback, bloblUrlTtl) {
                this.downloadFile(srcUrl, function (blob, fileName) {
                    var _URL = $window.URL || $window.webkitURL || $window.mozURL;
                    var url = _URL.createObjectURL(blob);

                    // Revoke the url after 3 minutes.
                    $timeout(function () {
                        // Add this url to the url revoke queue.
                        _URL.revokeObjectURL(url);
                    }, bloblUrlTtl || 3 * 60 * 1000);

                    callback(url, fileName);
                });
            }
        }
    });

    ApplicationServices.factory('ReportingExportService', function ($log, $window, $timeout, $translate, notification, FileDownloadService, UtilService) {
        return {
            showReport: function (srcUrl, formatName, overridedFileName) {
                UtilService.showDummySpinner();

                var htmlName = 'partials/report.html';
                if (formatName !== 'HTML') {
                    htmlName = 'partials/download.html';
                }

                FileDownloadService.downloadFile(srcUrl, function (blob, fileName, responseStatus) {
                    UtilService.hideDummySpinner();

                    if (responseStatus && responseStatus !== 200) {
                        notification({
                            type: 'warning',
                            text: $translate.instant('CommonMessages.FileNotFound')
                        });

                        return;
                    }

                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob, overridedFileName || fileName);
                    } else {
                        var _URL = $window.URL || $window.webkitURL || $window.mozURL;
                        var url = _URL.createObjectURL(blob);

                        var win = $window.open(htmlName += '?url=' + encodeURIComponent(url));

                        if (!win || win.closed || typeof win.closed == 'undefined') {
                            // Pup-up Blocked
                            notification({
                                type: 'warning',
                                text: $translate.instant('CommonMessages.PopupBlockerDetected')
                            });

                            return;
                        }

                        if (formatName === 'HTML') {
                            // Do nothing if HTML
                        } else if (formatName === 'CSV' || formatName === 'MS EXCEL' || formatName === 'EXCEL 2007' || formatName === 'XLS' || formatName === 'WAV') {
                            if (formatName === 'WAV' && blob.type === 'text/html') {
                                notification({
                                    type: 'warning',
                                    text: $translate.instant('CommonMessages.GenericServerError')
                                });

                                // Close the download window if any error occurred.
                                $timeout(function () {
                                    win.close();
                                }, 100);
                            } else {
                                var onload = function (e) {
                                    $timeout(function () {
                                        // Construct an <a> element and give the url to it to be able to give filename
                                        // to the file which want to be downloaded.
                                        var link = win.document.createElement("a");
                                        link.download = overridedFileName || fileName;
                                        link.href = url;
                                        win.document.body.appendChild(link);
                                        link.click();

                                        $timeout(function () {
                                            // Close the download window after download modal window has appeared.
                                            win.close();
                                        }, 200);
                                    }, 1000);
                                };

                                angular.element(win).bind('load', onload);
                            }
                        } else {
                            $timeout(function () {
                                win.location = url;
                            }, 1000);
                        }

                        // Revoke the url after 3 minutes.
                        $timeout(function () {
                            // Add this url to the url revoke queue.
                            _URL.revokeObjectURL(url);
                        }, 3 * 60 * 1000);
                    }
                });
            }
        };
    });

    ApplicationServices.factory('NgTableService', function ($log, $translate) {
        return {
            filterList: function (filterText, columns, list) {
                var filteredListData;

                if (_.isEmpty(filterText)) {
                    filteredListData = list;
                } else {
                    filteredListData = _.filter(list, function (obj) {
                        for (var i in columns) {
                            // Use {translate} prefix in order to search in translations.
                            var propName = columns[i].split('{translate}');
                            var propValue;
                            try {
                                if (propName.length > 1) {
                                    propValue = $translate.instant(eval('obj.' + propName[1]));
                                } else {
                                    // For evaluating nested object properties like "property.name".
                                    propValue = eval('obj.' + propName[0]);
                                }
                            } catch (e) {
                                // ignore
                            }

                            if (typeof propValue !== 'undefined') {
                                // `~` with `indexOf` means "contains"
                                // `toLowerCase` to discard case of question string
                                var matched = ~String(propValue).toLowerCase().indexOf(filterText.toLowerCase());

                                if (matched)
                                    return true;
                            }
                        }

                        return false;
                    });
                }

                return filteredListData;
            }
        };
    });

    ApplicationServices.service('SessionService', function ($log, $window, $http, $rootScope, $timeout, $state, UtilService, RESOURCE_NAME) {
        return {
            getSessionKey: function () {
                var sessionKey = UtilService.getFromSessionStore(UtilService.SESSION_KEY);

                return sessionKey;
            },
            getUsername: function () {
                var username = UtilService.getFromSessionStore(UtilService.USERNAME_KEY);

                return username;
            },
            getMsisdn: function () {
                var msisdn = UtilService.getFromSessionStore(UtilService.MSISDN_KEY);

                return msisdn;
            },
            subscriberProfile: function () {
                var subscriberProfile = UtilService.getFromSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY);

                return subscriberProfile;
            },
            getSubscriberState: function () {
                var subscriberProfile = UtilService.getFromSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY);

                return subscriberProfile.state;
            },
            getSessionUserRights: function () {
                var userRights = UtilService.getFromSessionStore(UtilService.USER_RIGHTS);

                return userRights;
            },
            setResourceNameHeader: function () {
                $http.defaults.headers.common.ResourceName = RESOURCE_NAME;
            },
            setAuthorizationHeader: function (token) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + token;
            },
            saveUserAttributesInSession: function (username, authenticateResponse) {
                this.setAuthorizationHeader(authenticateResponse.token);

                UtilService.putToSessionStore(UtilService.SESSION_KEY, authenticateResponse);
                UtilService.putToSessionStore(UtilService.USERNAME_KEY, username);
            },
            getSiteInformation: function () {
                var siteInformation = UtilService.getFromSessionStore(UtilService.SITE_INFORMATION_KEY);

                return siteInformation;
            },
            isSessionValid: function () {
                // Check the session key, username and user rights only to be sure there is a valid session. The portal will be
                // used the tokens that saved in the session key to be able to go to the restful services.
                return !_.isEmpty(this.getSessionKey()) && !_.isEmpty(this.getUsername()) && !_.isEmpty(this.getSessionUserRights());
            },
            logout: function () {
                angular.element(document.querySelector('body')).addClass('hidden');

                this.sessionInvalidate();

                $timeout(function () {
                    $window.location.href = 'app.html#!/login';
                    $window.location.reload(true);
                }, 0);
            },
            cleanValues: function () {
                UtilService.removeFromSessionStore(UtilService.SESSION_KEY);
                UtilService.removeFromSessionStore(UtilService.USERNAME_KEY);
                UtilService.removeFromSessionStore(UtilService.SITE_INFORMATION_KEY);
                UtilService.removeFromSessionStore(UtilService.MSISDN_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_RIGHTS);
                UtilService.removeFromSessionStore(UtilService.CMPF_SUBSCRIBER_KEY);
                UtilService.removeFromSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_ORGANIZATION_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_ORGANIZATION_ID_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_ORGANIZATION_NAME_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_ADMIN_KEY);
                UtilService.removeFromSessionStore(UtilService.USER_BMS_ADMIN_KEY);
            },
            sessionInvalidate: function () {
                delete $http.defaults.headers.common.Authorization;

                this.cleanValues();
            }
        };
    });

    // Server Configuration and Information Services
    ApplicationServices.factory('ServerConfigurationService', function ($log, $q, ServerInformationRestangular, UtilService) {
        return {
            // The methods which gets data from the free zone.
            getSiteInformation: function (promiseTracker) {
                var promise = ServerInformationRestangular.one('site.json?' + UtilService.getCurrentNanoTime()).get();
                UtilService.addPromiseToTracker(promise, promiseTracker);

                return promise;
            }
        };
    });

    // CMPF Cache Services
    ApplicationServices.factory('CMPFCacheService', function ($log, $q, CMPFCacheRestangular, UtilService) {
        return {};
    });

    // CMPF Services
    ApplicationServices.factory('CMPFService', function ($log, $q, $filter, UtilService, CMPFAuthRestangular, CMPFRestangular, DEFAULT_REST_QUERY_LIMIT, CURRENCY) {
        return {
            DEFAULT_ORGANIZATION_NAME: "Fastweb",
            RELATED_RESOURCES: ['VCP Customer Care Portal'],
            // Subscriber related profiles
            SUBSCRIBER_PROFILE: 'SubscriberProfile',
            // Offer related profiles
            OFFER_TEMPLATE_NAME: "OfferTemplate",
            ENTITY_I18N_PROFILE: "Entityi18nProfile",
            XSM_CHARGING_PROFILE: "XsmChargingProfile",
            XSM_OFFER_PROFILE: "XsmOfferProfile",
            XSM_RENEWAL_PROFILE: "XsmRenewalProfile",
            XSM_TRIAL_PROFILE: "XsmTrialProfile",
            PRICE_GROUP_PROFILE: "PriceGroupProfile",
            OFFER_PROFILE: "OfferProfile",
            SUBSCRIPTION_RENEWAL_NOTIFICATION_PROFILE: "SubscriptionRenewalNotificationProfile",
            // User related profiles
            BULK_USER_PROFILE: 'BulkUserProfile',
            BULK_USER_POLICY_PROFILE: 'BulkUserPolicyProfile',
            BULK_SMS_POLICY_PROFILE: 'BulkSMSPolicyProfile',
            // Organization related profiles
            USSD_CODE_PROFILE_NAME: 'USSDCorporateCode',
            BULK_ORGANIZATION_PROFILE: 'BulkOrganizationProfile',
            // Predefined group and user names
            VCP_ADMIN_GROUP: 'VCP Admin',
            VCP_BMS_ADMIN_GROUP: 'VCP Marketing Admin',
            // Methods
            showApiError: function (response) {
                var type = 'warning', message;

                if (response) {
                    if (response.errorDescription) {
                        message = response.errorDescription.split(':')[0] + '...';
                    } else if (response.data) {
                        if (response.data.errorDescription) {
                            message = response.data.errorDescription.split(':')[0] + '...';
                        } else {
                            type = 'danger';
                            message = $translate.instant('CommonMessages.ApiError');
                        }
                    }
                }

                if (message) {
                    notification({
                        type: type,
                        text: message
                    });
                }
            },
            // Authentication
            authenticate: function (credential) {
                var authenticateProm = CMPFAuthRestangular.all('authenticate').post(credential);
                UtilService.addPromiseToTracker(authenticateProm);
                return authenticateProm;
            },
            refreshToken: function (refreshToken) {
                var refreshTokenProm = CMPFAuthRestangular.all('refresh-token').customGET(null, null, {
                    Authorization: 'Bearer ' + refreshToken
                });
                UtilService.addPromiseToTracker(refreshTokenProm);
                return refreshTokenProm;
            },
            // All Organizations without specifying type
            getAllOrganizations: function (offset, limit, withProfile) {
                var url = 'organizations?offset=' + offset + '&limit=' + limit;
                if (withProfile) {
                    url += '&withprofiles=true';
                }

                var prom = CMPFRestangular.one(url).get();
                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            // Only Network Operators
            getAllOperators: function (offset, limit, withProfile) {
                var url = 'organizations?offset=' + offset + '&limit=' + limit + '&type=NetworkOperator';
                if (withProfile) {
                    url += '&withprofiles=true';
                }

                var prom = CMPFRestangular.one(url).get();
                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            getAllOperatorsAndPartners: function (offset, limit, withchildren, withprofiles) {
                var _self = this;

                var deferred = $q.defer();

                var url = 'organizations?withprofiles=true&offset=' + offset + '&limit=' + limit + '&type=NetworkOperator,Partner' +
                    '&withchildren=' + (withchildren ? withchildren : false) +
                    '&withprofiles=' + (withprofiles ? withprofiles : false);

                CMPFRestangular.one(url).get().then(function (response) {
                    deferred.resolve({
                        metaData: {
                            limit: response.metaData.limit,
                            offset: response.metaData.offset,
                            totalCount: response.organizations.length
                        },
                        organizations: response.organizations
                    });
                }, function (response) {
                    deferred.reject(response);
                });

                UtilService.addPromiseToTracker(deferred.promise);

                return deferred.promise;
            },
            // Partner (service provider)
            getPartner: function (id, withprofiles) {
                var url = 'partners/' + id + '?withprofiles=' + withprofiles;

                var prom = CMPFRestangular.one(url).get();

                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            getAllPartners: function (offset, limit, withProfile, promiseTracker) {
                var url = 'partners?offset=' + offset + '&limit=' + limit;
                if (withProfile) {
                    url += '&withprofiles=true';
                }

                var prom = CMPFRestangular.one(url).get();
                UtilService.addPromiseToTracker(prom, promiseTracker);

                return prom;
            },
            // Services
            getServices: function (offset, limit, withchildren, withprofiles, promiseTracker) {
                var prom = CMPFRestangular.one('services?withchildren=' + withchildren + '&withprofiles=' + withprofiles + '&offset=' + offset + '&limit=' + limit).get();

                UtilService.addPromiseToTracker(prom, promiseTracker);

                return prom;
            },
            getServiceByName: function (name, withchildren, withprofiles) {
                var prom = CMPFRestangular.one('services?name=' + name + '&withchildren=' + withchildren + '&withprofiles=' + withprofiles).get();

                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            // Offers
            getOffers: function (offset, limit, withchildren, withprofiles, promiseTracker) {
                var prom = CMPFRestangular.one('offers?withchildren=' + withchildren + '&withprofiles=' + withprofiles + '&offset=' + offset + '&limit=' + limit).get();
                UtilService.addPromiseToTracker(prom, promiseTracker);

                return prom;
            },
            getActiveOffers: function (offset, limit, withchildren, withprofiles) {
                var prom = CMPFRestangular.one('offers?offset=' + offset + '&limit=' + limit + '&state=ACTIVE&withchildren=' + (withchildren ? withchildren : false) + '&withprofiles=' + (withprofiles ? withprofiles : false)).get();
                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            getOffersByService: function (offset, limit, serviceName, withchildren, withprofiles, promiseTracker) {
                var prom = CMPFRestangular.one('offers?offset=' + offset + '&limit=' + limit + '&serviceName=' + serviceName + '&withchildren=' + (withchildren ? withchildren : false) + '&withprofiles=' + (withprofiles ? withprofiles : false)).get();
                UtilService.addPromiseToTracker(prom, promiseTracker);

                return prom;
            },
            findOfferByName: function (offerName) {
                var activeOffersByServiceProm = CMPFRestangular.one('offers?withchildren=true&withprofiles=true&name=' + offerName).get();
                UtilService.addPromiseToTracker(activeOffersByServiceProm);

                return activeOffersByServiceProm;
            },
            // User accounts
            getUserAccounts: function (offset, limit, withProfile, promiseTracker) {
                var url = 'useraccounts?withchildren=true&offset=' + offset + '&limit=' + limit;
                if (withProfile) {
                    url += '&withprofiles=true';
                }

                var prom = CMPFRestangular.one(url).get();
                UtilService.addPromiseToTracker(prom, promiseTracker);
                return prom;
            },
            getUserAccount: function (id, withProfile, promiseTracker) {
                var url = 'useraccounts/' + id + '?withchildren=true';
                if (withProfile) {
                    url += '&withprofiles=true';
                }

                var prom = CMPFRestangular.one(url).get();
                UtilService.addPromiseToTracker(prom, promiseTracker);
                return prom;
            },
            getUserAccountRights: function (id) {
                var _self = this;
                var deferred = $q.defer()

                UtilService.addPromiseToTracker(deferred.promise);

                CMPFRestangular.one('useraccounts/' + id + '/rights').get().then(function (response) {
                    if (response) {
                        response = _.filter(response, function (right) {
                            return _.contains(_self.RELATED_RESOURCES, right.resourceName);
                        });
                    }

                    deferred.resolve(response);
                }, function (response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getUserAccountGroups: function (userId, withchildren, withprofiles) {
                var promise = CMPFRestangular.one('useraccounts/' + userId + '/usergroups?withchildren=' + withchildren + '&withprofiles=' + withprofiles).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            // Profile operations
            getOrphanProfilesByProfileDefName: function (profileDefName, withchildren) {
                var url = 'profiles/orphan?profileDefName=' + profileDefName;
                if (withchildren) {
                    url += '&withchildren=true';
                }

                var prom = CMPFRestangular.one(url).get();

                UtilService.addPromiseToTracker(prom);

                return prom;
            },
            findProfileByName: function (profiles, profileName) {
                return _.findWhere(profiles, {profileDefinitionName: profileName});
            },
            findProfilesByName: function (profiles, profileName) {
                return _.where(profiles, {profileDefinitionName: profileName});
            },
            getProfileAttributes: function (profileList, profileName) {
                var array = [];

                var profiles = _.where(profileList, {name: profileName});
                angular.forEach(profiles, function (profile) {
                    var obj = {};
                    angular.forEach(profile.attributes, function (attribute) {
                        var value;
                        if (attribute.listValues && attribute.listValues.length > 0) {
                            var value = $filter('orderBy')(attribute.listValues, ['value']);
                        } else {
                            value = attribute.value;
                            if (!_.isEmpty(value) && !_.isUndefined(value)) {
                                var numValue = Number(value);
                                if (!isNaN(numValue)) {
                                    if ((value.length > 1 && !value.startsWith('0')) || (value.length === 1) || value.includes(',') || value.includes('.')) {
                                        value = numValue;
                                    }
                                } else if (value === 'true' || value === 'false') {
                                    value = s.toBoolean(value);
                                }
                            }
                        }

                        obj[attribute.name] = value;
                    });

                    obj.profileId = profile.id;

                    array.push(obj);
                });

                return array;
            },
            // Bulk Messaging Related methods
            getBulkOrganizationProfile: function (provider) {
                return this.findProfileByName(provider.profiles, this.BULK_ORGANIZATION_PROFILE);
            },
            extractBulkOrganizationProfile: function (provider) {
                var bulkOrganizationProfileDef = this.getBulkOrganizationProfile(provider);

                if (!_.isEmpty(bulkOrganizationProfileDef) && !_.isUndefined(bulkOrganizationProfileDef)) {
                    var contactPersonAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "ContactPerson"});
                    var phoneAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "Phone"});
                    var addressAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "Address"});
                    var faxAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "Fax"});
                    var emailAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "Email"});
                    var webSiteAttr = _.findWhere(bulkOrganizationProfileDef.attributes, {name: "WebSite"});

                    return {
                        ContactPerson: (contactPersonAttr ? contactPersonAttr.value : ''),
                        Phone: (phoneAttr ? phoneAttr.value : ''),
                        Address: (addressAttr ? addressAttr.value : ''),
                        Fax: (faxAttr ? faxAttr.value : ''),
                        Email: (emailAttr ? emailAttr.value : ''),
                        WebSite: (webSiteAttr ? webSiteAttr.value : '')
                    };
                } else {
                    return {};
                }
            },
            getBulkUserProfile: function (userAccount) {
                return this.findProfileByName(userAccount.profiles, this.BULK_USER_PROFILE);
            },
            extractBulkUserProfile: function (userAccount) {
                var bulkUserProfileDef = this.getBulkUserProfile(userAccount);

                if (!_.isEmpty(bulkUserProfileDef) && !_.isUndefined(bulkUserProfileDef)) {
                    var nameAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "Name"});
                    var surnameAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "Surname"});
                    var phoneAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "Phone"});
                    var emailAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "Email"});
                    var addressAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "Address"});
                    var secretQuestionAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "SecretQuestion"});
                    var secretQuestionCorrectAnswerAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "SecretQuestionCorrectAnswer"});
                    var isBulkSmsUserAttr = _.findWhere(bulkUserProfileDef.attributes, {name: "isBulkSmsUser"});

                    return {
                        Name: (nameAttr ? nameAttr.value : ''),
                        Surname: (surnameAttr ? surnameAttr.value : ''),
                        Phone: (phoneAttr ? phoneAttr.value : ''),
                        Email: (emailAttr ? emailAttr.value : ''),
                        Address: (addressAttr ? addressAttr.value : ''),
                        SecretQuestion: (secretQuestionAttr ? secretQuestionAttr.value : ''),
                        SecretQuestionCorrectAnswer: (secretQuestionCorrectAnswerAttr ? secretQuestionCorrectAnswerAttr.value : ''),
                        isBulkSmsUser: (isBulkSmsUserAttr && isBulkSmsUserAttr.value === 'true' ? true : false)
                    };
                } else {
                    return {};
                }
            },
            getBulkUserPolicyProfile: function (userAccount) {
                return this.findProfileByName(userAccount.profiles, this.BULK_USER_POLICY_PROFILE);
            },
            extractBulkUserPolicyProfile: function (userAccount) {
                var bulkUserPolicyProfileDef = this.getBulkUserPolicyProfile(userAccount);

                if (!_.isEmpty(bulkUserPolicyProfileDef) && !_.isUndefined(bulkUserPolicyProfileDef)) {
                    var PermissibleUserAccountsAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "PermissibleUserAccounts"});
                    var isModeratedAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "isModerated"});
                    var ModeratorsAssignedAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "ModeratorsAssigned"});
                    var isApiAccessAllowedAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "isApiAccessAllowed"});
                    var isIpAddressListRestrictedAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "isIpAddressListRestricted"});
                    var permissibleIpAddressesAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "PermissibleIpAddresses"});
                    var isTimeConstraintEnforcedAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "isTimeConstraintEnforced"});
                    var timeConstraintsAttr = _.findWhere(bulkUserPolicyProfileDef.attributes, {name: "TimeConstraints"});
                    return {
                        PermissibleUserAccounts: (PermissibleUserAccountsAttr ? PermissibleUserAccountsAttr.value : ''),
                        isModerated: (isModeratedAttr && isModeratedAttr.value === 'true' ? true : false),
                        ModeratorsAssigned: (ModeratorsAssignedAttr ? ModeratorsAssignedAttr.value : ''),
                        isApiAccessAllowed: (isApiAccessAllowedAttr && isApiAccessAllowedAttr.value === 'true' ? true : false),
                        isIpAddressListRestricted: (isIpAddressListRestrictedAttr && isIpAddressListRestrictedAttr.value === 'true' ? true : false),
                        PermissibleIpAddresses: (permissibleIpAddressesAttr ? permissibleIpAddressesAttr.listValues : []),
                        isTimeConstraintEnforced: (isTimeConstraintEnforcedAttr && isTimeConstraintEnforcedAttr.value === 'true' ? true : false),
                        TimeConstraints: (timeConstraintsAttr ? timeConstraintsAttr.listValues : [])
                    };
                } else {
                    return {};
                }
            },
            getBulkSMSPolicyProfile: function (userAccount) {
                return this.findProfileByName(userAccount.profiles, this.BULK_SMS_POLICY_PROFILE);
            },
            extractBulkSMSPolicyProfile: function (userAccount) {
                var bulkPolicyProfileDef = this.getBulkSMSPolicyProfile(userAccount);

                if (!_.isEmpty(bulkPolicyProfileDef) && !_.isUndefined(bulkPolicyProfileDef)) {
                    var isFlashSmsAllowedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isFlashSmsAllowed"});
                    var isMaxRetryCntOverridableAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isMaxRetryCntOverridable"});
                    var isValidityPeriodOverridableAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isValidityPeriodOverridable"});
                    var isSenderMsisdnOverridableAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isSenderMsisdnOverridable"});
                    var isLocationTargetingAllowedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isLocationTargetingAllowed"});
                    var isTargetProfilingAllowedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isTargetProfilingAllowed"});
                    var isDisableChargingAllowedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isDisableChargingAllowed"});
                    var isOffnetSenderListRestrictedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isOffnetSenderListRestricted"});
                    var permissibleOffnetSendersAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "PermissibleOffnetSenders"});
                    var isOffNetDeliveryAllowedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isOffNetDeliveryAllowed"});
                    var isAlphanumericSenderListRestrictedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isAlphanumericSenderListRestricted"});
                    var permissibleAlphanumericSendersAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "PermissibleAlphanumericSenders"});
                    var isQuotaLimitedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isQuotaLimited"});
                    var availableQuotaAmountAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "AvailableQuotaAmount"});
                    var quotaStartDateAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "QuotaStartDate"});
                    var quotaExpiryDateAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "QuotaExpiryDate"});
                    var isQuotaRefundedUponDeliveryFailureAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isQuotaRefundedUponDeliveryFailure"});
                    var isThroughputLimitedAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "isThroughputLimited"});
                    var throughputLimitAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "ThroughputLimit"});
                    var senderMsisdnAttr = _.findWhere(bulkPolicyProfileDef.attributes, {name: "SenderMsisdn"});
                    return {
                        isFlashSmsAllowed: (isFlashSmsAllowedAttr && isFlashSmsAllowedAttr.value === 'true' ? true : false),
                        isMaxRetryCntOverridable: (isMaxRetryCntOverridableAttr && isMaxRetryCntOverridableAttr.value === 'true' ? true : false),
                        isValidityPeriodOverridable: (isValidityPeriodOverridableAttr && isValidityPeriodOverridableAttr.value === 'true' ? true : false),
                        isSenderMsisdnOverridable: (isSenderMsisdnOverridableAttr && isSenderMsisdnOverridableAttr.value === 'true' ? true : false),
                        isLocationTargetingAllowed: (isLocationTargetingAllowedAttr && isLocationTargetingAllowedAttr.value === 'true' ? true : false),
                        isTargetProfilingAllowed: (isTargetProfilingAllowedAttr && isTargetProfilingAllowedAttr.value === 'true' ? true : false),
                        isDisableChargingAllowed: (isDisableChargingAllowedAttr && isDisableChargingAllowedAttr.value === 'true' ? true : false),
                        isOffNetDeliveryAllowed: (isOffNetDeliveryAllowedAttr && isOffNetDeliveryAllowedAttr.value === 'true' ? true : false),
                        isOffnetSenderListRestricted: (isOffnetSenderListRestrictedAttr && isOffnetSenderListRestrictedAttr.value === 'true' ? true : false),
                        PermissibleOffnetSenders: (permissibleOffnetSendersAttr ? permissibleOffnetSendersAttr.listValues : []),
                        isAlphanumericSenderListRestricted: (isAlphanumericSenderListRestrictedAttr && isAlphanumericSenderListRestrictedAttr.value === 'true' ? true : false),
                        PermissibleAlphanumericSenders: (permissibleAlphanumericSendersAttr ? permissibleAlphanumericSendersAttr.listValues : []),
                        isQuotaLimited: (isQuotaLimitedAttr && isQuotaLimitedAttr.value === 'true' ? true : false),
                        AvailableQuotaAmount: (availableQuotaAmountAttr ? Number(availableQuotaAmountAttr.value) : 0),
                        QuotaStartDate: (quotaStartDateAttr && quotaStartDateAttr.value ? moment(moment(quotaStartDateAttr.value + DateTimeConstants.OFFSET)).toDate() : new Date()),
                        QuotaExpiryDate: (quotaExpiryDateAttr && quotaExpiryDateAttr.value ? moment(moment(quotaExpiryDateAttr.value + DateTimeConstants.OFFSET)).toDate() : new Date()),
                        isQuotaRefundedUponDeliveryFailure: (isQuotaRefundedUponDeliveryFailureAttr && isQuotaRefundedUponDeliveryFailureAttr.value === 'true' ? true : false),
                        isThroughputLimited: (isThroughputLimitedAttr && isThroughputLimitedAttr.value === 'true' ? true : false),
                        ThroughputLimit: (throughputLimitAttr ? Number(throughputLimitAttr.value) : 0),
                        SenderMsisdn: (senderMsisdnAttr ? senderMsisdnAttr.value : '')
                    };
                } else {
                    return {};
                }
            }
        };
    });

    // SSM Services
    ApplicationServices.factory('SSMSubscribersService', function ($log, $q, UtilService, SSMSubscribersRestangular) {
        return {
            prepareSubscriberProfile: function (subscriber) {
                var subscriberProfile = angular.copy(subscriber);

                subscriberProfile.languageLabel = subscriberProfile.lang ? 'Languages.' + subscriberProfile.lang : 'CommonLabels.N/A';
                subscriberProfile.paymentTypeLabel = subscriberProfile.paymentType ? subscriberProfile.paymentType : 'CommonLabels.N/A';

                return subscriberProfile;
            },
            // Subscriber Operations
            getSubscriberByMsisdn: function (msisdn) {
                var _self = this;

                var deferredFindSubscriber = $q.defer();

                var prom = SSMSubscribersRestangular.one('/' + msisdn).get();
                prom.then(function (response) {
                    // If there is no subscriber with specified MSISDN
                    if (_.isEmpty(response) || (response && response.state.currentState === 'INACTIVE') || (response && !response.msisdn)) {
                        $log.debug('Subscriber not found with the msisdn: ', msisdn);

                        deferredFindSubscriber.reject(response);
                    } else { // Found a subscriber as per specified MSISDN and put it to the session store.
                        $log.debug('Subscriber found by the msisdn: ', msisdn, ', Response: ', response);

                        var subscriberProfile = _self.prepareSubscriberProfile(response);
                        $log.debug('Prepared subscriber profile for the msisdn: ', msisdn, ', SubscriberProfile: ', subscriberProfile);

                        // Here is writing application styled json object to the current session
                        UtilService.putToSessionStore(UtilService.SUBSCRIBER_PROFILE_KEY, subscriberProfile);
                        UtilService.putToSessionStore(UtilService.MSISDN_KEY, msisdn);

                        deferredFindSubscriber.resolve(subscriberProfile);
                    }
                }, function (response) {
                    $log.debug('Error: ', response);

                    deferredFindSubscriber.reject(response);
                });

                UtilService.addPromiseToTracker(deferredFindSubscriber.promise);

                return deferredFindSubscriber.promise;
            }
        }
    });
    ApplicationServices.factory('VCPSubscribersService', function ($log, $q, $translate, notification, UtilService, VCPSubscribersRestangular) {
        return {
            showApiError: function (response) {
                var type = 'warning', message;

                if (response) {
                    if (response.errorCode) {
                        message = response.errorCode + ' - ' + response.errorMessage
                    } else if (response.data) {
                        if (response.data.errorCode) {
                            message = response.data.errorCode + ' - ' + response.data.errorMessage
                        } else {
                            type = 'danger';
                            message = $translate.instant('CommonMessages.GenericServerError');
                        }
                    }
                }

                if (message) {
                    notification({
                        type: type,
                        text: message
                    });
                }
            },
            // Subscription methods
            createSubscription: function (subscriptionPayload) {
                var promise = VCPSubscribersRestangular.all('/soap/subscription').post(subscriptionPayload);

                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            deleteSubscription: function (subscriptionPayload) {
                var promise = VCPSubscribersRestangular.one('/soap/subscription').customOperation('remove', null, {}, {'Content-Type': 'application/json'}, subscriptionPayload);

                UtilService.addPromiseToTracker(promise);

                return promise;
            }
        }
    });

    // Screening Manager Services
    ApplicationServices.factory('ScreeningManagerService', function ($log, ScreeningManagerRestangular, ScreeningManagerStatsRestangular, Restangular, notification, $translate, UtilService) {
        var CHANNEL_TYPE = 3; // 1: SMS, 2: USSD, 3: CC, 4: Third Party, 5: IVR

        return {
            scopes: {
                // Main service scopes
                GLOBAL_SCOPE_KEY: 'global',
                MMSC_SCOPE_KEY: 'mmsc', // mms center
                SMSC_SCOPE_KEY: 'smsc', // sms center
                ICS_SCOPE_KEY: 'ics', // intelligent call screening
                CMB_SCOPE_KEY: 'cmb', // call me back
                COC_SCOPE_KEY: 'cc', // collect call
                POKE_CALL_SCOPE_KEY: 'poke', // poke call
                COLLECTSMS_SCOPE_KEY: 'collectsms', // collect sms
                MCA_SCOPE_KEY: 'mca', // missed call alert
                PSMS_SCOPE_KEY: 'psms', // personalized sms
                PMMS_SCOPE_KEY: 'pmms', // personalized mms
                VM_SCOPE_KEY: 'vm' // voice mail
            },
            errorCodes: {
                AUTHORIZATION_FAILED: 3001,
                API_NOT_SUPPORTED: 3011,
                STORAGE_ERROR: 3021,
                QUOTA_ERROR: 3031,
                WRONG_REQUEST_ERROR: 3041,
                SERVICE_NOT_FOUND: 3051,
                SCOPE_NOT_FOUND: 3061
            },
            getDefaultModeTypeByScope: function () {
                var defaultModeType = 'RejectBlackList';

                return defaultModeType;
            },
            getScopeByScopeKey: function (scopeKey, msisdn) {
                var scopePromise = ScreeningManagerRestangular.one(CHANNEL_TYPE + '/' + scopeKey + '/screenings/' + msisdn + '/' + scopeKey).get();
                UtilService.addPromiseToTracker(scopePromise);

                return scopePromise;
            },
            deleteListItem: function (scopeKey, $listObj, msisdn, screenableEntryId) {
                var requestUri = CHANNEL_TYPE + '/' + scopeKey + '/screenings/' + msisdn + '/' + scopeKey + '/' + $listObj.listkey + '/' + screenableEntryId;
                var scopeDeleteListItemPromise = ScreeningManagerRestangular.one(requestUri).remove();
                UtilService.addPromiseToTracker(scopeDeleteListItemPromise);

                return scopeDeleteListItemPromise;
            },
            addNewListItem: function (scopeKey, $listObj, msisdn, listItem) {
                var screeningRequest = {
                    "screeningRequest": {
                        "screenableEntry": [listItem],
                        "requestCorrelator": new Date().getTime()
                    }
                };

                var requestUri = CHANNEL_TYPE + '/' + scopeKey + '/screenings/' + msisdn + '/' + scopeKey + '/' + $listObj.listkey;
                var scopeAddItemToListPromise = ScreeningManagerRestangular.all(requestUri).post(screeningRequest);
                UtilService.addPromiseToTracker(scopeAddItemToListPromise);

                return scopeAddItemToListPromise;
            },
            updateScreeningMode: function (scopeKey, msisdn, screeningMode) {
                var screeningModeRequest = {
                    screeningMode: {
                        screeningModeType: screeningMode.modeType
                    }
                };

                if (screeningMode.timeConstraintAvailable) {
                    if (screeningMode.timeConstraintType === 'absolute') {
                        var startDateIso = $filter('date')(screeningMode.absolute.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss' + DateTimeConstants.OFFSET);
                        startDateIso = UtilService.injectStringIntoAText(startDateIso, ':', startDateIso.length - 2);

                        var endDateIso = $filter('date')(screeningMode.absolute.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss' + DateTimeConstants.OFFSET);
                        endDateIso = UtilService.injectStringIntoAText(endDateIso, ':', endDateIso.length - 2);

                        screeningModeRequest.screeningMode.absoluteTimeConstraint = {
                            activated: screeningMode.absolute.active,
                            startDate: startDateIso,
                            endDate: endDateIso
                        };
                    } else if (screeningMode.timeConstraintType === 'recurring') {
                        var startTime = $filter('date')(screeningMode.recurring.startTime, 'HH:mm');
                        var endTime = $filter('date')(screeningMode.recurring.endTime, 'HH:mm');

                        var daysOfWeek = _.filter(screeningMode.recurring.daysOfWeek, function (dayVal) {
                            return dayVal !== 0;
                        });

                        var masks = [];
                        if (!_.isEmpty(screeningMode.recurring.masks)) {
                            if (screeningMode.recurring.masks.daysOfWeek)
                                masks.push("DayOfWeek");

                            if (screeningMode.recurring.masks.hoursOfDay) {
                                masks.push("HourOfDay");
                            } else {
                                startTime = '00:00';
                                endTime = '23:59';
                            }
                        }

                        screeningModeRequest.screeningMode.recurringTimeConstraint = {
                            activated: screeningMode.recurring.active,
                            startTime: startTime,
                            endTime: endTime,
                            daysOfWeek: daysOfWeek,
                            masks: masks,
                            timeExcluded: screeningMode.recurring.timeExcluded
                        };
                    }
                }

                $log.debug('Screening mode update request body: ', screeningModeRequest);

                var requestUri = CHANNEL_TYPE + '/' + scopeKey + '/screenings/' + msisdn + '/' + scopeKey + '/modes';
                var screeningModeUpdatePromise = ScreeningManagerRestangular.all(requestUri).post(screeningModeRequest);
                UtilService.addPromiseToTracker(screeningModeUpdatePromise);

                return screeningModeUpdatePromise;
            }
        };
    });
    ApplicationServices.factory('ScreeningManagerV3Service', function ($log, ScreeningManagerV3Restangular, Restangular, notification, $translate, UtilService) {
        return {
            lists: {
                // Welcome SMS
                WELCOME_SMS_SERVICE_KEY: 'WS',
                WELCOME_SMS_GLOBAL_IDENTIFIER_KEY: 'global',
                WELCOME_SMS_MCC_MNC_IDENTIFIER_KEY: 'mccmnc',
                BON_VOYAGE_SERVICE_KEY: 'BV',
                BON_VOYAGE_GLOBAL_IDENTIFIER_KEY: 'global',
                BON_VOYAGE_COUNTRY_CODE_IDENTIFIER_KEY: 'countrycode',
                BON_VOYAGE_OPERATOR_CODE_IDENTIFIER_KEY: 'operatorcode'
            },
            scopes: {
                // Main service scopes
                GLOBAL_SCOPE_KEY: 'global',
                // Welcome SMS
                WELCOME_SMS_BLACKLIST_SCOPE_KEY: 'blacklist'
            },
            errorCodes: {
                AUTHORIZATION_FAILED: 3001,
                API_NOT_SUPPORTED: 3011,
                STORAGE_ERROR: 3021,
                QUOTA_ERROR: 3031,
                WRONG_REQUEST_ERROR: 3041,
                SUBSCRIBER_NOT_FOUND: 3051,
                SCOPE_NOT_FOUND: 3061
            },
            // Subscriber black lists operations
            getGlobalBlackListExistence: function (serviceKey, identifier, scopeKey, msisdn) {
                var requestUri = '/screenings/' + serviceKey + '/' + identifier + '/' + scopeKey + '?existence=' + msisdn;

                var promise = ScreeningManagerV3Restangular.one(requestUri).get();

                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            addSubscriberToGlobalBlackList: function (serviceKey, identifier, scopeKey, screenableEntry) {
                var screeningRequest = {
                    "screeningRequest": {
                        "screenableEntry": [screenableEntry],
                        "requestCorrelator": new Date().getTime()
                    }
                };

                var requestUri = '/screenings/' + serviceKey + '/' + identifier + '/' + scopeKey;

                var promise = ScreeningManagerV3Restangular.all(requestUri).post(screeningRequest);

                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            removeSubscriberFromGlobalBlackList: function (serviceKey, identifier, scopeKey, msisdn) {
                var requestUri = '/screenings/' + serviceKey + '/' + identifier + '/' + scopeKey + '/' + msisdn;

                var promise = ScreeningManagerV3Restangular.one(requestUri).remove();

                UtilService.addPromiseToTracker(promise);

                return promise;
            }
        };
    });

    // SMSC Services
    var SmscOperationService = ['$log', 'SmscConfigRestangular', 'SmscOperationRestangular', 'SmscSenderApplicationRestangular', 'UtilService',
        function ($log, SmscConfigRestangular, SmscOperationRestangular, SmscSenderApplicationRestangular, UtilService) {
            return {
                resendMessage: function (message, promiseTracker) {
                    var promise = SmscSenderApplicationRestangular.all('').customPUT(message);
                    UtilService.addPromiseToTracker(promise, promiseTracker);

                    return promise;
                },
                deleteBySMSTicket: function (messageId, promiseTracker) {
                    var promise = SmscOperationRestangular.all('sfe/delete-by-sms-ticket?smsTicket=' + messageId).remove();
                    UtilService.addPromiseToTracker(promise, promiseTracker);

                    return promise;
                },
                sendNowBySMSTicket: function (messageId, promiseTracker) {
                    var promise = SmscOperationRestangular.all('sfe/send-now-by-sms-ticket?smsTicket=' + messageId).customPUT({});
                    UtilService.addPromiseToTracker(promise, promiseTracker);

                    return promise;
                }
            };
        }];
    var SmscProvService = ['$log', 'SmscProvRestangular', 'UtilService', function ($log, SmscProvRestangular, UtilService) {
        return {
            getAllSMPPApplications: function (promiseTracker) {
                var promise = SmscProvRestangular.all('applications/smpp').getList();
                UtilService.addPromiseToTracker(promise, promiseTracker);

                return promise;
            }
        };
    }];

    // SMSC Service Definitions
    ApplicationServices.factory('SmscOperationService', function ($injector) {
        return $injector.instantiate(SmscOperationService);
    });
    ApplicationServices.factory('SmscProvService', function ($injector) {
        return $injector.instantiate(SmscProvService);
    });

    // SMSC SFE Services
    ApplicationServices.factory('SfeReportingService', function ($log, SfeReportingRestangular, SfeRemoteReportingRestangular, UtilService) {
        var getEDRs = function (restangular, url) {
            var promise = restangular.one(url).get();
            UtilService.addPromiseToTracker(promise);

            return promise;
        };
        var deleteAllPendingMessages = function (restangular, url) {
            var promise = restangular.one(url).remove();
            UtilService.addPromiseToTracker(promise);

            return promise;
        };
        var findSmscTransientMessageParts = function (restangular, origAddress, destAddress, partRef) {
            var url = '?orig-address=' + origAddress;
            url += '&dest-address=' + destAddress;
            url += '&part-ref=' + partRef;

            var promise = restangular.one(url).get();
            UtilService.addPromiseToTracker(promise);

            return promise;
        };
        var getTransientCount = function (restangular, url) {
            var promise = restangular.one(url).get();
            UtilService.addPromiseToTracker(promise);

            return promise;
        };

        return {
            prepareUrl: function (filter, additionalFilter) {
                var msisdn = filter.msisdn;

                var url = '?date-from=' + filter.startDate.replace(/\+/g, '%2B');
                url += '&date-to=' + filter.endDate.replace(/\+/g, '%2B');

                url += filter.orderBy ? '&order-by=' + filter.orderBy : '';

                url += !_.isUndefined(filter.offset) ? '&paging-from=' + filter.offset : '';
                url += !_.isUndefined(filter.limit) ? '&page-count=' + filter.limit : '';

                url += additionalFilter.origAddress ? '&orig-address=' + additionalFilter.origAddress : '';
                url += additionalFilter.origAgentType ? '&orig-agent-type=' + additionalFilter.origAgentType : '';
                url += additionalFilter.origAgentId ? '&orig-agent-id=' + additionalFilter.origAgentId : '';

                url += additionalFilter.destAddress ? '&dest-address=' + additionalFilter.destAddress : '';
                url += additionalFilter.destAgentType ? '&dest-agent-type=' + additionalFilter.destAgentType : '';
                url += additionalFilter.destAgentId ? '&dest-agent-id=' + additionalFilter.destAgentId : '';

                url += filter.msisdn ? '&orig-or-dest-address=' + msisdn : '';

                url += filter.quickSearchText ? '&inner-search-address=' + filter.quickSearchText : '';

                url += additionalFilter.partRef ? '&part-ref=' + additionalFilter.partRef : '';

                return url;
            },
            // Main site
            getEDRs: function (filter, additionalFilter) {
                var url = this.prepareUrl(filter, additionalFilter);

                return getEDRs(SfeReportingRestangular, url);
            },
            deleteAllPendingMessages: function (filter, additionalFilter) {
                var url = this.prepareUrl(filter, additionalFilter);

                return deleteAllPendingMessages(SfeReportingRestangular, url);
            },
            findSmscTransientMessageParts: function (origAddress, destAddress, partRef) {
                return findSmscTransientMessageParts(SfeReportingRestangular, origAddress, destAddress, partRef);
            },
            getTransientCount: function (filter, additionalFilter) {
                filter.limit = 0;
                delete filter.offset;
                delete filter.orderBy;

                var url = this.prepareUrl(filter, additionalFilter);

                return getTransientCount(SfeReportingRestangular, url);
            },
            // Remote site
            getEDRsRemote: function (filter, additionalFilter) {
                var url = this.prepareUrl(filter, additionalFilter);

                return getEDRs(SfeRemoteReportingRestangular, url);
            },
            deleteAllPendingMessagesRemote: function (filter, additionalFilter) {
                var url = this.prepareUrl(filter, additionalFilter);

                return deleteAllPendingMessages(SfeRemoteReportingRestangular, url);
            },
            findSmscTransientMessagePartsRemote: function (origAddress, destAddress, partRef) {
                return findSmscTransientMessageParts(SfeRemoteReportingRestangular, origAddress, destAddress, partRef);
            },
            getTransientCountRemote: function (filter, additionalFilter) {
                filter.limit = 0;
                delete filter.offset;
                delete filter.orderBy;

                var url = this.prepareUrl(filter, additionalFilter);

                return getTransientCount(SfeRemoteReportingRestangular, url);
            }
        };
    });

    // MMSC Services
    ApplicationServices.factory('MmscTroubleshootingService', function ($log, MmscTroubleshootingRestangular, MmscRemoteTroubleshootingRestangular, UtilService) {
        return {
            getContentIdList: function (msgId) {
                var promise = MmscTroubleshootingRestangular.one(msgId).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            getContentById: function (msgId, contentId) {
                var promise = MmscTroubleshootingRestangular.one(msgId + '/' + contentId).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            retryMessage: function (msgId, recipientAddress) {
                var promise = MmscTroubleshootingRestangular.one(msgId + '?recipient=' + recipientAddress).post();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            cancelMessage: function (msgId, recipientAddress) {
                var promise = MmscTroubleshootingRestangular.all(msgId + '?recipient=' + recipientAddress).remove();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            // Remote
            getContentIdListRemote: function (msgId, promiseTracker) {
                var promise = MmscRemoteTroubleshootingRestangular.one(msgId).get();
                UtilService.addPromiseToTracker(promise, promiseTracker);
                return promise;
            },
            getContentByIdRemote: function (msgId, contentId, promiseTracker) {
                var promise = MmscRemoteTroubleshootingRestangular.one(msgId + '/' + contentId).get();
                UtilService.addPromiseToTracker(promise, promiseTracker);
                return promise;
            },
            retryMessageRemote: function (msgId, recipientAddress, promiseTracker) {
                var promise = MmscRemoteTroubleshootingRestangular.one(msgId + '?recipient=' + recipientAddress).post();
                UtilService.addPromiseToTracker(promise, promiseTracker);
                return promise;
            },
            cancelMessageRemote: function (msgId, recipientAddress, promiseTracker) {
                var promise = MmscRemoteTroubleshootingRestangular.all(msgId + '?recipient=' + recipientAddress).remove();
                UtilService.addPromiseToTracker(promise, promiseTracker);
                return promise;
            }
        };
    });

    // Personalized SMS (SMS Plus)
    ApplicationServices.factory('PersonalizedSMSSelfCareService', function ($log, PersonalizedSMSSelfCareRestangular, UtilService) {
        return {
            SERVICES: {
                ARCHIVE: 'archive-service',
                AUTO_REPLY: 'autoreply-service',
                BLOCK_APPLICATION: 'applicationblocking-service',
                BLOCK_MOBILE: 'screening-service',
                BLOCK_PREMIUM: 'premiumblocking-service',
                COPY: 'copy-service',
                FORWARD: 'forwarding-service',
                LAST_RESORT: 'lastresort-service',
                AUTO_SIGNATURE: 'autosignature-service',
                AD_INSERTION: 'adinsertion-service'
            },
            DIRECTIONS: {
                SENDER: 'sender',
                RECEIVER: 'receiver'
            },
            // Preferences
            getServiceSubscriberPreferences: function (serviceName, msisdn) {
                var promise = PersonalizedSMSSelfCareRestangular.one(serviceName + '/' + msisdn).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            updateServiceStatus: function (serviceName, msisdn, subscriberPreferences) {
                var serviceStatusBoolean = (subscriberPreferences.status === 'ENABLED');

                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/status/' + msisdn + '/' + serviceStatusBoolean).customPUT();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            updateServiceSubscriberPreferences: function (serviceName, msisdn, subscriberPreferences) {
                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/' + msisdn).customPUT(subscriberPreferences);
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            subscribeServiceSubscription: function (serviceName, subscriberPreferences) {
                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/subscription').post(subscriberPreferences);
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            unsubscribeServiceSubscription: function (serviceName, msisdn) {
                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/subscription/' + msisdn).remove();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            getScreeningEntries: function (serviceName, msisdn, direction) {
                var promise = PersonalizedSMSSelfCareRestangular.one(serviceName + '/list/' + msisdn + '/' + direction).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            addScreeningEntry: function (serviceName, msisdn, direction, listType, entryId) {
                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/list/' + msisdn + '/' + direction + '/' + listType + '/' + entryId).post();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            removeScreeningEntry: function (serviceName, msisdn, direction, listType, entryId) {
                var promise = PersonalizedSMSSelfCareRestangular.all(serviceName + '/list/' + msisdn + '/' + direction + '/' + listType + '/' + entryId).remove();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            // Screening lists
            getServiceSubscriberScreeningLists: function (serviceName, msisdn, direction) {
                if (serviceName === this.SERVICES.BLOCK_APPLICATION || serviceName === this.SERVICES.BLOCK_MOBILE) {
                    serviceName = serviceName + '/list';
                }

                var url = serviceName + '/' + msisdn + (direction ? '/' + direction : '');

                var promise = PersonalizedSMSSelfCareRestangular.one(url).get();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            addServiceSubscriberScreenableIdToList: function (serviceName, msisdn, listKey, screenableId, direction) {
                var url = serviceName + '/list/' + msisdn + (direction ? '/' + direction : '') + '/' + listKey + '/' + encodeURIComponent(screenableId);

                var promise = PersonalizedSMSSelfCareRestangular.all(url).post();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            deleteServiceSubscriberScreenableIdFromList: function (serviceName, msisdn, listKey, screenableId, direction) {
                var url = serviceName + '/list/' + msisdn + (direction ? '/' + direction : '') + '/' + listKey + '/' + encodeURIComponent(screenableId);

                var promise = PersonalizedSMSSelfCareRestangular.one(url).remove();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            saveListType: function (serviceName, msisdn, listType) {
                var url = serviceName + '/list/' + msisdn + '/list_type/' + listType;

                var promise = PersonalizedSMSSelfCareRestangular.all(url).customPUT();
                UtilService.addPromiseToTracker(promise);

                return promise;
            },
            saveSelectedScreeningModeType: function (serviceName, msisdn, direction, screeningModeType) {
                var url = serviceName + '/list/' + msisdn + '/' + direction + '/' + screeningModeType;

                var promise = PersonalizedSMSSelfCareRestangular.all(url).customPUT();
                UtilService.addPromiseToTracker(promise);

                return promise;
            }
        };
    });

    // General Elastic Search Services
    ApplicationServices.factory('GeneralESService', function ($log, $filter, DateTimeConstants, UtilService, SessionService, RESOURCE_NAME, ESClient, ESClientRemote, SmscESClient, SmscESClientRemote, SmscESAdapterClient, SmscESAdapterClientRemote,
                                                              SMSAntiSpamESClient, SMSAntiSpamESClientRemote, SMSAntiSpamESAdapterClient, SMSAntiSpamESAdapterClientRemote) {

        var findHistoryRecords = function (esClient, index, type, filter, payload) {
            // The range filters for using navigation
            var offset = filter.offset,
                limit = filter.limit;

            var url = '/' + index;
            if (type) {
                // Remove the type parameter because the new version of ES does not need it.
                url = url + '/' + type;
            }
            url = url + '/_search?from=' + offset + '&size=' + limit;

            var esQueryPromise = esClient.all(url).post(payload);

            UtilService.addPromiseToTracker(esQueryPromise);

            return esQueryPromise;
        };

        var getCount = function (esClient, index, type, payload) {
            var url = '/' + index;
            if (type) {
                // Remove the type parameter because the new version of ES does not need it.
                url = url + '/' + type;
            }
            url = url + '/_count';

            var esQueryPromise = esClient.all(url).post(payload);

            UtilService.addPromiseToTracker(esQueryPromise);

            return esQueryPromise;
        };

        return {
            prepareMainEdrQueryPayload: function (filter, msisdnFields, timestampFieldName, additionalFilterFields, termFilterJSON) {
                var msisdn = filter.msisdn,
                    startDate = filter.startDate,
                    endDate = filter.endDate,
                    queryString = filter.queryString,
                    quickSearchColumns = filter.quickSearchColumns,
                    sortFieldName = filter.sortFieldName,
                    sortOrder = filter.sortOrder;

                var mustFilterJSON = [];
                var shouldFilterJSON = [];

                // Msisdn field matchers
                _.each(msisdnFields, function (msisdnFieldName) {
                    shouldFilterJSON.push(JSON.parse('{ "regexp" : { "' + msisdnFieldName + '" : ".*' + msisdn + '" } }'));
                });

                // Clean the query string text
                queryString = s.clean(queryString);
                queryString = UtilService.escapeRegExp(queryString);

                // Prepare the payload now.
                var payload = {
                    "query": {
                        "bool": {
                            "must": [],
                            "must_not": [],
                            "should": [],
                        }
                    },
                    "sort": []
                };

                if (!_.isEmpty(queryString)) {
                    var quickSearchShouldFilterJSON = [];
                    _.each(quickSearchColumns, function (columnName) {
                        var pJson = {};
                        try {
                            pJson = JSON.parse('{ "regexp" : { "' + columnName + '" : ".*' + queryString + '.*" } }');
                        } catch (e) {
                            console.log(e.message);
                        }
                        quickSearchShouldFilterJSON.push(pJson);
                    });

                    payload.query.bool.must.push({
                        "bool": {
                            "minimum_should_match": 1,
                            "should": quickSearchShouldFilterJSON
                        }
                    });
                }

                // Prepares queries for additional filter fields.
                if (additionalFilterFields) {
                    _.each(additionalFilterFields, function (columnValue, columnName) {
                        // It should be considered that a field contains multiple should query if additional the field is an object.
                        if (_.isObject(columnValue)) {
                            if (_.isArray(columnValue)) {
                                var termsArrayQuery = JSON.parse('{ "terms": { "' + columnName + '": [' + columnValue.join(', ') + '] } }');

                                payload.query.bool.must.push(termsArrayQuery);
                            } else {
                                _.each(columnValue, function (subColumnValue, subColumnName) {
                                    var query;
                                    if (!_.isUndefined(subColumnValue) && !s.isBlank(subColumnValue)) {
                                        // Consider that the star character in value of fields.
                                        if (s.include(subColumnValue, "*")) {
                                            query = JSON.parse('{ "regexp": { "' + subColumnName + '": "' + subColumnValue.replace(/\*/g, '.*') + '" } }');
                                        } else {
                                            query = JSON.parse('{ "term": { "' + subColumnName + '": "' + subColumnValue + '"} }');
                                        }

                                        payload.query.bool.must.push(query);
                                    }
                                });
                            }
                        } else {
                            if (!_.isUndefined(columnValue) && !s.isBlank(columnValue)) {
                                var query;
                                // Prepare simple prefix or query_string query if only simple fields have sent in the additionalfields parameter.
                                // Consider that the star character in value of fields.
                                if (s.include(columnValue, "*")) {
                                    query = JSON.parse('{ "regexp": { "' + columnName + '": "' + columnValue.replace(/\*/g, '.*') + '" } }');
                                } else {
                                    query = JSON.parse('{ "term": { "' + columnName + '": "' + columnValue + '"} }');
                                }

                                payload.query.bool.must.push(query);
                            }
                        }
                    });
                }

                if (sortFieldName && sortOrder) {
                    // Parsing sort JSON object
                    var sortJSON = JSON.parse('[ { "' + sortFieldName + '": { "order": ' + sortOrder + ' } } ]');
                    payload.sort = sortJSON;
                }

                // Push the date parameters into the filter.
                if (startDate && endDate) {
                    // Date range field matcher
                    var dateRangeJSON = JSON.parse('{ "range": { "' + timestampFieldName + '": { "gt": "' + startDate + '", "lt": "' + endDate + '" } } }');
                    payload.query.bool.must.push(dateRangeJSON);
                }

                // Main filter query puts in the main payload.
                payload.query.bool.must = payload.query.bool.must.concat(mustFilterJSON);
                payload.query.bool.should = shouldFilterJSON;
                // If there is at least one clause in the should, then add minimum_should_match parameter to the bool.
                if (payload.query.bool.should.length > 0) {
                    payload.query.bool.minimum_should_match = 1;
                }

                // Add passed term filters into into the bool directly since supposing the term json contains any filter (e.g. must or must_not).
                if (termFilterJSON) {
                    _.each(termFilterJSON.must, function (mustItem) {
                        payload.query.bool.must.push(mustItem);
                    });

                    _.each(termFilterJSON.must_not, function (mustNotItem) {
                        payload.query.bool.must_not.push(mustNotItem);
                    });

                    _.each(termFilterJSON.should, function (shouldItem) {
                        payload.query.bool.should.push(shouldItem);
                    });
                }

                return payload;
            },
            // Service and product methods.
            // Subscription Manager
            findSSMHistory: function (filter, additionalFilterFields) {
                var index = 'ssm', type = null;

                // Filter these events: SUBSCRIBE_TO_OFFER_SUCCESS(2), SUBSCRIBE_TO_OFFER_FAIL(3), UNSUBSCRIBE_FROM_OFFER_SUCCESS(5), UNSUBSCRIBE_FROM_OFFER_FAIL(6)
                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "event": [2, 3, 5, 6]
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['msisdn'], 'timestamp', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            },
            findSSMDetailedHistory: function (transactionId, eventType) {
                var index = 'ssm', type = null;
                eventType = Number(eventType); // Convert event type to number.

                // Make a decision for event types according to the main event type.
                //
                // For SUBSCRIBE_TO_OFFER_SUCCESS(2)
                // Query: CHARGING_SUCCESS(8), CHARGING_FAIL(9), RENEW_SUBSCRIPTION_SUCCESS(32), RENEW_SUBSCRIPTION_FAIL(33), PROCESS_CONFIRMATION_SUCCESS(41),
                // PROCESS_CONFIRMATION_FAIL(42), SETTING_HLR_FLAG_SUCCESS(54), SETTING_HLR_FLAG_FAILED(55), SUBSCRIBE_TO_OFFER_AFTER_TRIAL_PERIOD_SUCCESS(57),
                // SUBSCRIBE_TO_OFFER_AFTER_TRIAL_PERIOD_FAIL(58), TERMINATE_TRIAL_SUBSCRIPTION_SUCCESS(60), TERMINATE_TRIAL_SUBSCRIPTION_FAIL(61),
                // OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_GRACE(70), OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_SUSPEND(71), OFFER_SUBSCRIPTION_STATE_CHANGE_ACTIVE_TO_INACTIVE(72),
                // OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_SUSPEND(73), OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_ACTIVE(74), OFFER_SUBSCRIPTION_STATE_CHANGE_GRACE_TO_INACTIVE(75),
                // OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_ACTIVE(76), OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_INACTIVE(77), OFFER_SUBSCRIPTION_STATE_CHANGE_SUSPEND_TO_GRACE(78),
                // OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_ACTIVE(79), OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_SUSPEND(80), OFFER_SUBSCRIPTION_STATE_CHANGE_INACTIVE_TO_GRACE(81),
                // CLEAR_HLR_FLAG_SUCCESS(94), CLEAR_HLR_FLAG_FAIL(95)
                //
                // For SUBSCRIBE_TO_OFFER_FAIL(3)
                // Query: CHARGING_FAIL(9), SETTING_HLR_FLAG_FAILED(55)
                //
                // For UNSUBSCRIBE_FROM_OFFER_SUCCESS(5)
                // Query: CLEAR_HLR_FLAG_SUCCESS(94), CLEAR_HLR_FLAG_FAIL(95)
                //
                // For UNSUBSCRIBE_FROM_OFFER_FAIL(6)
                // Query: CLEAR_HLR_FLAG_FAIL(95)
                var eventTypeTerms = {
                    "terms": {
                        "event": []
                    }
                };
                if (eventType === 2) {
                    eventTypeTerms.terms.event = [2, 8, 9, 32, 33, 41, 42, 54, 55, 57, 58, 60, 61, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 94, 95];
                } else if (eventType === 3) {
                    eventTypeTerms.terms.event = [3, 9, 55];
                } else if (eventType === 5) {
                    eventTypeTerms.terms.event = [5, 94, 95];
                } else if (eventType === 6) {
                    eventTypeTerms.terms.event = [6, 95];
                }

                var filter = {offset: 0, limit: 1000};
                var payload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "transactionId": transactionId
                                    }
                                },
                                eventTypeTerms
                            ]
                        }
                    }
                };

                return findHistoryRecords(ESClient, index, type, filter, payload);
            },
            // SMSC
            findSmscPermanentEdrs: function (filter, additionalFilterFields) {
                var index = 'elastic-search-adapter/main_edr', type = '';

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origAddress', 'destAddress'], 'date', additionalFilterFields);

                return findHistoryRecords(SmscESAdapterClient, index, type, filter, bodyPayload);
            },
            findSmscHistoryEdrs: function (cdrKey) {
                var index = 'smsc-history', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "cdrKey": cdrKey
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SmscESClient, index, type, filter, bodyPayload);
            },
            findSmscPermanentMessageParts: function (origAddress, destAddress, partRef, scTimestamp) {
                var index = 'smsc-main', type = null;

                var beginDate = moment(scTimestamp).subtract(2, 'hours').utcOffset(DateTimeConstants.OFFSET).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
                var endDate = moment(scTimestamp).add(2, 'hours').utcOffset(DateTimeConstants.OFFSET).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "origAddress": origAddress
                                    }
                                },
                                {
                                    "term": {
                                        "destAddress": destAddress
                                    }
                                },
                                {
                                    "term": {
                                        "partRef": partRef
                                    }
                                },
                                {
                                    "range": {
                                        "scTimestamp": {
                                            "gt": beginDate,
                                            "lt": endDate
                                        }
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SmscESClient, index, type, filter, bodyPayload);
            },
            getSmscPermanentCountByFilter: function (filter, additionalFilterFields) {
                var index = 'smsc-main', type = null;

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origAddress', 'destAddress'], 'date', additionalFilterFields);

                // sort clause is deleting from the query that it is unnecessary for count queries.
                delete bodyPayload.sort;

                return getCount(SmscESClient, index, type, bodyPayload);
            },
            getSmscPermanentDeliveredCount: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "term": {
                                "result": 0
                            }
                        }
                    ]
                };

                return this.getSmscPermanentCountByFilter(filter, additionalFilterFields, termFilterJSON);
            },
            getSmscPermanentCount: function (filter, additionalFilterFields) {
                return this.getSmscPermanentCountByFilter(filter, additionalFilterFields);
            },
            // SMSC Remote
            findSmscPermanentEdrsRemote: function (filter, additionalFilterFields) {
                var index = 'elastic-search-adapter', type = 'main_edr';

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origAddress', 'destAddress'], 'date', additionalFilterFields);

                return findHistoryRecords(SmscESAdapterClientRemote, index, type, filter, bodyPayload);
            },
            findSmscHistoryEdrsRemote: function (cdrKey) {

                var index = 'smsc-history', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "cdrKey": cdrKey
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SmscESClientRemote, index, type, filter, bodyPayload);
            },
            findSmscPermanentMessagePartsRemote: function (origAddress, destAddress, partRef, scTimestamp) {
                var index = 'smsc-main', type = null;

                var beginDate = moment(scTimestamp).subtract(2, 'hours').utcOffset(DateTimeConstants.OFFSET).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
                var endDate = moment(scTimestamp).add(2, 'hours').utcOffset(DateTimeConstants.OFFSET).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')


                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "origAddress": origAddress
                                    }
                                },
                                {
                                    "term": {
                                        "destAddress": destAddress
                                    }
                                },
                                {
                                    "term": {
                                        "partRef": partRef
                                    }
                                },
                                {
                                    "range": {
                                        "scTimestamp": {
                                            "gt": beginDate,
                                            "lt": endDate
                                        }
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SmscESClientRemote, index, type, filter, bodyPayload);
            },
            getSmscPermanentCountByFilterRemote: function (filter, additionalFilterFields) {

                var index = 'smsc-main', type = null;

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origAddress', 'destAddress'], 'date', additionalFilterFields);

                // sort clause is deleting from the query that it is unnecessary for count queries.
                delete bodyPayload.sort;

                return getCount(SmscESClientRemote, index, type, bodyPayload);
            },
            getSmscPermanentDeliveredCountRemote: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "term": {
                                "result": 0
                            }
                        }
                    ]
                };

                return this.getSmscPermanentCountByFilterRemote(filter, additionalFilterFields, termFilterJSON);
            },
            getSmscPermanentCountRemote: function (filter, additionalFilterFields) {
                return this.getSmscPermanentCountByFilterRemote(filter, additionalFilterFields);
            },
            // SMS AntiSpam
            findSMSAntiSpamEdrs: function (filter, additionalFilterFields) {
                var index = 'elastic-search-adapter/sms-as', type = '';

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origMsisdn', 'destMsisdn'], 'date', additionalFilterFields);

                return findHistoryRecords(SMSAntiSpamESAdapterClient, index, type, filter, bodyPayload);
            },
            findSMSAntiSpamMainEdrs: function (filter, additionalFilterFields) {
                // CDR types filter to differenciate records as main or historical.
                // Main CDR key criteria put into the term filter json.
                // Check the SMS_ANTISPAM_EDR_TYPE constant array for all CDR Types.
                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "cdrType": [
                                    101, 102,
                                    121, 122,
                                    131, 132, 133,
                                    151, 152,
                                    201
                                ]
                            }
                        }
                    ]
                };

                if (additionalFilterFields.opContentFilter && !_.isEmpty(additionalFilterFields.opContentFilter)) {
                    termFilterJSON.must[0].terms.cdrType = [162];
                }

                return this.findSMSAntiSpamEdrs(filter, additionalFilterFields);
            },
            findSMSAntiSpamHistoricalEdrs: function (cdrKey) {
                var index = 'sms-as', type = null;

                var filter = {offset: 0, limit: 1000};
                var payload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "cdrKey": cdrKey
                                    }
                                }
                            ]
                        }
                    },
                    "sort": [{"date": {"order": "desc"}}]
                };

                return findHistoryRecords(SMSAntiSpamESClient, index, type, filter, payload);
            },
            findSMSAntiSpamMessageParts: function (origMsisdn, destMsisdn, opPartRef) {
                var index = 'sms-as', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "origMsisdn": origMsisdn
                                    }
                                },
                                {
                                    "term": {
                                        "destMsisdn": destMsisdn
                                    }
                                },
                                {
                                    "term": {
                                        "opPartRef": opPartRef
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SMSAntiSpamESClient, index, type, filter, bodyPayload);
            },
            // SMS AntiSpam Remote
            findSMSAntiSpamEdrsRemote: function (filter, additionalFilterFields) {
                var index = 'elastic-search-adapter', type = 'sms-as';

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['origMsisdn', 'destMsisdn'], 'date', additionalFilterFields);

                return findHistoryRecords(SMSAntiSpamESAdapterClientRemote, index, type, filter, bodyPayload);
            },
            findSMSAntiSpamMainEdrsRemote: function (filter, additionalFilterFields) {
                // CDR types filter to differenciate records as main or historical.
                // Main CDR key criteria put into the term filter json.
                // Check the SMS_ANTISPAM_EDR_TYPE constant array for all CDR Types.
                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "cdrType": [
                                    101, 102,
                                    121, 122,
                                    131, 132, 133,
                                    151, 152,
                                    201
                                ]
                            }
                        }
                    ]
                };


                if (additionalFilterFields.opContentFilter && !_.isEmpty(additionalFilterFields.opContentFilter)) {

                    termFilterJSON.must[0].terms.cdrType = [162];

                }

                return this.findSMSAntiSpamEdrsRemote(filter, additionalFilterFields);
            },
            findSMSAntiSpamHistoricalEdrsRemote: function (cdrKey) {
                var index = 'sms-as', type = null;

                var filter = {offset: 0, limit: 1000};
                var payload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "cdrKey": cdrKey
                                    }
                                }
                            ]
                        }
                    },
                    "sort": [{"date": {"order": "desc"}}]
                };

                return findHistoryRecords(SMSAntiSpamESClientRemote, index, type, filter, payload);
            },
            findSMSAntiSpamMessagePartsRemote: function (origMsisdn, destMsisdn, opPartRef) {
                var index = 'sms-as', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "origMsisdn": origMsisdn
                                    }
                                },
                                {
                                    "term": {
                                        "destMsisdn": destMsisdn
                                    }
                                },
                                {
                                    "term": {
                                        "opPartRef": opPartRef
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(SMSAntiSpamESClientRemote, index, type, filter, bodyPayload);
            },
            // MMSC
            findMmscPermanentEdrs: function (filter, additionalFilterFields) {
                var index = 'mmsc-main', type = null;

                var termFilterJSON = {
                    "must_not": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            },
            findMmscTransientEdrs: function (filter, additionalFilterFields) {
                var index = 'mmsc-main', type = null;

                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            },
            findMmscHistoryEdrs: function (messageId, destAddress) {
                var index = 'mmsc-history', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "messageID": messageId
                                    }
                                },
                                {
                                    "term": {
                                        "recipient.address": destAddress
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            },
            getMmscRecordCountByFilter: function (filter, additionalFilterFields, termFilterJSON) {
                var index = 'mmsc-main', type = null;

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                // sort clause is deleting from the query that it is unnecessary for count queries.
                delete bodyPayload.sort;

                return getCount(ESClient, index, type, bodyPayload);
            },
            getMmscDeliveredCount: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "term": {
                                "finalStatus": 1
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilter(filter, additionalFilterFields, termFilterJSON);
            },
            getMmscPermanentCount: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must_not": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilter(filter, additionalFilterFields, termFilterJSON);
            },
            getMmscTransientCount: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilter(filter, additionalFilterFields, termFilterJSON);
            },
            // MMSC Remote
            findMmscPermanentEdrsRemote: function (filter, additionalFilterFields) {
                var index = 'mmsc-main', type = null;

                var termFilterJSON = {
                    "must_not": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClientRemote, index, type, filter, bodyPayload);
            },
            findMmscTransientEdrsRemote: function (filter, additionalFilterFields) {
                var index = 'mmsc-main', type = null;

                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClientRemote, index, type, filter, bodyPayload);
            },
            findMmscHistoryEdrsRemote: function (messageId, destAddress) {
                var index = 'mmsc-history', type = null;

                var bodyPayload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "messageID": messageId
                                    }
                                },
                                {
                                    "term": {
                                        "recipient.address": destAddress
                                    }
                                }
                            ]
                        }
                    }
                };

                var filter = {offset: 0, limit: 1000};

                return findHistoryRecords(ESClientRemote, index, type, filter, bodyPayload);
            },
            getMmscRecordCountByFilterRemote: function (filter, additionalFilterFields, termFilterJSON) {
                var index = 'mmsc-main', type = null;

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['sender.address', 'recipient.address'], 'eventTime', additionalFilterFields, termFilterJSON);

                // sort clause is deleting from the query that it is unnecessary for count queries.
                delete bodyPayload.sort;

                return getCount(ESClientRemote, index, type, bodyPayload);
            },
            getMmscDeliveredCountRemote: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "term": {
                                "finalStatus": 1
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilterRemote(filter, additionalFilterFields, termFilterJSON);
            },
            getMmscPermanentCountRemote: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must_not": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilterRemote(filter, additionalFilterFields, termFilterJSON);
            },
            getMmscTransientCountRemote: function (filter, additionalFilterFields) {
                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "finalStatus": [0, 7]
                            }
                        }
                    ]
                };

                return this.getMmscRecordCountByFilterRemote(filter, additionalFilterFields, termFilterJSON);
            },
            // Personalized SMS - SMS Plus Service
            findPersonalizedSMSHistory: function (filter, additionalFilterFields) {
                var index = 'smartsms', type = null;

                var termFilterJSON = {
                    "must": [
                        {
                            "terms": {
                                "executionStatusCode": [102, 103] // 102 -> SUCCESS, 103 -> BLOCKED events
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, ['originalSender', 'originalReceiver'], 'date', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            },
            findPersonalizedSMSDetailedHistory: function (correlatorId) {
                // var index = 'smartsms-read', type = 'history';
                var index = 'smartsms', type = null;

                var filter = {offset: 0, limit: 1000};
                var payload = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "correlatorId": correlatorId
                                    }
                                }
                            ]
                        }
                    }
                };

                return findHistoryRecords(ESClient, index, type, filter, payload);
            },
            // Screening Manager
            findScreeningManagerHistory: function (filter, additionalFilterFields) {
                // var index = 'screeningmanager-read', type = 'rest';
                var index = 'screeningmanager', type = null;

                var termFilterJSON = {
                    "should": [
                        {
                            "term": {
                                "otherSubscriberId": filter.msisdn
                            }
                        }
                    ]
                };

                var bodyPayload = this.prepareMainEdrQueryPayload(filter, [], 'timestamp', additionalFilterFields, termFilterJSON);

                return findHistoryRecords(ESClient, index, type, filter, bodyPayload);
            }
        };
    });

})();
