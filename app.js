
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var http = require('http');
var path = require('path');
var travels = require('./routes/travels');
var events = require('./routes/events');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/users/:name', users.listTravels);
app.get('/users/:name/open', users.getOpenTravel);

app.post('/travels/:id/events', travels.createEvent);
app.get('/travels', travels.list);
app.post('/travels', travels.create);
app.get('/travels/:id', travels.info);
app.get('/travels/:id/end', travels.end);
app.get('/travels/:id/events', travels.listEvents);

app.get('/events/:id', events.info);
app.post('/events/:id/expenses', events.createExpense);


//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
