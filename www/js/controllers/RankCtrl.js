app.controller('RankCtrl', function($scope, $rootScope, $state, $http) {

  $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].id == $rootScope.userAuthenticated.id) {
        $rootScope.rank = i + 1;
      }
    }
  });

});
