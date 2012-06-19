var graph = {
	initialized: false,
	//r: Raphael("graph-holder"),

	hover_in: function () {
	    this.flag = graph.r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
	},
	hover_out: function () {
	    this.flag.animate({opacity: 0}, 300, function () {this.remove();});
	},
	draw: function() {
		if (this.initialized) { return false; }
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
			$('<tr></tr>')
				.append("<td class='city'>" + this.cit + " <em>" + this.reg + ", " + this.cnt + "</em></td>")
				.append("<td><div class='avg liveability'><div style='width: " + this.avg * 25 + "%'><i>" + Math.round(this.avg * 25) + "%</i></div></div></td>")
				.append("<td><div class='avg infra'><div style='width: " + this.sect_avg.infrastructure * 25 + "%'><i>" + Math.round(this.sect_avg.infrastructure * 25) + "%</i></div></div></td>")
				.append("<td><div class='avg culture'><div style='width: " + this.sect_avg.culture * 25 + "%'><i>" + Math.round(this.sect_avg.culture * 25) + "%</i></div></div></td>")
				.append("<td><div class='avg environ'><div style='width: " + this.sect_avg.environment * 25 + "%'><i>" + Math.round(this.sect_avg.environment * 25) + "%</i></div></div></td>")
				.appendTo('#graphs .graphTable');

			dat.push(this.avg);
		});

		//this.r.hbarchart(10, 30, 300, 220, dat).hover(this.hover_in, this.hover_out);
		$(".graphTable").tablesorter();

		this.initialized = true;
	}
};
