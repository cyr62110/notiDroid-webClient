'use strict';

angular.module('admin', ['lumx','ngRoute'])
.config(function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            controllerAs: 'logInCtrl'
        })
        .when('/', {
            templateUrl: 'views/dashboard.html',
            controller: 'DashboardController',
            resolve : {
                auth : ['$q', '$location', 'AuthenticationService', function($q, $location, auth) {
                    return auth.isAuthenticated().then(
                        function(succes) {},
                        function(error) {
                            $location.path('/login');
                            $location.replace();
                            return $q.reject(error);
                        }
                    );
                }]
            }
        })
        .otherwise({
            redirectTo: '/'
        });
})
.config(function($httpProvider) {
    $httpProvider.defaults.headers.post = { 'Content-Type' : 'application/json' }
});
