// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('fishbook', ['ionic', 'fishbook.controllers', 'fishbook.services'])

.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
})

.run(function($ionicPlatform, $rootScope, AuthService, AUTH_EVENTS) {
    $ionicPlatform.ready(function() {

        // $rootScope.$on('$stateChangeStart', function (event, next) {
        //     event.preventDefault();

        //     // user is not logged in
        //     if (!AuthService.isAuthenticated()) {
        //         $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        //     }
        // });

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

    });
})

// .config(['$httpProvider', function($httpProvider) {
//     $httpProvider.defaults.withCredentials = true;
// }])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        }
    })

    .state('app.browse', {
        url: "/browse",
        views: {
            'menuContent': {
                templateUrl: "templates/browse.html"
            }
        }
    })

    .state('app.spots', {
        url: "/spots",
        views: {
            'menuContent': {
                templateUrl: "templates/spots.html",
                controller: 'SpotsCtrl'
            }
        }
    })

    .state('app.spot', {
        url: "/spots/:spotId",
        views: {
            'menuContent': {
                templateUrl: "templates/spot.html",
                controller: 'SpotCtrl'
            }
        }
    })

    .state('app.users', {
        url: "/users",
        views: {
            'menuContent': {
                templateUrl: "templates/users.html",
                controller: 'UsersCtrl'
            }
        }
    })

    .state('app.user', {
        url: "/users/:userId",
        views: {
            'menuContent': {
                templateUrl: "templates/user.html",
                controller: 'UserCtrl'
            }
        }
    })

    .state('app.posts', {
        url: "/posts",
        views: {
            'menuContent': {
                templateUrl: "templates/posts.html",
                controller: 'PostsCtrl'
            }
        }
    })

    .state('app.post', {
        url: "/posts/:postId",
        views: {
            'menuContent': {
                templateUrl: "templates/post.html",
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.post.comments', {
        url: "/posts/:postId/comments",
        views: {
            'menuContent': {
                templateUrl: "templates/post.html",
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.post.comment', {
        url: "/posts/:postId/comments/:commentId",
        views: {
            'menuContent': {
                templateUrl: "templates/comment.html",
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.conversations', {
        url: "/conversations",
        views: {
            'menuContent': {
                templateUrl: "templates/conversations.html",
                controller: 'ConversationsCtrl'
            }
        }
    })

    .state('app.conversation', {
        url: "/conversations/:conversationId",
        views: {
            'menuContent': {
                templateUrl: "templates/conversation.html",
                controller: 'ConversationCtrl'
            }
        }
    })

    .state('app.conversation.messages', {
        url: "/conversations/:conversationId/messages",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.conversation.message', {
        url: "/conversations/:conversationId/messages/:messageId",
        views: {
            'menuContent': {
                templateUrl: "templates/message.html",
                controller: 'MessageCtrl'
            }
        }
    });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/spots');
});
