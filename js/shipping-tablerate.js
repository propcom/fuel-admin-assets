$(function() {
	$('table[data-has-many]').hasMany({
		owner_field_name: 'rates'
	});

    (function() {
        $('.typeahead').typeahead({
            source: function() {
                this.country = this.$element.closest('tr').find('select.country-code').val();

                return $.map(window.state_options[this.country] || {}, function(_,k) { return k; });
            },
            matcher: function(item) {
                // The item matches the query, or the description of the item matches the query.
                return item.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
                    || window.state_options[this.country][item].indexOf(this.query.toLowerCase()) >= 0; 
            },
            highlighter: function(item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')

                item = item + ' (' + window.state_options[this.country][item] + ')';

                return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>'
                });
            }
        });
    })();
});
