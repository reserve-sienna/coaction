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
  $routeProvider.when('/users', routeDefinition);
}])
.controller('UserCtrl', ['$location', 'User', 'userService', function ($location, User, userService) {

  var self = this;

  self.user = User();
  // tasks.status = "new";

  //holds any error messages
  self.errors = {};

  self.createUser = function () {
    //reset error object for next request
    self.errors = {};
    userService.createUser(self.user).then(function(success){
      $location.path('/login');

    }, function(error){
      // set the errors object for our view
      self.errors = error.data;

    });

    };


}]);
