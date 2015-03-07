app.factory('User', function () {
  return function (spec) {
    spec = spec || {};
    return {
      username: spec.username,
      email: spec.email,
      password: spec.password
    };
  };
});
