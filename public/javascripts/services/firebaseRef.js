'user strict';

travelpalApp.service('firebaseRef', function() {
  var baseUrl = 'https://travelpal.firebaseio.com';
  var eventsUrl = baseUrl + '/events';
  var travelsUrl = baseUrl + '/travels';
  var usersUrl = baseUrl + '/users';

  var newRef = function(url) {
    return new Firebase(url);
  };

  this.events = newRef(eventsUrl);

  this.event = function(eventId) {
    return newRef(eventsUrl + '/' + eventId);
  };

  this.travels = newRef(travelsUrl);

  this.travel = function(travelId) {
    return newRef(travelsUrl + '/' + travelId);
  };

  this.users = newRef(usersUrl);
});
