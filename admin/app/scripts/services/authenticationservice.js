'use strict';

angular.module('admin')
.service('AuthenticationService', 
    ["$q", "$http", "$log", "ConfigurationService", 
    function AuthenticationService($q, $http, $log, config) {
        var self = this;
        self.tokens = {
            accessToken: null,
            accessTokenExpirationDate: 0,
            refreshToken: null,
            refreshTokenExpirationTimestamp: 0,
            scopes : []
        };
        var cache = {
            accessToken: function() {
                var defered = $q.defer();
                if(!this.isCachedAccessTokenExpired())
                    defered.resolve(self.tokens.accessToken);
                else
                    defered.reject();
                return defered.promise;
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
        var online = {
            refreshTokensUsingCredentials: function() {
                var deferedToken = $q.defer();
                var request = {
                    method: 'GET',
                    url: config.serverUrl + '/oauth/token?grant_type=client_credentials',
                    headers: {
                        'Authorization' : 'Basic YUBhLmFhYTph'
                    }
                }
                $http(request).then(function(result) {
                    $log.log(result);    
                });
            },
            refreshAccessToken: function() {
                //TODO : add support for refresh token server-side
            }
        }
        return {
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
            logIn: function(credentials) {
                online.refreshTokensUsingCredentials();
            },
            accessToken: function() {
                
            }

        }
    }
]);
