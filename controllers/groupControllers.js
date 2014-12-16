/**
 * Created by Ibrahim on 12/13/2014.
 */
angular.module('esn')
    .controller('CreateGroupCtrl', function ($scope, $http, $location) {
        $scope.form = {};
        $scope.form.privacy = 1;
        $scope.form.interests = [];
        $scope.form.selectedInterest = null;
        $scope.test = function () {
            console.log('testing');
        };
        $scope.addInterest = function () {
            if (!angular.isUndefined($scope.form.selectedInterest) && $scope.form.selectedInterest != null) {
                var $interest = $scope.form.selectedInterest.originalObject;
                console.log($interest.Interest);
                $scope.form.interests.push($interest.Interest);
            }
        };
        var getInterestsIdArray = function () {
            var result = [];
            for (var i = 0; i < $scope.form.interests.length; i++) {
                result.push($scope.form.interests[i].id);
            }
            return result;
        };
        var getFormJson = function () {

            return {
                Group: {
                    title: $scope.form.title,
                    description: $scope.form.description,
                    groupprivacy_id: $scope.form.privacy

                },
                Interest: getInterestsIdArray()
            };
        };
        $scope.create_group = function () {
            var $formData = getFormJson();
            $http.post('http://esnback.com/groups/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    console.log(data);
                    if (data.result.success) {
                        $location.path('/group/' + data.result.group_id);
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        };

    }).controller('GroupController', function ($scope, $http, $routeParams, $Auth, fileUpload) {
        $scope.groupOwner = false;
        $scope.owner = {};
        $scope.Group = {};

        $scope.get_group = $http.get('http://esnback.com/groups/getById/' + $routeParams.groupId + '.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    $scope.Group = data.result.group;
                    $scope.Group.groupData = data.result.group.Group;
                    $scope.owner = data.result.group.User;

                    if ($Auth.getUser('id') == $scope.owner.id) {
                        $scope.groupOwner = true;
                    }
                    else {
                        $scope.groupOwner = false;
                    }
                    $scope.Group.privacy = data.result.group.Groupprivacy.privacy;
                }
            }).error(function (error) {
                console.log(error);
            });
        $scope.data = {};
        $scope.data.view = './views/group/announcements.html';
        $scope.updateView = function (view) {
            if (view == 'Announcements') {
                $scope.data.view = './views/group/announcements.html';
            } else if (view == 'Tasks') {
                $scope.data.view = './views/group/tasks.html';
            }
            else if (view == 'Questions') {
                $scope.data.view = './views/group/questions.html';
            }
            else if (view == 'Posts') {
                $scope.data.view = './views/group/posts.html';
            }
            else if (view == 'Contents') {
                $scope.data.view = './views/group/contents.html';
            }


        };
    })
    .controller('GroupMenuController', function ($scope) {
        var $menus = ['Announcements', 'Tasks', 'Posts', 'Questions', 'Contents'];
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
    }).controller('GroupAnnouncementsController', function ($scope, $http) {
        $scope.data = {};
        $scope.get_group.success(function () {

            $scope.data.announcements = $scope.Group.Announcement;

            console.log($scope.Group);
        });
        $scope.addAnnouncement = function () {
            var $formData = {
                Announcement: {
                    title: $scope.new_title,
                    announcement: $scope.new_description,
                    group_id: $scope.Group.Group.id
                }
            };
            $http.post('http://esnback.com/announcements/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $announcement = data.result.announcement;
                        $scope.data.announcements.push($announcement.Announcement);
                        console.log($announcement.Announcement);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        $scope.deleteAnnouncement = function ($announcement_id, $index) {
            $http.delete('http://esnback.com/announcements/delete/' + $announcement_id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.announcements.splice($index, 1);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        }


    }).controller('GroupPostsController', function ($scope, $http, $Auth, $routeParams) {
        console.log($scope.test);
        $scope.data = {
            posts: []
        };
        $scope.profile = {
            user: {}
        };
        var updatePosts = function () {
            $http.post('http://esnback.com/posts/findByGroup/' + $scope.Group.groupData.id + '.json', {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {
                        $scope.data.posts = data.result.posts;

                    }
                }).error(function (error) {
                    console.log(error);
                });
        };
        updatePosts();
        $scope.addPost = function () {
            var $formData = {
                Post: {
                    post: $scope.new_post,
                    group_id: $scope.Group.Group.id,
                    privacy_id: 1
                }
            };
            $http.post('http://esnback.com/posts/add.json', $formData, {withCredentials: true})
                .success(function (data) {
                    if (data.result.success) {

                        var $post = data.result.post;
                        $scope.data.posts.push($post);
                        $scope.new_post = " ";
                        console.log($post);
                    }
                }).error(function (error) {
                    console.log(error);
                });
        };

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

    });