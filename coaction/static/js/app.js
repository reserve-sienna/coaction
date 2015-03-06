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
.controller('NewTaskCtrl', ['$location', 'Task', 'tasksService', function ($location, Task, tasksService) {

  var self = this;

  self.task = Task();

  self.goToTasks = function () {
    $location.path('/tasks');
  }

  self.addTask = function () {

  tasksService.addTask(self.task).then(self.goToTasks);
    // Make a copy of the 'newTask' object
    // var task = Task(self.newTask);

    // // Add the task to our service
    // tasksService.addTask(task);
    //
    // self.newTask = Task();

  };

}]);

app.factory('Task', function () {
  return function (spec) {
    spec = spec || {};
    return {
      title: spec.title || '',
      description: spec.description || '',
      due_date: spec.due_date || ''
    };
  };
});

app.factory('tasksService', ['$http', '$log', function($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, task) {
    return processAjaxPromise($http.post(url, task));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      var data = result.data;
      console.log(data);
      return data.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
      getTasks: function () {
      return get('/api/tasks');
      },

      getTask: function (id) {
      return get('/api/task/' + id);
      },

      addTask: function (task) {
      console.log(task, "hello");
      return post('/api/tasks', task);
      }
    //
    // deleteShare: function (id) {
    //   return remove('/api/res/' + id);
    // }
  };
}]);

//making a filter
//$filter('filter') (array, expression, comparator)
app.filter('ellipsis', function(){
  return function (input, num) {
    if(input.length > num ) {
      var newInputArea = input.slice(0, num) + '...';
      return newInputArea;
    } else {
      return input;
    }
};
});

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
.controller('TasksCtrl', ['$location', 'tasks', 'tasksService', function ($location, tasks, shareService) {

  var self = this;
  self.tasks = tasks;


}]);

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

//# sourceMappingURL=app.js.map