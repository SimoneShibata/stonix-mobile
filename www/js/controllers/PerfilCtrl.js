app.controller('PerfilCtrl', function($scope, $stateParams, $state, $rootScope, $http) {

  $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
    $rootScope.userAuthenticated = response.data;
    $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].id == $rootScope.userAuthenticated.id) {
          $rootScope.rank = i + 1;
        }
      }
    });
  });

  $scope.config = {
    url: $rootScope.urlApi
  };

  $scope.user = {
    name: $rootScope.userAuthenticated.name,
    email: $rootScope.userAuthenticated.email
  };

  // var config = {        headers:{'Access-Control-Allow-Origin':'*'} };

  $scope.salvar = function (user) {

    var u = $rootScope.userAuthenticated;
    u.name = user.name;
    u.email = user.email;
    console.log(u);
    $http.put($rootScope.serviceBase + "users", u).then(function (response) {
      $rootScope.userAuthenticated = response.data;
      $state.go('app.perfil', {id: $stateParams.id});
    });
  }
});
