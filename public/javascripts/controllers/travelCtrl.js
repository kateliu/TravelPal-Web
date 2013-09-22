'use strict';

travelpalApp.controller('travelCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef',
  function($scope, $routeParams, angularFire, firebaseRef) {
    console.log('travelCtrl: ' + $routeParams.travelId);

    $scope.travelId = $routeParams.travelId;
    $scope.travel = {};
    $scope.events = {};
    $scope.users = {};

    $scope.getTotalExpense = function(){
      var total = 0;
      //for(var event in $scope.events){

      //}
      return total;
    };

    angularFire(firebaseRef.events, $scope, 'events');
    angularFire(firebaseRef.travel($scope.travelId), $scope, 'travel');
    angularFire(firebaseRef.users, $scope, 'users');

    $scope.expenseSum = $scope.events
  }
]);
