angular.module('navbar', [])
    .directive('navbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/navbar/navbar.html',
            controller: function ($scope, $location) {
                $scope.menu = {};
                var $items = [
                    {'title': 'Home', 'position': 'pull-left', 'link': 'home', 'index': 0},
                    {'title': 'Profile', 'position': 'pull-left', 'link': 'profile', 'index': 1},
                    {'title': 'Connections', 'position': 'pull-left', 'link': 'connections', 'index': 2},
                    {'title': 'Logout', 'position': 'pull-right', 'link': 'logout', 'index': 3}
                ];

                $scope.menu.items = $items;

                var currentLocation = $items[0];

                $scope.changeLocation = function ($index) {
                    var $path = $scope.menu.items[$index].link;
                    currentLocation = $scope.menu.items[$index];
                    $location.path('/' + $path);
                };

                $scope.getActiveClass = function ($option) {
                    if ($option.title == currentLocation.title) {
                        return 'active-option';
                    }
                    else {
                        return '';
                    }

                }

            }

        }
    });