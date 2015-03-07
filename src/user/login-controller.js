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
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/login', routeDefinition);
}])
.controller('LogInCtrl', ['$location', 'User', 'userService', function ($location, User, userService) {

  var self = this;
  self.user = User();
  // tasks.status = "new";

  self.logInUser = function () {
     userService.logInUser(self.user).then(function(success){
       console.log(success, 'not right');
     if (success) {
       userService.setCurrentUser(success);
     }

      self.goToTasks();

    }, function(error){
      return error;
    });
  };

  self.goToTasks = function () {
    $location.path('/tasks');
    };


}]);
