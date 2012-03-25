

$(function() {

	contribute_form = {
		ajax_el: null,
		place: {},
		validate: function() {

		},
		update: function( item )
		{
			// update inputs
			$('input#country').val(item.country).siblings('span.displayonly').text(item.country);
			$('input#region').val(item.region).siblings('span.displayonly').text(item.region);
			$('input#locX').val(item.lat).siblings('span.displayonly').text(item.lat);
			$('input#locY').val(item.lng).siblings('span.displayonly').text(item.lng);


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
		//force clear spans
		$('form span.displayonly').text('');
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
		value:1,
		max: 40,
		create: function() {
			var slider_val = $(this).siblings(':input').val() * 10 == 0 ? 1 : $(this).siblings(':input').val() * 10;
			$(this).slider('value', slider_val);
			$(this).after('<div class="marker one"></div><div class="marker two"></div><div class="marker three"></div>');
		},
		stop: function(e, ui) {

			// calculate which round value its closer to...
			var variance = ui.value % 10;
			var val = variance < 5 ? ui.value - variance : ui.value - variance + 10;

			// set dropdown value
			//$(this).siblings('select').val(val / 10);

			// if its zero, show just a little bit of it. Stylistic change.
			if (val == 0) val = 1;

			$(this).slider('value', val);
			$(this).siblings(':input').val(parseInt(val/10));
		}
	});


	// Popovers

	$('form label').twipsy({
		placement: 'above',
		offset: 9,
		leftpos: '70px'
	});


	// Pagination

	function showPage(el) {
		$('.pagination_page').hide();
		$(el).show();

		// change menu
		var cur = $('.pagination .active');
		cur.removeClass('active');

		// add highlight to new item
		$('.pagination').find('a[href=' + el + "]").parent().not('.btns').addClass('active');

		// rig next and back buttons
		setTimeout(function() {
			$('.pagination .prev a').attr('href', $('.pagination').find('.active').prev().children('a').attr('href'));
			$('.pagination .next a').attr('href', $('.pagination').find('.active').next().children('a').attr('href'));

			// check if next and back need to be disabled...
			if (cur.prev().not('.btns').children('a').attr('href') == $('.pagination .prev a').attr('href')) {
				$('.pagination .prev').addClass('disabled');
			} else {
				$('.pagination .prev').removeClass('disabled');
			}

			if (cur.next().not('.btns').children('a').attr('href') == $('.pagination .next a').attr('href')) {
				$('.pagination .next').addClass('disabled');
			} else {
				$('.pagination .next').removeClass('disabled');
			}
		}, 0);

	}

	// show first page on load
	$('.pagination_page').hide();
	$('.pagination_page').first().show();

	$('.pagination a').click(function(e) {
		e.preventDefault();
		showPage($(this).attr('href'));
	});

});