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
	markers : [],
	windows: [], 
	locations: null,
	map: new google.maps.Map(document.getElementById("map_canvas"), mapOptions),
	init: function() 
	{
		app.get_data();
		//app.set_marker(37.65323,-79.38318);
	},
	get_data: function() {
		$.getJSON('/data/places', function(data) { 
			app.locations = data;
			$.each(app.locations, function(key) {
			    app.set_marker(this, key);
			});
		});
	},
	set_marker: function(e, i) 
	{
		
		
		this.markers[i] = new google.maps.Marker({
	        position: new google.maps.LatLng(e.locX,e.locY), 
	        map: app.map,
	        title: e.cit
		});
		
		this.windows[i] = new google.maps.InfoWindow({
    		content: '<h3>' + e.cit + '</h3><p>'
    				+ (e.reg ? e.reg + ', ' : '') + e.cnt + '</p>'
		});
		
		google.maps.event.addListener(this.markers[i], 'click', function() {
  			app.windows[i].open(app.map,app.markers[i]);
		});
	}
}

$(window).load(app.init);

