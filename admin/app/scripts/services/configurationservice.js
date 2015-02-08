'use strict';

angular.module('admin')
.service('ConfigurationService', ['$q', '$http', function ConfigurationService($q, $http) {
    var self = this;
    var cache = {
        config: null,
    }
    var online = {
        getConfig: function() {
            return $http.get('/config.json').then(
                function(response) {
                    var defered = $q.defer();
                    defered.resolve(response.data);
                    cache.config = response.data;
                    return defered.promise;
                }
            );
        }
    }
    return {
        getConfig: function() {
            if(cache.config != null) {
                var defered = $q.defer();
                defered.resolve(cache.config);
                return defered.promise;    
            } else {
                return online.getConfig();
            }
        }
        
    }
}]);
