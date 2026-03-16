(function () {

    'use strict';

    angular.module('ccportal.products', [
        'ccportal.products.smsc',
        'ccportal.products.antispamsms',
        'ccportal.products.mmsc'
    ]);

    var ProductsModule = angular.module('ccportal.products');

    ProductsModule.config(function ($stateProvider) {

        $stateProvider.state('products', {
            url: "/products",
            templateUrl: 'products/products.html'
        });

    });

})();
