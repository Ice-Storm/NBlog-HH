define(['jquery'], function ($) {

	var replay = function () {
		$('.content-artical-replay').click(function (e) {
			if (e.target.className == 'content-artical-replay-replay') {
				$.get(window.location.href, {replay: e.target.id}, function (data) {
					if (data) {
						location.hash = 'addReplay';
					} else {
						//错误处理
					}
				});
			}
			
		});
	};

	var clearHash = function () {
		window.location.hash = '';
	}

	return {
		replay: replay,
		clearHash: clearHash
	}
})