'use strict';

travelpalApp.controller('eventCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef',
  function($scope, $routeParams, angularFire, firebaseRef) {
    console.log('eventCtrl: ' + $routeParams.eventId);

    var eventId = $routeParams.eventId;
    var eventReady = false;

    $scope.event = {};
    $scope.travel = {};
    $scope.users = {};

    angularFire(firebaseRef.event(eventId), $scope, 'event').then(function() {
      eventReady = true;

      angularFire(firebaseRef.travel($scope.event.travel), $scope, 'travel');
    });

    angularFire(firebaseRef.users, $scope, 'users');

    $scope.getEventExpense = function() {
      if (!eventReady) {
        return 0;
      }

      var expenses = $scope.event.expenses;
      var totalExpense = 0;
      var expenseId;
      var payers;
      var payerId;

      for (expenseId in expenses) {
        payers = expenses[expenseId].payers;
        for (payerId in payers) {
          totalExpense = totalExpense + payers[payerId].cost;
        }
      }

      return totalExpense;
    };
  }
]);
