angular.module('fishbook', ['ionic', 'restangular', 'fishbookControllers', 'fishbookServices', 'LocalStorageModule'])

// shortcut constants for easier use of authentication events
.constant('AUTH_EVENTS', {
    loginRequired: 'auth-login-required',
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
})

.run(function($ionicPlatform, $rootScope, $state, AUTH_EVENTS, AuthService, localStorageService) {

    // device or browser is ready, LETS GO
    $ionicPlatform.ready(function() {

        // seems to only fire on phones
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("onDeviceReady");
        }

        // placeholders for state info
        $rootScope.previousState = "";
        $rootScope.currentState = "";

        // called after a state is transitioned to successfully
        $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {

            // save our previous and current state info, so we can go back to it if we need to
            $rootScope.previousState = from.name;
            $rootScope.previousStateParams = fromParams;
            $rootScope.currentState = to.name;

            console.log('Previous state: '+$rootScope.previousState)
            console.log('Current state: '+$rootScope.currentState)
        });


        // called before a state is transitioned to
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // determine if the state requires login, and check if the user is logged in if so
            if ((toState.data && toState.data.loginRequired) && !AuthService.isAuthenticated()) {

                // prevent transitioning to the state
                event.preventDefault();

                // fire off not authenticated event and transition to the login screen
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $state.go('app.auth.login');
            }
        });

        // called after the current controller changes
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

.config(function($ionicConfigProvider, $compileProvider, $httpProvider, RestangularProvider, localStorageServiceProvider) {

    // increase our view cache, keeps move views in memory (hmm?)
    $ionicConfigProvider.views.maxCache(20);

    // push our tabs down to the bottom on Android as well
    $ionicConfigProvider.tabs.position('bottom');

    // whitelist some uri's, seems to be needed sometimes for the camera
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

    // setup our auth interceptor, so we can listen for authentication related http response codes
    $httpProvider.interceptors.push(['$injector', function ($injector) {
        return $injector.get('AuthInterceptor');
    }]);

    // initialize restangular to use local development server for all requests
    RestangularProvider.setBaseUrl('http://fishbook.app/api');

    // setup restangular to play nice with our responses
    // response = {
    //     success: boolean
    //     data: list|object
    //     meta: object with extra stuff
    // }
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        //console.log(data, operation, what, url, response, deferred);

        var extractedData;

        extractedData = (data.data != undefined) ? data.data : data;
        extractedData.success = data.success;
        extractedData.message = data.message;
        extractedData.meta = data.meta;
        return extractedData;
    });
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
        // listen for authenticated related response codes and broadcast the appropriate authentication event
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
    })

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
            // created this state so we could transition to and from registration
            // while keeping the credentials in scope
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
        // resolve: {
        //     post: function(Restangular, $route) {
        //         return Restangular.one('posts', $route.current.params.postId).get();
        //     }
        // },
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

    // no other states were matched
    $urlRouterProvider.otherwise('/app');
});
