app.controller('RoomCtrl', function($scope, $stateParams, $state, $http, $rootScope, $ionicPopup, $timeout, $ionicHistory) {

  $scope.cancelNewRoom = function () {
    $state.go('app.rooms');
  }

  $scope.newRoom = function() {
    $state.go('app.room-new');
  };

  $scope.newUser = function() {
    $state.go('app.room-new-user');
  };

  $scope.cancelNewUser = function() {
    $ionicHistory.goBack(-1);
  };

  $scope.openRoom = function(room) {
    $state.go('app.classroom', {'id':room.id});
    console.log(room);
  };

//getAllroom
  function getAllRoom(sucesso, falha) {
    $http.get($rootScope.serviceBase + "classroom").then(function (response) {
      $rootScope.rooms = response.data;
      if(sucesso) sucesso($rootScope.room);
    }, function (error) {
      if(falha) falha(error);
    });
  }
  getAllRoom();

  $http.get($rootScope.serviceBase + "classroom").then(function (response) {
    $scope.myRooms = response.data;
  });

  $http.get($rootScope.serviceBase + "classroom").then(function (response) {
    $scope.myRooms = response.data;
  });

  $scope.createRoom = function (room) {
    room.teacher = $rootScope.userAuthenticated;
    $http.post($rootScope.serviceBase + "classroom", room)
      .then(function (response) {
        getAllRoom(function () {
          popup("Sala de aula criada com sucesso.");
          $ionicHistory.goBack(-1);
        }),
          function (error) {
            popup("Não consegui criar uma sala de aula.");
            console.log(response.data);
            $ionicHistory.goBack(-1);
          }
      });
  }

  function popup(mensagem) {
    var myPopup = $ionicPopup.show({
      title: mensagem
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 2500);
  }

  // GetOne - Chama Sala solicitada
  if ($stateParams.id != null) {
    $http.get($rootScope.serviceBase + "classroom/" + $stateParams.id).then(function (response) {
      $scope.room = response.data;
      $scope.users = $scope.room.students;
      if ($scope.room == "") {
        console.log("O room está nulo");
      }
    }, function (error) {
      if (error.status == 404) {
        console.log("Erro 404!");
      }
    });
  }

  // Add User in Classroom
  $scope.addUser = function(u) {
    var user = {};
    $http.post($rootScope.serviceBase + "users/email", u).then(function(response) {
      $scope.userClass = response.data;

      $http.post($rootScope.serviceBase + "classroom/student/" + $routeParams.id, $scope.userClass).then(function(response) {
        $scope.users.push($scope.userClass);
        popup($scope.userClass.name + " foi adicionado na sala.");
      }, function(error) {
        popup("Não foi possível adicionar o usuário :(");
      });
    }, function(error) {
      popup("Não foi possível encontrar o usuário :(");
    });
  }

// Maçã
  $scope.addApple = function(teacher) {
  }

});
