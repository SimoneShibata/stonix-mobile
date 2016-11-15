app.controller('PerfilCtrl', function ($scope, $stateParams, $state, $rootScope, $http, $location, $cordovaCamera, $cordovaDatePicker, $filter, $ionicPopup, $timeout) {

  //
  // $http.get($rootScope.serviceBase + "users/get-auth").then(function (response) {
  //   $rootScope.userAuthenticated = response.data;
  //   u = response.data;
  //   console.log(u);
  // });

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

  $scope.abrirGaleria2 = function () {

    console.log("Abriu a galeria 2");

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

  $scope.editarPerfil = function () {
    $state.go("app.perfil-edit", {
      "id": $rootScope.userAuthenticated.id
    });
  }

  $http.get($rootScope.serviceBase + 'users/' + $stateParams.id).then(function (response) {
    $scope.user = response.data;
    $scope.user.imageProfile = "data:image/jpeg;base64," + response.data.imageProfile;
    $scope.user.imageProfile2 = response.data.imageProfile;
    console.log($scope.user.imageProfile);
    console.log($scope.user.imageProfile2);
  });

  $scope.salvar = function (user) {

    var u = $rootScope.userAuthenticated;
    u.name = user.name;
    u.email = user.email;

    if(user.password && user.passwordAtual != null && user.passwordOld != null) {
      if(user.passwordOld == $rootScope.userAuthenticated.password) {
        u.password = user.passwordAtual;
      } else {
        popup("A senha antiga não confere!");
      }

      if(user.passwordOld == user.passwordAtual) {
        popup("A nova senha não pode ser a mesma senha antiga");
      }

    }

    u.imageProfile = cod;
    console.log(u);

    $http.put($rootScope.serviceBase + "users", u).then(function (response) {
      $rootScope.userAuthenticated = response.data;
      $state.go('app.perfil', {id: $stateParams.id});
      popup("Alteração realizada com sucesso!");
    });
  }

  function popup(mensagem) {
    var myPopup = $ionicPopup.show({
      title: mensagem
    });
    $timeout(function () {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 3000);
  }
});
