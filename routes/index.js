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
		places.find().limit(100).toArray(function(err, items){
	    	res.send(items, { 'Content-Type': 'text/plain' });
		});
	} else {
		submissions.find().limit(100).toArray(function(err, items){
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
	/*
		Calculate Averages
	*/ 
	calc = {
		submission_average: function(e, subm) {
			// divide by number of questions
			// it was already combined in the for loop
			e = e / question_num;
			return this.averages(subm.avg, e, subm.count);
		},
		averages: function(avg,new_val,tot) 
		{
			console.log('old avg -> '+ avg + '\n tot -> ' + tot + '\n new -> ' + new_val);
			new_val = (avg * tot + new_val)/ (tot + 1);
			//new_val = new_val.toFixed(8);// round to 8 decimal points
			return new_val;
		}	
	}
	
	var p = req.body.place;
	var r = req.body.rating;
	
	var question_num 	= 14,
		submission_avg 	= 0,
		item_id 		= p.locX + "-" + p.locY,
		avgs 			= {};
	
	// get data and parse the new value for averages
	places.find({loc: item_id}).limit(1).each(function(err, subm) {
		if (subm == undefined) var subm = {'count': 0, 'avg': 0};
		
		for (key in r) 
		{
			// convert to string
			r[key] = parseInt(r[key]);
			// calculate total of all values
			submission_avg += r[key];
					
			// update averages to new ones 
			// (calculate average without individual values) = multiply base num by number of items then add one and divide
			// first time city is added, create a blank subm
			if (subm[key] == undefined) subm[key] = 0; // if undefined, set as 0
			avgs[key] = calc.averages(subm[key], r[key], subm.count)
		}

		submission_avg = calc.submission_average(submission_avg, subm);
		
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
			{ 
				$inc: { count : 1 },
				$set: { averages  : avgs, avg: submission_avg }
			}, 
			{ upsert: true }
		);
		
		console.log(submission_avg);
		
		// save rating data into corresponding city object, appending to the appropriate arrays!
		submissions.update(
			{loc : item_id}, 
			{ 
				$push: 	r
			},
			{ upsert: true }
		);
	});
	
  	res.redirect('/browse');
};