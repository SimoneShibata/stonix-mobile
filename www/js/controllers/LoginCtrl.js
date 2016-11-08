app.controller('LoginCtrl', function ($scope, $rootScope, $http, $state, $filter, $ionicPopup, $timeout, $ionicHistory, $cordovaCamera) {

// Cadastrar - register
  $scope.fotoPerfilBase64 = "";
  $scope.hideInputRegister = true;
  $scope.hideInputLoadRegister = false;

  $scope.register = function (user) {

    $scope.hideInputRegister = false;
    $scope.hideInputLoadRegister = true;

    if (user.password != user.passwordConfirm) {

      $scope.hideInputRegister = true;
      $scope.hideInputLoadRegister = false;

      var myPopup = $ionicPopup.show({
        title: 'Confirmação de senha inválida!'
      });
      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2500);
      $ionicHistory.goBack(-1);
      return null;
    }

    user.birth = $filter("date")(user.birth, 'yyyy-MM-dd');
    user.image = $scope.fotoPerfilBase64;
    $http.post($rootScope.serviceBase + "users", user).then(function (response) {
      var myPopup = $ionicPopup.show({
        title: 'Cadastrado com sucesso'
      });
      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2500);
      $scope.hideInputRegister = true;
      $scope.hideInputLoadRegister = false;
      $ionicHistory.goBack(-1);
    });
    $scope.login();
  };

  $scope.tirarFoto = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight:500,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.fotoPerfilBase64 = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });
  }
});

