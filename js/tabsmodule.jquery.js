var tab = ''; 

$(document).ready(function() {
	tab = $("#tabtype").val();
});

// .on() doesn't work when removing elements..
$(".remove").live("click", function() {

	var id = $(this).data('tab_item_id');
	
	$(this).parent().parent().fadeOut(500, function() {

		$(this).remove();
		if($(".tabitems tbody tr").length <= 0) $(".tabitems").addClass('hide');		

		$.ajax({
			'type'		: 'post',
			'url'		: '/rest/'+tab+'/delete.json',
			'data'		: 'tab_item_id='+id,
			'success'	: function(rsp) {
				if(rsp.error == 0) 
				{
					$("#page-container").prepend('<div class="rsp-message rsp alert alert-warning"><a class="close" href="#" data-dismiss="alert">&times;</a>'+rsp.msg+'</div>');															
				}

				else
				{
					$("#page-container").prepend('<div class="rsp-message rsp alert alert-error"><a class="close" href="#" data-dismiss="alert">&times;</a>'+rsp.msg+'</div>');
				}
			}
		});	
	});
});

//.on() doesn't work when removing/adding new elements..
$(".edit, .new").live("click", function() {
	
	if($(this).hasClass("new"))
	{
		// Clear the fields within modal as the user has clicked on the .new add button
		$("#tab_item_id").val('');
		
		$(".tab-item").each(function() {
			$(this).val();
		});
	}

	else
	{	
		// Set the fields to their respective values
		$("#tab_item_id").val($(this).data("tab_item_id"));	
		
		$(".tab-item").each(function() {
			$(this).val($("."+$(this).attr("name")).text());
		});
	}

	$('.modal').modal({
		'backdrop' 	: 'static',
		'show'		: true
	});
	
	// Disable sortable on sections
	$('#sections-sortable').sortable( "disable" );
});

// Events for enabling/disabling sortable on sections when modal is displayed
$(".modal").live('show', function() { $('#sections-sortable').sortable( "disable" ); });
$(".modal").live('hide', function() { $('#sections-sortable').sortable( "enable" ); });

/**
 * @todo - known issues with drag and drop on page. Tab items duplicate. (FIXED 19/07/2012)
 */
$(".save").live("click", function(event) {
		
	var _url = '/rest/'+tab+'/add.json';
	if($("input[name='tab_item_id']").val() != '') _url = '/rest/'+tab+'/edit.json'; 
	
	var _data = ''; var _sep = '&';
	
	$(".tab-item").each(function() {
		_data += _sep + $(this).attr('name') + "=" + $(this).val();
	});
		
	$.ajax({
		'type'		: 'post',
		'url'		: _url,
		'data'		: 'tab_item_id='+$("input[name='tab_item_id']").val()+'&tab_id='+$("input[name=tabid]").val()+_data,
		'success'	: function(rsp) {
								
			$(".rsp-message span").text(rsp.msg);
			$(".rsp-message").show().delay(1500).fadeOut(800, function() {
				if(rsp.error == 0) {
					$('.modal').modal('hide');
					$('.tabitems').removeClass('hide');
				
					// Rebuild the lists view
					refreshTabsList();			
				}
				//$(".tabitems tbody").append('<tr class="'+rsp.tab_item_id+'_tab_item"><td class="title">'+$("#form_title").val()+'</td><td class="sub_title">'+$("#form_sub_title").val()+'</td><td><i class="icon-pencil edit" title="Edit" style="cursor:pointer;"></i> <i class="icon-remove remove" title="Remove" data-tab_item_id="'+rsp.tab_item_id+'" style="cursor:pointer;"></i></td></tr>');
			});							
		
		}		
	});	
});

function refreshTabsList()
{
	$.ajax({
		'type'		: 'get',
		'url'		: '/rest/'+tab+'/tabslist.html',
		'data'		: 'tab_id='+$("input[name=tabid]").val(),
		'success'	: function(html) {
			$(".tabs-list-container").html(html);
		}
	});
}