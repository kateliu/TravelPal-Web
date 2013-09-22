
//Setup for firebase
var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.create = function (req, res) {
  var newTravel = req.body;
  var userName = newTravel.user;
  var currentTimeStamp = new Date().getTime();
  newTravel.time = [currentTimeStamp];
  newTravel.users = {}; 
  newTravel.users[userName] =  true ;
  newTravel.events = {};
  delete newTravel["user"];
  var travelID = firebaseRootRef.push(newTravel).name();

  var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
  travelRef.once("value", function( snapshot ) {
    res.json( { travelID: travelID, content: snapshot.val()});
  });

};

exports.list = function (req, res) {
  firebaseRootRef.once("value", function(snapshot){ 
    res.json(snapshot.val());
  });
};

exports.info = function (req, res ) {
  var travelID = req.params.id;
  var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
  travelRef.once("value", function(snapshot) {
    if(snapshot.val() == null) {
      res.status(404).send("404 Travel Not Found");
    }
    else{
      var travel = snapshot.val();
      travel.events = _und.map(travel.events, function( eventt, eventID) {
        return eventID;
      });
      res.json(travel);
    } 
  });
};

exports.end = function (req, res ) {
  var currentTimeStamp = new Date().getTime();
  var travelID = req.params.id; 
  var travelTimeRef = new Firebase(firebaseRootRef.child(travelID + "/time").toString());
  travelTimeRef.update({ 1:  currentTimeStamp});
  var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
  travelRef.on("value", function(snapshot){
    res.send(snapshot.val());
  });
}

exports.listEvents = function (req, res) {
  var travelID = req.params.id;
  var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
  travelRef.once("value", function(snapshot) {
    if(snapshot.val() == null) {
      res.status(404).send("404 Travel Not Found");
    }
    else{
      var travel = snapshot.val();
      travel.events = _und.map(travel.events, function( eventt, eventID) {
        return eventID;
      });
      res.json(travel.events);
    } 
  });
};

exports.createEvent = function (req, res ) {
  var travelID = req.params.id; 
  var eventsRef = new Firebase('https://travelpal.firebaseio.com/events');
  var newEvent = req.body;
  var eventID = eventsRef.push(newEvent).name();
  var eventJson = {}; 
  eventJson[eventID] = true;
  console.log(eventID);
  firebaseRootRef.child(travelID + "/events").push(eventJson);
  eventsRef.child(eventID).on("value", function(snapshot) {
    console.log(snapshot.val() );
    res.json({eventID: eventID, content: snapshot.val()}); 
  });
};

