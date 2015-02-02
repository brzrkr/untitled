angular.module('fishbookServices', [])

.factory('AuthService', function ($http, Session, localStorageService, Restangular) {

    return {
        // method for actually logging the user in
        login: function (credentials) {

            // fire off our login request and return the response
            return $http.post('http://fishbook.app/api/login', credentials).then(function (res) {

                // we've logged in successfully
                if(res.data.success == true) {
                    // create our session
                    Session.create(res.data.user.key, res.data.user.id);

                    // persist our session and returned authenticated user
                    localStorageService.set('session', Session);
                    localStorageService.set('currentUser', res.data.user);

                    // set restangular to send our key with all request
                    Restangular.setDefaultRequestParams({ key: res.data.user.key });
                }

                return res.data;
            });
        },

        // shortucut for checking if a user is authenticated
        isAuthenticated: function () {
            return !!Session.userId;
        }
    };

})

.factory('Camera', function($q, $ionicActionSheet) {

    return {
        // method for actually retrieving a photo from the camera
        getPicture: function(options) {
            var q = $q.defer();

            // open camera for photo
            navigator.camera.getPicture(function(result) {

                // we have a photo
                // magic

                q.resolve(result);
            }, function(err) {

                // we couldn't retreive a photo
                // magic

                q.reject(err);
            }, options);

            return q.promise;
        },

        // show the action sheet allowingthe user to decide between camera, or photo from file
        showActions: function() {

            $ionicActionSheet.show({

                buttons: [
                    { text: 'From Camera' },
                    { text: 'From Device' }
                ],

                titleText: 'Upload Photo',
                cancelText: 'Cancel',

                cancel: function() {
                },

                buttonClicked: function(index) {

                    // user chose to take a photo with camera
                    if(index == 0) {

                        // open user's camera for photo retreival
                        this.getPicture().then(function(imageURI) {

                            // we have a photo
                            console.log(imageURI);

                        }, function(err) {

                            // we could retrieve a photo
                            console.err(err);

                        });

                    } else if(index == 1) {
                        // user chose to get a photo from the phone's file system
                        // open the native photo retrieval system
                        this.getPicture({
                            quality: 50,
                            destinationType: navigator.camera.DestinationType.FILE_URI,
                            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                        }).then(function(imageURI) {

                            // we have a photo
                            console.log(imageURI);

                        }, function(err) {

                            // we could retrieve a photo
                            console.err(err);

                        });
                    }

                    return true;
                }
            });
        }
    };
})

// simple session singleton for holding our key and user id
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

