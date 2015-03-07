app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/tasks/tasks.html',
    controller: 'TasksCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', function (tasksService){
        return tasksService.getTasks();
      }]
      }
  };
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/tasks', routeDefinition);
}])
.controller('TasksCtrl', ['$location', 'tasks', 'tasksService', function ($location, tasks, tasksService) {

  var self = this;
  self.tasks = tasks;
  // tasks.status = "new";

  self.removeTask = function (id) {
    tasksService.removeTask(id).then(function () {
    for (var i =0; i < self.tasks.length; ++i) {
      if (self.tasks[i].id === id) {
      self.tasks.splice(i, 1);
      break;
      }
    }
  }).catch(function () {
    alert('failed to delete');
  });
  };

  self.updateTask = function (task, tabStatus) {
    task.status = tabStatus;
    tasksService.updateTask(task.id, task);
  };
}]);
