/**
 * Created by Ibrahim on 11/23/2014.
 */
angular.module('esn')
    .controller('profileCtrl', function ($scope, $http, $routeParams, $Auth, fileUpload) {
        $scope.selfProfile = false;
        $scope.Auth = {};
        $scope.profile = {

        };
        $scope.test = $http.get('http://esnback.com/users/getByUsername/' + $routeParams.userID + '.json', {withCredentials: true})
            .success(function (data) {
                console.log(data);
                $scope.Auth.user = data.users;
                $scope.profile.user = $scope.Auth.user.User;
                if ($scope.profile.user.id == $Auth.getUser('id')) {
                    $scope.selfProfile = true;
                } else {
                    $scope.selfProfile = false;
                }
            }).error(function (error) {
                console.log(error);
            });
        var $user = {};
        $user.User = {};
        $user.User.Posts = {};
        $scope.profile.editTagLine = false;
        $scope._editTagLine = function () {
            if ($scope.profile.editTagLine) {
                var $user = {};
                $user.User = {
                    id: $Auth.getUser('id'),
                    tagline: $scope.profile.user.tagline
                };
                var $url = 'http://esnback.com/users/edit/' + $Auth.getUser('id') + '.json';
                $http.put($url, $user, {withCredentials: true})
                    .success(function (data) {
                        console.log(data);
                    })
                    .error(function (error) {
                        console.log(error);
                    });
                $scope.profile.editTagLine = false;
            }
            else {

                $scope.profile.editTagLine = true;
            }
        };
        $scope.data = {};
        $scope.data.view = './views/profile_posts.html';
        $scope.updateView = function (view) {
            if (view == 'Posts') {
                $scope.data.view = './views/profile_posts.html';
            } else if (view == 'Interests') {
                $scope.data.view = './views/profile_interests.html';
            }
            else if (view == 'About') {
                $scope.data.view = './views/profile_about.html';
            }
            else if (view == 'Groups') {
                $scope.data.view = './views/profile_groups.html';
            }
            else if (view == 'Supervises') {
                $scope.data.view = './views/profile_supervises.html';
            }


        };
        $scope.uploadFileType = function (file) {
            $scope.upload = {'file': file};
        };

        $scope.uploadfile = function () {
            var file = null;
            var uploadUrl = null;

            if ($scope.upload.file == 'cover') {
                file = $scope.coverFile;
                uploadUrl = 'http://esnback.com/users/addCoverPhoto.json';
            } else if ($scope.upload.file == 'profile') {
                file = $scope.profileFile;
                uploadUrl = 'http://esnback.com/users/addProfilePhoto.json';
            }
            if (file != null && uploadUrl != null) {
                var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
                uploadData.then(function (result) {
                        if (!angular.isUndefined(result) && result.success && result.fileType == 'profilePhoto') {
                            $scope.profile.user.profilephoto_thumb = result.thumbnail;
                            var $user = {
                                'User': {
                                    id: $Auth.getUser('id'),
                                    profilephoto: result.original,
                                    profilephoto_thumb: result.thumbnail
                                }
                            };
                            var $url = 'http://esnback.com/users/edit/' + $Auth.getUser('id') + '.json';
                            $http.post($url, $user, {withCredentials: true})
                                .success(function (data) {

                                }).error(function (error) {

                                });
                        } else if (!angular.isUndefined(result) && result.success && result.fileType == 'coverPhoto') {
                            $scope.profile.user.coverphoto_thumb = result.thumbnail;
                            var $user = {
                                'User': {
                                    id: $Auth.getUser('id'),
                                    coverphoto: result.original,
                                    coverphoto_thumb: result.thumbnail
                                }
                            };
                            var $url = 'http://esnback.com/users/edit/' + $Auth.getUser('id') + '.json';
                            $http.post($url, $user, {withCredentials: true})
                                .success(function (data) {

                                }).error(function (error) {

                                });
                        }
                        else {
                            console.log(result);
                        }
                    }
                );
            }


        }
        ;

    }).
    controller('profileMenuCtrl', function ($scope) {
        var $menus = ['Posts', 'Interests', 'About', 'Groups', 'Supervises'];
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
    }).controller('interestsCtrl', function ($scope, $http, $Auth) {
        var $user = $scope.Auth.user;
        $scope.data.interests = $user.Interest;
        $scope.deleteInterest = function (id, $index) {
            $http.delete('http://esnback.com/users/deleteInterest/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.interests.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.addInterest = function () {
            if (!angular.isUndefined($scope.data.selectedInterest)) {
                var $interest = $scope.data.selectedInterest.originalObject;
                console.log($interest);
                var $interest_id = $interest.Interest.id;
                var $user_id = $Auth.getUser('id');
                var $data = {'user_id': $user_id, 'interest_id': $interest_id};
                $http.post('http://esnback.com/users/addInterest.json', $data, {withCredentials: true})
                    .success(function (data) {
                        console.log(data);
                        if (data.result.success) {
                            $scope.data.interests.push($interest.Interest);
                        }
                    }).error(function (error) {
                        console.log(error)
                    });
            }
        }


    }).controller('infoCtrl', function ($scope, $Auth, $http) {
        $scope.data = {};
        $scope.data.info = {
            edit: false
        };
        $scope.editInfo = function () {
            if ($scope.data.info.edit) {
                $scope.data.info.edit = false;
                if ($scope.profile.user.id == $Auth.getUser('id')) {
                    var $user = {};
                    $user.User = {
                        id: $Auth.getUser('id'),
                        firstname: $scope.profile.user.firstname,
                        lastname: $scope.profile.user.lastname,
                        contact: $scope.profile.user.contact,
                        address: $scope.profile.user.address,
                        city: $scope.profile.user.city,
                        country: $scope.profile.user.country

                    };
                    var $url = 'http://esnback.com/users/edit/' + $Auth.getUser('id') + '.json';
                    $http.put($url, $user, {withCredentials: true})
                        .success(function (data) {
                            console.log(data);
                        })
                        .error(function (error) {
                            console.log(error);
                        });

                }

            }
            else {
                $scope.data.info.edit = true;
            }
        }


    }).controller('profilePostsCtrl', function ($scope, $http, $Auth, $routeParams) {
        console.log($scope.test);
        $scope.data = {
            posts: {}
        };
        var updatePosts = function () {
            $http.post('http://esnback.com/posts/findByUser/' + $scope.profile.user.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.posts = data.result.posts;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.test.success(function () {
            updatePosts();
        });
        var editable_post_id = -1;

        $scope.isEditable = function ($post_id) {
            return $post_id == editable_post_id;
        };
        $scope.setEditable = function ($post_id) {
            editable_post_id = $post_id;
        };
        $scope.savePost = function ($post) {
            $http.post('http://esnback.com/posts/edit/' + $post.id + '.json', {'Post': $post}, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        editable_post_id = -1;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });

        };


        $scope.$on('wallPostAdded', function (event, post) {
            console.log(post);
            $scope.data.posts.push(post);
        });
        $scope.deletePost = function (id, $index) {
            $http.delete('http://esnback.com/posts/delete/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        //$scope.data.posts.splice($index, 1);
                        updatePosts();
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    }).filter('reverse', function () {
        return function (items) {
            if (angular.isArray(items) && items.length > 0)
                return items.slice().reverse();
        };
    });
;