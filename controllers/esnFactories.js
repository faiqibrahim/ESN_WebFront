/**
 * Created by Ibrahim on 11/23/2014.
 */
angular.module('Auth', [])
    .constant('loginUrl', 'http://esnback.com/users/login.json')
    .factory('$Auth', function ($http, loginUrl, $location, localStorageService) {
        var $user = {};
        var isLoggedIn = false;
        var loginStatus = {};
        var user_id = null;
        return {
            login: function ($username, $password, path) {

                $user.User = {};
                $user.User.username = $username;
                $user.User.password = $password;
                $http.post(loginUrl, $user, {withCredentials: true})
                    .success(function (data) {
                        if (data.result.success) {

                            isLoggedIn = true;
                            $user = data.result.user;
                            $location.path(path);
                            localStorageService.set('esnSessionUser', $user);
                        }
                        else {
                            isLoggedIn = false;
                            loginStatus = data.result;
                        }

                    }).error(function (error) {
                        console.log(error);
                    });

            },
            isAuthenticated: function () {
                return isLoggedIn;
            },
            getUser: function ($param) {
                if (!angular.isUndefined($param)) {
                    if ($param == 'id') {
                        return $user.id;
                    } else if ($param == 'username') {
                        return $user.username;
                    }
                    else {
                        return {};
                    }
                }
                return $user;
            },
            setUserFromSession: function (_user) {
                $user = _user;
                isLoggedIn = true;
            },
            logout: function () {
                localStorageService.clearAll();
                isLoggedIn = false;
            }

        };

    }).directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                        scope.uploadfile();
                    });
                });
            }
        };
    }]).service('fileUpload', ['$http', function ($http) {

        return {
            uploadFileToUrl: function (file, uploadUrl) {
                var fd = new FormData();
                fd.append('file', file);
                return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function (data) {
                    console.log(data);
                    return data.data.result;
                });
            }
        }


    }]).service('$postHandler', function ($http, $Auth) {
        var $addUrl = 'http://esnback.com/posts/add.json';
        return {
            uploadPost: function ($post,$_scope) {
                var $_post = {
                    Post: $post
                };
                $_post.Post.user_id = $Auth.getUser('id');
                $_post.Post.privacy_id = "1";

                $http.post($addUrl, $_post, {withCredentials: true})
                    .success(function (data) {
                        if (data.result.success) {
                            $_scope.added(data.result.post);
                        }
                    })

                    .error(function (error) {
                        console.log(error);
                    });
            }
        }
    })
;