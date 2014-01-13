$.fn.wordlist = function(){
	var $field = this;

	var word;
	var words = []; // words is an array
	if ($field.val().length > 0) {
		words = $field.val().split(','); // Fill array if textarea has contents
		cleanwords = [];
		$.each(words, function(){
			cleanwords.push(this.trim());
		});
		words = cleanwords;
		$field.val(words.join(','));
	}

	$('<div class="wordlist-view" />').insertAfter($field); // Add the display div
	$field.hide(); // Hide the textarea

	$.each(words, function(i, word){
		$('<span>'+word.trim()+'</span>').appendTo('.wordlist-view');
	});
	$('<input type="text" class="js-wordlist-input" />').appendTo('.wordlist-view');

	$('.wordlist-view').on('click', 'span', function(){
		var $word = $(this); // Word span object
		word = $word.text().trim(); // Word text
		var i = words.indexOf(word); // Position of word in array

		words.splice(i, 1); // Remove word from array

		$word.remove(); // Remove word object from div

		$field.val(words.join(',')); // Update text in the textarea
	});

	$('.js-wordlist-input').on('keyup', function(e) {
		var word = $(this).val().trim();
		if (e.which == 13 && word != '') {
			e.preventDefault();
			e.stopPropagation();
			// Add word
			words.push(word);

			$('<span>'+word.trim()+'</span>').insertBefore('.js-wordlist-input');

			$(this).val('');
			console.log(words);

			$field.val(words.join(',')); // Update text in the textarea
		}
	});
};