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
