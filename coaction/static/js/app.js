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
}])

//implement a auth check before hitting a route and/or a route controller
.run(['$rootScope', '$location', 'userService', function($rootScope, $location, userService) {
  $rootScope.$on( "$routeChangeError", function(event, current, previous, rejection) {
    // check if the route error is due to restricted access attempt on tasks view
    if(angular.isDefined(rejection) && rejection.notLoggedIn) {
      $location.path('/login');
    }

  });

}]);

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', 'userService', function($location, StringUtil, userService) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
    };

    self.logOutUser = function () {
      userService.logOutUser().then(self.goToLogIn);
    };

    self.goToLogIn = function () {
      $location.path('/login');
    };
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
  };

  self.addTask = function () {
    tasksService.addTask(self.task).then(self.goToTasks);
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

  function put(url, task) {
    return processAjaxPromise($http.put(url, task));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
  }

  function processAjaxPromise(p) {
    return p.then(function (result) {
      var data = result.data;
      return data.data;
    })
    .catch(function (error) {
     $log.log(error);
     throw error;
    });
  }

  return {

      getTasks: function () {
      return get('/api/tasks');
      },

      getTask: function (id) {
      return get('/api/task' + id);
      },

      addTask: function (task) {
      return post('/api/tasks', task);
      },

      assignTask: function (taskId, userId, userId) {
      alert(taskId, userId);
      return post('/api/task/' + taskId + '/assign/' + userId, userId);
      },

      removeTask: function (id) {
      return remove('/api/task/' + id);
      },

      updateTask: function (id, task) {
      return put('/api/task/' + id, task);
      }
  };
}]);

app.factory('userService', ['$http', '$log', '$q', function($http, $log, $q) {

  //currentUser will hold the returned logged in user object
  var currentUser = {};

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, task) {
    return processAjaxPromise($http.post(url, task));
  }


  function processAjaxPromise(p) {
    return p.then(function (result) {
      var data = result.data;
      return data.data;
    })
    .catch(function (error) {
     $log.log(error);
     throw error;
    });
  }

  return {
      createUser: function (user) {
      return post('/api/users', user);
      },

      setCurrentUser: function(user) {
        currentUser = user;
      },

      getCurrentUser: function() {
        var deferred = $q.defer();
        // check if we already have the current user in memory
        if( angular.equals({}, currentUser) ) {
          // not in memory, see if the user has a valid session cookie
           get('/api/authenticated').then(function(user){
            if(user) {
              currentUser = user;
              deferred.resolve(currentUser);
            } else {
              // user was not logged in
              deferred.resolve(false);
            }

          }, function(error){
            // something just went wrong here
            deferred.resolve(error);

          });

        } else {
          // user was already in memory
          deferred.resolve(currentUser);
        }

        return deferred.promise;
      },

      getUsers: function () {
         return get('/api/users').then(function (result) {
           return result;
         });
      },

      logOutUser: function () {
        currentUser = {};
        return post('/api/logout');
      },

      logInUser: function (user) {
      return post('/api/login', user);
      }

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
  self.assignForm = 'false';

  self.assignForm = function() {
    return assignForm = 'true';
  };

  self.filters = function (task) {
    if (task.status === 'new') {
    return tasks;
    }
    else if (task.status === 'doing') {
    return tasks;
    }

    else if (task.status === 'done') {
    return tasks;
    }
  };


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
            self.userinfo = '';
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

app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/user/login.html',
    controller: 'LogInCtrl',
    controllerAs: 'vm'
    // resolve: {
    //   tasks: ['userService', function (userService){
    //     return userService.getUsers();
    //   }]
    //   }
  };
  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/login', routeDefinition);
}])
.controller('LogInCtrl', ['$location', 'User', 'userService', function ($location, User, userService) {

  var self = this;

  self.error = null;

  self.user = User();

  // tasks.status = "new";

  self.logInUser = function () {
     userService.logInUser(self.user).then(function(success){
       
     if (success) {
       userService.setCurrentUser(success);
       self.goToTasks();
     }

    }, function(error){
      self.error = error;
    });
  };

  self.goToTasks = function () {
    $location.path('/tasks');
    };


}]);

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

app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      name: spec.name,
      email: spec.email,
      password: spec.password
    };
  };
});

// A little string utility... no biggie
app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

//# sourceMappingURL=app.js.map