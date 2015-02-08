'use strict';

angular.module('admin')
.controller('LoginController', ['AuthenticationService', function (authSrv) {
    var self = this;
    
    self.logIn = function() {
        authSrv.logIn().then(
            function(token) {
                console.log(token);
            },
            function (error) {
                console.log(error);
            }
        );
    };
}]);
