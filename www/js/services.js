angular.module('fishbook.services', ['ngResource'])

// .factory('Session', function ($resource) {
//   return $resource('http://localhost:5000/sessions/:sessionId');
// });

.factory('Spot', function($resource) {
  return $resource('http://fishbook-server.app/api/spot/:id');
})

.factory('User', function($resource) {
  return $resource('http://fishbook-server.app/api/user/:id');
})

.factory('Post', function($resource) {
  return $resource('http://fishbook-server.app/api/post/:id');
})

.factory('Conversation', function($resource) {
  return $resource('http://fishbook-server.app/api/conversation/:id');
})

.factory('Message', function($resource) {
  return $resource('http://fishbook-server.app/api/message/:id');
});
