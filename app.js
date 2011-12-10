
/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'),
	mongo = require('mongoskin');

var app = express.createServer();

// Configuration

app.use(express.logger('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.compiler({ src: __dirname + '/public', enable: ['less'], autocompile: true }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/libs'));

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

/*app.configure('production', function(){
  app.use(express.errorHandler()); 
});*/


// DB setup
db = mongo.db('localhost:27017/liveableworld');
places = db.collection('Places');

// Routes

app.get('/', routes.index);
app.get('/discover', routes.discover);

app.get('/contribute', routes.contribute);
app.post('/contribute/submit', routes.submit_place)

app.get('/browse', function(req, res) {	res.redirect('/browse/map') });
app.get('/browse/:id', routes.browse);

// data
app.get('/discover/init', routes.database_init);
app.get('/cleardb', routes.database_clear);
app.get('/data', routes.database_test);

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);