app.factory('userService', ['$http', '$log', function($http, $log) {

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
        console.log(user);
      return post('/api/register', user);
      },

      logOutUser: function (id) {
      return get('/api/logout');
      },

      logInUser: function (user) {
      return post('/api/login', user);
    },

  };
}]);
