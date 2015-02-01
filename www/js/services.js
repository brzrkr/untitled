angular.module('fishbookServices', ['ionic', 'ngResource', 'LocalStorageModule'])

.factory('Spot', function($resource) {
    return $resource('http://fishbook.app/api/spots/:id');
})

.factory('User', function($resource) {
    return $resource('http://fishbook.app/api/users/:id');
})

.factory('Post', function($resource) {
    return $resource('http://fishbook.app/api/posts/:postId', {}, {
        update: {
            method: 'POST',
            params: {id: '@id'},
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {
                data._method = 'PUT';
                return data;
            }
        }
    });
})

.factory('Comment', function($resource) {
    return $resource('http://fishbook.app/api/posts/:postId/comments/:commentId');
})

.factory('Conversation', function($resource) {
    return $resource('http://fishbook.app/api/conversations/:id');
})

.factory('Message', function($resource) {
    return $resource('http://fishbook.app/api/conversations/messages/:id');
})

.factory('Catch', function($resource) {
    return $resource('http://fishbook.app/api/catches/:id');
})

.factory('AuthService', function ($http, Session, localStorageService) {

    return {
        login: function (credentials) {
            return $http
            .post('http://fishbook.app/api/login', credentials)
            .then(function (res) {
                if(res.data.success == true) {
                    Session.create(res.data.user.key, res.data.user.id);

                    localStorageService.set('session', Session);
                    localStorageService.set('currentUser', res.data.user);
                }

                return res.data;
            });
        },

        isAuthenticated: function () {
            return !!Session.userId;
        }
    };
})

.factory('Camera', function($q, $ionicActionSheet) {
    var camera = {}

    camera.getPicture = function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
            // Do any magic you need
            q.resolve(result);
        }, function(err) {
            q.reject(err);
        }, options);

        return q.promise;
    };

   // Show the action sheet
    camera.showActions = function() {
        $ionicActionSheet.show({
            buttons: [
                { text: 'From Camera' },
                { text: 'From Device' }
            ],

            //destructiveText: 'Delete',
            titleText: 'Upload Photo',
            cancelText: 'Cancel',
            cancel: function() {
            },
            buttonClicked: function(index) {
                if(index == 0) {
                    camera.getPicture().then(function(imageURI) {
                        console.log(imageURI);
                    }, function(err) {
                        console.err(err);
                    });

                } else if(index == 1) {
                    camera.getPicture({
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    }).then(function(imageURI) {
                        console.log(imageURI);
                    }, function(err) {
                        console.err(err);
                    });
                }

                return true;
            }
        });
    };

    return camera;
})

.service('Session', function () {
    this.create = function (sessionId, userId) {
        this.key = sessionId;
        this.userId = userId;
    };

    this.destroy = function () {
        this.key = null;
        this.userId = null;
    };

    return this;
});

