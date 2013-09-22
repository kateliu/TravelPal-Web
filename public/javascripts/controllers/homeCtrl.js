'use strict';

travelpalApp.controller('homeCtrl', ['$scope', 'angularFire', 'firebaseRef',
  function($scope, angularFire, firebaseRef) {
    console.log('homeCtrl');

    var eventsReady = false;
    var travelsReady = false;

    $scope.events = {};
    $scope.travels = {};
    $scope.users = {};
    $scope.query = "";

    angularFire(firebaseRef.events, $scope, 'events').then(function() {
      eventsReady = true;
      if(travelsReady){ $('.main-container').css('opacity', '1'); }
    });

    angularFire(firebaseRef.travels, $scope, 'travels').then(function() {
      travelsReady = true;
      if(eventsReady){ $('.main-container').css('opacity', '1'); }
    });

    angularFire(firebaseRef.users, $scope, 'users');

    $scope.scrollDown = function(){
      $('body').animate({ scrollTop: 266 }, 800);
    }

    $scope.getPerPersonExpense = function(travelId) {
      if (!eventsReady || !travelsReady) { return 0; }

      var userCount = 0;
      var userId;

      for (userId in $scope.travels[travelId].users) {
        userCount++;
      }

      return $scope.getTravelExpense(travelId) / userCount;
    };

    $scope.getTravelExpense = function(travelId) {
      if (!eventsReady || !travelsReady) { return 0; }

      var totalExpense = 0;
      var eventId;

      for (eventId in $scope.travels[travelId].events) {
        totalExpense = totalExpense + $scope.getEventExpense(eventId);
      }

      return totalExpense;
    };

    $scope.getEventExpense = function(eventId) {
      if (!eventsReady || !travelsReady || !$scope.events[eventId]) { return 0; }

      var expenses = $scope.events[eventId].expenses;
      var totalExpense = 0;
      var expenseId;

      for (expenseId in expenses) {
        totalExpense = totalExpense + expenses[expenseId].cost;
      }

      return totalExpense;
    };

    $scope.$on('$routeChangeStart', function(next, current) {
      $('.main-container').css('opacity', '0.3');
    });
  }
]);
