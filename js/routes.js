/**
 * Created by Ibrahim on 11/13/2014.
 */
angular.module('esn').config(function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {templateUrl: './views/welcome.html'});

    $routeProvider.when('/welcome', {templateUrl: './views/welcome.html'});

    $routeProvider.when('/home', {templateUrl: './views/home.html'});
    $routeProvider.when('/connections', {templateUrl: './views/connections.html'});
    $routeProvider.when('/profile/:userID', {templateUrl: './views/profile.html'});

    $routeProvider.when('/create-group', {templateUrl: './views/group-create.html'});
    $routeProvider.when('/inbox', {templateUrl: './views/inbox.html'});
    $routeProvider.when('/inbox/:contactId', {templateUrl: './views/inbox/chatbox.html'});

    $routeProvider.when('/group/:groupId', {templateUrl: './views/group.html'});


    $routeProvider.otherwise({templateUrl: 'views/welcome.html'});
    $locationProvider.html5Mode(false);

}).run(function ($rootScope, $location, $Auth) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (!$Auth.isAuthenticated()) {
            // no logged user, redirect to /login
            if (next.templateUrl === "./views/welcome.html") {
            } else {
                $location.path("/welcome");
            }
        }
    });
});
