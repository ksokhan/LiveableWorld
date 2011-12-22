

$(function() {
	
	contribute_form = {
		place: {},
		update_name: function( ui )
		{
			this.place.lat = ui.item.lat;
			this.place.lng = ui.item.lng;
			this.place.name = ui.item.name;
		},
		city_thumbnail: function() 
		{
			$('#location_preview').css('background', 'url(http://maps.googleapis.com/maps/api/staticmap?size=220x219&maptype=roadmap&sensor=false&zoom=8&center=' + contribute_form.place.lat + ',' + contribute_form.place.lng + ') center center no-repeat');
		}
	}
	
	
	
	// autocomplete the city
	$('form #name').autocomplete({
		source: function( request, response ) {
						$.ajax({
							url: "http://ws.geonames.org/searchJSON",
							dataType: "jsonp",
							data: {
								featureClass: "P",
								style: "full",
								maxRows: 12,
								name_startsWith: request.term
							},
							success: function(data) {
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
		delay: 50,
		select: function(event, ui) { 
			$('input#country').val(ui.item.country); 
			$('input#region').val(ui.item.region); 
			$('input#locX').val(ui.item.lat);
			$('input#locY').val(ui.item.lng);
			
			contribute_form.update_name(ui);
			contribute_form.city_thumbnail(ui);
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