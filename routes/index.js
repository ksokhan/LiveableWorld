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