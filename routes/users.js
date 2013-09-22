exports.listTravels = function( req, res) {
  var userID = req.params.id;
  firebaseRootRef.once("value", function( snapshot ) {
    var myTravels = _und.filter(snapshot.val(), function(travel) {
      return userID in travel.users;
    }); 
    var myTravels = _und.sortBy(myTravels, function(travel) { return travel.time[0]});
    res.json(myTravels);  
  });
};

exports.getOpenTravel = function( req, res ) {
  var userID = req.params.id;

};

