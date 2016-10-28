angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope, $state, $ionicPopup, $timeout) {

  window.http = $http;

  // sair - logout
  $scope.logout = function () {
    $http.post($rootScope.serviceBase + "logout", $rootScope.userAuthenticated)
    .then(
      function (response) {
       $rootScope.userAuthenticated = {};
        $scope.login();
      },
      function (response) {
        // failure callback
      }
    );
  };

  $ionicModal.fromTemplateUrl('templates/login/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.login = function() {
    $scope.closeRegisterModal();
    $scope.modal.show();
  };
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $ionicModal.fromTemplateUrl('templates/login/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalRegister = modal;
  });

  $scope.registerModal = function() {
    $scope.closeLogin();
    $scope.modalRegister.show();
  };
  $scope.closeRegisterModal = function() {
    $scope.modalRegister.hide();
  };

  var config = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8;'
    }
  };
// Login
  $scope.logar = function (user) {
    $http.post($rootScope.serviceBase + "login", user, config)
      .then(
        function (response) {
          $rootScope.userAuthenticated = response.data;
          $scope.closeLogin();
          $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].id == $rootScope.userAuthenticated.id) {
                $rootScope.rank = i + 1;
              }
            }
          });
        },
        function (error) {
          var alertPopup = $ionicPopup.alert({
            title: 'E-mail ou senha incorreto.'
          });
        }
      );
  };
})

.controller('ForumCtrl', function($scope, $stateParams, $http, $rootScope, $filter, $state, $ionicSideMenuDelegate, $timeout, $ionicPopup,$ionicHistory) {

// getAll - questions
  $rootScope.questions = [];
  function getAll(sucesso, falha) {
    $http.get($rootScope.serviceBase + "questions")
      .then(function (response) {
        $rootScope.questions = response.data;
        for (var i=0; i<response.data.length; i++) {
          $rootScope.questions[i].lastUpdateFilter = $filter("date")(new Date($rootScope.questions[i].lastUpdate), 'dd/MM/yyyy HH:mm');
        }
        if(sucesso) sucesso($rootScope.questions);
      }, function (error) {
        if(falha) falha(error);
      });
  }
  getAll();

// Aceitar Melhor Resposta
  $scope.acceptAnswer = function (answer) {
    $http.get($rootScope.serviceBase + '/answers/' + $scope.question.id + "/better/" + answer.id).then(function (response) {
      $scope.question.answered = true;
      $scope.answers = $scope.getAllAnswers();
      var userAnswer = answer.user;
      if ($rootScope.userAuthenticated.id != userAnswer.id) {
        $http.put($rootScope.serviceBase + '/users/assign/xp/40', userAnswer).then(function (response) {
        });
        $http.put($rootScope.serviceBase + '/users/assign/punctuation/50', userAnswer).then(function (response) {
        });
      }
      $http.put($rootScope.serviceBase + '/users/assign/punctuation/25', $rootScope.userAuthenticated).then(function (response) {
        $rootScope.userAuthenticated = response.data;
        $rootScope.userAuthenticated = response.data;
      });
      var myPopup = $ionicPopup.show({
        title: 'Uauuuu, boa escolha! Aceitar a resposta te rendeu 25 pontos!'
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2000);
    });
  };

// nice question - gostei
  $scope.niceQuestion = function (question) {
    if ($rootScope.userAuthenticated.id) {
      $http.get($rootScope.serviceBase + '/questions/nice/' + question.id).then(function (response) {
        $http.get($rootScope.serviceBase + "questions").then(function (response) {
          $rootScope.questions = response.data;
          question.nice++;
        });
      });
    }
  };

  function getOne(id, success) {
    $http.get($rootScope.serviceBase + "questions/" + id).then(function (response) {
      $scope.question = response.data;
      $scope.question.lastUpdateFilter = $filter("date")(new Date($scope.question.lastUpdate), 'dd/MM/yyyy HH:mm');
      if (success) success();
    }, function (error) {
       // error
    });
  }

// getOne question
  if ($stateParams.id != null) {
    getOne($stateParams.id);
  }

  $scope.openQuestion = function (question) {
    $state.go('app.question-answer', {'id':question.id});
  };

////////////////// Answer //////////////////
// GetAll - Lista answers
  $http.get($rootScope.serviceBase + "answers/question/" + $stateParams.id).then(function (response) {
    $scope.answers = response.data;
    for (var i=0; i<$scope.answers.length; i++) {
      $scope.answers[i].lastUpdateFilter = $filter("date")(new Date($scope.answers[i].lastUpdate), 'dd/MM/yyyy HH:mm');
    }
  });

//Delete Answer
  $scope.deleteAnswer = function (answer) {
    var questionId = answer.question.id;
    var configDelete = {
      headers: {
        'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
        'Accept': 'application/json;odata=verbose'
      }
    };
    $http.delete($rootScope.serviceBase + "answers/" + answer.id, configDelete).then(function (response) {
      $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
        $scope.answers = response.data;
      });
      $http.get($rootScope.serviceBase + "questions/" + questionId).then(function (response) {
        $scope.question = response.data;
      });
    }, function (response) {
      // failure
    });
  };

// Question Answer - responder

  $scope.answer = {"answer":{"question": {}, "user": {}}};
  $scope.postAnswer = function () {
    $scope.hideButton = false;
    $scope.answer.question = $scope.question;
    $scope.answer.user = $rootScope.userAuthenticated;

    var configPost = {
      headers: {
          'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
          'Accept': 'application/json;odata=verbose'
      }
    };
    $http.post($rootScope.serviceBase + "answers/", $scope.answer, configPost)
    .then(
      function (response) {
        $scope.answer.description = "";
        $scope.answers = $scope.getAllAnswers();
        $scope.question.numberAnswers++;
        $http.put($rootScope.serviceBase + '/users/assign/xp/10', $rootScope.userAuthenticated).then(function (response) {
          $rootScope.userAuthenticated = response.data;
        });
        var myPopup = $ionicPopup.show({
          title: 'Boaaaa, ganhou +10 xp!'
        });
        $timeout(function() {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 2000);
      },
      function (response) {
        // failure
      }
    );
  };

  $scope.countAnswer = function (question) {
    $http.get($rootScope.serviceBase + "answers/count/question/" + question.id).then(function (response) {
      return response.data;
    });
  };

// Botao show hide input answer
  $scope.toAnswer = function () {
    $scope.hideButton = true;
  };

  $scope.hideInputAnswer = function () {
    $scope.hideButton = false;
  };

// GetAll Answers - atualiza lista de respostas
  $scope.getAllAnswers = function () {
    $http.get($rootScope.serviceBase + "answers/question/" + $scope.question.id).then(function (response) {
      $scope.answers = response.data;
      $scope.numberAnswers = response.data.length;
    });
  };

// GetAllCommentAnswer - listar comentarios de resposta
  $scope.comments = [];
  $scope.listComments = function (answer) {
    $http.get($rootScope.serviceBase + "comment/answers/answer/" + answer.id)
      .then(
        function (response) {
          $scope.comments = response.data;
        }, function (error) {
          // failure
        }
      );
  };

  $scope.commentSelected = function (answer) {
    $scope.selected = answer.id;
    $scope.listComments(answer);
  };

// Botao show hide input comment
  $scope.toComment = function (answer) {
    $scope.hideButtonComment = true;
    $scope.commentSelected(answer);
  };

  $scope.hideInputComment = function () {
    $scope.selected = "";
  };

// Post Comment Answer - comentar resposta
  $scope.comment = {user: {}, answer: {}};
  $scope.postCommentAnswer = function (answer) {
    $scope.comment.answer = answer;
    $scope.comment.user = $rootScope.userAuthenticated;

    $http.post($rootScope.serviceBase + "comment/answers/", $scope.comment)
      .then(function (response) {
        $scope.comments.push(response.data);
        $scope.comment = {};
        $scope.getAllAnswers();
      }, function (error) {
        // failure
      });
  };

// fab button new question
  $scope.newQuestion = function() {
    $state.go('app.question-new');
  };

// botao cancelar nova pergunta
  $scope.cancelNewQuestion = function() {
    $state.go('app.forum');
  };

//Questions//

// Post - Cria question
  $scope.createQuestion = function (question) {
    question.user = $rootScope.userAuthenticated;
    $http.post($rootScope.serviceBase + "questions/", question)
      .then(
        function (response) {
          getAll(function (questions) {
            $state.go('app.question-answer', {id:response.data.id});
            $rootScope.questions = questions;
          });
          $scope.question = {};
          $http.put($rootScope.serviceBase + '/users/assign/xp/5', $rootScope.userAuthenticated).then(function (response) {
              $rootScope.userAuthenticated = response.data;
            var myPopup = $ionicPopup.show({
              title: 'Em dúvida? +5 de xp para você!'
            });
            $timeout(function() {
              myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
          });
        },
        function (response) {
          // failure callback
        }
      );
  };

// Clean search
  $scope.cleanSearch = function() {
    console.log("clean");
    $scope.search = "";
  };

// Show edit question
  $scope.boolShowEdition = false;
  $scope.showEdition = function() {
    $scope.boolShowEdition = !$scope.boolShowEdition;
    console.log($scope.boolShowEdition);
  };

  $scope.toEdit = function() {
    $state.go('app.question-edit', {id: $stateParams.id});
  };

  $scope.cancelEditQuestion = function() {
    $state.go('app.question-answer', {id: $stateParams.id});
  };

  // Update - Edit question
  $scope.updateQuestion = function (question) {
    question.user = $rootScope.userAuthenticated;
    $http.put($rootScope.serviceBase + "questions/", question)
      .then(
        function (response) {
          getAll(function () {
            $ionicHistory.goBack(-2);
          })
        },
        function (response) {
          // callback error
        }
      );
  };

  // Delete - Delete question
  $scope.deleteQuestion = function (question) {
    $http.delete($rootScope.serviceBase + "questions/" + question.id)
      .then(
        function (response) {
          getAll(function () {
            //$state.go('app.forum');
            $ionicHistory.goBack(-2);
          })
        },
        function (error) {
          //callback error
        }
      )
  };
})

.controller('RoomCtrl', function($scope, $stateParams, $state, $http, $rootScope, $ionicPopup, $timeout, $ionicHistory) {

  $scope.cancelNewRoom = function () {
    $state.go('app.rooms');
  }

  $scope.newRoom = function() {
    $state.go('app.room-new');
  };

  $scope.openRoom = function() {
    $state.go('app.classroom');
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
    }, 1000);
  }

})

.controller('RankCtrl', function($scope, $rootScope, $state, $http) {

  $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
    $scope.users = response.data;
  });

})

.controller('PerfilCtrl', function($scope, $stateParams, $state, $rootScope, $http) {
    $scope.config = {
      url: $rootScope.urlApi
    };

    $scope.user = {
      name: $rootScope.userAuthenticated.name,
      email: $rootScope.userAuthenticated.email
    };

   // var config = {        headers:{'Access-Control-Allow-Origin':'*'} };

    $scope.salvar = function (user) {

      var u = $rootScope.userAuthenticated;
      u.name = user.name;
      u.email = user.email;
      console.log(u);
      $http.put($rootScope.serviceBase + "users", u).then(function (response) {
         $rootScope.userAuthenticated = response.data;
        $state.go('app.perfil', {id: $stateParams.id});
      });
    }
  })

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $filter, $ionicPopup, $timeout, $ionicHistory) {

// Cadastrar - register

  $scope.register = function (user) {
    user.birth = $filter("date")(user.birth, 'yyyy-MM-dd');
    console.log(user);

    $http.post($rootScope.serviceBase + "users", user).then(function (response) {
      response.data.image = "img/default.png";
      var myPopup = $ionicPopup.show({
        title: 'Cadastrado com sucesso'
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 1000);
      $ionicHistory.goBack(-1);
    });
  };

});
