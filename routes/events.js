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
Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

function getDistance( locA, locB) {
  locA = _und.map(locA, function(val) {return parseFloat(val);});
  locB = _und.map(locB, function(val) {return parseFloat(val);});
  var R = 6371; // km
  if(locA == undefined || locB == undefined || locA.length < 2 || locB.length < 2) return 1000000;
  var dLat = (locA[0]-locB[0]).toRad();
  var dLon = (locA[1]-locB[1]).toRad();
  var lat1 = locA[0].toRad();
  var lat2 = locB[0].toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

exports.findEvents = function(req, res) {
  var loc = req.body.location;
  var budget = req.body.budget; 
  var eventsRef = new Firebase("https://travelpal.firebaseio.com/events").on("value", function (snapshot) {
    var events = snapshot.val();
    events = _und.filter( events, function(evt, eventID) {
      evt.id = eventID; 
      var expenses = _und.reduce(evt.expenses, function(memo, expense){
        return memo + expense.cost;
      }, 0);
      var distance = getDistance(evt.location, loc); 
      return expenses <= budget && distance <= 2; 
    });
    res.json(events);
  });
};

exports.createExpense = function(req, res) {
  var eventId = req.params.id;
  var expenseInfo = req.body;
  var expensesRef = EventsRef.child(eventId + '/expenses');
  var expense = {
    description: expenseInfo.description,
    paidBy: expenseInfo.paidBy,
    cost: parseFloat(expenseInfo.cost),
    payers: {}
  };

  expenseInfo.people.split(/[ ,]+/).forEach(function(payer) {
    expense.payers[payer] = true;
  });

  expensesRef.push(expense, function(error) {
    if(error){
      res.status(404).send("400 Bad Request");
    }
    else{
      res.json(expense);
    }
  });
};
