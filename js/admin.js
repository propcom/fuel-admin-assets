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
	};

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

		var modal_html = '<aside class="modal';

		if (content.class) {
			modal_html += ' ' + content.class;
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

			if (response != null) {
				if (response.redirect != undefined) {
					window.location = response.redirect;
				}

				if (response.fancybox != undefined) {
					$.fancybox(response.fancybox);
				}

				if (response.modal != undefined) {
					generateModal(response.modal);
				}
			}
		}
	});

	// Apply chosen to .chzn-select elements if chosen is loaded
	if ($.fn.chosen) {
		$(".chzn-select").chosen();
	}

});
