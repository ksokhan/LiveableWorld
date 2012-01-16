// geocoding
//http://maps.googleapis.com/maps/api/geocode/output?parameters

var lvstyle = [ { featureType: "water", stylers: [ { hue: "#0077ff" }, { saturation: -37 }, { lightness: 13 } ] },{ elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "administrative", elementType: "geometry", stylers: [ { lightness: 49 }, { visibility: "simplified" } ] },{ featureType: "poi", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "off" } ] },{ } ];

var mapOptions = {
  zoom: 2,
  center: new google.maps.LatLng(37.65323,-79.38318),
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapTypeControl: false,
  panControl: false,
  streetViewControl: false,
  styles: lvstyle,
  zoomControlOptions: {
     position: google.maps.ControlPosition.LEFT_BOTTOM
  }

};

var app = {
	markers : [],
	circles: [],
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
		var pos = new google.maps.LatLng(e.locX,e.locY);
		this.markers[i] = new google.maps.Marker({
	        position	: pos, 
	        map			: app.map,
	        title		: e.cit,
	        icon		: '/lib/images/pin.png',
	        shadow		: new google.maps.MarkerImage('/lib/images/pin_shadow.png',null,new google.maps.Point(0,0),new google.maps.Point(8,22)),
	        flat		: false
		});
		
		var circleOptions = {
			strokeWeight: 0,
		    fillColor	: "#f54275",
		    fillOpacity	: 0.35,
		    map			: app.map,
		    center		: pos,
		    radius		: (e.avg * 100000)
		}
		log(circleOptions.radius)
				
		this.circles[i] = new google.maps.Circle(circleOptions);
		
		this.windows[i] = new google.maps.InfoWindow({
    		content: '<h3>' + e.cit + '</h3><p>'
    				+ (e.reg ? e.reg + ', ' : '') + e.cnt + '</p><p>Overall average rating: ' + e.avg.toFixed(1) + '</p>'
		});
		
		google.maps.event.addListener(this.markers[i], 'click', function() {
  			app.windows[i].open(app.map,app.markers[i]);
		});
	}
}

$(window).load(app.init);


$('.pills li').click(function() {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
});
