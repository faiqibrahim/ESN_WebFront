/**
 * Created by Ibrahim on 8/28/2014.
 */
angular.module('esn').controller('mainCtrl', function ($scope, $http) {
    $scope.data = {};
    $http.get('http://localhost:5500/users')
        .success(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].firstname == "Usman" && data[i].lastname == "Akram") {
                    $scope.loggedInUser = data[i];

                }
            }
        });

    var getPosts = function () {
        $http.get('http://localhost:5500/posts')
            .success(function (data) {

                $scope.data.posts = data;
            });
    };

    getPosts();


    $scope.data.files = [];

    $scope.test = function (data) {
        $scope.data.test = data;
    };

    $scope.$on('updatePosts', function (event, args) {
        getPosts();
    });
    $scope.$on('PostAdded', function (event, args) {
        var $_post = {};
        $_post.post = args.post;
        $_post.userid = $scope.loggedInUser.id;
        $_post.post = args.post;
        $_post.groupid = '';
        $_post.type = 'wall';

        $http.post('http://localhost:5500/posts', $_post).success(function (id) {
            getPosts();
        });
    });

    $scope.$on('FileAdded', function (event, args) {
        $scope.data.files.push(args);
    });

    $scope.deletePost = function (id_) {
        $http.delete('http://localhost:5500/posts/' + id_.id)
            .success(function (data) {
                getPosts();

            });

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