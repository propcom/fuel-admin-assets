$(function(){

	$('.tag-it').each(function () {

		var available_options = [
			'fieldName', 'availableTags', 'autocomplete',
			'showAutocompleteOnFocus', 'removeConfirmation',
			'caseSensitive', 'allowDuplicates', 'allowSpaces',
			'readOnly', 'tagLimit', 'tabIndex', 'placeholderText'
		];

		var options = {};

		var $elem = $(this);

		$.each(available_options, function (index, value) {
			options[value] = $elem.data(value);
		});

		$elem.tagit(options);

	});

});
