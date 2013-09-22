'use strict';

travelpalApp.controller('eventCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef', 'gMapFact',
  function($scope, $routeParams, angularFire, firebaseRef, gMapFact) {
    console.log('eventCtrl: ' + $routeParams.eventId);

    $scope.eventId = $routeParams.eventId;
    $scope.event = {};
    $scope.travel = {};
    $scope.users = {};

    angularFire(firebaseRef.event($scope.eventId), $scope, 'event').then(function() {
      angularFire(firebaseRef.travel($scope.event.travel), $scope, 'travel');
      gMapFact.init($scope.event.location, function(){
        gMapFact.addMarker($scope.event.location, $scope.event.description);
      });
    });

    angularFire(firebaseRef.users, $scope, 'users');
  }
]);
