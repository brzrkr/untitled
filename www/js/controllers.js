angular.module('fishbookControllers', [])

.controller('AppController', function($scope, $rootScope, $state, AUTH_EVENTS, Session, AuthService, localStorageService, Restangular) {

    $scope.currentUser = null;

    // method for persisting our user data
    $scope.setCurrentUser = function(post) {
        $scope.currentUser = post;
    };

    // listen to not authenticated event so we can let the user login
    $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
        $state.go('app.auth.login');
    });

    // listen to the session timeout event so we can let the user login
    $scope.$on(AUTH_EVENTS.sessionTimeout, function() {
        $state.go('app.auth.login');
    });

    // check if the user already did the tutorial and skip it if so
    if (localStorageService.get('didTutorial') == 1) {

        // if we already have user data, let's "login" the user
        if(localStorageService.get('currentUser')) {

            // persist our saved data to the app
            $scope.setCurrentUser(localStorageService.get('currentUser'));
            Session.create($scope.currentUser.key, $scope.currentUser.id);

            // set restangular to send our key with all request
            Restangular.setDefaultRequestParams({ key: $scope.currentUser.key });

            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }

        // if our app recognizes our user data, let's move to the main app feed
        if($scope.currentUser) {
            $state.go('app.main.posts');
        } else {
            // otherwise force them to login again
            $state.go('app.auth.login');
        }
    } else {
        // user hasn't seen the tutorial yet, so let's transition them to the tutorial state
        $state.go('app.tutorial');
    }
})

.controller('LoginController', function($scope, $state, $rootScope, $ionicPopup, AUTH_EVENTS, AuthService) {

    // method for logging a user in when the form is submitted
    $scope.login = function(credentials) {
        console.log("Logging in", credentials);

        // pass credentials off to our authentication service
        AuthService.login(credentials).then(function(res) {

            // woot! we're logged in
            if(res.success == true) {

                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                // persist our user info
                $scope.setCurrentUser(res.user);

                // list of previous states to ignore
                var ignoreStates = ['root', 'app.tutorial', 'app.auth', 'app.auth.login', 'app.auth.register'];

                // transition to the previous state if not ignored
                if(_.indexOf(ignoreStates, $rootScope.previousState) !== -1) {
                    $state.go($rootScope.previousState, $rootScope.previousStateParams);
                } else {
                    // transition to our main app feed
                    $state.go('app.main.posts');
                }

            } else {

                // we couldn't login for some reason, show a popup with error messages
                $ionicPopup.alert({
                    title: 'Error: Authentication',
                    template: res.message
                });

                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

            }

        });
    };
})

.controller('RegisterController', function($scope, $state, $rootScope, $ionicPopup, User, Camera) {
    // method for showing the camera actions to load from file or camera
    $scope.startUpload = function() {
        Camera.showActions();
    };

    // method for executing the user creation process when the form is submitted
    $scope.register = function(credentials) {
        console.log("Registering", credentials);

        // fire off the request to create the user
        Restangular.post('users').then(function(res) {

            // we successfully created the user
            if(res.success) {
                console.log("Registered successfully", res.message)

                // move to the login screen, credentials should be autopopulated because
                // we inherit from the same parent state
                $state.go('app.auth.login');

            } else {

                // we couldn't create the user for some reason, show a popup with error messages
                $ionicPopup.alert({
                    title: res.message,
                    template: res.errors
                });

            }
        }).catch(function(req) {
            // unexpected error creating the user
            console.log("Error registering.", req);
        });
    };
})


.controller('TutorialController', function($scope, $state, $ionicSlideBoxDelegate, localStorageService) {
    // called to navigate to the main app
    $scope.startApp = function() {
        $state.go('app.main.posts');

        // set a flag that we finished the tutorial
        localStorageService.set('didTutorial', 1);

        console.log('Starting application now.');
    };

    // move to the app if we've already gone through the tutorial
    if(localStorageService.get('didTutorial') == 1) {
        $scope.startApp();
    }

    // make sure we start at first slide
    $scope.slideIndex = 0;

    // move to the next slide
    $scope.next = function() {
        $scope.$broadcast('slideBox.nextSlide');
    };

    // move to the previous slide
    $scope.back = function() {
        $scope.$broadcast('slideBox.prevSlide');
    }

    // called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
})


.controller('SpotsController', function($scope, Restangular) {
    // get all spots
    Restangular.all('spots').getList()
    .then(function(spots) {
        // returns a list of spots
        $scope.spots = spots;
    });
})

.controller('PostsController', function($scope, $anchorScroll, Restangular) {
    // get all posts
    Restangular.all('posts').getList()
    .then(function(posts) {
        // returns a list of posts
        $scope.posts = posts;
    });
})


.controller('UsersController', function($scope, Restangular) {
    // get all users
    Restangular.all('users').getList()
    .then(function(users) {
        // returns a list of users
        $scope.users = users;
    });
})

.controller('ConversationsController', function($scope, Restangular) {
    // get all conversations
    Restangular.all('conversations').getList()
    .then(function(conversations) {
        // returns a list of conversations
        $scope.conversations = conversations;
    });
})

.controller('MessagesController', function($scope, Restangular) {
    // get all messages
    Restangular.all('messages').getList()
    .then(function(messages) {
        // returns a list of messages
        $scope.messages = messages;
    });
})

.controller('CommentsController', function($scope, $stateParams, $ionicPopup, Restangular) {
    // method for executing the creation of comment
    $scope.create = function(commentData) {
        console.log("Creating new comment", comment);

        // fire off request with Restangular
        $scope.post.post('comments', comment).then(function(res)  {
            console.log(res);

            // we successfully created the comment
            if(res.success) {
                console.log("Comment added successfully", res.message)

                // add it to the main comment area without changing state
                $scope.post.comments.push(res);

                // reset the comment form
                $scope.comment = angular.copy({});
            } else {
                // we couldn't create the comment for some reason, show a popup with error messages
                $ionicPopup.alert({
                    title: res.message,
                    template: res.errors
                });
            }
        }).catch(function(req) {
            // unexpected error creating the comment
            console.log("Error creating comment.", req);
        });
    };
})

.controller('SpotController', function($scope, $stateParams, Restangular) {
})

.controller('PostController', function($scope, $stateParams, Restangular) {
    // copy the post resolved from Restangular into our scope
    $scope.post = post.$object;

    // shortcut for scrolling the view down to the comments
    $scope.gotoComments = function() {
      $location.hash('comments');
      $anchorScroll();
    };

    // shortcut for scrolling the view down to the comment creation area
    $scope.gotoCreateComment = function() {
      $location.hash('create-comment');
      $anchorScroll();
    };
})

.controller('PostCreateController', function($scope, $stateParams, Restangular) {
})

.controller('UserController', function($scope, $stateParams, Restangular) {
})

.controller('ConversationController', function($scope, $stateParams, Restangular) {
})

.controller('MessageController', function($scope, $stateParams, Restangular) {
})

.controller('CommentController', function($scope, $stateParams, Restangular) {
});
