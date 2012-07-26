$.fn.productfeatures = function(opts){

	var settings = $.extend({
		'popup_width' : 220,
		'popup_height' : 120,
		'marker_width' : 50,
		'marker_height' : 33,
		'popup_fallback' : 'right',
		'update_feature' : function(marker){
			console.log('Update existing feature');
		},
		'insert_feature' : function(marker){
			console.log('Insert new feature');
		},
		'remove_feature' : function(marker){
			console.log('Remove feature');
		}
	},opts)

	var image = $(this);
	image.data('valid',true);
	var position = image.position();
	var image_id = image.data('p-image-id');

	var offset_left = 0;
	var offset_top = 0;

	var markers = [];

	var marker = $('<div class="feature-marker"></div>');

	var marker_drag = function(event, ui){
		var api = $(ui.helper).data('feature-api');
		api.feature_popup_close();
		api.change_points(ui.position.left,ui.position.top);
	};

	var marker_drag_complete = function(event, ui){
		var api = $(ui.helper).data('feature-api');

		if(api.feature_x > image.width() || api.feature_y > image.height() || api.feature_x < 0 || api.feature_y < 0){
			api.return_to(ui.originalPosition.left,ui.originalPosition.top);
		} else {
			api.check_placement();
			api.reposition_popup();
		}
		check_validity();
	};

	marker.dblclick(function(){
		var api = $(this).data('feature-api');
		api.feature_popup_open();
	});

	var x = 0;
	var y = 0;

	init();

	$(this).mouseenter(function(){

		var position = image.parent().position();
		offset_left = position.left;
		offset_top = position.top;

	});

	$(this).mousemove(function(e){

		x = parseInt(e.pageX - offset_left);
		y = parseInt(e.pageY - offset_top);

	});

	$(this).click(function(e){
		show_create_popup();
	});

	$('.feature-popup input, .feature-popup textarea').live('blur',function(){
		check_validity();
	});

	function check_validity()
	{

		image.data('valid',true);

		$.each(markers,function(index,obj){

			var api = obj.data('feature-api');

			var image_valid = true;

			api.marker.removeClass('feature-invalid');

			if(api.for_delete == false){
				if(api.feature_popup.find('input').val() == ''){
					api.valid = false;
					image.data('valid',false);
					api.marker.addClass('feature-invalid');
				}
				if(api.feature_popup.find('textarea').val() == ''){
					api.valid = false;
					image.data('valid',false);
					api.marker.addClass('feature-invalid');
				}
			}
			if(image.data('valid') == true){
				image.siblings('.feature-save').children().removeClass('disabled');
			} else {
				image.siblings('.feature-save').children().addClass('disabled');
			}

			if(api.changed == true){
				image.siblings('.feature-save').slideDown(200);
			}


		});
	}

	function choose_placement(x, y)
	{
		// Start off with right
		if((parseInt(x) + settings.popup_width) < image.width()){
			return 'right';
		} else {
			if((parseInt(y) + settings.popup_height) < image.height()){
				return 'bottom';
			} else {
				if((parseInt(x) - settings.popup_width) > 0){
					return 'left';
				} else {
					if((parseInt(y) - settings.popup_height) > 0){
						return 'top';
					} else {
						return settings.popup_fallback;
					}
				}
			}
		}
	}

	function init()
	{
		var existing = image.data('features') || [];
		image.wrap('<div style="position: relative;"></div>');
		image.parent().width(image.width());
		var save_area = $('<div class="feature-save"><a href="#" class="feature-save-btn btn btn-primary">Save Changes</a></div>');
		image.parent().append(save_area);

		save_area.find('a').click(function(e){
			e.preventDefault();
			save_changes();
		});

		$.each(existing,function(index,obj){

			var new_marker = marker.clone(true);
			var api = {};
			api.feature_id = parseInt(markers.length + 1);

			new_marker.css({
				left : parseInt(obj.x),
				top : parseInt(obj.y),
				position: 'absolute'
			});

			image.parent().append(new_marker);

			var popup = $('<div class="span3 feature-popup well"></div>');
			var name = $('<input type="text" name="marker-name[' + api.feature_id + ']" placeholder="Feature Title" />');
			name.val(obj.title);
			var description = $('<textarea cols="30" rows="4" name="marker-desc[' + api.feature_id + ']" placeholder="Feature Description"></textarea>');
			var close_button = $('<a href="#" class="close-feature-popup">&times;</a>');
			var done_button = $('<a href="#" class="btn btn-primary feature-done">Done</a>');
			var delete_button = $('<a href="#" class="btn btn-danger delete-feature">Delete Feature</a>');

			description.val(obj.content);
			popup.append(name);
			popup.append(description);
			popup.append(close_button);
			popup.append(done_button);
			popup.append(delete_button);

			popup.css({
				left : parseInt(obj.x) + settings.marker_width,
				top : parseInt(obj.y),
				position: 'absolute',
				'z-index': 2000,
				display: 'none'
			});

			image.parent().append(popup);
			api.is_new = false;
			api.for_delete = false;
			api.feature_db_id = obj.id;
			api.image_id = image.data('p-image-id');
			api.marker = new_marker;
			api.valid = true;
			api.changed = false;
			api.feature_popup = popup;
			api.feature_x = obj.x;
			api.feature_y = obj.y;
			api.feature_popup_close = function(){
				api.feature_popup.hide();
			};
			api.feature_popup_open = function(){
				api.feature_popup.show();
			};
			api.reposition_popup = function(){
				api.feature_popup.css({
					left : parseInt(parseInt(api.feature_x) + settings.marker_width),
					top : parseInt(api.feature_y)
				});
			};
			api.check_placement = function(){
				api.placement = choose_placement(api.feature_x, api.feature_y);
			};
			api.remove_marker = function(){
				api.for_delete = true;
				api.valid = true;
				api.marker.hide();
				api.feature_popup_close();
			};
			api.change_points = function(x,y){
				api.feature_x = x;
				api.feature_y = y;
				api.changed = true;
			};
			api.return_to = function(x,y){
				api.feature_x = x;
				api.feature_y = y;
				api.marker.css({
					left : parseInt(x),
					top : parseInt(y)
				});
			};
			api.values = function() {
				return $.extend({
					'name' : name.val(),
					'description' : description.val()
				}, obj);
			};

			new_marker.data('feature-api',api);

			markers.push(new_marker);

			new_marker.draggable({
				drag: function(event, ui) {
					marker_drag(event,ui);
				},
				stop: function(event,ui) {
					marker_drag_complete(event,ui)
				}
			});

			close_button.click(function(e){
				e.preventDefault();
				api.feature_popup_close();
			});

			delete_button.click(function(e){
				e.preventDefault();
				api.remove_marker();
				check_validity();
			});

			done_button.click(function(e){
				e.preventDefault();
				api.feature_popup_close();
			});

		});

	}

	function save_changes()
	{
		$.each(markers,function(index,obj){
			var api = obj.data('feature-api');

			if(api.for_delete){
				settings.remove_feature(obj);
			} else {
				if(api.is_new){
					settings.insert_feature(obj);
				} else {
					settings.update_feature(obj);
				}
			}
		});

		image.trigger('save.productfeatures');
	}

	function show_create_popup()
	{

		$.each(markers,function(index,obj){
			var api = obj.data('feature-api');
			api.feature_popup_close();
		});

		var new_marker = marker.clone(true);

		var api = {};
		api.feature_id = parseInt(markers.length + 1);

		new_marker.feature_id = parseInt(markers.length + 1);

		new_marker.css({
			left : parseInt(x) - (parseInt(settings.marker_width) / 2),
			top : parseInt(y) - (parseInt(settings.marker_height) / 2),
			position: 'absolute'
		});

		image.parent().append(new_marker);

		var popup = $('<div class="span3 feature-popup well"></div>');
		var name = $('<input type="text" name="marker-name[' + api.feature_id + ']" placeholder="Feature Title" />');
		var description = $('<textarea cols="30" rows="4" name="marker-desc[' + api.feature_id + ']" placeholder="Feature Description"></textarea>');
		var close_button = $('<a href="#" class="close-feature-popup">&times;</a>');
		var done_button = $('<a href="#" class="btn btn-primary feature-done">Done</a>');
		var delete_button = $('<a href="#" class="btn btn-danger delete-feature">Delete Feature</a>');

		popup.append(name);
		popup.append(description);
		popup.append(close_button);
		popup.append(done_button);
		popup.append(delete_button);

		var placement = choose_placement(new_marker.css('left'),new_marker.css('top'));

		popup.css({
			left : parseInt(new_marker.css('left')) + settings.marker_width,
			top : parseInt(new_marker.css('top')),
			position: 'absolute',
			'z-index': 2000,
			display: 'none'
		});

		image.parent().append(popup);
		api.feature_popup = popup;
		api.marker = new_marker;
		api.image_id = image.data('p-image-id');
		api.is_new = true;
		api.for_delete = false;
		api.valid = false;
		api.placement = placement;
		api.changed = true;
		api.feature_db_id = false;
		api.feature_x = new_marker.css('left');
		api.feature_y = new_marker.css('top');
		api.feature_popup_close = function(){
			api.feature_popup.hide();
		};
		api.feature_popup_open = function(){
			api.feature_popup.show();
		};
		api.reposition_popup = function(){
			api.feature_popup.css({
				left : parseInt(parseInt(api.feature_x) + settings.marker_width),
				top : parseInt(api.feature_y)
			});
		};
		api.check_placement = function(){
			api.placement = choose_placement(api.feature_x, api.feature_y);
		};
		api.remove_marker = function(){
			api.for_delete = true;
			api.valid = true;
			api.marker.hide();
			api.feature_popup_close();
		};
		api.change_points = function(x,y){
			api.feature_x = x;
			api.feature_y = y;
		};
		api.return_to = function(x,y){
			api.feature_x = x;
			api.feature_y = y;
			api.marker.css({
				left : parseInt(x),
				top : parseInt(y)
			});
		};
		api.values = function() {
			return {
				'name' : name.val(),
				'description' : description.val()
			};
		};

		new_marker.data('feature-api',api);

		markers.push(new_marker);

		popup.show();

		new_marker.draggable({
			drag: function(event, ui) {
				marker_drag(event,ui);
			},
			stop: function(event,ui) {
				marker_drag_complete(event,ui)
			}
		});

		close_button.click(function(e){
			e.preventDefault();
			api.feature_popup_close();
		});

		delete_button.click(function(e){
			e.preventDefault();
			api.remove_marker();
			check_validity();
		});

		done_button.click(function(e){
			e.preventDefault();
			api.feature_popup_close();
		});

		check_validity();

	}

}

$(function(){
	$('.add-features-enabled').each(function(index,obj){
		$(obj).productfeatures();
	});
});
