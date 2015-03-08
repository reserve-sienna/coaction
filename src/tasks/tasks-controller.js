app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/tasks/tasks.html',
    controller: 'TasksCtrl',
    controllerAs: 'vm',
    resolve: {
      tasks: ['tasksService', function (tasksService){
        return tasksService.getTasks();
      }],
      currentUser: ['userService', function(userService){
        return userService.getCurrentUser();
      }]
      }
  };
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/tasks', routeDefinition);
}])
.controller('TasksCtrl', ['$location', 'tasks', 'tasksService', 'currentUser', function ($location, tasks, tasksService, currentUser) {

  var self = this;
  self.tasks = tasks;
  self.currentUser = currentUser;

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

    self.className = function (task) {
      var className = 'task-title';
      if (task.status === 'new') {
        className += ' todo';
      }
      else if (task.status === 'doing') {
        className += ' doing';
      }
      else {
        className += ' done';
      }
      return className;
    };

}]);
