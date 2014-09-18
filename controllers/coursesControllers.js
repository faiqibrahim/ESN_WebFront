/**
 * Created by Ibrahim on 9/1/2014.
 */
angular.module('courses', [])

    .factory('courses', function ($http) {
        var courses = {};

        var get_courses = function () {
            $http.get('http://localhost:5500/groups')
                .success(function (data) {
                    courses = data;


                    return courses;
                }).error(function (error) {
                    alert('error');
                    return null;
                });

        };
        get_courses();

        var selectedCourse = null;
        return {
            getSelectedCourse: function () {
                return selectedCourse;
            },
            setSelectedCourse: function (id) {
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].id == id) {
                        selectedCourse = courses[i];
                        return;
                    }
                }
                selectedCourse = null;
            },
            getCourses: function () {
                return courses;
            }
        };
    })
    .controller('coursesListCtrl', function ($scope, courses, $location) {

        $scope.data.courses = function () {
            return courses.getCourses();

        };
        $scope.selectCourse = function (id) {

            courses.setSelectedCourse(id);
            $location.path('/course');

        };


    })
    .controller('courseViewCtrl', function ($scope, courses, $http) {
        /*var posts = [
         {id: 'jsdjh9375', title: 'Create a Web Page', description: 'Blah blah', post: "Create I'm Batman Page", course_id: '928267sd1', post_type: 'Tasks', user_id: '0'},
         {id: 'skshd234', title: 'Lecture#1', description: 'Slide', post: 'Downlaod Freom here blah blah', course_id: '9amy7jk1', post_type: 'Contents', user_id: '0'},
         {id: 'ksdh8630', title: 'Read Awesome Batman', description: 'Batman is Cool', post: 'Because im batman', course_id: '928hdhx7sd1', post_type: 'Tasks', user_id: '0'},
         {id: 'lsjdu82', title: 'No Class', description: 'no class', post: 'There will be no class as usual', course_id: '928267sd1', post_type: 'Announcements', user_id: '0'},
         {id: 'dlsnd283', title: 'No Class Again', description: 'haha', post: 'I said no class', course_id: '928267sd1', post_type: 'Announcements', user_id: '0'},
         {id: 'lsndy987', title: 'Still Sleepy', description: 'Late night awake', post: 'Working in Dreams...', course_id: '9amy7jk1', post_type: 'Announcements', user_id: '0'}
         ];
         */
        var _user = {photo: './usman.png'};
        $scope._user = _user;
        //$scope.data.posts = posts;
        //$scope.data.owner = loggedInUser;

        $scope.selectedCourse = function () {
            return courses.getSelectedCourse();
        };

        $scope.$on('CoursePostAdded', function (event, args) {
            var $_post = {};
            $_post.post = args.post;
            $_post.userid = $scope.loggedInUser.id;

            $_post.groupid = courses.getSelectedCourse().id;
            $_post.type = args.type;

            $http.post('http://localhost:5500/posts', $_post).success(function (id) {
                $scope.$emit('updatePosts', {});
            });
        });
        $scope.views = ['All', 'Announcements', 'Tasks', 'Contents'];
        $scope.activeView = $scope.views[0];
        $scope.setActiveView = function (id) {
            if (angular.isNumber(id)) {
                $scope.activeView = $scope.views[id];

            }
            else if (angular.isString(id)) {
                $scope.activeView = id;
            }
        };
        $scope.getActiveViewClass = function (item) {
            return $scope.activeView == item ? 'btn-primary' : '';
        };
        $scope.getCoursePosts = function () {
            var results = [];
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].course_id == $scope.selectedCourse().id) {
                    results.push(posts[i]);
                }
            }
            return results;
        };
        $scope.categoryFilterFn = function (post) {
            return $scope.activeView == post.type || $scope.activeView == 'All';
        };


    })
    .filter('course_posts', function (courses) {
        return function (data) {
            //console.log(courses.getSelectedCourse());
            var course_id = courses.getSelectedCourse().id;
            var results = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].groupid == course_id) {
                    results.push(data[i]);
                }
            }
            return results;

        }
    });