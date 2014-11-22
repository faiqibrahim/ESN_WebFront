/**
 * Created by Ibrahim on 11/13/2014.
 */
angular.module('esn').config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {templateUrl: './views/welcome.html'});

    $routeProvider.when('/welcome', {templateUrl: './views/welcome.html'});

    $routeProvider.when('/home', {templateUrl: './views/home.html'});

    $routeProvider.when('/profile', {templateUrl: './views/profile.html'});

    $routeProvider.otherwise({templateUrl: 'views/welcome.html'});
    $locationProvider.html5Mode(false);

});