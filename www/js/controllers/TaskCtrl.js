app.controller('TaskCtrl', function ($scope, $http, $rootScope, $stateParams, $state, $ionicHistory, $ionicPopup, $timeout, $cordovaDatePicker) {

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
      $state.go('app.classroom', {id: response.data.classRoom.id});
    });
  } else {
    category.classRoom = {'id': $stateParams.id};
    $http.post($rootScope.serviceBase + "task-category", category).then(function (response) {
      popup("Categoria salva com sucesso");
      $state.go('app.classroom', {id: response.data.classRoom.id});
    });
  }
}
// Cancel Task
$scope.cancelTask = function () {
  $state.go('app.classroom', {id: $stateParams.id});
}
// Create Task
$scope.createTask = function (task) {
  var category;
  $http.get($rootScope.serviceBase + "task-category/" + $stateParams.idCategory).then(function (response) {
    task.taskCategory = response.data;
    $scope.saveTask(task);
    $state.go('app.classroom', {id: $stateParams.id});
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
        $state.go('app.classroom', {id: task.taskCategory.classRoom.id});
      });
    }
  }
}

var loadTaskAnswered = function (taskAnswered) {
  $http.post($rootScope.serviceBase + "tasks/answered/find", taskAnswered).then(function (res) {
    if (res.data != null || res.data != "") {
      verifyOption(res.data);
    }
  });
}

var verifyOption = function (taskAnswered) {
  for (var i=0; i < $scope.options.length; i++) {
    if ($scope.options[i].id == taskAnswered.taskOption.id) {
      $scope.choice = $scope.options[i].id;
      $scope.task.answered = true;
    }
    if ($scope.options[i].correct && $scope.options[i].id == taskAnswered.taskOption.id) {
      $scope.task.answeredCorrect = true;
    } else {
      $scope.task.answeredCorrect = false;
    }
  }
}


$scope.saveTaskAnswered = function (task, taskOption) {
  var taskAnsweed = {task: task, user: $rootScope.userAuthenticated, taskOption: taskOption};
  $http.post($rootScope.serviceBase + "tasks/answered", taskAnsweed).then(function (response) {
    $state.go('app.classroom', {id: task.taskCategory.classRoom.id});
    task.answered = true;
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

$scope.voltarTask = function (task) {
  $state.go('app.classroom', {id: task.taskCategory.classRoom.id});
}

// GetOne task
var getOneTask = function (idTask) {
  if (idTask) {
    $http.get($rootScope.serviceBase + "tasks/" + idTask).then(function (response) {
      $scope.pageTitle = response.data.title;
      $scope.task = response.data;
      $scope.task.closingDate = new Date(response.data.closingDate);

      $http.get($rootScope.serviceBase + "tasks/options/list/" + $scope.task.id).then(function (success) {
        $scope.options = success.data;

        if ($rootScope.userAuthenticated.id != $scope.task.taskCategory.classRoom.teacher.id) {
          var taskAnswered = {user: $rootScope.userAuthenticated, task: $scope.task};

          loadTaskAnswered(taskAnswered);
        } else {
          for (var i = 0; i < $scope.options.length; i++) {
            if ($scope.options[i].correct) {
              $scope.correct = i;
              return null;
            }
          }
        }
      });
    });
  }
}

getOneTask($stateParams.taskid);

$scope.selectChoice = function (choice) {
  $scope.selected = choice;
}

// Conferir resposta
$scope.evaluate = function (task) {
  $http.get($rootScope.serviceBase + "tasks/options/" + $scope.selected).then(function (response) {
    if (response.data.correct == true) {
      $http.put($rootScope.serviceBase + 'users/assign/xp/10', $rootScope.userAuthenticated).then(function (response) {
        $http.put($rootScope.serviceBase + 'users/assign/punctuation/5', response.data).then(function (response) {
          $rootScope.userAuthenticated = response.data;
          popup("Você acertou, parabéns! +10 de xp e +5 de reputação!");
        });
      });
    } else {
      $rootScope.userAuthenticated.punctuation -= 5;
      $http.put($rootScope.serviceBase + 'users', $rootScope.userAuthenticated).then(function (response) {
        $rootScope.userAuthenticated = response.data;
        popup("Precisa estudar mais, amiguinho! Perdeu 5 pontos de reputação :(");
      });
    }

    $scope.saveTaskAnswered(task, response.data);
  });
}

// Editar task
$scope.edit = function (task, options) {
  $http.put($rootScope.serviceBase + "tasks", task).then(function (response) {
    for (var i = 0; i < options.length; i++) {
      $http.put($rootScope.serviceBase + "tasks/options", options[i]).then(function (response) {
      }, function (error) {
        popup("Desculpe :( houve algum erro ao salvar as alternativas.");
        return null;
      });
    }
    popup("Atividade atualizada com sucesso.");
    $state.go('app.classroom', {id: task.taskCategory.classRoom.id});
  });
}

// Delete
$scope.deleteTask = function (task) {
  var classroom = task.taskCategory.classRoom.id;
  $http.delete($rootScope.serviceBase + "tasks/" + task.id).then(function (response) {
    popup("Atividade excluída com sucesso.");
    $state.go('app.classroom', {id:classroom});
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

  $scope.editarTask = function (taskid) {
    $state.go('app.task-edit', {taskid: taskid})
  }
});
