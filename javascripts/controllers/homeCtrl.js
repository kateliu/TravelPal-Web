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

    $scope.$on('$viewContentLoaded', function(next, current) {
      var frontImgs = [
        ['http://farm8.staticflickr.com/7222/7321674824_7e0c2d2842_c_d.jpg', 140],
        ['http://farm9.staticflickr.com/8512/8352608407_e6418d1179_o.jpg', 240],
        ['https://lh4.googleusercontent.com/-tWfWvc5SOrU/Uj8VeoSZVAI/AAAAAAAAAGM/t8neIJvuH0o/w800-h466-no/web_splash_next.jpg', 180]
      ];

      var selectedImg = 0;
      setInterval( function(){
        selectedImg = (selectedImg+1)%frontImgs.length;
        $('.jumbotron-bg img').fadeOut(1200, function(){
          $('.jumbotron-bg img').attr('src', frontImgs[selectedImg][0]);
          $('.jumbotron-bg img').css('margin-top', '-'+frontImgs[selectedImg][1]+'px');
        });
        $('.jumbotron-bg img').fadeIn(1200);
      }, 9000);

    });
  }
]);
