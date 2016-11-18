app.controller('RoomCtrl', function ($scope, $stateParams, $state, $http, $rootScope, $ionicPopup, $timeout, $ionicHistory) {

  $scope.cancelNewRoom = function () {
    $state.go('app.rooms');
  }

  $scope.newRoom = function () {
    $state.go('app.room-new');
  };

  $scope.newUser = function (room) {
    console.log(room);
    $state.go('app.room-new-user', {'idroom': room.id});
  };

  $scope.cancelNewUser = function () {
    $ionicHistory.goBack(-1);
  };

  $scope.openRoom = function (room) {
    $state.go('app.classroom', {'id': room.id});
    console.log(room);
  };

//getAllroom
  function getAllRoom(sucesso, falha) {
    $http.get($rootScope.serviceBase + "classroom").then(function (response) {
      $rootScope.rooms = response.data;
      if (sucesso) sucesso($rootScope.room);
    }, function (error) {
      if (falha) falha(error);
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
    $timeout(function () {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 2500);
  }

  // GetOne - Chama Sala solicitada
  if ($stateParams.id != null) {
    $http.get($rootScope.serviceBase + "classroom/" + $stateParams.id).then(function (response) {
      $scope.room = response.data;
      $rootScope.users = $scope.room.students;
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
  $scope.addUser = function (u) {
    var user = {};
    $http.post($rootScope.serviceBase + "users/email", u).then(function (response) {
      $scope.userClass = response.data;

      $http.post($rootScope.serviceBase + "classroom/student/" + $stateParams.idroom, $scope.userClass).then(function (response) {
        $rootScope.users.push($scope.userClass);
        popup($scope.userClass.name + " foi adicionado na sala.");
        $ionicHistory.goBack(-1);
      }, function (error) {
        popup("Não foi possível adicionar o usuário :(");
      });
    }, function (error) {
      popup("Não foi possível encontrar o usuário :(");
    });
  }

// Maçã
  $scope.addApple = function (teacher) {
    var apple = {};
    apple.teacher = teacher;
    apple.student = $rootScope.userAuthenticated;
    $http.post($rootScope.serviceBase + "apples", apple).then(function (response) {
      getNumberApples(teacher);
    })
  }
  // GetAll Categories Tasks - categorias
  var getAllCategories = function () {
    $http.get($rootScope.serviceBase + "task-category/classroom/" + $stateParams.id).then(function (response) {
      $scope.categories = response.data;
    })
  }

  getAllCategories();

  window.setInterval(function () {
    getAllCategories();
  }, 3000);

  $scope.categorySelected = function (category) {
    $scope.selected = category.id;
    $scope.listTasks(category);
  };

// GetAll Tasks - atividades
  $scope.listTasks = function (category) {
    $http.get($rootScope.serviceBase + "tasks/task-category/" + category.id).then(function (response) {
      $scope.tasks = response.data;
    });
  }

// Create Category
  $scope.createCategory = function (idCategory) {
    if (idCategory) {
      $state.go('app.category-edit', {id:$stateParams.id, idCategory:idCategory});
    } else {
      $state.go('app.category-new',{ id: $stateParams.id});
    }
  }

// Delete Category
  $scope.deleteCategory = function (category) {
    $http.get($rootScope.serviceBase + "tasks/task-category/" + category.id).then(function (response) {
      if (response.data.length > 0) {
        popup("Não é possível excluir uma categoria com atividades cadastradas.");
      } else {
        $http.delete($rootScope.serviceBase + "task-category/" + category.id).then(function (response) {
          getAllCategories();
          popup("Categoria excluída com sucesso");
        });
      }
    });
  }

// Cancelar edição
  $scope.cancelEdit = function (room) {
    $state.go('/rooms/' + room);
  }

// Editar sala
  $scope.editRoom = function (room) {
    $http.put($rootScope.serviceBase + "classroom/", room).then(function (response) {
      popup(response.data.name + " alterada com sucesso.");
      $state.go("/rooms");
    });
  }
});
