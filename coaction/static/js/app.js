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

app.controller('MainNavCtrl',
  ['$location', 'StringUtil', function($location, StringUtil) {
    var self = this;

    self.isActive = function (path) {
      // The default route is a special case.
      if (path === '/') {
        return $location.path() === '/';
      }

      return StringUtil.startsWith($location.path(), path);
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
  self.user = 

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

      removeTask: function (id) {
      return remove('/api/task/' + id);
    },

      updateTask: function (id, task) {
      return put('/api/task/' + id, task);
    }
  };
}]);

app.factory('userService', ['$http', '$log', function($http, $log) {

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
        return currentUser;
      },

      logOutUser: function (id) {
      return get('/api/logout');
      },

      logInUser: function (user) {
      return post('/api/login', user);
    },

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

  self.createUser = function () {
    userService.createUser(self.user);
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