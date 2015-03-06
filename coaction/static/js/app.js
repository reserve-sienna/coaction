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

app.factory('tasksService', ['$http', '$log', function($http, $log) {

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, share) {
    return processAjaxPromise($http.post(url, share));
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
      return post('/api/res', task);
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