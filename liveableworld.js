
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    mongo = require('mongoskin');

var app = express.createServer();

// Configuration

//app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.compiler({ src: __dirname + '/public', enable: ['less'], autocompile: true }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var  config = require('./config');
  // start db
  db = mongoskin.db(config.db);
});

app.configure('production', function(){
  app.use(express.errorHandler());
  // start db
  db = mongoskin.db(process.env.DB);
});


places = db.collection('Places');
submissions = db.collection('Submissions');

// Routes

app.get('/', routes.index);
app.get('/discover', routes.discover);

app.get('/contribute', routes.contribute);
app.post('/contribute/submit', routes.submit_place)

app.get('/browse', function(req, res) {	res.redirect('/browse/map') });
app.get('/browse/:id', routes.browse);

// data
app.get('/cleardb', routes.database_clear);
app.get('/data/:id', routes.ajaxdata);

app.get('/mu-0e970e83-b9189184-844a0d06-bd2f5237', function(req,res) { res.send('42'); });

app.listen(process.env.PORT || 3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
