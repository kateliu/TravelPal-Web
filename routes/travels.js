
//Setup for firebase
var Firebase = require('firebase');
var firebaseRootRef = new Firebase('https://travelpal.firebaseio.com/travels');

exports.create = function (req, res) {
  var newTravel = req.body;
  var id = firebaseRootRef.push(newTravel).name();
  res.json({id: id});
};

exports.list = function (req, res) {
  var all = [];
  firebaseRootRef.once("value", function(snapshot){ 
    all.push(snapshot.val());
    //res.json({params: req.params.id}); 
    res.json(all);
  });

};

exports.listEvents = function (req, res) {
  var travelID = req.params.id;
  console.log(travelID);
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
