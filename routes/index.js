/*
 * GET home page.
 */

exports.index = function(req, res){
	
  	res.render('home', { 
		header_class: 'big',
		header_title: 'Liveable World',
		header_description: 'Find the best place to live. Liveable World is an experimental index of the most liveable places on earth through realtime data and collective statistics. Its a new way to examine our world.',
		layout: 'layouts/home.ejs'
	});
};

exports.browse = function(req, res){
	var loc = req.params[0] ? req.params[0] : 'map';
	
  	res.render('browse/' + loc , { 
		header_class: 'normal border',
		header_title: 'Liveable World: Browse data',
		layout: 'layouts/browse.ejs'
	});
};

exports.contribute = function(req, res){
  	res.render('contribute', { 
		header_class: 'big',
		header_title: 'Liveable World',
		header_description: 'Fill out the details below according to how important you feel each category for a place to live. And some additional text to describe the process of filling out the form.',
		layout: 'layouts/search.ejs'
	});		
};

exports.discover = function(req, res){
  	res.render('discover', { 
		header_class: 'big',
		header_title: 'Liveable World',
		header_description: 'Fill out the details below according to how important you feel each category for a place to live. And some additional text to describe the process of filling out the form.',
		layout: 'layouts/search.ejs'
	});		
};

///////////////////////////////////
/// Post routes


exports.database_test = function(req, res){
	var e = req.params.id ? req.params.id : 'places';
	if (e == "places") {
		places.find().toArray(function(err, items){
	    	res.send(items, { 'Content-Type': 'text/plain' });
		});
	} else {
		submissions.find().toArray(function(err, items){
	    	res.send(items, { 'Content-Type': 'text/plain' });
		});
	}
  	
};

exports.database_clear = function(req, res){
	submissions.remove({},{},function() {
	});
  	places.remove({},{},function() {
		res.send('complete.');
	});
};


exports.submit_place = function(req, res){
	var p = req.body.place;
	var s = req.body.rating;
	// create the loc tag; acts as id in matching ratings with location
	var item_id = p.locX + "-" + p.locY;
	
	// if the place is in db already, then fine. if not, then add.
	// inc counts the number of submissions.
	places.update(
		{
			loc		: item_id, 
			cit		: p.name, 
			reg		: p.region, 
			cnt		: p.country, 
			locX	: p.locX, 
			locY	: p.locY 
		}, 
		{ $inc: { count:1 } }, 
		{ upsert: true }
	);
	
	//append location tag to object
	s.loc = item_id;
	submissions.save(s);
	
  	res.redirect('/data');
};