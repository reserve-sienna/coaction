app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/user/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm'
    // resolve: {
    //   tasks: ['userService', function (userService){
    //     return userService.getUsers();
    //   }]
    //   }
  };
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/users', routeDefinition);
}])
.controller('UserCtrl', ['$location', 'User', 'userService', function ($location, User, userService) {

  var self = this;
  self.user = User();
  // tasks.status = "new";

  self.createUser = function () {
    userService.createUser(self.user);
    };


}]);
