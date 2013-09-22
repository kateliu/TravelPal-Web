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
      $('.main-container').css('opacity', '1');
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

      for (expenseId in expenses) {
        totalExpense = totalExpense + expenses[expenseId].cost;
      }

      return totalExpense;
    };

    $scope.getUsersCount = function(){
      var count = 0;
      for(var user in $scope.event.users){ count++; }
      return count;
    }

    $scope.effect = function(e, effect){
      $(e.srcElement).parent().parent().find('img').toggleClass(effect);
    };

    $scope.$on('$routeChangeStart', function(next, current) {
      $('.main-container').css('opacity', '0.3');
    });

  }

]);
