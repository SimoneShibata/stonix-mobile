app.controller('PerfilCtrl', function ($scope, $stateParams, $state, $rootScope, $http, $location) {

  //
  // $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
  //   $rootScope.userAuthenticated = response.data;
  //   u = response.data;
  //   console.log(u);
  // });

  $scope.editarPerfil = function () {
    $state.go("app.perfil-edit", {
      "name": $rootScope.userAuthenticated.name,
      "email": $rootScope.userAuthenticated.email,
      "password": $rootScope.userAuthenticated.password
    });
  }

  $scope.user = {
    name: $stateParams.name,
    email: $stateParams.email,
    password: $stateParams.password
  };

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
