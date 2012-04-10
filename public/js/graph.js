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
			infra = this.averages.econ;
			$('<tr></tr>')
				.append("<td class='city'>" + this.cit + ", " + this.reg + ", " + this.cnt + "</td>")
				.append("<td><div class='avg liveability'><div style='width: " + this.avg * 25 + "%'>" + Math.round(this.avg * 10)/10 + "</div></div></td>")
				.append("<td><div class='avg infra'><div style='width: " + infra * 25 + "%'></div></div></td>")
				.append("<td><div class='avg culture'><div style='width: " + this.avg * 25 + "%'></div></div></td>")
				.append("<td><div class='avg environ'><div style='width: " + this.avg * 25 + "%'></div></div></td>")
				.appendTo('#graphTable');

			dat.push(this.avg);
		});

		//this.r.hbarchart(10, 30, 300, 220, dat).hover(this.hover_in, this.hover_out);
		$("#graphTable").tablesorter();

		this.initialized = true;
	}
};
