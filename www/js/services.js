angular.module('fishbook.services', ['ngResource', 'LocalStorageModule'])

.factory('Spot', function($resource) {
    return $resource('http://fishbook.app/api/spots/:id');
})

.factory('User', function($resource) {
    return $resource('http://fishbook.app/api/users/:id');
})

.factory('Post', function($resource) {
    return $resource('http://fishbook.app/api/posts/:id');
})

.factory('Comment', function($resource) {
    return $resource('http://fishbook.app/api/posts/comments/:id');
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
                Session.create(res.data.key, res.data.id);

                localStorageService.set('session', Session);
                localStorageService.set('currentUser', res.data);

                return res.data;
            });
        },

        isAuthenticated: function () {
            return !!Session.userId;
        }
    };
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
