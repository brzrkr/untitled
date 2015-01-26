// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('fishbook', ['ionic', 'fishbook.controllers'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {

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
        url: "/spot",
        views: {
            'menuContent': {
                templateUrl: "templates/spots.html",
                controller: 'SpotsCtrl'
            }
        }
    })

    .state('app.spot', {
        url: "/spot/:spotId",
        views: {
            'menuContent': {
                templateUrl: "templates/spot.html",
                controller: 'SpotCtrl'
            }
        }
    })

    .state('app.users', {
        url: "/user",
        views: {
            'menuContent': {
                templateUrl: "templates/users.html",
                controller: 'UsersCtrl'
            }
        }
    })

    .state('app.user', {
        url: "/user/:userId",
        views: {
            'menuContent': {
                templateUrl: "templates/user.html",
                controller: 'UserCtrl'
            }
        }
    })

    .state('app.posts', {
        url: "/post",
        views: {
            'menuContent': {
                templateUrl: "templates/posts.html",
                controller: 'PostsCtrl'
            }
        }
    })

    .state('app.post', {
        url: "/post/:postId",
        views: {
            'menuContent': {
                templateUrl: "templates/post.html",
                controller: 'PostCtrl'
            }
        }
    })

    .state('app.conversations', {
        url: "/conversation",
        views: {
            'menuContent': {
                templateUrl: "templates/conversations.html",
                controller: 'ConversationsCtrl'
            }
        }
    })

    .state('app.conversation', {
        url: "/conversation/:conversationId",
        views: {
            'menuContent': {
                templateUrl: "templates/conversation.html",
                controller: 'ConversationCtrl'
            }
        }
    })

    .state('app.messages', {
        url: "/message",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessagesCtrl'
            }
        }
    })

    .state('app.message', {
        url: "/message/:messageId",
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
