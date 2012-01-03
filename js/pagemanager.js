$(document).ready(function() {
	
	var pmConfig = {
		'revisionId':null,
		
		'pageId':0,
		
		init : function() {
			// Do initial config
			this.revisionId = $('input[name="revision_id"]').val();
			this.pageId = $('input[name="page_id"]').val();
		},
		updatePage : function() {
			$.post('/admin/cms/page/addedit_ajax/', {'page_id' : this.pageId
			}).success(function(data){
				$('#page-container').html(data);
			});
		},
		createSection : function() {
			$.post('/admin/cms/section/create/', {
				'page_id' : this.pageId,
				'revision_id' : this.revisionId,
				'section_name' : $('input[name="section_name"]').val(),
				'section_type' : $('select[name="section_type"]').val()
			}).success(function(data){
				$('#sections-sortable').append(data);
			});
		},
		removeSection : function($section) {
			var sectionId = $section.find('input[name="section_id"]').val();
			$.post('/admin/cms/section/delete/', { 
				'page_id' : this.pageId,
				'section_id' : sectionId,
				'revision_id' : this.revisionId
			}).success(function(data){
				$('#page-container').prepend('<div class="alert-message success" data-alert="alert">'+data+'<a class="close" href="#">x</a></div>');
				$section.slideUp('slow');
			});
		},
		updateSectionPositions : function() {
			$.post("/admin/cms/rest/section_order.json/"+this.pageId+'/', $('#sections-sortable').sortable('serialize'))
			.success(function(data){
				if(data.success == 'true')
				{
					alert('category order saved');
				}
			});
		},
		autoSave : function(success) {
			var that = this;
			var form = $('#create_page').find('form');
			$.post('/admin/cms/rest/autosave.json', form.serialize())
			.success(function(data){
				if(data.success) 
				{
					autosave = data.autosave;
					that.revisionId = autosave.id;
					pmConfig.updatePage();
					// Call the success callback
					// passing it the autosave obj
					if(success != null)
					{
						success.call(autosave);
					}
				}
			});			
		}
	};
	pmConfig.init();
	
	
	$('.create-section-btn').live('click', function(e) {
		e.preventDefault();
		// Autosave first so that we dont loose the original values
		// and pass the create section as a callback (we want to wait for
		// the autosave to finish before doing anything else
		pmConfig.createSection();
	});
	
	$('.cms-section .close').unbind('click');
	$('.cms-section .close').live('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		var section = $(this).parents('.cms-section');
		pmConfig.removeSection(section);
	});
	
	$('input.lookup-type:checked').each( function(){
		toggleLookup($(this));
	});
	
	$('input.lookup-type:checked').live('change', function(e){
		toggleLookup($(this));
	});
	
	function toggleLookup($checkbox)
	{
		if($checkbox.val() == 0)
		{
			$checkbox.parents('fieldset').find('input.latitude, input.longitude').parents('.clearfix').hide();
			$checkbox.parents('fieldset').find('input.postcode').parents('.clearfix').show();
			$checkbox.parents('fieldset').find('button.postcode-lookup-btn').parents('.clearfix').show();
			
		}
		else
		{
			$checkbox.parents('fieldset').find('input.latitude, input.longitude').parents('.clearfix').show();
			$checkbox.parents('fieldset').find('input.postcode').parents('.clearfix').hide();
			$checkbox.parents('fieldset').find('button.postcode-lookup-btn').parents('.clearfix').hide();
		}
	}
	
	$('button.postcode-lookup-btn').live('click', function(e){
		e.preventDefault();
		var $this = $(this);
		maps.geocodePostcode($(this).parents('fieldset').find('input.postcode').val(), function(location){
			if(location == null)
			{
				alert('geocoder failed to lookup postcode');
			}
			else
			{
				$this.parents('fieldset').find('input.latitude').val(location.latitude);
				$this.parents('fieldset').find('input.longitude').val(location.longitude);
				$this.parents('fieldset').find('input.latitude, input.longitude').parents('.clearfix').show();
			}
		});
	});
	
	$('#sections-sortable').sortable({
		update : function(){
			pmConfig.updateSectionPositions();
		},
		cancel : '.map-content, input, textarea, button, .move, .edit, .save'
	});
	
	$('table .move').live('click', function(e){
		e.preventDefault();
	
		var wrapper = $(this).parents('fieldset').find('.table-builder');
		var tableMarkup = $(this).parents('fieldset').find('input[type="hidden"].table-markup');	
		var tableId = $(this).parents('.table-builder').data('tablebuilder');
		var table = tableBuilder.tableObj[tableId];
		var index;
		
		if($(this).hasClass('move-up'))
		{
			index = $(this).parents('table').find('tbody tr')
				.index($(this).parents('tr').get(0));
				
			table.moveRow(index, -1);
		}
		else if($(this).hasClass('move-down'))
		{
			index = $(this).parents('table').find('tbody tr')
				.index($(this).parents('tr').get(0));
				
			table.moveRow(index, 1);
		}
		else if($(this).hasClass('move-left'))
		{
			index = $(this).parents('table').find('thead th')
				.index($(this).parents('th').get(0));
			
			table.moveColumn(index, -1);
		}
		else
		{
			index = $(this).parents('table').find('thead th')
				.index($(this).parents('th').get(0));
				
			table.moveColumn(index, 1);
		}
		
		// Update the output
		wrapper.html(table.markup);
		tableMarkup.val(table.outputTable());
	});
	
	$('.add-header').live('click', function(){
		var wrapper = $(this).parents('fieldset').find('.table-builder');
		var tableMarkup = $(this).parents('fieldset').find('input[type="hidden"].table-markup');
		var tableId = wrapper.data('tablebuilder');
		var table = tableBuilder.tableObj[tableId];
		var headerContent = $(this).parents('fieldset').find('.header-content').val();
		table.addColumn(headerContent);
		
		// Output
		wrapper.html(table.markup);
		tableMarkup.val(table.outputTable());
	});
	
	$('.add-row').live('click', function(){
		
		var wrapper = $(this).parents('fieldset').find('.table-builder');
		var tableMarkup = $(this).parents('fieldset').find('input[type="hidden"].table-markup');
		var tableId = wrapper.data('tablebuilder');
		var table = tableBuilder.tableObj[tableId];
		var colCount = table.headers.length;
		var newRow = [];
		
		for(var i = 0; i < colCount; i++)
		{
			newRow.push('&nbsp;');
		}
		
		table.addRow(newRow);
		
		// Output
		wrapper.html(table.markup);
		tableMarkup.val(table.outputTable());
	});
	
	$('td a.edit').live('click',function(e){
		e.preventDefault();
		$(this).parents('table').find('.move').hide();
		
		// Dont allow moving columns when editing
		// otherwise it'll turn the internet off.
		$(this).removeClass('edit').addClass('save').text('Save');
		$(this).parents('tr').find('input').show();
		$(this).parents('tr').find('span.value').hide();
	});
	
	$('td a.save').live('click', function(e){
		e.preventDefault();
		
		var wrapper = $(this).parents('fieldset').find('.table-builder');
		var tableMarkup = $(this).parents('fieldset').find('input[type="hidden"].table-markup');
		var tableId = wrapper.data('tablebuilder');
		var table = tableBuilder.tableObj[tableId];
		
		var newRow = [""];
		var link = $(this);
		
		var index = link.parents('table').find('tbody tr')
				.index(link.parents('tr').get(0));
				
		link.removeClass('save').addClass('edit').text('Edit');
		link.parents('tr').find('input').each(function(){
			var input = $(this);
			$(this).siblings('span.value').text($.trim(input.val()));
		});
		
		link.parents('tr').find('input').hide();
		link.parents('tr').find('span.value').show();
		
		// Upddate the row in tablebuilder
		link.parents('tr').find('td span.value').each(function(){
			newRow.push($.trim($(this).text()));
		});
		
		table.updateRow(index, newRow);
		
		wrapper.html(table.markup);
		tableMarkup.val(table.outputTable());		
		
		// All editing has finished, let them move stuff around again
		if(link.parents('table').find('.save').length == 0)
		{
			link.parents('table').find('.move').show();
		}
	});
});
