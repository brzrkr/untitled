// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('fishbook', ['ionic', 'fishbookControllers', 'fishbookServices', 'LocalStorageModule'])

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

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("onDeviceReady");
        }

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

                $state.go('app.auth.login');
            }
        });

        $rootScope.$on('onControllerChanged', function(oldController, oldIndex, newController, newIndex) {
            console.log('Controller changed', oldController, oldIndex, newController, newIndex);
            console.log(arguments);
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

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(20);

    $ionicConfigProvider.tabs.position('bottom');
})

.config(function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
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
        templateUrl: "templates/root.html",
        controller: 'AppController',
        // data: {
        //     loginRequired: false
        // }
    })

    // .state('app', {
    //     url: "/app",
    //     abstract: true,
    //     templateUrl: "templates/main.html",
    //     controller: 'AppController',
    //     // data: {
    //     //     loginRequired: false
    //     // }
    // })

    .state('app.tutorial', {
        url: '/tutorial',
        templateUrl: 'templates/tutorial.html',
        controller: 'TutorialController',
        data: {
            loginRequired: false
        }
    })

    .state('app.main', {
        url: '/main',
        abstract: true,
        templateUrl: 'templates/main.html',
        data: {
            loginRequired: true
        }
    })


    .state('app.auth', {
        url: '/auth',
        abstract: true,
        templateUrl: 'templates/root.html',
        controller: function($scope, $rootScope) {
            $scope.credentials = {
                username: '',
                password: ''
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.auth.login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController',
        data: {
            loginRequired: false
        }
    })

    .state('app.auth.register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterController',
        data: {
            loginRequired: false
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

    .state('app.main.spots', {
        url: "/spots",
        views: {
            'spots-tab': {
                templateUrl: "templates/spots.html",
                controller: 'SpotsController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.spot', {
        url: "/spots/:spotId",
        views: {
            'spots-tab': {
                templateUrl: "templates/spot.html",
                controller: 'SpotController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.users', {
        url: "/users",
        views: {
            'menuContent': {
                templateUrl: "templates/users.html",
                controller: 'UsersController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.user', {
        url: "/users/:userId",
        views: {
            'menuContent': {
                templateUrl: "templates/user.html",
                controller: 'UserController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.posts', {
        url: "/posts",
        views: {
            'posts-tab': {
                templateUrl: "templates/posts.html",
                controller: 'PostsController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.post', {
        url: "/posts/:postId",
        views: {
            'posts-tab': {
                templateUrl: "templates/post.html",
                controller: 'PostController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.post.comments', {
        url: "/posts/:postId/comments",
        views: {
            'posts-tab': {
                templateUrl: "templates/comments.html",
                controller: 'CommentsController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.post.comment', {
        url: "/posts/:postId/comments/:commentId",
        views: {
            'posts-tab': {
                templateUrl: "templates/comment.html",
                controller: 'CommentController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.conversations', {
        url: "/conversations",
        views: {
            'menuContent': {
                templateUrl: "templates/conversations.html",
                controller: 'ConversationsController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.conversation', {
        url: "/conversations/:conversationId",
        views: {
            'menuContent': {
                templateUrl: "templates/conversation.html",
                controller: 'ConversationController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.conversation.messages', {
        url: "/conversations/:conversationId/messages",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessagesController'
            }
        },
        data: {
            loginRequired: true
        }
    })

    .state('app.main.conversation.message', {
        url: "/conversations/:conversationId/messages/:messageId",
        views: {
            'menuContent': {
                templateUrl: "templates/messages.html",
                controller: 'MessageController'
            }
        },
        data: {
            loginRequired: true
        }
    });

    $urlRouterProvider.otherwise('/app');
});
