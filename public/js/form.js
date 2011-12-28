

$(function() {
	
	contribute_form = {
		ajax_el: null,
		place: {},
		validate: function() {
			
		},
		update: function( item )
		{
			// update inputs
			$('input#country').val(item.country);
			$('input#region').val(item.region);
			$('input#locX').val(item.lat);
			$('input#locY').val(item.lng);
			
			// update the internal var
			this.place.lat = item.lat;
			this.place.lng = item.lng;
			this.place.name = item.name;
			
			// update thumbnail after
			this.set_thumbnail();
		},
		set_thumbnail: function()
		{
			var zoom = typeof this.place.lng != 'undefined' ? 3 : 1;
			$('#location_preview').css('background', 'url(http://maps.googleapis.com/maps/api/staticmap?size=220x221&maptype=roadmap&sensor=false&zoom=' + zoom + '&markers=size:small|color:red|' + this.place.lat + ',' + this.place.lng + '&center=' + this.place.lat + ',' + this.place.lng + ') center center no-repeat');
		}
	}
	
	// autocomplete the city
	$('form #name').focus(function() {
		var item = {}
		$(this).val('');
		contribute_form.update(item);
	}).autocomplete({
		source: function( request, response ) {
			// stop last ajax request, if it exists.
			if (contribute_form.ajax_el) contribute_form.ajax_el.abort();
			
			contribute_form.ajax_el = $.ajax({
				url: "http://ws.geonames.org/searchJSON",
				dataType: "jsonp",
				data: {
					featureClass: "P",
					style: "full",
					maxRows: 12,
					name_startsWith: request.term
				},
				success: function(data) {
					$('.ui-autocomplete-loading').removeClass('ui-autocomplete-loading');
					response( $.map( data.geonames, function( item ) {
						return {
							label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
							country: item.countryName,
							region: item.adminName1,
							population: item.population,
							lat: item.lat,
							lng: item.lng,
							value: item.name
						}
					}));
				}
			});
		},
		minLength: 2,
		delay: 20,
		select: function(event, ui) 
		{
			contribute_form.update(ui.item);
		}
	})
	
	// form polyfill
	$('form').html5form();  

	// hide select boxes, to be replaced by sliders
	$("form select")
		.css('display', 'none')
		.after('<div class="slider" />');
		
	
	// ratings sliders
	$('.slider').slider({
		range: "min",
		value:0,
		max: 40,
		create: function() {
			$(this).after('<div class="marker one"></div><div class="marker two"></div><div class="marker three"></div>');
		},
		stop: function(e, ui) {
			
			// calculate which round value its closer to...
			var variance = ui.value % 10;
			var val = variance < 5 ? ui.value - variance : ui.value - variance + 10;
			
			// set dropdown value 
			//$(this).siblings('select').val(val / 10);
	
			// if its zero, show just a little bit of it.
			if (val == 0) val = 1;
				
			$(this).slider('value', val);
			
		}
	});


	// Popovers
	
	$('form label').twipsy({
		placement: 'above',
		offset: 9
	});
	
		
});