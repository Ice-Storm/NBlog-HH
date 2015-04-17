define(['jquery'], function ($) {
	var ajax = function (obj) {
		if (typeof obj !== 'object') {
			throw 'Type error';
		}

		$.ajax({
			url: obj.url,
			data: obj.data,
			type: obj.type,
			success: obj.cb(data)
		})

	}

	return {

	}
})