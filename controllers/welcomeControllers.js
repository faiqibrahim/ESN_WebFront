/**
 * Created by Ibrahim on 11/13/2014.
 */
angular.module('esn')
    .controller('loginCtrl', function ($scope, $Auth) {
        $scope.data = {};
        $scope.data.login = {};
        $scope.loginLoading = false;
        $scope.login = function () {
            $scope.loginLoading = true;
            var $username = $scope.data.login.username;
            var $password = $scope.data.login.password;
            var $path = '/home';
            var $loginStatus = $Auth.login($username, $password, $path);
            $loginStatus.success(function (data) {
                if (!data.result.success) {
                    $scope.loginLoading = false;
                    $scope.data.login.error = data.result.message;
                }
            });
        }


    })
    .controller('registrationCtrl', function ($scope, $http) {
        $scope.data = {};
        $scope.data.result = {};
        $scope.inProcess = false;
        $scope.register = function () {
            $scope.inProcess=true;
            var registrationUrl = "http://esnback.com/users/add.json";
            var user = {};
            user.firstname = $scope.data.first_name;
            user.lastname = $scope.data.last_name;
            user.email = $scope.data.email;
            user.username = $scope.data.username;
            user.password = $scope.data.password;
            $http.post(registrationUrl, user).success(function (data) {

                if (data.result.success) {
                    $scope.data.error = null;
                    $scope.data.register_success = 'Registration Successful, Please Login';
                    $scope.inProcess=false;
                }
                else {
                    $scope.data.error = data.result.message;
                    $scope.data.register_success = null;
                    $scope.inProcess=false;
                }
            }).error(function (error) {
                console.log(error);
                $scope.inProcess=false;
            });


        };
        $scope.checkUserAvailability = function () {
            var checkUrl = 'http://esnback.com/users/checkUsername.json';
            var $user = {};
            $user.User = {};

            $user.User.username = $scope.data.username;
            $http.post(checkUrl, $user).success(function (data) {
                if (data.result.success) {
                    $scope.data.username_error = false;
                    return true;
                }
                else {
                    $scope.data.username_error = data.result.message;
                    return false;
                }
            }).error(function (error) {
                console.log(error);
                return false;
            });
        };
        $scope.checkEmailAvailability = function () {
            var checkUrl = 'http://esnback.com/users/checkEmail.json';
            $http.post(checkUrl, {'email': $scope.data.email}).success(function (data) {
                if (angular.isUndefined(data.result)) {
                    return;
                }
                if (data.result.success) {
                    $scope.data.email_error = false;
                    return true;
                }
                else {
                    $scope.data.email_error = data.result.message;
                    return false;
                }
            }).error(function (error) {
                console.log(error);
                return false;
            });
        };

    })
;