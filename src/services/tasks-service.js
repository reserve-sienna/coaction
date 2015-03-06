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
      return get('/api/task' + id);
      },

      addTask: function (task) {
      return post('/api/tasks', task);
    },

      removeTask: function (id) {
      return remove('/api/task/' + id);
    }
  };
}]);
