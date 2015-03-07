'use strict';

angular.module('admin')
.service('AuthenticationService', 
    ["$q", "$http", "$log", "ConfigurationService", 
    function AuthenticationService($q, $http, $log, configSrv) {
        var self = this;
        self.credentials = {
            username: null,
            password: null
        }
        self.tokens = {
            accessToken: null,
            accessTokenExpirationDate: 0,
            refreshToken: null,
            refreshTokenExpirationTimestamp: 0,
            scopes : []
        };
        var cache = {
            accessToken: function() {
                if(!this.isCachedAccessTokenExpired()) {
                    var defered = $q.defer();
                    defered.resolve(self.tokens.accessToken);
                    return defered.promise;
                } else {
                    return online.refreshTokensUsingCredentials();
                }
            },
            isCachedAccessTokenExpired: function() {
                if(self.tokens.accessToken == null)
                    return true;
                else
                    return false; //TODO
            },
            refreshToken: function() {
                var defered = $q.defer();
                if(!this.isCachedRefreshTokenExpired())
                    defered.resolve(self.tokens.refreshToken);
                else
                    defered.reject();
                return defered.promise;
            },
            isCachedRefreshTokenExpired: function() {
                return true; //TODO add support for refresh token server-side.
            }
        }
        //All methods communication with the server to refresh the tokens returns a promise.
        //All promises uses the access token as result.
        var online = {
            refreshTokensUsingCredentials: function() {
                return configSrv.getConfig().then(function(config) {
                    var request = {
                        method: 'GET',
                        url: config.apiServerUrl + '/oauth/token?grant_type=client_credentials',
                        withCredentials: true,
                        headers: {
                            'Authorization' : 'Basic YUBhLmFhYTph'
                        }
                    }
                    return $http(request).then(function(result) {
                        var defered = $q.defer();
                        $log.log(result.data);
                        $q.resolve(result.data);
                        return defered.promise;
                    });
                });
            },
            refreshAccessToken: function() {
                //TODO : add support for refresh token server-side
            }
        }
        return {
            //Reminder : param { username: "", password: "" }
            setCredentials: function(credentials) {
                self.credentials.username = credentials.username;
                self.credentials.password = credentials.password;
            },
            isAuthenticated: function() {
                return cache.accessToken().then(
                    function(success) {},
                    function(reason) {
                        return cache.refreshToken().then(
                            function(refreshToken) {
                                return online.refreshAccessToken();
                            },
                            function() {
                                return $q.reject("Unauthorized");
                            }
                        );
                    }
                );
            },
            logIn: function() {
                var defered = $q.defer();
                if(self.credentials.username == null || self.credentials.password == null) {
                    defered.resolve({
                        isAuthenticated: false,
                        error: "You must call setCredentials() before logIn()"
                    })
                } else {
                    online.refreshTokensUsingCredentials().then(
                        function(token) {
                            defered.resolve({
                                isAuthenticated: true, //TODO : Check if the user has enough right to access the admin console
                            });
                        },
                        function(error) {
                            if(error.status == 404 || error.status >= 500) {
                                console.log(error);
                                return $q.reject(error)
                            } else {
                                defered.resolve({
                                    isAuthenticated: false,
                                    error: error,
                                });
                            }
                        }
                    );
                }
                return defered.promise;
            },
            accessToken: function() {
                
            }

        }
    }
]);
