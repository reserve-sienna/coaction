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
