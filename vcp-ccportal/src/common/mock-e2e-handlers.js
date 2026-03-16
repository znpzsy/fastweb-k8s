(function() {

   'use strict';

   /* Mock end to end request handlers */
   angular.module('Application.ccportal-mock-e2e', [
      'ngMockE2E'
   ]);

   var ApplicationMockE2E = angular.module('Application.ccportal-mock-e2e');

   ApplicationMockE2E.run(function($httpBackend) {
//      $httpBackend.whenGET(/^\/cmpf-rest/).respond(function(method, url, data) {
//         return [200, {"metaData": {"limit": 10, "offset": 0, "totalCount": 3}, "subscribers": [{"id": 1202, "organizationId": 1, "state": "ACTIVE"}, {"id": 1203, "organizationId": 1, "state": "ACTIVE"}, {"id": 1204, "organizationId": 1, "state": "ACTIVE"}]}, {}];
//      });

      $httpBackend.whenGET(/^\/ccportal/).passThrough();
      $httpBackend.whenGET(/^\/cmpf-rest/).passThrough();

      $httpBackend.whenGET(/^\/screening-manager-rest/).respond(function(method, url, data) {
         return [200, {
               "screeningScope": {
                  "screeningScopeId": "voicemail",
                  "selectedScreeningModeType": "RejectBlacklist", "screeningModes": {
                     "entry": [
                        {
                           "key": "RejectAll",
                           "value": {
                              "screeningModeType": "RejectAll"
                           }
                        },
                        {
                           "key": "AcceptAll",
                           "value": {
                              "screeningModeType": "AcceptAll"
                           }
                        },
                        {
                           "key": "AcceptWhitelist",
                           "value": {
                              "screeningModeType": "RejectBlacklist"
                           }
                        },
                        {
                           "key": "RejectBlacklist",
                           "value": {
                              "screeningModeType": "AcceptWhitelist"
                           }
                        }
                     ]
                  },
                  "whiteList": [
                     {
                        "screenableEntryId": "905334683867",
                        "screenableCorrelator": "Close friend"
                     },
                     {
                        "screenableEntryId": "905334683868",
                        "screenableCorrelator": "Close friend"
                     },
                     {
                        "screenableEntryId": "905334683869",
                        "screenableCorrelator": "Close friend"
                     }
                  ],
                  "blackList": [
                  ],
                  "blackListNotificationActivated": true,
                  "whiteListNotificationActivated": false
               }
            }, {}];
      });
   });

   ApplicationMockE2E.config(function($provide) {

      // Backend dummy delay.
      $provide.decorator('$httpBackend', function($delegate) {
         var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
               var _this = this;
               var _arguments = arguments;

               if (url === '/ccportal/i18n/en.json') {
                  callback.apply(_this, _arguments);
               } else {
                  setTimeout(function() {
                     callback.apply(_this, _arguments);
                  }, 200);
               }
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
         };

         for (var key in $delegate) {
            proxy[key] = $delegate[key];
         }

         return proxy;
      });
   });


})();
