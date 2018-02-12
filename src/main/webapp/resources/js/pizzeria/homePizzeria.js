$(function() {
	$('.nav-pills li').on('click', function(event) {
		event.preventDefault();
		var $clickedElement = $(this);
		var contentToLoad = $clickedElement.data('content');

		$('#content').load(contentToLoad, function(data) {
			$('.nav-pills .active').removeClass('active');
			$clickedElement.addClass('active');
		});
	});
});