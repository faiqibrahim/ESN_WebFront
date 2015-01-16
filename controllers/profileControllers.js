/**
 * Created by Ibrahim on 11/23/2014.
 */
angular.module('esn')
    .controller('profileCtrl', function ($scope, $http, $routeParams, $Auth, fileUpload) {
        $scope.selfProfile = false;
        $scope.Auth = {};
        $scope.profile = {};
        $scope.connectedUser = false;
        $scope.userInfoLoading = false;
        var getUserInfo = function () {
            $scope.userInfoLoading = true;
            return $http.get('http://esnback.com/users/getByUsername/' + $routeParams.userID + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.users.length != 0) {
                        $scope.userInfoLoading = false;
                        $scope.Auth.user = data.users;
                        $http.get('http://esnback.com/users/areConnected/' + $scope.Auth.user.User.id + '.json', {withCredentials: true})
                            .success(function (data) {
                                if (data.result.success) {
                                    $scope.connectedUser = true;
                                }
                            })
                            .error(function (error) {
                                console.log(error);
                            });


                        $http.get('http://esnback.com/users/getJoinedGroups/' + $routeParams.userID + '.json', {withCredentials: true})
                            .success(function (data) {
                                if (data.result.success) {
                                    $scope.Auth.user.joinedGroups = data.result.groups;
                                }
                            }).error(function (error) {
                                console.log(error);
                            });

                        $scope.profile.user = $scope.Auth.user.User;
                        if ($scope.profile.user.id == $Auth.getUser('id')) {
                            $scope.selfProfile = true;
                        } else {
                            $scope.selfProfile = false;
                        }
                    } else {
                        console.log(data);
                    }

                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.test = getUserInfo();
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
        $scope.data.view = './views/profile/posts.html';
        $scope.updateView = function (view) {
            if (view == 'Posts') {
                $scope.data.view = './views/profile/posts.html';
            } else if (view == 'Interests') {
                $scope.data.view = './views/profile/interests.html';
            }
            else if (view == 'About') {
                $scope.data.view = './views/profile/about.html';
            }
            else if (view == 'Groups') {
                $scope.data.view = './views/profile/groups.html';
            }
            else if (view == 'Supervises') {
                $scope.data.view = './views/profile/supervises.html';
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
        $scope.connectUser = function () {
            var $formData = {
                user_id: $Auth.getUser('id'),
                username: $routeParams.userID
            };
            $http.post('http://esnback.com/users/addContact.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.connectedUser = true;
                    }
                    console.log(data);
                }).error(function (error) {
                    console.log(error);
                });
        };

        $scope.disconnectUser = function () {
            $http.delete('http://esnback.com/users/deleteContact/' + $routeParams.userID + '.json', {withCredentials: true})
                .success(function (data) {
                    console.log(data);
                    if (data.result.success) {
                        $scope.connectedUser = false;
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };

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
        $scope.addingInterest = false;
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
            $scope.addingInterest = true;
            if (!angular.isUndefined($scope.data.selectedInterest)) {
                var $interest = $scope.data.selectedInterest.originalObject;
                console.log($interest);
                var $interest_id = $interest.Interest.id;
                var $user_id = $Auth.getUser('id');
                var $data = {'user_id': $user_id, 'interest_id': $interest_id};
                $http.post('http://esnback.com/users/addInterest.json', $data, {withCredentials: true})
                    .success(function (data) {

                        if (data.result.success) {
                            $scope.data.interests.push($interest.Interest);
                            $scope.selectedInterest = '';
                            $scope.addingInterest = false;
                        } else {
                            $scope.addingInterest = false;
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
        $scope.data.educations = $scope.Auth.user.Education;
        $scope.addingEducation = false;
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
        };
        $scope.addEducation = function () {
            $scope.addingEducation = true;
            var $institute = $scope.institute;
            var $major = $scope.major;
            var $formData = {
                Education: {
                    institute: $institute,
                    major: $major
                }
            };
            $http.post('http://esnback.com/userseducations/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    console.log(data);
                    if (data.result.success) {
                        $scope.data.educations.push(data.result.user_education.Education);
                        $scope.institute = '';
                        $scope.major = '';
                        $scope.addingEducation = false;

                    } else {
                        console.log(data);
                        $scope.addingEducation = false;

                    }
                }).error(function (error) {

                    console.log(error);
                });


        };
        $scope.deleteEducation = function ($id, $index) {
            $http.delete('http://esnback.com/userseducations/delete/' + $id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.educations.splice($index, 1);
                    }
                    else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };


    }).controller('profilePostsCtrl', function ($scope, $http, $Auth, $routeParams, fileUpload) {

        $scope.data = {
            posts: {}
        };
        $scope.postsLoading = false;
        var editable_post_id = -1;

        $scope.editPost = {
            content_id: null,
            removeFile: true
        };

        var resetFileStatus = function () {
            $scope.$fileStatus = {
                isUploaded: false,
                content_id: null,
                content_path: null
            };
            $scope.fileStatus = 'No file';
            $scope.isUploading = false;
        };

        resetFileStatus();


        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.postFile;
            if (editable_post_id != -1) {
                file = $scope.editFile;
            }
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                    //resetFileStatus();
                } else {
                    $scope.fileStatus = result.message;

                }
                $scope.isUploading = false;
            });
        };
        $scope.addPost = function () {
            var $formData = {
                Post: {
                    post: $scope.new_post,
                    privacy_id: 1,
                    content_id: $scope.$fileStatus.content_id
                }
            };
            $http.post('http://esnback.com/posts/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        var $post = data.result.post;
                        $scope.data.posts.unshift($post);
                        $scope.new_post = " ";
                        resetFileStatus();
                    }
                    else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        var updatePosts = function () {
            $scope.postsLoading = true;
            $http.post('http://esnback.com/posts/getForUserProfile/' + $scope.profile.user.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.postsLoading = false;
                        $scope.data.posts = data.result.posts;
                    } else {
                        console.log(data);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.test.success(function () {
            updatePosts();
        });


        $scope.isEditable = function ($post_id) {
            return $post_id == editable_post_id;
        };
        $scope.setEditable = function ($post_id) {
            editable_post_id = $post_id;
            resetFileStatus();
        };

        $scope.savePost = function ($post, $index) {
            if ($scope.editPost.removeFile) {
                $post.content_id = null;
            } else if (!angular.isUndefined($scope.editPost.content_id) && $scope.editPost.content_id != null) {
                $post.content_id = $scope.editPost.content_id;
            }

            $http.post('http://esnback.com/posts/edit/' + $post.id + '.json', {'Post': $post}, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        editable_post_id = -1;
                        $scope.data.posts[$index] = data.result.post;
                        console.log(data);
                        resetFileStatus();
                    } else {
                        console.log(data);
                        resetFileStatus();
                    }
                })
                .error(function (error) {
                    console.log(error);
                    resetFileStatus();
                });

        };

        $scope.deletePost = function (id, $index) {
            $http.delete('http://esnback.com/posts/delete/' + id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.posts.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }

    }).
    controller('ProfileEditPostController', function ($scope, $http, fileUpload) {
        var resetFileStatus = function () {
            $scope.$fileStatus = {
                isUploaded: false,
                content_id: null,
                content_path: null
            };
            $scope.fileStatus = 'No file';
            $scope.isUploading = false;
        };

        resetFileStatus();


        $scope.uploadfile = function () {
            $scope.isUploading = true;
            $scope.fileStatus = 'Please wait while the file gets uploaded';
            var file = $scope.postFile;
            var uploadUrl = 'http://esnback.com/contents/uploadFile.json';
            var uploadData = fileUpload.uploadFileToUrl(file, uploadUrl);
            uploadData.then(function (result) {
                if (result != null && result.success) {
                    $scope.$fileStatus.isUploaded = true;
                    $scope.$fileStatus.content_id = result.content_id;
                    $scope.$fileStatus.content_path = result.content_path;
                    $scope.fileStatus = 'File Successfully Attached';
                    $scope.editPost.content_id = result.content_id;
                } else {
                    $scope.fileStatus = result.message;

                }
                $scope.isUploading = false;
            });
        };

    }).filter('reverse', function () {
        return function (items) {
            if (angular.isArray(items) && items.length > 0)
                return items.slice().reverse();
        };
    });
