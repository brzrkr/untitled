angular.module('starter.controllers', [])

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

.controller('SpotsCtrl', function($scope) {
    $scope.spots = [{
        lat: 0,
        lng: 0,
        title: "S.P.I",
        curPeople: 0,
        totalBeen: 0,
        id: 1
    }, {
        lat: 0,
        lng: 0,
        title: "Mercedes Waterfall",
        curPeople: 0,
        totalBeen: 0,
        id: 2
    }, {
        lat: 0,
        lng: 0,
        title: "Port of Brownsville",
        curPeople: 0,
        totalBeen: 0,
        id: 3
    }, {
        lat: 0,
        lng: 0,
        title: "Laguna Madre",
        curPeople: 0,
        totalBeen: 0,
        id: 4
    }];
})

.controller('PeopleCtrl', function($scope) {
    $scope.people = [{
        name: "Nic Dienstbier",
        caughtTotal: 0,
        numSpots: 0,
        contestsWon: 0,
        phone: "9569007200",
        id: 1
    }, {
        name: "Mauricio Pina",
        caughtTotal: 0,
        numSpots: 0,
        contestsWon: 0,
        phone: "9565555555",
        id: 2
    }];
})

.controller('SpotCtrl', function($scope, $stateParams) {})
.controller('PersonCtrl', function($scope, $stateParams) {});
