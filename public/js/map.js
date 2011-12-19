// geocoding
//http://maps.googleapis.com/maps/api/geocode/output?parameters

var mapOptions = {
  zoom: 2,
  center: new google.maps.LatLng(37.65323,-79.38318),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false
};

var app = {
	locations: null,
	map: new google.maps.Map(document.getElementById("map_canvas"), mapOptions),
	init: function() 
	{
		app.get_data();
		//app.set_marker(37.65323,-79.38318);
	},
	get_data: function() {
		$.getJSON('/data', function(data) { 
			app.locations = data;
			$.each(app.locations, function(key) {
			    app.set_marker(this.locX, this.locY, this.name);
			});
		});
	},
	set_marker: function(x,y,text) 
	{
		var pos = new google.maps.LatLng(x,y);
		var marker = new google.maps.Marker({
	        position: pos, 
	        map: app.map,
	        title: text
		});
	}
}

$(window).load(app.init);

