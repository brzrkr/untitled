angular.module('fishbook.controllers', ['ionic', 'fishbook.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('SpotsCtrl', function($scope, Spot) {
    $scope.spots = [{
        lat: 26.092801,
        lng: -97.181454,
        title: "S.P.I",
        curPeople: 0,
        totalBeen: 0,
        id: 1
    }, {
        lat: 26.130081,
        lng: -97.909985,
        title: "Mercedes Waterfall",
        curPeople: 0,
        totalBeen: 0,
        id: 2
    }, {
        lat: 26.685060,
        lng: -97.42732,
        title: "Laguna Madre",
        curPeople: 0,
        totalBeen: 0,
        id: 3
    }, {
        lat: 26.15401,
        lng: -97.17807,
        title: "Cullen House",
        curPeople: 0,
        totalBeen: 0,
        id: 4
    }, {
        lat: 26.080610,
        lng: -97.204113,
        title: "Pirate's Landing Pier",
        curPeople: 0,
        totalBeen: 0,
        id: 5
    }];
})

.controller('UsersCtrl', function($scope, User) {
    $scope.users = [{
        name: "Nic Dienstbier",
        caughtTotal: 0,
        numSpots: 0,
        contestsWon: 0,
        phone: "9569007200",
        friends: 0,
        id: 1
    }, {
        name: "Mauricio Pina",
        caughtTotal: 0,
        numSpots: 0,
        contestsWon: 0,
        phone: "9565555555",
        friends: 0,
        id: 2
    }];
})

.controller('ConversationsCtrl', function($scope, Conversation) {
    $scope.conversations = [];
})

.controller('MessagesCtrl', function($scope, Message) {
    $scope.messages = [];
})

.controller('PostsCtrl', function($scope, Post) {
    $scope.posts = [{
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 1,
        person: 1,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 1
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 2,
        person: 1,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 2
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 3,
        person: 1,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 3
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 4,
        person: 1,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 4
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 5,
        person: 1,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 5
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 2,
        person: 2,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 6
    }, {
        type: "photo",
        likes: 0,
        comments: 0,
        spot: 3,
        person: 2,
        data: {
            text: "Hello world.",
            url: "http://google.com",
            image: "http://placehold.it/800x600",
            thumb: "http://placehold.it/150x150"
        },
        id: 7
    }];
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
