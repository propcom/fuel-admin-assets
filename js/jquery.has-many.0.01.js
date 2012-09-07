(function($) {

	$.fn.hasMany = function(opts) {
		var self = this,
			field_names,
			important_elements = {},
			api;

		opts = $.extend({
			owner_id: this.data('has-many'),
			owner_field_name: this.data('field-name'),
			ajax: false,
		}, opts);

		important_elements.new_row = opts.new_row 
			|| this.find('tr').last();
		important_elements.add_button = opts.add_button 
			|| important_elements.new_row.find('.new-row .btn.add');
		important_elements.remove_button = opts.remove_button 
			|| important_elements.new_row.find('.existing-row .btn.remove');
		important_elements.antecedent = this.find('tr').not(important_elements.new_row);
		important_elements.new_rows = [];

		// So we can recognise it when we clone it, regardless of how we found it
		important_elements.add_button.addClass('hasmany-addbutton');
		
		field_names = opts.field_names 
			|| important_elements.new_row.find(':input').map(function() {
				// owner_field_name[(id)?][field_name]
				var re = new RegExp(opts.owner_field_name + '\\[\\d*\\]\\[([^\\]]+)\\]');
				var matches = $(this).attr('name').match(re);

				return matches[1];
			});

		important_elements.add_button.click(function() {
			api.add_new_row();
		});
		important_elements.remove_button.click(function() {
			api.delete_row($(this).closest('tr'));
		});

		important_elements.new_row.closest('form').submit(function() {
			important_elements.new_row.find(':input').attr('disabled', true);
		});


//// API /////

		api = {
			add_new_row : function() {
				// TODO: ajax if owner ID
				var new_row = important_elements.new_row.clone(true),
					new_rows = important_elements.new_rows;

				if (opts.validation && typeof opts.validation == 'function'
				&& !opts.validation(new_row)) {
					$.event.trigger('validation-failed.has-many', { row: new_row });
					return;
				}

				$.each(field_names, function(_,n){
					new_row
						.find(':input[name*="[' + n + ']"]')
						.attr('name', opts.owner_field_name + '[0][' + new_rows.length + '][' + n + ']')
						.val(important_elements.new_row.find(':input[name*="[' + n + ']"]').val());
				});

				new_row.data('hasMany.new', true);
				new_row
					.find('.buttons')
					.find('.existing-row')
					.removeClass('hidden')
					.end()
					.find('.new-row')
					.remove();

				if (new_rows.length) {
					new_rows[new_rows.length - 1].after(new_row);
				}
				else if (important_elements.antecedent.length) {
					important_elements.antecedent.last().after(new_row);
				}
				else {
					self.prepend(new_row);
				}

				new_rows.push(new_row);
				important_elements.new_row.find(':input').val('');

				$.event.trigger('new-row.has-many', { row: new_row });
			},

			delete_row: function(row) {
				if (row.data('hasMany.new')) {
					// Find it in new_rows and exorcise it
					$.each(important_elements.new_rows, function(i) {
						if ($(this).is(row)) {
							important_elements.new_rows.splice(i, 1);
							return false;
						}
					});
				}
				// TODO: ajax if owner ID
				row.remove();

				$.event.trigger('remove-row.has-many', { row: $(this) });
			}
		};
		self.data('hasMany', api);
	};
})(jQuery);
