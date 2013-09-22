
//Setup for firebase
var Firebase = require('firebase');
var _und = require("underscore");
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');
var Fiber = require("fibers");
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

exports.end = function (req, res) {
  var currentTimeStamp = new Date().getTime();
  var travelID = req.params.id; 
  var travelTimeRef = firebaseRootRef.child(travelID + "/time");
  travelTimeRef.update({1: currentTimeStamp});
  var travelRef = firebaseRootRef.child(travelID);
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
  var newEvent = {
    description: req.body.description,
    location: [req.body.latitude, req.body.longitude],
    time: [new Date().getTime()],
    travel: travelID
  }
  var eventID = eventsRef.push(newEvent).name();
  var eventJson = {}; 
  eventJson[eventID] = true;
  firebaseRootRef.child(travelID + "/events").update(eventJson);
  eventsRef.child(eventID).on("value", function(snapshot) {
    console.log(snapshot.val() );
    res.json({eventID: eventID, content: snapshot.val()}); 
  });
};

exports.summary = function (req, res) {
  var travelID = req.params.id;
  var travelRef = new Firebase('https://travelpal.firebaseio.com/travels').child(travelID).child("expenses");
  travelRef.on("value", function (snapshot){
    var expenses = snapshot.val();
    var people = {};
    for(var expenseID in expenses){
      var expense = expenses[expenseID];
      if( !(expense.paidBy in people)){
        people[expense.paidBy] = {'debt': 0, 'credit': 0};
      }
      people[expense.paidBy].credit += expense.cost;
      totalPayers = _und.reduce(expense.payers, function(memo, payer){ return memo + 1;} , 0);
      for(var payer in expense.payers) {
        if(!(payer in people)) {
          people[payer] = {'debt': 0, 'credit': 0};
        }
        people[payer].debt += expense.cost/totalPayers;
      }
    }
    for(var person in people){
      people[person].summary = people[person].credit - people[person].debt;
    }
    res.json(people);
  });
}
