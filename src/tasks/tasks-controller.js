app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/tasks/tasks.html',
    controller: 'TasksCtrl',
    controllerAs: 'vm',
    resolve: {
      currentUser: ['userService', '$q', function(userService, $q){
        var deferred = $q.defer();
         userService.getCurrentUser().then(function(user){
          if(user) {
            deferred.resolve(user);
          } else {
            deferred.reject({notLoggedIn: true});
          }
        });
        return deferred.promise;
      }],
      tasks: ['tasksService', function (tasksService){
        return tasksService.getTasks();
      }],
      users: ['userService', function(userService) {
        return userService.getUsers();
      }]
    }
  };
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/tasks', routeDefinition);
}])
.controller('TasksCtrl', ['$location', 'tasks', 'tasksService', 'userService','currentUser', 'users', function ($location, tasks, tasksService, userService, currentUser, users) {

  var self = this;
  self.tasks = tasks;
  self.currentUser = currentUser;
  self.users = users;


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

    // self.getUsers = function () {
    //   return userService.getUsers();
    // };

    self.assignTask = function (taskId) {
          var assigned = self.userinfo;
          for (var i = 0; i < users.length; ++i) {
            var userVar = users[i].name;
            if (assigned.trim() === userVar.trim()) {
            tasksService.assignTask(taskId, self.users[i].id, self.users[i].id);
            }
          }
    };

    self.updateTask = function (task, tabStatus) {
      task.status = tabStatus;
      tasksService.updateTask(task.id, task);
    };

    self.className = function (task) {
      var className = 'task-title todo';
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
