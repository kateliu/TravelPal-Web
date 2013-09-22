'use strict';

travelpalApp.controller('eventCtrl', ['$scope', '$routeParams', 'angularFire', 'firebaseRef', 'gMapFact',
  function($scope, $routeParams, angularFire, firebaseRef, gMapFact) {
    console.log('eventCtrl: ' + $routeParams.eventId);

    var eventReady = false;

    $scope.eventId = $routeParams.eventId;
    $scope.event = {};
    $scope.travel = {};
    $scope.users = {};

    angularFire(firebaseRef.event($scope.eventId), $scope, 'event').then(function() {
      eventReady = true;
      angularFire(firebaseRef.travel($scope.event.travel), $scope, 'travel');
      gMapFact.init($scope.event.location, function(){
        gMapFact.addMarker($scope.event.location, $scope.event.description);
      });
    });

    angularFire(firebaseRef.users, $scope, 'users');

    $scope.getEventExpense = function() {
      if (!eventReady) { return 0; }

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


    $scope.effect = function(e, effect){
      //var elem = angular.element(e.srcElement);
      //console.log(e.srcElement);
      $(e.srcElement).parent().parent().find('img').toggleClass(effect);
      //elem.css('background', 'blue');
    };


  }

]);
