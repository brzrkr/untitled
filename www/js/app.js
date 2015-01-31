// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('fishbook', ['ionic', 'fishbook.controllers', 'fishbook.services', 'LocalStorageModule'])

.constant('AUTH_EVENTS', {
    loginRequired: 'auth-login-required',
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
})

.run(function($ionicPlatform, $rootScope, $state, AUTH_EVENTS, AuthService, localStorageService) {
    $ionicPlatform.ready(function() {

        $rootScope.previousState;
        $rootScope.currentState;
        $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
            $rootScope.previousState = from.name;
            $rootScope.currentState = to.name;
            console.log('Previous state:'+$rootScope.previousState)
            console.log('Current state:'+$rootScope.currentState)
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // user is not logged in
            if ((toState.data && toState.data.loginRequired) && !AuthService.isAuthenticated()) {
                event.preventDefault();

                console.log("Not authenticated", toState);
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                $state.go('app.auth');
            }
        });

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

.config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$injector', function ($injector) {
        return $injector.get('AuthInterceptor');
    }]);
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function (response) {
            console.log("Intercepted");
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                419: AUTH_EVENTS.sessionTimeout,
                440: AUTH_EVENTS.sessionTimeout
            }[response.status], response);

            return $q.reject(response);
        }
    };
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/root.html",
        controller: 'AppCtrl',
        // data: {
        //     loginRequired: false
        // }
    })

    .state('root', {
        url: "/",
        templateUrl: "templates/root.html",
        controller: 'AppCtrl',
        // data: {
        //     loginRequired: false
        // }
    })

    .state('app.tutorial', {
        url: '/tutorial',
        views: {
            'rootContent': {
                templateUrl: 'templates/tutorial.html',
                controller: 'TutorialCtrl'
            }
        },
        data: {
            loginRequired: false
        }
    })

    .state('app.auth', {
        url: '/auth',
        views: {
            'rootContent': {
                templateUrl: 'templates/auth.html',
                controller: 'AuthCtrl'
            }
        },
        data: {
            loginRequired: false
        }
    })

    .state('app.tabs', {
        url: "/tabs",
        abstract: true,
        views: {
            'rootContent': {
                templateUrl: 'templates/menu.html'
            },
            'menuContent': {
                templateUrl: "templates/app.html",
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.spots', {
        url: "/spots",
        views: {
            'spots-tab': {
                templateUrl: "templates/spots.html",
                controller: 'SpotsCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.spot', {
        url: "/spots/:spotId",
        views: {
            'spots-tab': {
                templateUrl: "templates/spot.html",
                controller: 'SpotCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.users', {
        url: "/users",
        views: {
            'menuContent': {
                templateUrl: "templates/users.html",
                controller: 'UsersCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.user', {
        url: "/users/:userId",
        views: {
            'menuContent': {
                templateUrl: "templates/user.html",
                controller: 'UserCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.posts', {
        url: "/posts",
        views: {
            'menuContent': {
                templateUrl: 'templates/app.html'
            },
            'posts-tab@': {
                templateUrl: "templates/posts.html",
                controller: 'PostsCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.post', {
        url: "/posts/:postId",
        views: {
            'posts-tab': {
                templateUrl: "templates/post.html",
                controller: 'PostCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.post.comments', {
        url: "/posts/:postId/comments",
        views: {
            'posts-tab': {
                templateUrl: "templates/post.html",
                controller: 'PostCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.tabs.post.comment', {
        url: "/posts/:postId/comments/:commentId",
        views: {
            'posts-tab': {
                templateUrl: "templates/comment.html",
                controller: 'PostCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.conversations', {
        url: "/conversations",
        views: {
            'menuContent': {
                templateUrl: "templates/conversations.html",
                controller: 'ConversationsCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.conversation', {
        url: "/conversations/:conversationId",
        views: {
            'menuContent': {
                templateUrl: "templates/conversation.html",
                controller: 'ConversationCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.conversation.messages', {
        url: "/conversations/:conversationId/messages",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessagesCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.conversation.message', {
        url: "/conversations/:conversationId/messages/:messageId",
        views: {
            'menuContent': {
                templateUrl: "templates/message.html",
                controller: 'MessageCtrl'
            }
        },
        data: {
            loginRequired: true
        }
    });

    $urlRouterProvider.otherwise('/');
});
