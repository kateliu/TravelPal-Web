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
  var userID = req.params.id;

};

