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
}]);

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/new-task/new-task.html',
    controller: 'NewTaskCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/tasks/new', routeDefinition);
}])
.controller('NewTaskCtrl', ['Task', function (Task) {

  var self = this;

  self.newTask = Task();

  self.addTask = function () {

    // Make a copy of the 'newTask' object
    var task = Task(self.newTask);

    // Add the task to our service
    tasksService.addTask(task);

    self.newTask = Task();

  };

}]);

app.factory('Task', function () {
  return function (spec) {
    spec = spec || {};
    return {
      id: spec.id || '',
      title: spec.title || '',
      description: spec.description || '',
      status: spec.status || '',
      due_date: spec.due_date || ''
    };
  };
});

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

//# sourceMappingURL=app.js.map