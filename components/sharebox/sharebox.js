/**
 * Created by Ibrahim on 8/30/2014.
 */
angular.module('sharebox', [])
    .directive('sharebox', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/sharebox/sharebox.html',
            controller: function ($scope) {
                $scope.views = ['Text', 'File', 'Link'];
                $scope.selectedBox = $scope.views[0];
                $scope.selectBox = function (index) {
                    if (index > $scope.views.length || index < 0) {
                        $scope.selectedBox = $scope.views[0];
                    }
                    else {
                        $scope.selectedBox = $scope.views[index];
                    }
                };
                $scope.addPost = function () {
                    if ($scope.selectedBox === 'Text') {
                        var post = $scope.sharebox_text;
                        var newPost = {post: post};
                        $scope.$emit('PostAdded', newPost);
                    }
                    else if ($scope.selectedBox === 'File') {
                        $scope.$emit('FileAdded', {path: $scope.file});
                    }
                };
                $scope.getActiveClass = function (item) {
                    return item == $scope.selectedBox ? 'btn-primary' : "";
                };
                $scope.addFile = function (file) {
                    alert(file);
                    $scope.file = file;
                }

            }
        }

    });