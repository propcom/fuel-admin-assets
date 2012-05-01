$(function(){

	/**
	 * Generates a Twitter Bootstrap Modal
	 *
	 * The content for the Modal is passed to the function as an object
	 * with one or more of the following items:
	 *
	 * * content - html content for the modal INCLUDING modal markup
	 * * header - content for the header of the modal
	 * * body - content for the body of the modal
	 * * footer - content for the footer of the modal
	 * * id - id attribute to be added to the Modal's container (an id of 'ajax-modal' is always applied)
	 * * class - class attribute to be added to the Modal's container (a class of 'modal' is always applied)
	 * * alerts - array of alert (flash) messages to be displayed in the modal, indexed by type (one of: success, error or info)
	 *
	 * If `content` is supplied then header, body and footer will be ignored
	 *
	 * @param  object  content  data to be used to generate the Modal
	 */
	function generateModal(content) {
		$('#ajax-modal, .modal-backdrop').remove();

		var modal_html = '<aside class="modal';

		if (content.class) {
			modal_html += ' ' + content.class;
		}

		modal_html += '" id="ajax-modal';

		if (content.id) {
			modal_html += ' ' + content.id;
		}

		modal_html += '">';

		if (content.content != null) {
			modal_html += content.content;
		} else {
			if (content.header != null) {
				modal_html += '<div class="modal-header">';
				modal_html += '<a class="close" data-dismiss="modal">&times;</a>';
				modal_html += '<h1>' + content.header + '</h1>';
				modal_html += '</div>';
			}


			modal_html += '<div class="modal-body">';

			if (content.header == null) {
				modal_html += '<a class="close" data-dismiss="modal">&times;</a>';
			}

			if (content.alerts != null) {
				for (type in {'success':1,'error':1,'info':1}) {
					if (content.alerts[type] != null) {
						modal_html += '<div class="alert alert-' + type + '">';
						modal_html += '<a class="close" href="#" data-dismiss="alert">&times;</a>';

						if (typeof content.alerts[type] == 'string') {
							modal_html += content.alerts[type];
						} else {
							modal_html += content.alerts[type].value;
						}

						modal_html += '</div>';
					}
				}
			}

			if (content.body != null) {
				modal_html += content.body;
			}

			modal_html += '</div>';

			if (content.footer != null) {
				modal_html += '<div class="modal-footer">' + content.footer + '</div>';
			}
		}

		modal_html += '</aside>';

		$(modal_html).modal();
	}

	$.ajaxPreprocess({
		error: function (jqXHR, textStatus, errorThrown) {
			try {
				var response = $.parseJSON(jqXHR.responseText)
			}
			catch (e) {
				var response = jqXHR.responseText;
			}

			if (jqXHR.status == 401) {
				if (response.redirect) {
					window.location = response.redirect;
				} else {
					window.location = '/admin/home/login';
				}
			}
		},

		success: function(data, textStatus, jqXHR){
			try {
				var response = $.parseJSON(jqXHR.responseText)
			}
			catch (e) {
				var response = jqXHR.responseText;
			}


		},

		complete: function(jqXHR, testStatus) {
			try {
				var response = $.parseJSON(jqXHR.responseText)
			}
			catch (e) {
				var response = jqXHR.responseText;
			}

			if (response.fancybox != undefined) {
				$.fancybox(response.fancybox);
			}

			if (response.modal != undefined) {
				generateModal(response.modal);
			}
		}
	});

});
