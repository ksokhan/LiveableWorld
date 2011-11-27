$(function() {
	


	$('.slider>div').each(function() {
		$(this).draggable({
			axis: 'x',
			containment: 'parent',
			grid: [60, 60]
		});
	});

});