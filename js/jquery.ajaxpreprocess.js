(function($){
	$.ajaxPreprocess = function(callbacks) {
		var ajax = $.ajax;

		$.ajax = function() {
			var ajaxObj = ajax.apply(this, arguments);

			if (callbacks.success) {
				ajaxObj.success(callbacks.success);
			}

			if (callbacks.error) {
				ajaxObj.error(callbacks.error);
			}

			if (callbacks.complete) {
				ajaxObj.complete(callbacks.complete);
			}

			return ajaxObj;
		};
	};
})(jQuery);
