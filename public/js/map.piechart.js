CityOverlay.prototype = new google.maps.OverlayView();

function makePie(e) {
	e.r_ = Raphael(e.div_);
	av = e.item_.sect_avg;

	return e.r_.piechart(100, 100, e.item_.avg * Math.pow(app.map.getZoom(),1.4), [av.infrastructure,av.culture,av.environment], {colors:["#ff0000","#ff6060","#ff9c9c"]})
		.attr({
			'opacity': 0.6,
			'stroke-width': 0,
			'stroke-opacity': 0
		});
}

function CityOverlay(pos, item) {
    // Now initialize all properties.
    this.pos_ = pos;
    this.map_ = app.map;
    this.item_ = item;
    this.pie_ = null;
    this.div_ = null;
    this.r_ = null;
    // Explicitly call setMap on this overlay
    this.setMap(app.map);
}

CityOverlay.prototype.onAdd = function() {
	var div = document.createElement('DIV');
	$(div).addClass('cityOverlay');
	this.div_ = div; // Set the overlay's div_ property to this DIV
	this.pie_ = makePie(this); // create the pie chart
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div); // insert the div to the google maps pane
}

CityOverlay.prototype.zoomChange = function() {
	$(this.div_).html(""); // clear the pie chart div, and re-create it
	this.pie_ = makePie(this);
}

CityOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var pxPos = overlayProjection.fromLatLngToDivPixel(this.pos_);

	// Resize the image's DIV to fit the indicated dimensions.
	var div = this.div_;
	div.style.left = pxPos.x + 'px';
	div.style.top = pxPos.y + 'px';

	if (app.zoomOverlayTo != app.map.getZoom()) { this.zoomChange(); }
}

CityOverlay.prototype.click = function() {
	log('hovered');

}

CityOverlay.prototype.onRemove = function() {
	this.div_.parentNode.removeChild(this.div_);
	this.div_ = null;
}