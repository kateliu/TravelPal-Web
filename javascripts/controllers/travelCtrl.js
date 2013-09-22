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

    // gMapFact.init($scope.event.location, function(){
    //   gMapFact.addMarker($scope.event.location, $scope.event.description);
    // });

    angularFire(firebaseRef.travel($scope.travelId), $scope, 'travel').then(function() {
      travelReady = true;
    });

    angularFire(firebaseRef.users, $scope, 'users');

    $scope.getTravelExpense = function() {
      if (!eventsReady || !travelReady) { return 0; }

      var totalExpense = 0;
      var eventId;
      var eventsCount = 0;
      var eventsLocation = [0, 0];

      for (eventId in $scope.travel.events) {
        eventsCount++;
        eventsLocation[0] += $scope.events[eventId].location[0];
        eventsLocation[1] += $scope.events[eventId].location[1];
        totalExpense = totalExpense + $scope.getEventExpense(eventId);
      }

      gMapFact.init( [eventsLocation[0]/eventsCount, eventsLocation[1]/eventsCount], function(){
        for (eventId in $scope.travel.events) {
          gMapFact.addMarker($scope.events[eventId].location, $scope.events[eventId].description);
        }
      });

      return totalExpense;
    };

    $scope.getEventExpense = function(eventId) {
      if (!eventsReady || !travelReady) { return 0; }

      var expenses = $scope.events[eventId].expenses;
      var totalExpense = 0;
      var expenseId;

      for (expenseId in expenses) {
        totalExpense = totalExpense + expenses[expenseId].cost;
      }

      return totalExpense;
    };

    $scope.getUsersCount = function(eventId){
      var count = 0;
      if(eventId){
        for(var user in $scope.events[eventId].users){ count++; }
      } else{
        for(var user in $scope.travel.users){ count++; }
      }
      return count;
    }

  }
]);
