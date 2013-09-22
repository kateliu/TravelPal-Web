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
