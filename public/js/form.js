$(function() {

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
							success: function( data ) {
								response( $.map( data.geonames, function( item ) {
									//console.log(item);
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
		delay: 100,
		autoFocus: true,
		select: function(event, ui) { 
			$('input#country').val(ui.item.country); 
			$('input#region').val(ui.item.region); 
			$('input#locX').val(ui.item.lat);
			$('input#locY').val(ui.item.lng);
		}
		
	})
	
	// form polyfill
	$('form').html5form();  

	$("form select")
		.css('display', 'none')
		.after('<div class="slider" />');
		
		$('.slider').slider({
			value:0,
			min: 0,
			max: 5,
			step: 1,
			animate: true,
			slide: function( event, ui ) {
				//$( "#amount" ).val( "$" + ui.value );
				console.log($(this).siblings('select').val());
				$(this).siblings('select').val(ui.value);
			}
		});

		
		
});