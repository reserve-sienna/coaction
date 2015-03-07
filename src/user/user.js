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
