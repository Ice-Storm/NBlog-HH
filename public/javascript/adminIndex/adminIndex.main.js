require.config({
	paths: {
		'jquery' : '../jquery-2.1.1',
		'floder' : 'leftBarFloder'
	}
});

require(['jquery', 'floder'], function ($, f) {
	$($('.left-bar')[0]).click(function (event) {
		
		switch (event.target.id) {
			case 'site':
				f.floder('site');
				break;
			case 'artical':
				f.floder('artical');
				break;
			case 'img':
				f.floder('img');
				break;
			case 'message':
				f.floder('message');
				break;
			case 'else':
				f.floder('else');
				break;
			default: 'What ???';
		}
	});
})