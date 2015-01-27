angular.module('fishbook.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $http, AuthService, $localStorage) {

    $scope.currentUser = null;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        $scope.auth = AuthService.login($scope.loginData);

        if(AuthService.isAuthenticated()) {
            $scope.closeLogin();
        }
    };
})

.controller('SpotsCtrl', function($scope, Spot) {
    // Get all spots
    $scope.spots = Spot.query();
})

.controller('UsersCtrl', function($scope, User) {
    // Get all users
    $scope.users = User.query();
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
    $scope.spot = Spot.get({spotId: $stateParams.spotId});
})

.controller('UserCtrl', function($scope, $stateParams, User) {
    $scope.user = User.get({userId: $stateParams.userId});
})

.controller('PostCtrl', function($scope, $stateParams, Post) {
    $scope.post = Post.get({postId: $stateParams.postId});
})

.controller('ConversationCtrl', function($scope, $stateParams, Conversation) {
    $scope.conversation = Conversation.get({conversationId: $stateParams.conversationId});
})

.controller('MessageCtrl', function($scope, $stateParams, Message) {
    $scope.message = Message.get({messageId: $stateParams.messageId});
});
