define(['jquery'], function ($) {

	var ini = function () {
		var articalClo = $('.content-artical-artical');

		//每篇文章块的 content-artical-artical 初始化高度
		
		var totalHeight = [];
		for (var i = 0; i < articalClo.length; i++) {

			var child = $(articalClo[i]).children();
			var tmp = 0;

			for (var j = 0; j < child.length; j++) {
				tmp += $($(child)[j]).height();
			}

			totalHeight.push(tmp);
		}
		
		for (var i = 0; i < totalHeight.length; i++) {
			articalClo[i].height = totalHeight[i] + 'px;';
		}

		//content 的初始化高度

		var content = $('.content')[0];
		var articalCloHei = 0;

		for (var i = 0; i < totalHeight.length; i++) {
			articalCloHei += totalHeight[i];
		}

		var h = articalCloHei + totalHeight.length * 116 + 40 + totalHeight.length * 2 + 100;
		$(content).height(h); 

		//

		$($('.right-col')[0]).height($(content).height() - 45)
		//alert()
	}


	return {
		ini: ini
	}
})