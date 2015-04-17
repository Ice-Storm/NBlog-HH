define(['jquery'], function ($) {
	var floder = function (id) {
		var parentNode = $('#' + id).parent().parent();

		if (parentNode.next().css('display') == 'block') {

			parentNode.next().css({
				'display': 'none'
			});

			parentNode.css({
				'margin-bottom': '5px'
			});

			$('#' + id).html(' + ');
		} else {

			parentNode.next().css({
				'display': 'block'
			});

			$('#' + id).html(' — ');
		}
		
	}

	return {
		floder : floder
	}

})