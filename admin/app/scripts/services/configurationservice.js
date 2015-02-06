'use strict';

angular.module('admin')
.service('ConfigurationService', function ConfigurationService() {
    return {
        serverUrl : 'http://localhost:8080'
    }
});
