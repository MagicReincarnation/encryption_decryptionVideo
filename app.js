$(function(){

	var body = $('body'); // select body
	var stage = $('#stage'); // select stage
	var	back = $('a.back'); // select back class from the firstl link

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt'); // attach encrypt class to the body on selecting encrypt
		step(2); // next page to upload
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt'); // attach decrypt class to the bofy on selecting decrypt
		step(2); //next page to upload
	});

	$('#step2 .button').click(function(){
		$(this).parent().find('input').click(); // upload file
	});
	// file to be selected
	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){
		if(e.target.files.length!=1){
			alert('File not Selected');
			return false;
		}
		file = e.target.files[0];

		if(file.size > 1024*1024){
			alert('Please select file less than 1 MB');
			return;
		}
		step(3);
	});

	$('#step2').on('change', '#decrypt-input', function(e){
		if(e.target.files.length!=1){
			alert('File Not selected');
			return false;
		}
		file = e.target.files[0];
		step(3);
	});

	// password input & processing
	$('a.button.process').click(function(){
		var input = $(this).parent().find('input[type=password]'); // vary important
		var	a = $('#step4 a.download');
		var	password = input.val();
		input.val('');
		if(password.length<5){
			alert('Please choose a longer than 5 charactors');
			return;
		}
		var reader = new FileReader();
		// selecting encryption or decryption based on choice
		if(body.hasClass('encrypt')){
			reader.onload = function(e){
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				//create download option
				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');
				step(4);
			};
			reader.readAsDataURL(file);
		}
		else {
			reader.onload = function(e){
				//decryption
				var decrypted = CryptoJS.AES.decrypt(e.target.result, password).toString(CryptoJS.enc.Latin1);
				if(!/^data:/.test(decrypted)){
					alert("Invalid pass phrase or file! Please try again.");
					return false;
				}
				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encrypted',''));
				step(4);
			};

			reader.readAsText(file);
		}
	});

	back.click(function(){
		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});
		step(1);
	});

	function step(i){
		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}
		//for different views	
		stage.css('top',(-(i-1)*100)+'%');
	}
});
