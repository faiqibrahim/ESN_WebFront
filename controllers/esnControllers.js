/**
 * Created by Ibrahim on 8/28/2014.
 */
angular.module('esn').controller('mainCtrl', function ($scope, $http, courses,$location) {
    var posts = [
        {title: '1st Post', description: 'This is our first post', post: "And its Blah blah"},
        {title: '2nd Post', description: 'This is our second post', post: "And its Blah blah again"},
        {title: '3rd Post', description: 'This is our third post', post: "And it Blah blah again"},
        {title: '4th Post', description: 'This is our fourth post', post: "Because I'm Batman!"}
    ];

    $scope.data = {};
    $scope.data.posts = posts;
    $scope.data.courses = courses.getCourses();
    $scope.data.files = [];

    $scope.test = function (data) {
        $scope.data.test = data;
    };

    $scope.$on('PostAdded', function (event, args) {
        $scope.data.posts.push(args);
    });
    $scope.$on('FileAdded', function (event, args) {
        $scope.data.files.push(args);
    });

    $scope.selectCourse = function (id) {

        courses.setSelectedCourse(id);
        $location.path('/course');

    };

})
    .filter('custom', function () {
        return function (data, limit) {
            var result = [];
            for (var i = 0; i < limit; i++) {
                result.push(data[i]);
            }
            return result;

        };


    });