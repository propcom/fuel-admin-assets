// JavaScript Document

jQuery(function($) {
	//hide drop down navigations
	$('nav ul li ul').hide();

	//show dropdown menus on hover
	$('nav ul li').mouseenter(function() {
		if($(this).children('ul').length){
			$(this).children('ul').show();
		}
	});


	//hide dropdown menus
	$('nav ul li').mouseleave(function() {
		if($(this).children('ul').length){
			$(this).children('ul').hide();
		}
	});

	$('input[type="text"]').addClass('textbox');
	$('input[type="password"]').addClass('textbox');
	$('input[type="file"]').addClass('file');
	$('input[type="submit"]').addClass('submit');

// DROP DOWN STYLING

	$('select.select').each(function(){
		var title = $(this).attr('title');
		if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
		$(this)
			.css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
			.after('<span class="select">' + title + '</span>')
			.change(function(){
			val = $('option:selected',this).text();
				$(this).next().text(val);
				})
	});

	$('select').each(function () {
		if($(this).hasClass('error')) {
			$(this).siblings('span.select').addClass('error-select');
		}
	});

	//radio syling
	$('input:radio').wrap('<span class="radio"></span>');
	$('input:radio:checked').parent('span.radio').addClass('selected');

	//when span clicked change class on selected radio
	$('span.radio').live('click', function(event){
		//remove background on previous selected radio button
		var radioName = $(this).children('input:radio').attr('name');

		$("input[name='"+radioName+"']").parent('span').removeClass('selected');

		//add selected background to selected radio button
		$(this).addClass('selected');
	});


});
