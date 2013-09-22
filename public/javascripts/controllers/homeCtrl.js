'use strict';

travelpalApp.controller('homeCtrl', ['$scope', 'angularFire', 'firebaseRef',
  function($scope, angularFire, firebaseRef) {
    console.log('homeCtrl');

    $scope.events = {};
    $scope.travels = {};
    $scope.users = {};

    angularFire(firebaseRef.events, $scope, 'events');
    angularFire(firebaseRef.travels, $scope, 'travels');
    angularFire(firebaseRef.users, $scope, 'users');
  }
]);
