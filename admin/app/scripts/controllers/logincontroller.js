'use strict';

angular.module('admin')
.controller('LoginController', ['AuthenticationService', function (authSrv) {
    var self = this;

    self.logIn = function() {
        authSrv.setCredentials(self.credentials);
        authSrv.logIn().then(
            function(token) {
                console.log("Authenticated");
                console.log(token);
            },
            function (error) {
                console.log(error);
            }
        );
    };
}]);
