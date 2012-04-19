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
	 *
	 * If `content` is supplied then header, body and footer will be ignored
	 *
	 * @param  object  content  data to be used to generate the Modal
	 */
	function generateModal(content) {
		$('#ajax-modal').remove();

		var modal_html = '<aside class="modal';

		if (content.class) {
			modal_html += ' ' + content.class;
		}

		modal_html += '" id="ajax-modal';

		if (content.id) {
			modal_html += ' ' + content.id;
		}

		modal_html += '">';

		if (content.content != undefined) {
			modal_html += content.content;
		} else {
			if (content.header != undefined) {
				modal_html += '<div class="modal-header">';
				modal_html += '<a class="close" data-dismiss="modal">&times;</a>';
				modal_html += '<h1>' + content.header + '</h1>';
				modal_html += '</div>';
			}


			if (content.body != undefined) {
				modal_html += '<div class="modal-body">';

				if (content.header == undefined) {
					modal_html += '<a class="close" data-dismiss="modal">&times;</a>';
				}

				modal_html += content.body;
				modal_html += '</div>';
			}

			if (content.footer != undefined) {
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

			if (response.fancybox == true) {
				$.fancybox(response.html);
			}

			if (response.modal != undefined) {
				makeModal(response.modal);
			}
		}
	});

});
