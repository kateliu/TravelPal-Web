
//Setup for firebase
var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.create = function (req, res) {
  var newTravel = req.body;
  var userName = newTravel.user;
  var userRef =  new Firebase("https://travelpal.firebaseio.com/users");
  var currentUserID = null;
  var currentTimeStamp = new Date().getTime();
  userRef.once("value", function( snapshot ) {
    var users = snapshot.val(); 
    for(var userID in users){
      var user = users[userID];
      if(user.name == userName) currentUserID = userID;
    }
    if(currentUserID == null) { 
      res.status(404).send("cannot create travel with undefined user");
      return;
    }
    newTravel.time = [currentTimeStamp];
    newTravel.users = [currentUserID];
    delete newTravel["user"];
    var travelID = firebaseRootRef.push(newTravel).name();

    var travelRef = new Firebase(firebaseRootRef.child(travelID).toString());
    travelRef.once("value", function( snapshot ) {
      res.json( { travelID: travelID, content: snapshot.val()});
    });
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
      res.json(snapshot.val().events);
    } 
  });
};

exports.createEvent = function (req, res ) {
  //var travelID = 

};

