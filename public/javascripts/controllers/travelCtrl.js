'use strict';

travelpalApp.controller('travelCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef', 'gMapFact',
  function($scope, $routeParams, angularFire, firebaseRef, gMapFact) {
    console.log('travelCtrl: ' + $routeParams.travelId);

    var eventsReady = false;
    var travelReady = false;

    $scope.travelId = $routeParams.travelId;
    $scope.travel = {};
    $scope.events = {};
    $scope.users = {};

    angularFire(firebaseRef.events, $scope, 'events').then(function() {
      eventsReady = true;
    });

    angularFire(firebaseRef.travel($scope.travelId), $scope, 'travel').then(function() {
      travelReady = true;
    });

    angularFire(firebaseRef.users, $scope, 'users');

    $scope.getTravelExpense = function() {
      if (!eventsReady || !travelReady) {
        return 0;
      }

      var totalExpense = 0;
      var eventId;

      for (eventId in $scope.travel.events) {
        totalExpense = totalExpense + $scope.getEventExpense(eventId);
      }

      return totalExpense;
    };

    $scope.getEventExpense = function(eventId) {
      if (!eventsReady || !travelReady) {
        return 0;
      }

      var expenses = $scope.events[eventId].expenses;
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
