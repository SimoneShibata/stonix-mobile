app.controller('PerfilCtrl', function ($scope, $stateParams, $state, $rootScope, $http, $location, $cordovaCamera, $cordovaDatePicker, $filter, $ionicPopup, $timeout) {

  //
  // $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
  //   $rootScope.userAuthenticated = response.data;
  //   u = response.data;
  //   console.log(u);
  // });

  $scope.abrirDatePicker = function () {

    var yearBirth = $filter("date")($scope.user.birth, 'yyyy');
    var monthBirth = $filter("date")($scope.user.birth, 'MM');
    var dayBirth = $filter("date")($scope.user.birth, 'dd');
    console.log(dayBirth);
    //date: new Date(yearBirth, monthBirth, dayBirth)

    var options = {
      date: new Date("10/20/2015"),
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
  }

  $scope.editarPerfil = function () {
    $state.go("app.perfil-edit", {
      "id": $rootScope.userAuthenticated.id
    });
  }

  $http.get($rootScope.serviceBase + 'users/' + $stateParams.id).then(function (response) {
    $scope.user = response.data;
    $scope.user.imageProfile = "data:image/jpeg;base64," + response.data.imageProfile;
  });

  $scope.salvar = function (user) {

    var u = $rootScope.userAuthenticated;
    u.name = user.name;
    u.email = user.email;
    if(user.password) {
      if(user.passwordOld == $rootScope.userAuthenticated.password) {
        u.password = user.passwordAtual;
      } else {
        popup("A senha antiga não confere!");
      }
    }
    console.log(u);
    $http.put($rootScope.serviceBase + "users", u).then(function (response) {
      $rootScope.userAuthenticated = response.data;
      $state.go('app.perfil', {id: $stateParams.id});
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
