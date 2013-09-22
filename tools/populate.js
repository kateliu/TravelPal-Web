#!/usr/bin/env node

// Requires
var async = require('async');
var firebase = require('firebase');

// Root reference
var rootRef = new firebase('https://travelpal.firebaseio.com/');

var id = function(child) {
  return rootRef.child(child).push().name();
};

//
// Users
//
var users = {};
users['Sean']   = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/3/000/24b/0b9/25328d7.jpg'};
users['Clyde']  = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/2/000/188/324/1ef2688.jpg'};
users['Lydian'] = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/3/005/00f/11c/054c9ac.jpg'};
users['Dan']    = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/5/000/291/0cf/035a4e5.jpg'};
users['Kate']   = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/1/000/1ec/0fd/2e82dbb.jpg'};
users['Owen']   = {imageUrl: 'http://m.c.llnw.licdn.com/media/p/6/000/1ea/28f/3eebfe9.jpg'};
var userIds = Object.keys(users);

//
// Events
//
var events = {};

var createEvent = function(eventInfo) {
  var eventId = id('events');
  var event = {
    description: eventInfo.description,
    time: eventInfo.time,
    location: eventInfo.location,
    users: {},
    photos: {},
    expenses: {}
  };

  eventInfo.users.forEach(function(userId) {
    event.users[userId] = true;
  });

  eventInfo.photos.forEach(function(photoUrl) {
    var photoId = id('events/' + eventId + '/photos');
    event.photos[photoId] = photoUrl;
  });

  eventInfo.expenses.forEach(function(expenseInfo) {
    var expenseId = id('/events/' + eventId + '/expenses');
    var expense = {
      description: expenseInfo.description,
      cost: expenseInfo.cost,
      paidBy: expenseInfo.paidBy,
      payers: {}
    };

    expenseInfo.payers.forEach(function(payerId) {
      expense.payers[payerId] = true;
    });

    event.expenses[expenseId] = expense;
  });

  events[eventId] = event;
};

createEvent({
  description: 'Lunch at Ferry Plaza Seafood',
  time: [
    new Date(2013, 8, 10, 12, 00).getTime(),
    new Date(2013, 8, 10, 13, 30).getTime()
  ],
  location: [37.795907,-122.39392],
  users: [userIds[0], userIds[1], userIds[2], userIds[3], userIds[4], userIds[5]],
  photos: [],
  expenses: [
    {
      'description': '',
      'cost': 84.9,
      'paidBy': userIds[1],
      'payers': [userIds[0], userIds[1], userIds[2], userIds[3], userIds[4], userIds[5]]
    }
  ]
});

createEvent({
  description: 'Giants vs Dodgers at At&T Park',
  time: [
    new Date(2013, 8, 10, 18, 30).getTime(),
    new Date(2013, 8, 10, 22, 00).getTime()
  ],
  location: [37.778262,-122.39081],
  users: [userIds[0], userIds[1], userIds[3], userIds[5]],
  photos: [
    'http://www.guide-to-baseball-betting.com/images/ATT_Park_Panorama.jpg',
    'http://2.bp.blogspot.com/-7w70JAQbwsg/To3z8yTDIFI/AAAAAAAAALg/UYOgWiu76E0/s1600/Giants5.JPG'
  ],
  expenses: [
    {
      'description': 'Ticket fare',
      'cost': 73,
      'paidBy': userIds[3],
      'payers': [userIds[0], userIds[1], userIds[3], userIds[5]]
    },
    {
      'description': 'Popcorn',
      'cost': 6.5,
      'paidBy': userIds[0],
      'payers': [userIds[0], userIds[3]]
    }
  ]
});

createEvent({
  description: 'Pier 39',
  time: [
    new Date(2013, 8, 10, 15, 00).getTime(),
    new Date(2013, 8, 10, 17, 00).getTime()
  ],
  location: [37.3971614,-122.0241209],
  users: [userIds[1], userIds[3], userIds[5]],
  photos: [
    'http://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Pier_39_San_Francisco_CA.JPG/1280px-Pier_39_San_Francisco_CA.JPG'
  ],
  expenses: []
});

createEvent({
  description: 'Fallingwater',
  time: [
    new Date(2013, 5, 16, 10, 00).getTime(),
    new Date(2013, 5, 16, 12, 30).getTime()
  ],
  location: [39.906774,-79.468084],
  users: [userIds[1], userIds[2], userIds[3]],
  photos: [
    'http://www.wright-house.com/frank-lloyd-wright/fallingwater-pictures/fallingwater-1.jpg'
  ],
  expenses: [
    {
      'description': 'Ticket fare',
      'cost': 25.5,
      'paidBy': userIds[2],
      'payers': [userIds[1], userIds[2], userIds[3]]
    }
  ]
});

createEvent({
  description: 'Kings Dominion',
  time: [
    new Date(2013, 5, 18, 8, 30).getTime(),
    new Date(2013, 5, 18, 18, 0).getTime()
  ],
  location: [37.842614,-77.446428],
  users: [userIds[2], userIds[3]],
  photos: [
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRY4DgEa5yM9rFdNJ6K2DsWTI6VpzoDESD65qFEMX5Ep6qxnp2arA'
  ],
  expenses: [
    {
      'description': 'Ticket fare',
      'cost': 36,
      'paidBy': userIds[2],
      'payers': [userIds[2], userIds[3]]
    }
  ]
});

var eventIds = Object.keys(events);

//
// Travels
//
var travels = {};

var createTravel = function(travelInfo) {
  var travelId = id('travels');
  var travel = {
    description: travelInfo.description,
    time: travelInfo.time,
    users: {},
    events: {}
  };

  travelInfo.events.forEach(function(eventId) {
    travel.events[eventId] = true;
    events[eventId].travel = travelId;

    for (var userId in events[eventId].users) {
      travel.users[userId] = true;
    }
  });

  travels[travelId] = travel;
};

createTravel({
  description: 'One day in San Fransisco',
  time: [
    new Date(2013, 8, 10, 9, 30).getTime(),
    new Date(2013, 8, 10, 22, 30).getTime()
  ],
  events: [eventIds[0], eventIds[1]]
});

createTravel({
  description: 'CMU Graduation Trip in Pittsburgh',
  time: [
    new Date(2013, 5, 15, 8, 0).getTime(),
    new Date(2013, 5, 20, 18, 0).getTime()
  ],
  events: [eventIds[2], eventIds[3]]
});

var deleteAllData = function(callback) {
  console.log('Deleting all data...');
  rootRef.remove(function(error) {
    callback(error);
  });
};

var insertCollection = function(collectionName, collection, callback) {
  console.log('Inserting ' + collectionName + '...');
  rootRef.child(collectionName).set(collection, function(error) {
    callback(error);
  });
};

var insertUsers = function(callback) {
  insertCollection('users', users, callback);
};

async.series([
  deleteAllData,
  insertCollection.bind(null, 'events', events),
  insertCollection.bind(null, 'travels', travels),
  insertCollection.bind(null, 'users', users)
],
function(error, results) {
  if (error) {
    console.log(error);
  }
  process.exit(0);
});
