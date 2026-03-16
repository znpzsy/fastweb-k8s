(function () {

    'use strict';

    angular.module('ccportal.services', [
        'ccportal.services.personalizedsms'
    ]);

    var ServicesModule = angular.module('ccportal.services');

    ServicesModule.config(function ($stateProvider) {

        $stateProvider.state('services', {
            url: "/services",
            templateUrl: 'services/services.html'
        });

    });

})();
