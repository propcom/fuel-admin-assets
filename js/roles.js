$(document).ready(function() {
	$.fn.textWidth = function(){
		var html_org = $(this).html();
		var html_calc = '<span>' + html_org + '</span>';
		$(this).html(html_calc);
		var width = $(this).find('span:first').width();
		$(this).html(html_org);
		return width;
	};

	$('body.admin-groups-roles h2').hover(
		function() {
			$(this).css('overflow', 'visible');
			$(this).css('position', 'relative');
			$(this).css('background-color', '#6E6E6E');
			$(this).css('z-index', '999');
			$(this).attr('data-original-width', $(this).width());
			$(this).width($(this).textWidth());
		},
		function() {
			$(this).css('overflow', 'hidden');
			$(this).css('z-index', 'auto');
			$(this).css('background-color', 'transparent');
			$(this).width($(this).attr('data-original-width'));
		}
	);
});
