angular.module('fishbookControllers', ['LocalStorageModule'])

.controller('AppController', function($scope, $rootScope, $state, $ionicModal, AUTH_EVENTS, Session, AuthService, localStorageService) {

    $scope.currentUser = null;

    $scope.setCurrentUser = function(user) {
        $scope.currentUser = user;
    };

    $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
        console.log($state);
        $state.go('app.auth.login');
    });
    $scope.$on(AUTH_EVENTS.sessionTimeout, function() {
        console.log($state);
        $state.go('app.auth.login');
    });

    // Check if the user already did the tutorial and skip it if so
    if (localStorageService.get('didTutorial') == 1) {
        console.log('Skipping tutorial.');

        if(localStorageService.get('currentUser')) {
            $scope.setCurrentUser(localStorageService.get('currentUser'));
            Session.create($scope.currentUser.key, $scope.currentUser.id);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }

        if($scope.currentUser) {
            $state.go('app.main.posts');
        } else {
            $state.go('app.auth.login');
        }
    } else {
        console.log('Going to tutorial.');
        $state.go('app.tutorial');
    }
})

.controller('LoginController', function($scope, $state, $rootScope, $ionicPopup, User, AUTH_EVENTS, AuthService, Camera) {
    // Perform the login action when the user submits the login form
    $scope.login = function(credentials) {
        console.log("Logging in", credentials);

        AuthService.login(credentials).then(function(data) {
            //$scope.message = data.message;

            if(data.success == true) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $scope.setCurrentUser(data.user);

                if($rootScope.previousState !== 'root' &&
                   $rootScope.previousState !== 'app.tutorial' &&
                   $rootScope.previousState !== 'app.auth.login' &&
                   $rootScope.previousState !== 'app.auth.register') {
                    $state.go($rootScope.previousState);
                } else {
                    $state.go('app.main.posts');
                }
            } else {
                $ionicPopup.alert({
                    title: 'Error: Authentication',
                    template: data.message
                });
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }

        });
    };
})

.controller('RegisterController', function($scope, $state, $rootScope, $ionicPopup, User, Camera) {
    $scope.startUpload = function() {
        Camera.showActions();
    };

    // Perform the login action when the user submits the login form
    $scope.register = function(credentials) {
        console.log("Registering", credentials);

        $scope.user = new User();

        $scope.user.data = credentials;

        $scope.user.$save().then(function(res)  {
            console.log(res);

            if(res.success) {
                console.log("Registered successfully", res.message)

                //$scope.login(credentials);
                $state.go('app.auth.login');
            } else {
                $ionicPopup.alert({
                    title: res.message,
                    template: res.errors
                });
            }
        }).catch(function(req) {
            console.log("Error registering.", req);
        });
    };
})


.controller('TutorialController', function($scope, $state, $ionicSlideBoxDelegate, localStorageService) {
    // Called to navigate to the main app
    $scope.startApp = function() {
        $state.go('app.main.posts');

        // Set a flag that we finished the tutorial
        localStorageService.set('didTutorial', 1);

        console.log('Starting application now.');
    };

    if(localStorageService.get('didTutorial') == 1) {
        $scope.startApp();
    }

    $scope.slideIndex = 0;

    // Move to the next slide
    $scope.next = function() {
        $scope.$broadcast('slideBox.nextSlide');
    };

    $scope.back = function() {
        $scope.$broadcast('slideBox.prevSlide');
    }

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
})


.controller('SpotsController', function($scope, Spot) {
    // Get all spots
    $scope.spots = Spot.query();
})

.controller('UsersController', function($scope, User) {
    // Get all users
    $scope.users  = User.query();
})

.controller('ConversationsController', function($scope, Conversation) {
    // Get all conversations
    $scope.conversations = Conversation.query();
})

.controller('MessagesController', function($scope, Message) {
    // Get all messages
    $scope.messages = Message.query();
})

.controller('PostsController', function($scope, Post) {
    // Get all posts
    $scope.posts = Post.query();
})

.controller('SpotController', function($scope, $stateParams, Spot) {
    $scope.spot = Spot.get({
        spotId: $stateParams.spotId
    });
})

.controller('UserController', function($scope, $stateParams, User) {
    $scope.user = User.get({
        userId: $stateParams.userId
    });
})

.controller('PostController', function($scope, $stateParams, Post) {
    $scope.post = Post.get({
        postId: $stateParams.postId
    });
})

.controller('ConversationController', function($scope, $stateParams, Conversation) {
    $scope.conversation = Conversation.get({
        conversationId: $stateParams.conversationId
    });
})

.controller('MessageController', function($scope, $stateParams, Message) {
    $scope.message = Message.get({
        messageId: $stateParams.messageId
    });
});
