var Firebase = require('firebase');
var _und = require("underscore");
var EventsRef = new Firebase('https://travelpal.firebaseio.com/events');

exports.info = function ( req, res) {
  var eventID = req.params.id;
  console.log(eventID);
  var eventRef = new Firebase(EventsRef.child(eventID).toString());
  eventRef.once("value", function( snapshot ){
    if(snapshot.val() == null ) {
      res.status(404).send("404 Event Not Found");
    }
    else{
      res.json(snapshot.val());
    }
  });
};

