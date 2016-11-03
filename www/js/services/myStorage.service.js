app.service('MyStorageService', ['StorageService', function (StorageService) {
  return {
    token: {
      set: function (token) {
        StorageService.session.setItem("TOKEN", token);
      },
      get: function () {
        return StorageService.session.getItem("TOKEN");
      },
      clear: function () {
        StorageService.session.removeItem("TOKEN");
      }
    }
  };
}]);
