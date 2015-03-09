// Declare our app module, and import the ngRoute and ngAnimate
// modules into it.
var app = angular.module('app', ['ngRoute']);

// Set up our 404 handler
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({
    controller: 'Error404Ctrl',
    controllerAs: 'vm',
    templateUrl: 'static/errors/404/error-404.html'
  });
}])

//implement a auth check before hitting a route and/or a route controller
.run(['$rootScope', '$location', 'userService', function($rootScope, $location, userService) {
  $rootScope.$on( "$routeChangeError", function(event, current, previous, rejection) {
    // check if the route error is due to restricted access attempt on tasks view
    if(angular.isDefined(rejection) && rejection.notLoggedIn) {
      $location.path('/login');
    }

  });

}]);
