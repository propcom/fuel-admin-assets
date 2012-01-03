// Extend array prototype to allow us to move elements around
Array.prototype.moveElement = function(index, delta)
{
	var index2;
	var temp_item;
	
	if (index < 0 || index >= this.length) {
		return false;
	}
	
	index2 = index + delta;
	
	if (index2 < 0 || index2 >= this.length || index2 == index) {
		return false;
	}

	// Move the elements in the array
	temp_item = this[index2];
	this[index2] = this[index];
	this[index] = temp_item;

	return true;
}

var tableBuilder = {
	tableObj: [],
	// Target needs to be a jquery object... thanks
	init: function($target)
	{
		var table;
		var headers = [];
		var colCount = 0;
		
		// If there is allready a map, then we need to
		// parse it into our object.
		if($target.find('table').length == 1)
		{
			var $table = $target.find('table');
			$table.find('th').each( function(){
				$(this).find('a').remove();
				headers.push($(this).text());
			});
			
			table = new tableBuilder.table(headers);
			
			colCount = table.headers.length;
			
			$table.find('tr').each( function(){
				var $row = $(this);
				var rowCols;
				
				// Make sure that we're not on the
				// header row.
				if($row.find('td').length > 0)
				{					
					if( $row.find('td').length != colCount)
					{
						rowCols = [""];
					}
					else
					{
						rowCols = [];
					}
					
					$row.find('td').each( function(){
						$(this).find('a').remove();
						rowCols.push($(this).text());
					});
					
					table.addRow(rowCols);
				}
			});
		}
		else
		{
			// Create an empty table object that
			// may have some cols / rows added later
			table = new tableBuilder.table(headers);
		}
		
		var tableId = tableBuilder.tableObj.length;
		this.tableObj[tableId] = table;
		$target.data('tablebuilder', tableId);
		
	},
	table: function(headers)
	{
		// Init method needs to be defined
		// before its run in what is 
		// essentially a constructor.
		this.init = function(headers)
		{
			for(var i = 0; i < headers.length; i++)
			{
				this.headers.push(headers[i]);
			}
		}
		
		this.rows = [];
		this.headers = ['Actions'];
		this.markup = '';
		this.cssClass = null;
		this.cssId = null;
		
		this.init(headers);
		
		this.addRow = function(row)
		{
			this.rows.push(row);
			this.buildTable();
			return this;
		}
		
		this.addColumn = function(header)
		{
			this.headers.push(header);
			
			// Add an empty element to the end of each row.
			for( var i = 0; i < this.rows.length; i++)
			{
				this.rows[i].push("&nbsp;");
			}
			this.buildTable();
			return this;
		}
		
		this.setClass = function(className, append)
		{
			if(append == null)
				this.cssClass = className;
			else
				this.cssClass += className;
			
			this.buildTable();
			return this;
		}
		
		this.setId = function(Id)
		{
			this.cssId = Id;
			this.buildTable();
			return this;
		}
		
		this.buildTable = function()
		{
			var markup = '';
			var cssClass = (this.cssClass == null) ? '' : ' class="'+this.cssClass+'"';
			var cssId = (this.cssId == null) ? '' : ' id="'+this.cssId+'"';
			
			// Build it
			if(this.headers.length > 1)
			{
				markup += '<table'+cssId+''+cssClass+'>';
				markup += '<thead>';
				markup += this.buildHeader(this.headers);
				markup += '</thead>';
				markup += '<tbody>';
				for(var i = 0; i < this.rows.length; i++)
				{
					markup += this.buildRow(this.rows[i]);
				}
				markup += '</tbody>';
				markup += '</table>';
				
				this.markup = markup;
			}
		}
		
		this.buildRow = function(row, output)
		{
			var width = 500 / (row.length + 2);
			var rowHtml = '<tr>';
			
			for(var i = 0; i < row.length; i++)
			{
				if(output === true)
				{
					rowHtml += '<td>'+row[i]+'</td>';
				}
				else
				{
					if(i == 0)
					{
						rowHtml += '<td><a href="#" class="move move-up">Up</a>, <a href="#" class="move move-down">Down</a>, <a href="#" class="edit">Edit</a></td>';
					}
					else
					{
						rowHtml += '<td><span class="value">'+row[i]+'</span><input style="display:none;width:'+width+'px;" type="text" value="'+row[i]+'" /></td>';
					}
				}
			}
			
			rowHtml += '</tr>';
			return rowHtml;
		}
		
		this.buildHeader = function(header, output)
		{
			var headerHtml = '<tr>';
			
			for(var i = 0; i < header.length; i++)
			{
				if(i == 0 || output == true)
					headerHtml += '<th>'+header[i]+'</th>';
				else
					headerHtml += '<th><a href="#" class="move move-left">Left</a> '+header[i]+' <a href="#" class="move move-right">Right</a></th>';
				
			}
			
			headerHtml += '</tr>';
			return headerHtml;			
		}
		
		this.moveColumn = function(index, delta)
		{
			if((index + delta) > 0)
			{
				this.headers.moveElement(index, delta);
				for(var i = 0; i < this.rows.length; i++)
				{
					this.rows[i].moveElement(index, delta);
				}
				
				this.buildTable();
			}
		}
		
		this.moveRow = function(index, delta)
		{
			this.rows.moveElement(index, delta);
			this.buildTable();
		}
		
		this.updateRow = function(index, newRow)
		{
			this.rows[index] = newRow;
			this.buildTable();
		}
		
		this.outputTable = function()
		{
			var i;
			var markup = '';
			var cssClass = (this.cssClass == null) ? '' : ' class="'+this.cssClass+'"';
			var cssId = (this.cssId == null) ? '' : ' id="'+this.cssId+'"';
			
			var headers = [];
			var rows = [];
			
			// Remove actions from the headers
			for(i = 1; i < this.headers.length; i++)
			{
				headers.push(this.headers[i]);
			}
			
			// Remove actions from the rows
			for(i = 0; i < this.rows.length; i++)
			{
				var newRow = [];
				for(var j = 1; j < this.rows[i].length; j++)
				{
					newRow.push(this.rows[i][j]);
				}
				rows.push(newRow);
			}
			
			// Build it
			if(headers.length > 0)
			{
				markup += '<table'+cssId+''+cssClass+'>';
				markup += '<thead>';
				markup += this.buildHeader(headers, true);
				markup += '</thead>';
				markup += '<tbody>';
				for(i = 0; i < rows.length; i++)
				{
					markup += this.buildRow(rows[i], true);
				}
				markup += '</tbody>';
				markup += '</table>';
			}
			
			return markup;
		}
	}
}