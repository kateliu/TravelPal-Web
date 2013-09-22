
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
  res.json({param: req.params.id}); 
};
