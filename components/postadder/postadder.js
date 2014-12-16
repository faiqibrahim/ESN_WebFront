/**
 * Created by Ibrahim on 12/9/2014.
 */
angular.module('postAdder', []).directive('postAdder', function () {
    return {
        restrict: 'E',
        templateUrl: 'components/postadder/postadder.html',
        controller: function ($scope, $postHandler) {
            $scope.addPost = function ($post) {
                var $_post = {
                    post: $post
                };
                $postHandler.uploadPost($_post, $scope);
                $scope.post = '';
                $scope.added = function ($post) {
                    $scope.$broadcast('wallPostAdded', $post);
                }

            }
        }
    }
});