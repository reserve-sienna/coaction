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
