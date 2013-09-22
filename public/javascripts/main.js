var travelpal = travelpal || {};
var travelpalApp = angular.module('TravelPalApp', ['firebase', 'ngRoute']);

travelpalApp.config(function($routeProvider) {
  $routeProvider.
  when("/", {controller: "HomeCtrl", templateUrl: "home.html"}).
  when('/travel/:travelId', {controller: "travelCtrl", templateUrl: "travel.html"}).
  when("/event/:eventId", {controller: "eventCtrl", templateUrl: "event.html"});
});

