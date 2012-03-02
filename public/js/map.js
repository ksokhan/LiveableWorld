// geocoding
//http://maps.googleapis.com/maps/api/geocode/output?parameters

// depends on google ajax api
if(google.loader.ClientLocation)
{
	visitor_lat = google.loader.ClientLocation.latitude;
	visitor_lon = google.loader.ClientLocation.longitude;
	//visitor_city = google.loader.ClientLocation.address.city;
	//visitor_region = google.loader.ClientLocation.address.region;
	//visitor_country = google.loader.ClientLocation.address.country;
	//visitor_countrycode = google.loader.ClientLocation.address.country_code;
} else {
	visitor_lat = "37.65323";
	visitor_lon = "-79.38318";
}

var lvstyle = [ { featureType: "water", stylers: [ { hue: "#0077ff" }, { saturation: -37 }, { lightness: 13 } ] },{ elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "administrative", elementType: "geometry", stylers: [ { lightness: 49 }, { visibility: "simplified" } ] },{ featureType: "poi", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "off" } ] },{ } ];

var mapOptions = {
  zoom: 3,
  minZoom: 2,
  maxZoom: 8,
  center: new google.maps.LatLng(visitor_lat,visitor_lon),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false,
  styles: lvstyle,
  zoomControlOptions: {
     position: google.maps.ControlPosition.LEFT_CENTER
  }

};


////////////////////////////////
// Main App object

var app = {
	zoomOverlayTo: 2, // map starts off at 2, so lets just set it here anyway.
	markers : [],
	circles: [],
	windows: [], 
	locations: null,
	boundary: new google.maps.LatLngBounds(new google.maps.LatLng(-90,-180), new google.maps.LatLng(90,180)),
	map: new google.maps.Map(document.getElementById("map_canvas"), mapOptions),
	init: function() {
		$.getJSON('/data/places', function(data) { 
			app.locations = data;
			$.each(app.locations, function(key) {
			    app.set_marker(this, key);
			});
		});
	},
	set_marker: function(e, i) 
	{
		
		///////////////////////////
		// draw marker
		var pos = new google.maps.LatLng(e.locX,e.locY);
		this.markers[i] = new google.maps.Marker({
	        position	: pos, 
	        map			: app.map,
	        title		: e.cit,
	        icon		: '/lib/images/pin.png',
	        shadow		: new google.maps.MarkerImage('/lib/images/pin_shadow.png',null,new google.maps.Point(0,0),new google.maps.Point(8,22)),
	        flat		: false
		});
		
		///////////////////////////
		// draw overlay
	    var overlay = new CityOverlay(pos, e);
	
	    ///////////////////////////
	    // draw infowindow
	    
		this.windows[i] = new google.maps.InfoWindow({
    		content: '<h3>' + e.cit + '</h3><p>'
    				+ (e.reg ? e.reg + ', ' : '') + e.cnt + '</p><p>Overall average rating: ' + e.avg.toFixed(1) + '</p>'
		});
		
		google.maps.event.addListener(this.markers[i], 'click', function() {
  			app.windows[i].open(app.map,app.markers[i]);
		});
	}
}

// limit world scroll? not working... 
app.map.center_changed = function() {
	if(! app.boundary.contains(app.map.getCenter())) {
      var C = app.map.getCenter();
      var X = C.lng();
      var Y = C.lat();
	
      var AmaxX = app.boundary.getNorthEast().lng();
      var AmaxY = app.boundary.getNorthEast().lat();
      var AminX = app.boundary.getSouthWest().lng();
      var AminY = app.boundary.getSouthWest().lat();

      if (X < AminX) {X = AminX;}
      if (X > AmaxX) {X = AmaxX;}
      if (Y < AminY) {Y = AminY;}
      if (Y > AmaxY) {Y = AmaxY;}

      //app.map.setCenter(new google.maps.LatLng(Y,X));
    }
}

$(window).load(app.init);


$('.pills li').click(function() {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
});
