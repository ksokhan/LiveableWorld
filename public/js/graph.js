var graph = {
	r: Raphael("graph-holder"),
	hover_in: function () {
	    this.flag = graph.r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
	},
	hover_out: function () {
	    this.flag.animate({opacity: 0}, 300, function () {this.remove();});
	},

	draw: function() {
		/*nav.status = false;
		$.getJSON('/data/places', function(data) {
			app.locations = data;
			$.each(app.locations, function(key) {
			    app.set_marker(this, key);
			});
			nav.status = true; // done loading app
		});*/

		// borrowing data from map.js. its already loaded, so why not?

		var dat = [];
		$.each(app.locations, function(key) {
			$('<li></li>').html(this.cit + ", " + this.reg + ", " + this.cnt).appendTo('#names');
			dat.push(this.avg);
		});

		this.r.hbarchart(10, 30, 300, 220, dat).hover(this.hover_in, this.hover_out);
	}
};
