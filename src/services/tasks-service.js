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

      assignTask: function (taskId, userId) {
      return put('/api/task/' + taskId + '/assign/' + userId);
      },

      removeTask: function (id) {
      return remove('/api/task/' + id);
      },

      updateTask: function (id, task) {
      return put('/api/task/' + id, task);
      }
  };
}]);
