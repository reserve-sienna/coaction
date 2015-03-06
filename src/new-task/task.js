app.factory('Task', function () {
  return function (spec) {
    spec = spec || {};
    return {
      id: spec.id || '',
      title: spec.title || '',
      description: spec.description || '',
      status: spec.status || '',
      due_date: spec.due_date || ''
    };
  };
});
