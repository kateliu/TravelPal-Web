#!/usr/bin/env node

// Requires
var async = require('async');
var firebase = require('firebase');

// Root reference
var rootRef = new firebase('https://travelpal.firebaseio.com/');

var id = function(child) {
  return rootRef.child(child).push().name();
};

var users = {};
users[id('users')] = { name: 'Sean',   imageUrl: 'http://m.c.llnw.licdn.com/media/p/3/000/24b/0b9/25328d7.jpg' };
users[id('users')] = { name: 'Clyde',  imageUrl: 'http://m.c.llnw.licdn.com/media/p/2/000/188/324/1ef2688.jpg' };
users[id('users')] = { name: 'Lydian', imageUrl: 'http://m.c.llnw.licdn.com/media/p/3/005/00f/11c/054c9ac.jpg' };
users[id('users')] = { name: 'Kate',   imageUrl: 'http://m.c.llnw.licdn.com/media/p/1/000/1ec/0fd/2e82dbb.jpg' };
users[id('users')] = { name: 'Owen',   imageUrl: 'http://m.c.llnw.licdn.com/media/p/6/000/1ea/28f/3eebfe9.jpg' };
var userIds = Object.keys(users);

var travels = {};

var createTravel = function(travelInfo) {
  var travelId = id('travels');
  var travel = {
    description: travelInfo.description,
    time: travelInfo.time,
    users: {},
    events: {}
  };
  var event;
  var eventId;
  var i;

  travelInfo.users.forEach(function(userId) {
    travel.users[userId] = true;
  });

  for (i=0; i<travelInfo.events.length; ++i) {
    eventId = id('travels/' + travelId + '/events');
    event = {
      description: travelInfo.events[i].description,
      time: travelInfo.events[i].time,
      location: travelInfo.events[i].location,
      users: {},
      photos: {},
      expenses: {}
    }

    travelInfo.events[i].users.forEach(function(userId) {
      event.users[userId] = true;
    });

    travelInfo.events[i].photos.forEach(function(photoUrl) {
      var photoId = id('travels/' + travelId + '/events/' + eventId + '/photos');
      event.photos[photoId] = photoUrl;
    });

    travelInfo.events[i].expenses.forEach(function(expenseInfo) {
      var expenseId = id('travels/' + travelId + '/events/' + eventId + '/expenses');
      var expense = {
        description: expenseInfo.description,
        payers: {}
      };

      expenseInfo.payers.forEach(function(payerInfo) {
        var payerId = payerInfo.user;
        expense.payers[payerId] = {};
        expense.payers[payerId]['cost'] = payerInfo.cost;
      });

      event.expenses[expenseId] = expense;
    });

    travel.events[eventId] = event;
  }

  travels[travelId] = travel;
};

createTravel({
  description: 'One day in SF',
  time: [
    new Date(2013, 9, 10, 9, 30).getTime(),
    new Date(2013, 9, 10, 22, 30).getTime()
  ],
  users: [userIds[0], userIds[1], userIds[2], userIds[3], userIds[4]],
  events: [
    {
      description: 'Lunch at Ferry Plaza Seafood',
      time: [
        new Date(2013, 9, 10, 12, 00).getTime(),
        new Date(2013, 9, 10, 1, 30).getTime()
      ],
      location: [37.795907,-122.39392],
      users: [userIds[0], userIds[1], userIds[2], userIds[3], userIds[4]],
      photos: [],
      expenses: [
        {
          'description': '',
          'payers': [
            {user: userIds[0], cost: 14.15},
            {user: userIds[1], cost: 14.15},
            {user: userIds[2], cost: 14.15},
            {user: userIds[3], cost: 14.15},
            {user: userIds[4], cost: 14.15}
          ]
        }
      ]
    },
    {
      description: 'Giants vs Dodgers',
      time: [
        new Date(2013, 9, 10, 18, 30).getTime(),
        new Date(2013, 9, 10, 22, 00).getTime()
      ],
      location: [37.778262,-122.39081],
      users: [userIds[0], userIds[1], userIds[4]],
      photos: [
        'http://www.guide-to-baseball-betting.com/images/ATT_Park_Panorama.jpg',
        'http://2.bp.blogspot.com/-7w70JAQbwsg/To3z8yTDIFI/AAAAAAAAALg/UYOgWiu76E0/s1600/Giants5.JPG'
      ],
      expenses: [
        {
          'description': 'Ticket fare',
          'payers': [
            {user: userIds[0], cost: 18.25},
            {user: userIds[1], cost: 18.25},
            {user: userIds[4], cost: 18.25}
          ]
        },
        {
          'description': 'Popcorn',
          'payers': [
            {user: userIds[0],cost: 5.25}
          ]
        }
      ]
    }
  ]
});

createTravel({
  description: 'CMU Graduation',
  time: [
    new Date(2013, 5, 15, 8, 0).getTime(),
    new Date(2013, 5, 20, 18, 0).getTime()
  ],
  users: [userIds[1], userIds[2], userIds[3]],
  events: [
    {
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
          'payers': [
            {user: userIds[1], cost: 8.5},
            {user: userIds[2], cost: 8.5},
            {user: userIds[3], cost: 8.5}
          ]
        }
      ]
    },
    {
      description: 'Kings Dominion',
      time: [
        new Date(2013, 9, 12, 8, 30).getTime(),
        new Date(2013, 9, 12, 18, 0).getTime()
      ],
      location: [37.842614,-77.446428],
      users: [userIds[2], userIds[3]],
      photos: [
        'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRY4DgEa5yM9rFdNJ6K2DsWTI6VpzoDESD65qFEMX5Ep6qxnp2arA'
      ],
      expenses: [
        {
          'description': 'Ticket fare',
          'payers': [
            {user: userIds[0], cost: 12},
            {user: userIds[1], cost: 12},
            {user: userIds[4], cost: 12}
          ]
        }
      ]
    }
  ]
});

function deleteAllData(callback) {
  console.log('Deleting all data...');
  rootRef.remove(function(error) {
    callback(error);
  });
}

function insertCollection(collectionName, collection, callback) {
  console.log('Inserting ' + collectionName + '...');
  rootRef.child(collectionName).set(collection, function(error) {
    callback(error);
  });
}

function insertUsers(callback) {
  insertCollection('users', users, callback);
}

async.series([
  //authenticate,
  deleteAllData,
  insertCollection.bind(null, 'users', users),
  insertCollection.bind(null, 'travels', travels)
  /*
  insertItems,
  insertCategories,
  insertPortfolios,
  insertSessions,
  insertBackstages,
  */
],
function(error, results) {
  if (error) {
    console.log(error);
  }
  process.exit(0);
});
