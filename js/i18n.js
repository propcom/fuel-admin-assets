$(function(){
	//console.log('chart');
	$('.datagrid-data .thumbnail').each(function(i){
		var translated = parseInt($('p', this).eq(1).text().replace(/\D/g,''));
		var awaiting = parseInt($('p', this).eq(2).text().replace(/\D/g,''));

		var total = translated + awaiting;

		$('p', this).last().remove();

		var holder = $('<div id="holder'+i+'" />').appendTo(this);
			var chart = Raphael('holder'+i, 210, 150);

		if (total == 0) {
			var outstanding = 0;

			chart.piechart(105, 75, 75, [1], {
				colors: ['#000'],
				strokewidth: 0,
				init: true
			});
		} else if (translated == 0) {
			var outstanding = 100;

			chart.piechart(105, 75, 75, [i], {
				colors: ['#272727', '#272727'],
				strokewidth: 0,
				init: true
			});
		} else {
			var outstanding = (awaiting / total)*100;

			chart.piechart(105, 75, 75, [translated, awaiting], {
				colors: ['#4cc0bf', '#4cc0bf'],
				strokewidth: 0,
				init: true
			});
		}

		$('<h4 />').text(outstanding+"% Outstanding").appendTo(this);

	});

});