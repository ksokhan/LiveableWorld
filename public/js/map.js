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

CityOverlay.prototype = new google.maps.OverlayView();

function CityOverlay(pos, item) {

    // Now initialize all properties.
    this.pos_ = pos;
    this.map_ = app.map;
    this.item_ = item;

    // We define a property to hold the image's div. We'll 
    // actually create this div upon receipt of the onAdd() 
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay
    this.setMap(app.map);
}

CityOverlay.prototype.onAdd = function() {

	var div = document.createElement('DIV');
	$(div).addClass('cityOverlay');
	
	var r = Raphael(div);
	    r.piechart(50, 50, this.item_.avg * 3 + 10, [22,12,19])
	    .attr({
		    'opacity': 0.6,
		    'stroke-width': 0
	    });
	    
	// Set the overlay's div_ property to this DIV
	this.div_ = div;
	
	// We add an overlay to a map via one of the map's panes.
	// We'll add this overlay to the overlayImage pane.
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
}

CityOverlay.prototype.draw = function() {
	
	var overlayProjection = this.getProjection();
	
	// Retrieve the southwest and northeast coordinates of this overlay
	// in latlngs and convert them to pixels coordinates.
	// We'll use these coordinates to resize the DIV.
	var pxPos = overlayProjection.fromLatLngToDivPixel(this.pos_);
	
	// Resize the image's DIV to fit the indicated dimensions.
	var div = this.div_;
	div.style.left = pxPos.x + 'px';
	div.style.top = pxPos.y + 'px';
	//div.style.width = (ne.x - sw.x) + 'px';
	//div.style.height = (sw.y - ne.y) + 'px';
}

CityOverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
}

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

$(window).load(app.init);


$('.pills li').click(function() {
	$(this).siblings('.active').removeClass('active');
	$(this).addClass('active');
});
