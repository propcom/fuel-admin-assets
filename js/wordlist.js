$.fn.wordlist = function(){

	return this.each(function(){
		// Elements to work with:
		var $field = $(this), // textarea
			$mask = $('<div class="wordlist-view" />'), // Styled view
			$input = $('<input type="text" class="js-wordlist-input" />'); // input

		// Vars to use:
		var word,
			words = [];

		if ($field.val().length > 0) {
			words = $field.val().split(',');
			cleanwords = [];
			$.each(words, function(){
				cleanwords.push(this.trim());
			});
			words = cleanwords;
			$field.val(words.join(','));
		}

		// Put the styled view in and hide the textarea
		$mask.insertAfter($field);
		$field.hide();

		$.each(words, function(i, word){
			// Add the words to the styled view
			$('<span>'+word.trim()+'</span>').appendTo($mask);
		});

		// Put the input in after all of the words
		$input.appendTo($mask);

		// Delete a word when you click it
		$mask.on('click', 'span', function(){
			var $word = $(this);

			// Find position of word in the array of words
			word = $word.text().trim();
			var i = words.indexOf(word);

			// Remove word from array
			words.splice(i, 1);

			// Remove the word from the styled view
			$word.remove();

			// Update the contents of the textarea
			$field.val(words.join(','));
		});

		$input.on('keyup', function(e) {
			// Build up what the user is typing
			var word = $(this).val().trim();

			if (e.which == 13 && word != '') {
				// When they press enter, add the word to the array
				words.push(word);
				// Add to the display view
				$('<span>'+word.trim()+'</span>').insertBefore($input);
				// Update the contents of the textarea
				$field.val(words.join(','));

				// Clear the input
				$(this).val('');
			}
		});
	});
};