app.controller('RankCtrl', function($scope, $rootScope, $state, $http) {

  $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
    $scope.users = response.data;
  });

});
