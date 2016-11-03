var app = angular.module('starter.controllers', [])

app.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $rootScope, $state, $ionicPopup, $timeout) {

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
    $scope.closeLogin();
  };
});
