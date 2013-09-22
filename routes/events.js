var Firebase = require('firebase');
var _und = require("underscore");
var EventsRef = new Firebase('https://travelpal.firebaseio.com/events');

exports.info = function ( req, res) {
  var eventID = req.params.id;
  var eventRef = new Firebase(EventsRef.child(eventID).toString());
  eventRef.once("value", function( snapshot ){
    if(snapshot.val() == null ) {
      res.status(404).send("404 Event Not Found");
    }
    else{
      var evt = snapshot.val();
      evt.id = eventID;
      res.json(evt);
    }
  });
};

