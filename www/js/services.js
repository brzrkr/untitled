angular.module('fishbook.services', ['ngResource'])

// .factory('Session', function ($resource) {
//   return $resource('http://localhost:5000/sessions/:sessionId');
// });

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

.factory('$localStorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('AuthService', function ($http, Session) {
  var authService = {};

  authService.login = function (credentials) {
    return $http
      .post('http://fishbook.app/api/login', credentials)
      .then(function (res) {
        Session.create(res.data.user.key, res.data.user.id);
        $localStorage.setObject('session', Session);
        $localStorage.setObject('authUser', res.data.user);
        return res.data.user;
      });
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  return authService;
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
