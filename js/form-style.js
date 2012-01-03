// JavaScript Document
// File Style 1.0 beta max
(function($){
	$.fn.fileStyle = function(options, refreshOptions) {

		// this is to keep from overriding our "defaults" object.
		var opts = $.extend({}, $.fn.fileStyle.defaults, options);
		var base = this;

		base.init = function(){
			base.wrapElement();
		};

		base.initFileStyle = function(element){
			element.wrap('<div class="fileWrap"></div>');
			element.parent().append('<div class="file-overlay"><img src="/assets/img/admin/file.jpg" alt="Choose File" /><div></div><br style="clear:both" /></div><br style="clear:both" />');
			$('.fileWrap').height($('.file-overlay').height());

			if ($(".fileWrap").find('input').val()=="") {
				$('.file-overlay').find('div').html('No file chosen');
			} else {
				$('.file-overlay').find('div').html(base.val().replace('C:\\fakepath\\',''));
			};
	
			element.change(function(){
				$('.file-overlay').find('div').html(element.val().replace('C:\\fakepath\\',''));
			})
		};

		base.initRadioStyle = function(element){
			element.wrap('<span class="radioWrap"></span>');
			element.parent().append('<span class="radio-select">&nbsp;</span>');
			$('.radioWrap').height($('.radio-select').height());
			if(element.is(":checked")){
				element.parent().find('.radio-select').addClass('radio-select-on')
			}
			
		};

		base.initCheckboxStyle = function(element){
			element.wrap('<span class="checkboxWrap"></span>');
			element.parent().append('<span class="checkbox-select">&nbsp;</span>').after('<br style="clear:both" />');
			$('.checkboxWrap').height($('.checkbox-select').height());

			if(element.is(":checked")){
				element.parent().children('.checkbox-select').addClass('checkbox-select-on');
			}
		};

		base.initSelectStyle = function(element){
			element.wrap('<span class="selectWrap"></span>');
			element.parent().append('<span class="select-overlay"></span>');
			element.parent().find('.select-overlay').html('<span class="select-title">'+element.val()+'</span>').append('<div><ul></ul></div>');
			if ($.browser.msie && $.browser.version.substr(0,1)<7) {
				element.hide();
			}
			element.children('option').each(function(){
				element.parent().children('.select-overlay').children('div').children('ul').append('<li>' + $(this).val() + '</li>');
			})

		};

		base.wrapElement = function(){
			base.each(function(){
				switch($(this).attr('type')) {
					case 'radio': base.initRadioStyle($(this)); break;
					case 'checkbox': base.initCheckboxStyle($(this)); break;
					case 'text': break;
					case 'textarea': break;
					case 'select-one': base.initSelectStyle($(this)); break;
					case 'file': base.initFileStyle($(this)); break;
					default:   break;
				}
			})

			base.initButtons();
		};

		base.initButtons = function(){
			$('.select-overlay').toggle(function(){
				if($(this).find('div').is(':not(":visible")')) {
					$(this).find('div').slideDown();
				}
			},function(){
				if($(this).find('div').is(':visible')) {
					$(this).find('div').slideUp();
				}
			})

				$('.select-overlay li').click(function(){
					$(this).parent().parent().slideUp();
					$(this).parent().parent().parent().find('span.select-title').html($(this).html());
					$(this).parent().parent().parent().parent().find('select').children('option:eq('+$(this).index()+')').attr('selected','selected');
				})

			$('.checkbox-select').click(function(){
				if ($(this).hasClass('checkbox-select-on')) {
					$(this).removeClass('checkbox-select-on');
					$(this).parent().find('input').removeAttr('checked');
				} else {
					$(this).addClass('checkbox-select-on');
					$(this).parent().find('input').attr('checked','checked');
				};
			})

			$('.radio-select').click(function(){
				$(this).parent().find('input').attr('checked','checked');
				$(this).parent().parent().find('.radio-select-on').parent().find('input').removeAttr('checked');
				$(this).parent().parent().find('.radio-select').removeClass('radio-select-on');
				$(this).addClass('radio-select-on');
			})

			$('.file-overlay').click(function(){
				$(this).parent().children('input').trigger('click');
			})
		};

        base.init();
        	
	};
	
	$.fn.fileStyle.defaults = {
		repositionImage : true
	};
})(jQuery);