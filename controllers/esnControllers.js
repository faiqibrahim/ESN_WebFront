/**
 * Created by Ibrahim on 8/28/2014.
 */
angular.module('esn').controller('mainCtrl', function ($scope, $http, localStorageService, $Auth, $location) {

    if (localStorageService.isSupported) {
        var user = localStorageService.get('esnSessionUser');
        console.log(user);
        if (user != null) {
            $Auth.setUserFromSession(user);
        }
    } else {
        console.log('Local Storage Not Supported in this Browser');
    }

})
    .filter('custom', function () {
        return function (data) {
            for (var i = 1; i < data.length; i++) {
                for (var k = i; k > 0 && data[k]['created'] < data[k - 1]['created']; k--) {
                    var temp = data[k];
                    data[k] = data[k - 1];
                    data[k - 1] = temp;
                }

            }
            return data;

        };


    })
    .filter('sort-id', function () {
        return function (data) {
            for (var i = 1; i < data.length; i++) {
                for (var k = i; k > 0 && data[k]['id'] < data[k - 1]['id']; k--) {
                    var temp = data[k];
                    data[k] = data[k - 1];
                    data[k - 1] = temp;
                }

            }
            return data;

        };


    });