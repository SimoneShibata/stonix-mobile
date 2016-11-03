app.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $filter, $ionicPopup, $timeout, $ionicHistory) {

// Cadastrar - register

  $scope.register = function (user) {

    if (user.password != user.passwordConfirm) {
      var myPopup = $ionicPopup.show({
        title: 'Confirmação de senha inválida!'
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2500);
      $ionicHistory.goBack(-1);
      return null;
    }

    user.birth = $filter("date")(user.birth, 'yyyy-MM-dd');
    user.image = "img/default.png";
    $http.post($rootScope.serviceBase + "users", user).then(function (response) {
      var myPopup = $ionicPopup.show({
        title: 'Cadastrado com sucesso'
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2500);
      $ionicHistory.goBack(-1);
    });
    $scope.login();
  };

});

