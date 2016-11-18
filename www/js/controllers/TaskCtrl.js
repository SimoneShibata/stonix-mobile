app.controller('TaskCtrl', function ($scope, $http, $rootScope, $stateParams, $state, $ionicHistory, $ionicPopup, $timeout) {

  $scope.options = [];

// Create Category
  $scope.createCategory = function (category) {
    if (!category.name || !category.description) {
      popup("Todos os campos são obrigatórios");
      return null;
    }
    if (category.id) {
      $http.put($rootScope.serviceBase + "task-category", category).then(function (response) {
        popup("Categoria salva com sucesso");
        $ionicHistory.goBack(-1);
      });
    } else {
      category.classRoom = {'id': $stateParams.id};
      $http.post($rootScope.serviceBase + "task-category", category).then(function (response) {
        popup("Categoria salva com sucesso");
        $state.go('app.classroom', {id: response.data.classRoom.id})
      });
    }
  }

// Create Task
  $scope.createTask = function (task) {
    var category;
    $http.get($rootScope.serviceBase + "task-category/" + $stateParams.idCategory).then(function (response) {
      task.taskCategory = response.data;
      $scope.saveTask(task);
    });
  }

  $scope.saveTask = function (task) {
    $http.post($rootScope.serviceBase + "tasks", task).then(function (success) {
      $scope.saveOptions(success.data);
    });
  }

  $scope.saveOptions = function (task) {
    for (var i = 0; i < $scope.options.length; i++) {
      if ($scope.options[i].correct == null) {
        $scope.options[i].correct = false;
      }
      $scope.options[i].task = task;

      if ($scope.options[i].description != null) {
        $http.post($rootScope.serviceBase + "tasks/options", $scope.options[i]).then(function (res) {
          $state.go('/rooms/' + task.taskCategory.classRoom.id);
        });
      }
    }
  }

  $scope.saveTaskAnswered = function (task, taskOption) {
    console.log(taskOption);
    var taskAnsweed = {task: task, user: $rootScope.userAuthenticated, taskOption: taskOption};
    $http.post($rootScope.serviceBase + "tasks/answered", taskAnsweed).then(function (response) {
      $state.go("/rooms/" + task.taskCategory.classRoom.id);
    });
  }

// Cancel Category
  $scope.cancelCategory = function () {
    $state.go('app.classroom', {id: $stateParams.id});
  }

// Edit Category
  if ($stateParams.idCategory) {
    $http.get($rootScope.serviceBase + "task-category/" + $stateParams.idCategory).then(function (response) {
      $scope.category = response.data;
    });
  }

// GetOne task
  var getOneTask = function (idTask) {
    if (idTask) {
      $http.get($rootScope.serviceBase + "tasks/" + idTask).then(function (response) {
        $scope.pageTitle = response.data.title;
        $scope.task = response.data;

        $http.get($rootScope.serviceBase + "tasks/options/list/" + response.data.id).then(function (success) {
          $scope.options = success.data;
        });

        var taskAnswered = {task: response.data, user: $rootScope.userAuthenticated};
        $http.post($rootScope.serviceBase + "tasks/answered/find", taskAnswered).then(function (response) {
          console.log(response.data);
          console.log('response: ' + response.data.taskOption);
        }, function (error) {
          console.log('error: ' + error);
        });
      });
    }
  }
  getOneTask($stateParams.id);

// Conferir resposta
  $scope.evaluate = function (choice, task) {
    $http.get($rootScope.serviceBase + "tasks/options/" + choice).then(function (response) {
      if (response.data.correct) {
        popup("Você acertou, parabéns!");
      } else {
        popup("Precisa estudar mais, amiguinho");
      }
      $scope.saveTaskAnswered(task, response.data);
    });
  }

// Editar
  $scope.edit = function (task) {

  }

// Delete
  $scope.deleteTask = function (task) {
    var classroom = task.taskCategory.classRoom.id;
    $http.delete($rootScope.serviceBase + "tasks/" + task.id).then(function (response) {
      popup("Atividade excluída com sucesso.");
      $state.go("/rooms/" + classroom);
    });
  }

// Cancelar edição
  $scope.cancelEdit = function (room) {
    $state.go('/rooms/' + room);
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
