$(function(){
	$('.tag-it').tagit({
		availableTags: $('.tag-it').data('availableTags'),
		onTagAdded: function (event, tag) {
			var label = (tag.find('.tagit-label').text());
			$('.js-role-list li:not(.muted)').each(function () {
				if ($(this).text() == label) {
					$(this).addClass('muted');
				}
			});
		},
		onTagRemoved: function (event, tag) {
			var label = (tag.find('.tagit-label').text());
			$('.js-role-list li.muted').each(function () {
				if ($(this).text() == label) {
					$(this).removeClass('muted');
				}
			});
		}
	});

	$('.js-role-list').on('click', 'li:not(.muted)', function () {
		$('.tag-it').tagit('createTag', $(this).text());
		$(this).addClass('muted');
	});
});
