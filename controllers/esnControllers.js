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
        return function (data, limit) {
            var result = [];
            for (var i = 0; i < limit; i++) {
                result.push(data[i]);
            }
            return result;

        };


    })
    .filter('wall_posts', function () {
        return function (data) {
            var wallposts = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].groupid == "" && data[i].type == 'wall') {
                    wallposts.push(data[i]);

                }
            }
            return wallposts;

        };


    });