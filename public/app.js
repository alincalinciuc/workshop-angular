(function() {
    'use strict';

    angular
        .module('mainApp', [
            'ngResource',
            'ui.router',
            'agGrid',
            'permission',
        ]);

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('dashboard', {
                url: "/",
                templateUrl: "views/dashboard.html",
                controller: 'MainCtrl'
            })
            .state('login', {
                url: "/login",
                templateUrl: "views/login.html",
                controller: 'UsersCtrl',
            })
            .state('admin', {
                url: "/admin",
                templateUrl: "views/admin.html",
                controller: 'AdminCtrl',
                data: {
                    permissions: {
                        only: ['admin']
                    }
                }
            })
    }

    config
        .$inject = ['$stateProvider', '$urlRouterProvider'];

    function run(Permission, $q, UsersFactory) {

        Permission
            .defineRole('users', function() {

                var user = new UsersFactory();
                var deferred = $q.defer();

                user
                    .isAuthenticated()
                    .then(function(data) {

                        if (data.isAuthenticated === true) {

                            deferred.resolve();

                        } else {

                            deferred.reject();
                        }
                    });

                return deferred.promise;
            })
    }

    run
        .$inject = ['Permission', '$q', 'UsersFactory'];

    angular
        .module('mainApp')
        .config(config)
        .run(run);

}());