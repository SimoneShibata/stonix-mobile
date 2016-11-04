app.controller('ForumCtrl', function ($scope, $stateParams, $http, $rootScope, $filter, $state, $ionicSideMenuDelegate, $timeout, $ionicPopup, $ionicHistory, MyStorageService) {

  $rootScope.questions = [];
// getAll - questions
  function getAll(sucesso, falha) {
    $http.get($rootScope.serviceBase + "questions")
      .then(function (response) {
        $rootScope.questions = response.data;
        for (var i = 0; i < response.data.length; i++) {
          $rootScope.questions[i].lastUpdateFilter = $filter("date")(new Date($rootScope.questions[i].lastUpdate), 'dd/MM/yyyy HH:mm');
        }
        if (sucesso) sucesso($rootScope.questions);
      }, function (error) {
        if (falha) falha(error);
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
      $timeout(function () {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 2000);
    });
  };

  function getOne(id, success) {
    $http.get($rootScope.serviceBase + "questions/" + id).then(function (response) {
      $scope.question = response.data;
      $scope.question.lastUpdateFilter = $filter("date")(new Date($scope.question.lastUpdate), 'dd/MM/yyyy HH:mm');
      if (success) success();
      getAll(success);
    }, function (error) {
      // error
    });
  }

// getOne question
  if ($stateParams.id != null) {
    getOne($stateParams.id);
  }

  $scope.openQuestion = function (question) {
    $state.go('app.question-answer', {'id': question.id});
  };

////////////////// Answer //////////////////
// GetAll - Lista answers
  $http.get($rootScope.serviceBase + "answers/question/" + $stateParams.id).then(function (response) {
    $scope.answers = response.data;
    for (var i = 0; i < $scope.answers.length; i++) {
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

  $scope.answer = {"answer": {"question": {}, "user": {}}};
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
          $timeout(function () {
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
  $scope.newQuestion = function () {
    $state.go('app.question-new');
  };

// botao cancelar nova pergunta
  $scope.cancelNewQuestion = function () {
    $state.go('app.forum');
  };

//Questions//

// Post - Cria question
  $scope.createQuestion = function (question) {
    question.user = $rootScope.userAuthenticated;
    $http.post($rootScope.serviceBase + "questions/", question, app.header)
      .then(
        function (response) {
          getAll(function (questions) {
            $state.go('app.question-answer', {id: response.data.id});
            $rootScope.questions = questions;
          });
          $scope.question = {};
          $http.put($rootScope.serviceBase + '/users/assign/xp/5', $rootScope.userAuthenticated).then(function (response) {
            $rootScope.userAuthenticated = response.data;
            var myPopup = $ionicPopup.show({
              title: 'Em dúvida? +5 de xp para você!'
            });
            $timeout(function () {
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
  $scope.cleanSearch = function () {
    console.log("clean");
    $scope.search = "";
  };

// Show edit question
  $scope.boolShowEdition = false;
  $scope.showEdition = function () {
    $scope.boolShowEdition = !$scope.boolShowEdition;
    console.log($scope.boolShowEdition);
  };

  $scope.toEdit = function () {
    $state.go('app.question-edit', {id: $stateParams.id});
  };

  $scope.cancelEditQuestion = function () {
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
});
