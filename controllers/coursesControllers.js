/**
 * Created by Ibrahim on 9/1/2014.
 */
angular.module('courses', [])
    .factory('courses', function () {
        var courses = [
            {id: '928267sd1', title: 'Web Engineering', owner: 'Usman Akram'},
            {id: '92826smjhdd1', title: 'Automata Theory', owner: 'Muddassir Naseer'},
            {id: '928hdhx7sd1', title: 'Software Engineering', owner: 'Sobia Zaheer'},
            {id: '9282sb73sd1', title: 'Computer Graphics', owner: 'Sadaf Inaam'},
            {id: '9amy7jk1', title: 'Operating System', owner: 'Rab Nawaz Jadoon'}
        ];
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
    .controller('courseViewCtrl', function ($scope, courses) {
        $scope.data.courses = courses.getCourses();
        $scope.selectedCourse = function () {
            return courses.getSelectedCourse();
        };

    });