/**
 * Created by Ibrahim on 1/12/2015.
 */
angular.module('esn')
    .controller('HomeController', function ($scope, $http, $Auth) {
        $scope.data = {
            posts: {}
        };
        $scope.selfPost = function ($user_id) {
            return $Auth.getUser('id') == $user_id;
        };
        $http.post('http://esnback.com/posts/gethomeposts.json', {withCredentials: true})
            .success(function (data) {
                if (data.result.success) {
                    $scope.data.posts = data.result.posts;
                }
            }).error(function (error) {
                console.log(error);
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