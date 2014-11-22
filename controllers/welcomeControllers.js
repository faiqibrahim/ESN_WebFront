/**
 * Created by Ibrahim on 11/13/2014.
 */
angular.module('esn')
    .controller('loginCtrl', function ($scope, $http, $location) {
        $scope.data = {};
        $scope.data.login = {};
        var toProfile = true;
        $scope.login = function (_username, _password) {
            var $username;
            var $password;
            if (!angular.isUndefined(_username) && !angular.isUndefined(_password)) {
                $username = _username;
                $password = _password;
                toProfile = true;
            }
            else {
                $username = $scope.data.login.username;
                $password = $scope.data.login.password;
            }

            var $user = {};
            $user.User = {};
            $user.User.username = $username;
            $user.User.password = $password;
            var loginUrl = 'http://esnback.com/users/login.json';
            $http.post(loginUrl, $user)
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.login.error = null;
                        if (toProfile) {
                            $location.path("/profile");

                        } else {
                            $location.path("/home");
                        }
                    }
                    else {
                        $scope.data.login.error = data.result.message;
                    }

                }).error(function (error) {
                    console.log(error);
                });

        };
        $scope.$on('userRegisteredEvent', function (event, args) {
            console.log("Im here dude");
            $scope.login(args.username, args.password);

        });

    })
    .controller('registrationCtrl', function ($scope, $http) {
        $scope.data = {};
        $scope.data.result = {};
        $scope.register = function () {
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

                }
                else {
                    $scope.data.error = data.result.message;
                    $scope.data.register_success = null;
                }
            }).error(function (error) {
                console.log(error);
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

    }).controller('profileCtrl', function ($scope) {
        $scope.data = {};
        $scope.data.view='';
        $scope.updateView = function (view) {
            if (view == 'Posts') {
                $scope.data.view = './views/profile_posts.html';
            }

        };

    }).controller('profileMenuCtrl', function ($scope) {
        var $menus = ['Posts', 'Interests', 'About', 'Groups', 'Blah'];
        var $selectedMenu = $menus[0];
        $scope.data = {};
        $scope.data.menus = $menus;

        $scope.selectMenu = function (index) {
            if (index >= 0 && index < $scope.data.menus.length) {
                $selectedMenu = $scope.data.menus[index];
                $scope.updateView($selectedMenu);
            }
        };
        $scope.getActiveClass = function (menu) {
            return menu == $selectedMenu ? 'active' : '';
        }
    });
;