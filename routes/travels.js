
//Setup for firebase
var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.create = function (req, res) {
  var newTravel = req.body;
  var userID = newTravel.user;
  newTravel.users = [userID];
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
      res.json(snapshot.val());
    } 
  });
};

exports.listEvents = function (req, res) {
  var travelID = req.params.id;
  var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
  travelRef.once("value", function(snapshot) {
    if(snapshot.val() == null) {
      res.status(404).send("404 Travel Not Found");
    }
    else{
      res.json(snapshot.val().events);
    } 
  });
};

exports.createEvent = function (req, res ) {
  //var travelID = 

};

