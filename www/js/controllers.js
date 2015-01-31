angular.module('fishbook.controllers', ['LocalStorageModule'])

.controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, AUTH_EVENTS, Session, AuthService, localStorageService) {

    $scope.currentUser = null;

    $scope.setCurrentUser = function(user) {
        $scope.currentUser = user;
    };

    // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/auth.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    // }).then(function(modal) {
    //     $scope.authModal = modal;
    //     console.log($state);

    //     $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
    //         // if($state.current.data.loginRequired) {
    //             console.log($state);
    //             $scope.openAuth()
    //         // }
    //     });
    //     $scope.$on(AUTH_EVENTS.sessionTimeout, function() {
    //         // if($state.current.data.loginRequired) {
    //             console.log($state);
    //             $scope.openAuth()
    //         // }
    //     });
    // });
    //
    //
    // $scope.$on(AUTH_EVENTS.loginSuccess, function() {
    //     $state.go($rootScope.previousState);
    // });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
        console.log($state);
        $state.go('app.auth');
    });
    $scope.$on(AUTH_EVENTS.sessionTimeout, function() {
        console.log($state);
        $state.go('app.auth');
    });

    // Triggered in the login modal to close it
    // $scope.closeAuth = function() {
    //     $scope.authModal.hide();
    // };

    // // Open the login modal
    // $scope.openAuth = function() {
    //     $scope.authModal.show();
    // };

    // Check if the user already did the tutorial and skip it if so
    if (localStorageService.get('didTutorial') == 1) {
        console.log('Skipping tutorial.');

        $scope.setCurrentUser(localStorageService.get('currentUser'));
        Session.create($scope.currentUser.key, $scope.currentUser.id);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

        //if($scope.currentUser) {
            $state.go('app.tabs.posts');
        //}
    } else {
        console.log('Going to tutorial.');
        $state.go('app.tutorial');
    }
})

.controller('AuthCtrl', function($scope, $state, $rootScope, User, AUTH_EVENTS, AuthService) {

    $scope.credentials = {
        username: '',
        password: ''
    };

    // Perform the login action when the user submits the login form
    $scope.register = function(credentials) {
        console.log("Should register");
    };

    // Perform the login action when the user submits the login form
    $scope.login = function(credentials) {
        AuthService.login(credentials).then(function(user) {
            $scope.message = "Successfully logged in.";
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.setCurrentUser(user);

            if($rootScope.previousState !== 'root') {
                $state.go($rootScope.previousState);
            } else {
                $state.go('app.tabs.posts');
            }

        }, function() {
            $scope.message = "Invalid username or password. Please try again.";
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
})

.controller('TutorialCtrl', function($scope, $state, $ionicSlideBoxDelegate, localStorageService) {
    // Called to navigate to the main app
    $scope.startApp = function() {
        $state.go('app.tabs.posts');

        // Set a flag that we finished the tutorial
        localStorageService.set('didTutorial', 1);

        console.log('Starting application now.');
    };

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


.controller('SpotsCtrl', function($scope, Spot) {
    // Get all spots
    $scope.spots = Spot.query();
})

.controller('UsersCtrl', function($scope, User) {
    // Get all users
    $scope.users  = User.query();
})

.controller('ConversationsCtrl', function($scope, Conversation) {
    // Get all conversations
    $scope.conversations = Conversation.query();
})

.controller('MessagesCtrl', function($scope, Message) {
    // Get all messages
    $scope.messages = Message.query();
})

.controller('PostsCtrl', function($scope, Post) {
    // Get all posts
    $scope.posts = Post.query();
})

.controller('SpotCtrl', function($scope, $stateParams, Spot) {
    $scope.spot = Spot.get({
        spotId: $stateParams.spotId
    });
})

.controller('UserCtrl', function($scope, $stateParams, User) {
    $scope.user = User.get({
        userId: $stateParams.userId
    });
})

.controller('PostCtrl', function($scope, $stateParams, Post) {
    $scope.post = Post.get({
        postId: $stateParams.postId
    });
})

.controller('ConversationCtrl', function($scope, $stateParams, Conversation) {
    $scope.conversation = Conversation.get({
        conversationId: $stateParams.conversationId
    });
})

.controller('MessageCtrl', function($scope, $stateParams, Message) {
    $scope.message = Message.get({
        messageId: $stateParams.messageId
    });
});
