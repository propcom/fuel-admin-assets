$(function() {
	var features = $('#features'),
		img_input = $('input[name=image_id]');

	$('#select-image').mediamanager({
		onUseImage: use_image,
		restrictType: ['products']
	});

	function use_image(event, data) {
		var src = data.img[0].type.sizes.product_main.src;

		// change the image without messing around with the features!
		if (features.find('img').length) {
			features.find('img').attr('src', src);
		}
		else {
			var img = $('<img src="' + src + '">');
			features.append(img);
			setup_productfeatures(img);
		}

		img_input.val(data.img[0].id);
	}

	function setup_productfeatures(img) {
		if (img.length == 0) return;

		var markers = [],
			add_marker = function(marker) {
				var m = {};
				m.title = marker.title;
				m.content = marker.content;
				m.xpos = marker.elem.position().left;
				m.ypos = marker.elem.position().top;
				m.id = marker.id;
				m.image = marker.image;

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
