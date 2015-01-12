angular.module('esn')
    .controller('ConnectionsController', function ($scope, $http) {
        $scope.data = {};
        $scope.data.view = './views/connections/connectionsTo.html';
        $scope.updateView = function (view) {
            if (view == 'ConnectionsToYou') {
                $scope.data.view = './views/connections/connectionsTo.html';
            } else if (view == 'ConnectionsFromYou') {
                $scope.data.view = './views/connections/connectionsFrom.html';
            }

        }
    })
    .controller('ConnectionsMenuController', function ($scope) {
        var $menus = ['ConnectionsToYou', 'ConnectionsFromYou'];
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
        };


    }).controller('ConnectionsToUserController', function ($scope, $http) {
        $scope.users = {};
        $http.get('http://esnback.com/users/getconnectionsto.json', {withCredentials: true})
            .success(function (data) {
                if(data.result.success){
                    $scope.users=data.result.connections;
                }
            }).error(function (error) {
                console.log(error);
            });
    }).controller('ConnectionsFromUserController', function ($scope, $http) {
        $scope.users = {};
        $http.get('http://esnback.com/users/getconnectionsfrom.json', {withCredentials: true})
            .success(function (data) {
                if(data.result.success){
                    $scope.users=data.result.connections;
                }
            }).error(function (error) {
                console.log(error);
            });
    });