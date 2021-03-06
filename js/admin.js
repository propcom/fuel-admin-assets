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

	if ($('.alert:not(.alert-constant)').length > 0) {
		setTimeout(function(){
			$('.alert').slideUp();
		}, 10000);
	}

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

	var ajax_event = function(event) {
		event.preventDefault();

		var $this = $(this);
		var data = {};
		var form = $this.data('form');
		var $form = null;
		var method = 'GET';
		var url = '';

		// If a form data attribute has been specified then use it as a selector
		// to attempt to get a form rather than looking for the closest form. If
		// it is set to an empty string or something then we don't want to fall
		// back to finding the closest form.
		if (form !== undefined) {
			if ($(form).is('form')) {
				$form = $(form);
			}
		} else if ($this.is('input[type=submit],button') && $this.closest('form').length) {
			$form = $this.closest('form');
		}

		// If we have found a form then use it for data and method/url defaults
		if ($form) {
			data = $form.serialize();
			method = $form.attr('method');
			url = $form.attr('action');
		} else {
			data = $this.data();
		}

		// Reverse engineer jQuery's camelisation of the keys
		var new_data = {};
		$.each(data, function(key, value){
			var new_key = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			new_data[new_key] = value;
		});

		if(typeof this.value !== "undefined") {
			var key = $(this).attr('name') || new_data['value-name'] || 'value';
			new_data[key] = this.value;
		}

		$.ajax({
			type: $this.data('type') || $this.data('method') || method,
			url: $this.data('url') || $this.attr('href') || url,
			data: new_data
		});
	};

	$(document).on('click', '.js-ajax-btn', ajax_event);
	$(document).on('change', '.js-ajax-change', ajax_event);

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
		} else {
			$('.js-bulk-actions').attr('data-label', 'Bulk Actions');
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

	// Datagrid Actions Menu
	$('.datagrid-item-actions').mouseleave(function() {
		$('.datagrid-item-actions').removeClass('open');
	});

	// Datagrid Filters Button Group
	$('.datagrid-filter .btn-group').mouseleave(function() {
		$(this).removeClass('open');
	});

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
					modal_html += '<input type="submit" name="submit" class="btn btn-primary js-modal-submit"';

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

				var data = $(this).closest('form')
					.add(
						$('<input type=hidden>')
							.attr('name', $(this).attr('name'))
							.attr('value', $(this).attr('value'))
					)
					.serialize();

				$.ajax({
					url: content.form.action || '',
					type: content.form.method || 'post',
					data: data
				})
					.done(function () {
						$(document).trigger('success.submit.modal.admin', arguments);
						$(document).trigger('done.submit.modal.admin', arguments);
					}).fail(function () {
						$(document).trigger('error.submit.modal.admin', arguments);
						$(document).trigger('fail.submit.modal.admin', arguments);
					}).always(function () {
						$(document).trigger('complete.submit.modal.admin', arguments);
						$(document).trigger('always.submit.modal.admin', arguments);
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

			jqXHR.responseObj = response;

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

			jqXHR.responseObj = response;

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

				if( response.redirect != undefined && response.redirect !== false ){
					if( response.redirect === '' || response.redirect === true ){
						window.location.reload(true);
					}
					else {
						window.location = response.redirect;
					}
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

	$('.js-datepicker').datepicker({ dateFormat: "yy-mm-dd" });

	// Inline Error tooltip

	$(".inline-error").tooltip({ placement: 'bottom'});
});
