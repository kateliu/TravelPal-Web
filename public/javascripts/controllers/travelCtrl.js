'use strict';

travelpalApp.controller('travelCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef',
  function($scope, $routeParams, angularFire, firebaseRef) {
    console.log('travelCtrl: ' + $routeParams.travelId);

    var travelId = $routeParams.travelId;

    $scope.travel = {};
    $scope.users = {};

    angularFire(firebaseRef.travel(travelId), $scope, 'travel');
    angularFire(firebaseRef.users, $scope, 'users');
  }
]);
