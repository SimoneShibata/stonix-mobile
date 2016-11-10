app.controller('LoginCtrl', function ($scope, $rootScope, $http, $state, $filter, $ionicPopup, $timeout, $ionicHistory, $cordovaCamera, $cordovaImagePicker) {

// Cadastrar - register
  $scope.fotoPerfilBase64 = "";
  $scope.hideInputRegister = true;
  $scope.hideInputLoadRegister = false;

  var cod = "";
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
    //$scope.user.imageProfile = $scope.fotoPerfilBase64;
    user.imageProfile = cod;
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

  $scope.tirarFoto = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(options).then(function (imageData) {
      var imageDataCamera = "data:image/jpeg;base64," + imageData;
      $scope.fotoPerfilBase64 = imageDataCamera;
      cod = imageData;
    }, function (err) {
      // error
    });
  }

  $scope.abrirGaleria = function () {
    // Image picker will load images according to these settings
    var options = {
      maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
      width: 800,
      height: 800,
      quality: 80

    };

    $cordovaImagePicker.getPictures(options).then(function (results) {
      // Loop through acquired images
      for (var i = 0; i < results.length; i++) {
        var imageDataCamera = results[i]+"";

        cod = results[i];

        //$scope.fotoPerfilBase64 = imageDataCamera;

        $scope.fotoPerfilBase64  = imageDataCamera;
      }
    }, function (error) {
      console.log('Error: ' + JSON.stringify(error));    // In case of error
    });
  };
});

