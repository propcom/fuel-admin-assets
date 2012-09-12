$(function() {
	$('table[data-has-many]').hasMany({
		owner_field_name: 'rates'
	});

	(function() {
		var ajax = {};
		$('select.country-code').change(function() {
			var country_code = $(this).val();

			if (window.state_options[country_code]) return;

			if (ajax[country_code]) return;

			ajax[country_code] = $.ajax('/shipping/rest/states.json', {
				data: { country_code: country_code },
				dataType: 'json',
				type: 'get',
				success: function(data) {
					window.state_options[country_code] = data;
					delete ajax[country_code];
				}
			});
		});
	})();

    $('.state-code').typeahead({
        source: function() {
            this.country = this.$element.closest('tr').find('select.country-code').val();

            return $.map(window.state_options[this.country] || {}, function(_,k) { return k; });
        },
        matcher: function(item) {
            // The item matches the query, or the description of the item matches the query.
            return item.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
                || window.state_options[this.country][item].toLowerCase().indexOf(this.query.toLowerCase()) >= 0; 
        },
        highlighter: function(item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')

            item = item + ' (' + window.state_options[this.country][item] + ')';

            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            });
        }
    });

    $('a[rel=tooltip]').tooltip();
});
