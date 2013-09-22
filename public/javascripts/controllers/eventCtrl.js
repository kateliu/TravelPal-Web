'use strict';

travelpalApp.controller('eventCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef',
  function($scope, $routeParams, angularFire, firebaseRef) {
    console.log('eventCtrl: ' + $routeParams.eventId);

    var eventId = $routeParams.eventId;

    $scope.event = {};
    $scope.travel = {};
    $scope.users = {};

    angularFire(firebaseRef.event(eventId), $scope, 'event').then(function() {
      angularFire(firebaseRef.travel($scope.event.travel), $scope, 'travel');
    });

    angularFire(firebaseRef.users, $scope, 'users');
  }
]);
