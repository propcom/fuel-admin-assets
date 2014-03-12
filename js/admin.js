$(function(){

	Modernizr.addTest('ipad', function () {
		return !!navigator.userAgent.match(/iPad/i);
	});
	Modernizr.addTest('iphone', function () {
		return !!navigator.userAgent.match(/iPhone/i);
	});
	Modernizr.addTest('ipod', function () {
		return !!navigator.userAgent.match(/iPod/i);
	});
	Modernizr.addTest('appleios', function () {
		return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
	});
	Modernizr.addTest('firefox', function () {
		return !!navigator.userAgent.match(/Firefox/i);
	});
	Modernizr.addTest('webkit', function () {
		return !!navigator.userAgent.match(/AppleWebKit/i);
	});
	Modernizr.addTest('ie', function () {
		return !!navigator.userAgent.match(/MSIE/i);
	});

	//alert(navigator.userAgent);

	// iPhone Web App Links
	if ($('html').hasClass('appleios')) {
		$("a").click(function(e) {
			//console.log('apple links');
			if (this.href != '') {
				e.preventDefault();
				window.location = this.href;
			};
		});
	}

	if ($('.top__nav ul ul').is(':visible')) {
		$('html').addClass('subsubnav');
	}

	var anysubnav = false;
	$('.top__right > .top__nav > li').each(function(){
		if ($(this).children('ul').length > 0) {
			anysubnav = true;
		}
	});
	if (!anysubnav) {
		$('html').addClass('nosubnav');
	}


	$(document).on('click', '.js-ajax-btn', function (event) {
		event.preventDefault();

		var $this = $(this);

		$.ajax({
			type: $this.data('type') || 'GET',
			url: $this.data('url') || $this.attr('href')
		});
	});


	//$('.btn[title], i[title]').tooltip();

	$('input', '.datagrid-item').change(function(){
		var checkcount = 0;
		$('.datagrid-item').each(function(){
			if ($('input', this).is(':checked')) {
				checkcount ++;
			}
		});

		if (checkcount > 0) {
			$('.js-bulk-actions').attr('data-label', 'Bulk Actions ('+checkcount+')');
			$('i', '.js-bulk-actions').removeClass('icon-check-empty').addClass('icon-check');
		} else {
			$('.js-bulk-actions').attr('data-label', 'Bulk Actions');
			$('i', '.js-bulk-actions').removeClass('icon-check').addClass('icon-check-empty');
		}
	});

	$('.js-panel-trigger').click(function(e){
		e.preventDefault();
		$(this).parent('.js-panel').toggleClass('is-open');
	});
	$('.js-panel').mouseleave(function(e){
		$(this).removeClass('is-open');
	});


	// Admin Menu
	$('.js-admin-menu a').first().click(function(e){
		e.preventDefault();
		$('.js-admin-menu').toggleClass('is-open');
	});

	$('.datatable-filters').has('.multi-field').addClass('has-multi-field');


	// Character countdown
	var fields = [
		[$('#label_meta_description'), $('#meta_description'), 150],
		[$('#label_short_description'), $('#short_description'), 60],
		[$('#label_long_description'), $('#long_description'), 240],
		[$('#label_seo_description'), $('#seo_description'), 150]
	];
	$.each(fields, function(){
		var field = $(this),
			$label = field[0],
			$input = field[1],
			limit = field[2];

		if ($label.length && $input.length) {
			$label.addClass('label-char-counter');

			// no point doing stuff if it doesn't exist
			if ($input.size() <= 0) {
				return true;
			}

			// Add remaining characters label
			var prefilled = $input[0].value.length,
				remaining = limit - prefilled;

			$label.attr('data-char-count', remaining);

			// Make label red if too many characters
			if (remaining < 0) {
				$label.addClass('desc-over-limit');
			} else {
				$label.removeClass('desc-over-limit');
			}

			// Watch when typing in box to adjust value of label
			$input.on('keyup focus blur', function(){
				var chars_left = limit - this.value.length;
				$label.attr('data-char-count', chars_left);
				if (chars_left < 0) {
					$label.addClass('desc-over-limit');
				} else {
					$label.removeClass('desc-over-limit');
				}
			});
		}
	});

	// Hide visibility select when all is selected
	if ($('#visibility_0').is(':checked')) {
		$('#product_fieldset_visibility .control-group').last().hide();
	}
	$('#product_fieldset_visibility input').change(function(){
		if ($('#visibility_0').is(':checked')) {
			$('#product_fieldset_visibility .control-group').last().hide();
		} else {
			$('#product_fieldset_visibility .control-group').last().show();
		}
	});

	/**
	 * Link to a specific Twitter Bootstrap Tab
	 * @link https://github.com/twitter/bootstrap/issues/2415#issuecomment-4589184
	 */
	// var activeTab = $('[href=' + location.hash + ']');
	// activeTab && activeTab.tab('show');


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

		var modal_html = '';

		if (content.form != null) {
			modal_html += '<form';

			if (content.form.action != null) {
				modal_html += ' action="' + content.form.action + '"';
			} else {
				modal_html += ' action=""';
			}

			if (content.form.method != null) {
				modal_html += ' method="' + content.form.method + '"';
			} else {
				modal_html += ' method="post"';
			}
		} else {
			modal_html += '<aside';
		}

		modal_html += ' class="modal';

		if (content.class) {
			modal_html += ' ' + content.class;
		}

		if (content.form) {
			if (content.form.class != null) {
				modal_html += ' ' + content.form.class;
			} else {
				modal_html += ' form-horizontal';
			}
		}

		modal_html += '" id="ajax-modal">';

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

			if (content.footer != null || content.form != null) {
				modal_html += '<div class="modal-footer">';

				if (content.footer != null) {
					modal_html += content.footer;
				}

				if (content.form != null && content.form.no_buttons == null) {
					modal_html += '<input type="submit" class="btn btn-primary js-modal-submit"';

					if (content.form.submit != null) {
						modal_html += ' value="' + content.form.submit + '"';
					} else {
						modal_html += ' value="Save"';
					}

					modal_html += ' />';
				}

				modal_html += '</div>';
			}
		}

		if (content.form != null) {
			modal_html += '</form>';
		} else {
			modal_html += '</aside>';
		}

		var $modal = $(modal_html);
		$modal.modal();

		if (content.form && content.form.ajax !== false) {
			$modal.find('.js-modal-submit').on('click', function (e) {
				e.preventDefault();

				$.ajax({
					url: content.form.action || '',
					type: content.form.method || 'post',
					data: $(this).closest('form').serialize()
				});
			});
		}

		$(document).trigger('complete.modal.admin', { modal: $modal });

		return $modal;
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

			$(document).trigger('error.ajax.admin', {
				jqXHR: jqXHR,
				textStatus: textStatus,
				errorThrown: errorThrown
			});
		},

		success: function(data, textStatus, jqXHR){
			try {
				var response = $.parseJSON(jqXHR.responseText)
			}
			catch (e) {
				var response = jqXHR.responseText;
			}

			$(document).trigger('success.ajax.admin', {
				data: data,
				textStatus: textStatus,
				jqXHR: jqXHR
			});
		},

		complete: function(jqXHR, textStatus) {
			try {
				var response = $.parseJSON(jqXHR.responseText)
			}
			catch (e) {
				var response = jqXHR.responseText;
			}

			jqXHR.responseObj = response;

			if (response != null) {
				if (response.redirect != undefined) {
					window.location = response.redirect;
				}

				if (response.fancybox != undefined) {
					$.fancybox(response.fancybox);
					$(document).trigger('fancybox.ajax.admin');
				}

				if (response.modal != undefined) {
					generateModal(response.modal);
					$(document).trigger('modal.ajax.admin');
				}
			}

			if (! response || ! response.modal) {
				// Remove any old modals
				$('#ajax-modal, .modal-backdrop').remove();
			}

			$(document).trigger('complete.ajax.admin', {
				textStatus: textStatus,
				jqXHR: jqXHR
			});
		}
	});

	// Apply chosen to .chzn-select elements if chosen is loaded
	if ($.fn.chosen) {
		$(".chzn-select").chosen();
	}

	$('.js-datepicker').datepicker();
});
