(function(){
    $.fn.sortableTable = function(options) {
        var self = this,
            has_many;
        if (this.find('tbody').length) {
            self = this.find('tbody');
        }

        function next_order() {
            // There is an extra row (the new-row row), but that's OK because we want 1 more than the number of rows
            return self.find('tr').not('.no-content').length;
        }
        var methods = {
            'onSortUpdate': function() {
                self.find('tr').each(function(index, item){
                    $(item).find('input.order').val(index);
                });
            },
            'onNewRow': function() {
                self.sortable('refresh');
            }
        };

        var api = {
            add_row: function(row_data, callback) {
                self.find('.no-content').addClass('hidden');
                //1. put data in inputs
                var i;
                $.each(has_many.get_new_row().find(':input'), function(i, input){
                    if ($(input).hasClass('order')) return;

                    $(input).val(row_data[i++]);
                })
                //2. compute order
                has_many.get_new_row().find(':input.order').val(next_order());

                //3. call add_new_row on hasMany
                var row = has_many.add_new_row();

                //4. call callback
                if (callback) {
                    callback.call(this, row);
                }
                //5. trigger some event new-row.sortable-table with new row
                // FIXME: this will have triggered two new-row events, which may not be desirable.
                $.event.trigger('new-row.sortable-table', {row: row});
            }
        };

        var defaults = {
            'hasMany': {},
            'sortupdate' : function(){},
            'newrow': function(){}
        };
        // TODO: accept options for hasMany
        var opts = $.extend(true, defaults, options);

        // Intentionally use the table here, not any computed tbody
        this.hasMany(opts.hasMany);
        delete opts['hasMany'];
        has_many = this.data('hasMany');

        // Fix the width of the row.
        var widthHelper = function(e, ui) {
            ui.children().each(function() {
                $(this).width($(this).width());
            });
            return ui;
        };

        // Make the things sortable.
        self.find(':input.order').attr('readonly', 'readonly');
        self.sortable({
            helper: widthHelper
        }).disableSelection();

        // Bind to the sortupdate handler of ui.
        // don't use self because more than one tbody would mean more than one event handler
        this.bind('sortupdate', function(event,ui){
            methods.onSortUpdate.call(self, event, ui);
            opts.sortupdate.call(self, event, ui);
        });
        this.bind('new-row.has-many', function(row){
            methods.onNewRow.call(self, row);
            opts.newrow.call(self, row);
        });
        this.bind('remove-row.has-many', function() {
            if (next_order() == 1) {
                self.find('.no-content').removeClass('hidden');
            }
        })

        this.data('sortableTable', api);

        // Always return the thing you called it on
        return this;
    }
})();