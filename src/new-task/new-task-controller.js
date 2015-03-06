app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/new-task/new-task.html',
    controller: 'NewTaskCtrl',
    controllerAs: 'vm'
  };

  $routeProvider.when('/tasks/new', routeDefinition);
}])
.controller('NewTaskCtrl', ['$location', 'Task', 'tasksService', function ($location, Task, tasksService) {
  var self = this;
  self.task = Task();

  self.goToTasks = function () {
    $location.path('/tasks');
  };

  self.addTask = function () {
    tasksService.addTask(self.task).then(self.goToTasks);
  };

}]);
