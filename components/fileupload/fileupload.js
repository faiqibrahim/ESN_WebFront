angular.module('fileupload', [])
    .directive('fileupload', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/fileupload/fileupload.html',
            controller: function ($scope) {

            }
        }
    });