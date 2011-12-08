/*
 * GET home page.
 */

exports.index = function(req, res){
	
  	res.render('home', { 
		header_class: 'big',
		header_title: 'Liveable World',
		header_description: 'Find the best place to live; Liveable World is an experimental index of the most liveable places on earth through realtime data and collective statistics. Its a new way to examine our world.'
	});
};

exports.browse = function(req, res){
  	res.render('browse', { 
		header_class: 'normal border',
		header_title: 'Liveable World: Browse data',
		layout: 'layouts/browse'
	});
};

exports.search = function(req, res){
  	res.render('search', { 
		header_class: 'big',
		header_title: 'Liveable World',
		header_description: 'Fill out the details below according to how important you feel each category for a place to live. And some additional text to describe the process of filling out the form.',
		layout: 'layouts/search'
	});		
};

exports.database_init = function(req, res){
  	// bootstrap with sample
	places.save({ name: "Toronto", num: 25 });
	places.save({ name: "Calgary", num: 5 });
	places.save({ name: "Ottawa", num: 7 });
	places.save({ name: "New York", num: 33 });
	res.send('done');
};

exports.database_test = function(req, res){
  	places.find().toArray(function(err, items){
		console.log(items);
	    res.send(items, { 'Content-Type': 'text/plain' });
	});
};

exports.database_clear = function(req, res){
  	places.remove();
};