app.service('StorageService', ['$window', function ($window) {
  return {
    session: {
      setItem: function (index, value) {
        $window.sessionStorage.setItem(index, value);

      },
      getItem: function (index) {
        return $window.sessionStorage.getItem(index);
      },
      removeItem: function (index) {
        return $window.sessionStorage.removeItem(index);
      }
    },
    local: {
      setItem: function (index, value) {
        $window.localStorage.setItem(index, value);
      },
      getItem: function (index) {
        return $window.localStorage.getItem(index);
      },
      removeItem: function (index) {
        return $window.localStorage.removeItem(index);
      }
    }
  };
}]);
