var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.listTravels = function( req, res) {
  var userName = req.params.name;
  var currentUserID = null;
  new Firebase("https://travelpal.firebaseio.com/users").once("value", function( snapshot ) {
    var users = snapshot.val(); 
    for(var userID in users){
      var user = users[userID];
      console.log(user);
      if(user.name == userName) currentUserID = userID;
    }
    if(currentUserID == null) { 
      res.status(404).send("cannot create travel with undefined user");
      return;
    }
    firebaseRootRef.once("value", function( snapshot ) {
      var myTravels = _und.filter(snapshot.val(), function(travel, travelID) {
        travel.id = travelID;
        return currentUserID in travel.users;
      }); 
      var myTravels = _und.sortBy(myTravels, function(travel) { return travel.time[0]});
      
      res.json(myTravels);  
    });
  });
};

exports.getOpenTravel = function( req, res ) {
  var userName = req.params.name;
  var currentUserID = null;
  new Firebase("https://travelpal.firebaseio.com/users").once("value", function( snapshot ) {
    var users = snapshot.val(); 
    for(var userID in users){
      var user = users[userID];
      console.log(user);
      if(user.name == userName) currentUserID = userID;
    }
    if(currentUserID == null) { 
      res.status(404).send("cannot create travel with undefined user");
      return;
    }
    var travelsRef = new Firebase("https://travelpal.firebaseio.com/travels").once("value", function (snapshot) {
      var currentTimestamp = new Date().getTime();
      var travels = snapshot.val();

      var openTravel = _und.find(travels , function(travel, travelID) {
        travel.id = travelID; 
        return ('time' in travel && (travel.time.length == 1 || travel.time[2] >= currentTimestamp));  
      });
      openTravel.events = _und.map(openTravel.events, function(evt, eventID) {
        return eventID;  
      });
      res.json(openTravel);
    });
  });
};

