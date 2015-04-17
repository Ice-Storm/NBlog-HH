var btn = document.getElementById('btn');

btn.addEventListener('click', function () {
	var showContent = document.getElementsByClassName('about-me-content')[0];
	var cach = document.getElementsByClassName('about-me-show-content')[0].innerHTML;
	showContent.innerHTML = '';
	var textarea = document.createElement('textarea');
	var input = document.createElement('input');
	textarea.id = 'editor';
	textarea.className = 'about-me-editor';
	showContent.appendChild(input);
	showContent.appendChild(textarea);
	
	var editor;
   /* KindEditor.ready(function(K) {
    	alert(2)
    	textarea.value = cach;
        editor = K.create('#editor', {
            items: [
		        'source','code',
		        'wordpaste','justifyleft', 'justifycenter', 'justifyright',
		        'outdent','fontname', 'fontsize','forecolor', 'hilitecolor', 'bold',
		        'italic', 'underline', 'strikethrough', 'lineheight',
		        'hr', 'emoticons', 'link'
			],

			resizeType: 0,

			uploadJson : '/admin/adminIndex/content/addArtical'

			//fileManagerJson : '/admin/adminIndex/content/addArtical',
			//allowFileManager : true
        });
    });*/

}, false);