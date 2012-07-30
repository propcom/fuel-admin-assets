$(function() {
	var features = $('#features'),
		img_input = $('input[name=image_id]');

	$('#select-image').mediamanager({
		onUseImage: use_image
	});

	function use_image(event, data) {
		var src = data.img[0].type.sizes.product_main.src;

		// change the image without messing around with the features!
		if (features.find('img').length) {
			features.find('img').attr('src', src);
		}
		else {
			var img = $('<img src="' + src + '">');
			setup_productfeatures(img);
			features.append(img);
		}

		img_input.val(data.img[0].id);
	}

	function setup_productfeatures(img) {
		var markers = [],
			add_marker = function(marker) {
				var m = {};
				m.title = marker.title;
				m.content = marker.content;
				m.xpos = marker.x;
				m.ypos = marker.y;
				m.id = marker.id;

				markers.push(m);
			};

		img.productfeatures({
			update_feature: add_marker,
			insert_feature: add_marker,
			remove_feature: add_marker,
			admin: true
		});

		img.bind('save.productfeatures', function() {
			var button = $(this).next().find('a');
			$.post('/admin/productfeatures/rest/save.json', {
				image: img_input.val(),
				product_id: $('input[name=product_id]').val(),
				markers: markers
			})
			.success(function() {
				var html = button.html();
				button.html('Saved.');
				setTimeout(function() { button.html(html); }, 2000);

				markers = [];
			});
		});
	}

	setup_productfeatures($('img.features'));
});
