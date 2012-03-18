/*
 * GET home page.
 */

 // Globals

var gb = {
	header_title: 'Liveable World',
	header_description: 'Find the best place to live. Liveable World is an index of the most liveable places on earth. <a href="./about">Learn more</a> about why its different.'
}

exports.index = function(req, res){
	var e = {
		header_class: 'big',
		layout: 'layouts/home.ejs',
		header_title: gb.header_title,
		header_description: gb.header_description
	};
  	res.render('content/home', e);
};

exports.browse = function(req, res){
	var loc = req.params[0] ? req.params[0] : 'map';
	var e = {
		header_class: 'bar dark',
		layout: 'layouts/map.ejs',
		header_title: gb.header_title,
		header_description: gb.header_description
	};

  	res.render('content/' + loc, e);
};

exports.contribute = function(req, res){
	var e = {
		page_name: 'Contribute',
		header_class: 'big compressed',
		layout: 'layouts/search.ejs',
		header_title: gb.header_title,
		header_description: gb.header_description
	};

  	res.render('content/add', e);
};

exports.discover = function(req, res){
	var e = {
		page_name: 'Discover',
		header_class: 'big compressed',
		layout: 'layouts/search.ejs',
		header_title: gb.header_title,
		header_description: gb.header_description
	};

  	res.render('content/find', e);
};

///////////////////////////////////
/// Post routes


exports.ajaxdata = function(req, res){
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