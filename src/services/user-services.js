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
