app.controller('PerfilCtrl', function($scope, $stateParams, $state, $rootScope, $http) {
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
