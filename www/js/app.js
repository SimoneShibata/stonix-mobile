angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $http) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.serviceBase = "http://localhost:9991/api/";
    $rootScope.uiBase = "http://localhost/stonix-front-end/#/";

    $http.get($rootScope.serviceBase + "users/auth")
        .then(
            function (response) {
                $rootScope.userAuthenticated = response.data;
                $rootScope.logado = true;
                $http.get($rootScope.serviceBase + "users/ranking/punctuation").then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].id == $rootScope.userAuthenticated.id) {
                            $rootScope.rank = i + 1;
                        }
                    }
                });
            }
        );
    if ($rootScope.userAuthenticated == null) {
        $rootScope.logado = false;
    }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.forum', {
    url: '/forum',
    views: {
      'menuContent': {
        templateUrl: 'templates/forum/forum.html',
        controller: 'ForumCtrl'
      }
    }
  })

  .state('app.question-answer', {
    url: '/forum/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/forum/question-answer.html',
        controller: 'ForumCtrl'
      }
    }
  })

  .state('app.question-new', {
    url: '/forum/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/forum/question-new.html',
        controller: 'ForumCtrl'
      }
    }
  })

  .state('app.question-edit', {
    url: '/forum/edit/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/forum/question-edit.html',
        controller: 'ForumCtrl'
      }
    }
  })

  .state('app.rooms', {
    url: '/rooms',
    views: {
      'menuContent': {
        templateUrl: 'templates/rooms/rooms.html',
        controller: 'RoomCtrl'
      }
    }
  })

  .state('app.classroom', {
    url: '/classroom',
    views: {
      'menuContent': {
        templateUrl: 'templates/rooms/classroom.html',
        controller: 'RoomCtrl'
      }
    }
  })

  .state('app.activity', {
    url: '/activity',
    views: {
      'menuContent': {
        templateUrl: 'templates/rooms/activity.html',
        controller: 'RoomCtrl'
      }
    }
  })

  .state('app.ranking', {
    url: '/ranking',
    views: {
      'menuContent': {
        templateUrl: 'templates/ranking/ranking.html',
        controller: 'RankCtrl'
      }
    }
  })

  .state('app.perfil', {
    url: '/perfil',
    views: {
      'menuContent': {
        templateUrl: 'templates/perfil/perfil.html',
        controller: 'PerfilCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login/login.html',
        controller: 'AppCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/forum');
});
