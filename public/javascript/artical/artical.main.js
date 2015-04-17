require.config({
	paths: {
		'jquery' : '../jquery-2.1.1',
		'replay' : 'replay'
	}
});

require(['jquery', 'replay'], function ($, r) {
	r.replay();
	$('.submit').click(function () {
		r.clearHash()
	})
});