var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.listTravels = function( req, res) {
  var userName = req.params.name;
  firebaseRootRef.once("value", function( snapshot ) {
    var myTravels = _und.filter(snapshot.val(), function(travel, travelID) {
      travel.id = travelID;
      return userName in travel.users;
    }); 
    var myTravels = _und.sortBy(myTravels, function(travel) { return travel.time[0]});
    res.json(myTravels);  
  });
};

exports.getOpenTravel = function( req, res ) {
  var userName = req.params.name;
  var travelsRef = new Firebase("https://travelpal.firebaseio.com/travels").once("value", function (snapshot) {
    var currentTimestamp = new Date().getTime();
    var travels = snapshot.val();

    var openTravel = _und.find(travels , function(travel, travelID) {
      travel.id = travelID; 
      return ('time' in travel &&  userName in travel.users && (travel.time.length == 1 || travel.time[2] >= currentTimestamp));  
    });
    if(openTravel == null) res.json();
    else{
      openTravel.events = _und.map(openTravel.events, function(evt, eventID) {
        return eventID;  
      });
      res.json(openTravel);
    }
  });
};

