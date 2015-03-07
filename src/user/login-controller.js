app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/user/login.html',
    controller: 'LogInCtrl',
    controllerAs: 'vm'
    // resolve: {
    //   tasks: ['userService', function (userService){
    //     return userService.getUsers();
    //   }]
    //   }
  };
  $routeProvider.when('/login', routeDefinition);
}])
.controller('LogInCtrl', ['$location', 'User', 'userService', function ($location, User, userService) {

  var self = this;
  self.user = User();
  // tasks.status = "new";

  self.logInUser = function () {
    userService.logInUser(self.user);
    };


}]);
