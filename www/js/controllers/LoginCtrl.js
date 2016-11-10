app.controller('LoginCtrl', function ($scope, $rootScope, $http, $state, $filter, $ionicPopup, $timeout, $ionicHistory, $cordovaCamera, $cordovaDatePicker) {

// Cadastrar - register
  $scope.fotoPerfilBase64 = "";
  $scope.hideInputRegister = true;
  $scope.hideInputLoadRegister = false;

  var cod = "";


  $scope.abrirDatePicker = function () {
    var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      minDate: new Date(1900, 1, 1),
      allowOldDates: true,
      allowFutureDates: true,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    $cordovaDatePicker.show(options).then(function (date) {
      $scope.date = date;
    });

  }

  $scope.register = function (user) {

    $scope.hideInputRegister = false;
    $scope.hideInputLoadRegister = true;

    if (user.password != user.passwordConfirm) {

      $scope.hideInputRegister = true;
      $scope.hideInputLoadRegister = false;

      popup("Confirmação de senha inválida!");
      $ionicHistory.goBack(-1);
      return null;
    }

    user.birth = $filter("date")($scope.date, 'yyyy-MM-dd');
    //$scope.user.imageProfile = $scope.fotoPerfilBase64;
    user.imageProfile = cod;

    $http.post($rootScope.serviceBase + "users", user)
      .then(function (response) {
        popup("Cadastrado com sucesso!");
        $scope.hideInputRegister = true;
        $scope.hideInputLoadRegister = false;
        $ionicHistory.goBack(-1);
      }, function (error) {
        popup("Não foi possível cadastrar no momento!");
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
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      var imageDataCamera = "data:image/jpeg;base64," + imageData;
      $scope.fotoPerfilBase64 = imageDataCamera;
      cod = imageData;
    }, function (err) {
      // error
    });
  }

  function popup(mensagem) {
    var myPopup = $ionicPopup.show({
      title: mensagem
    });
    $timeout(function () {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 2500);
  }

});

