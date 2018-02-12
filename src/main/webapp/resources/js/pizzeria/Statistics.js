var Statistics = function(){
	//Chart.defaults.global.showTooltips=false;
	
	var pizzasPerYearFromServer;
	var pizzasPerMonthFromServer;
	var bookingsPerYearFromServer;
	var bookingsPerMonthFromServer;
	var rgb;
	var labelsYear=["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"];
	var labelsMonth=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15",
	                 "16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

	var options={
		    ///Boolean - Whether grid lines are shown across the chart
		    scaleShowGridLines : true,
		    //String - Colour of the grid lines
		    scaleGridLineColor : "rgba(0,0,0,.05)",
		    //Number - Width of the grid lines
		    scaleGridLineWidth : 1,
		    //Boolean - Whether to show horizontal lines (except X axis)
		    scaleShowHorizontalLines: true,
		    //Boolean - Whether to show vertical lines (except Y axis)
		    scaleShowVerticalLines: true,
		    //Boolean - Whether the line is curved between points
		    bezierCurve : true,
		    //Number - Tension of the bezier curve between points
		    bezierCurveTension : 0.4,
		    //Boolean - Whether to show a dot for each point
		    pointDot : true,
		    //Number - Radius of each point dot in pixels
		    pointDotRadius : 4,
		    //Number - Pixel width of point dot stroke
		    pointDotStrokeWidth : 1,
		    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
		    pointHitDetectionRadius : 20,
		    //Boolean - Whether to show a stroke for datasets
		    datasetStroke : true,
		    //Number - Pixel width of dataset stroke
		    datasetStrokeWidth : 2,
		    //Boolean - Whether to fill the dataset with a colour
		    datasetFill : true//,
		    //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<this.segments.length; i++){%><li><span style=\"background-color:<%=this.segments[i].fillColor%>\"></span><%if(this.segments[i].label){%><%=this.segments[i].label%><%}%></li><%}%></ul>"

	};
	
	var optionsPolar={
	    //Boolean - Show a backdrop to the scale label
	    scaleShowLabelBackdrop : true,
	    //String - The colour of the label backdrop
	    scaleBackdropColor : "rgba(255,255,255,0.75)",
	    // Boolean - Whether the scale should begin at zero
	    scaleBeginAtZero : true,
	    //Number - The backdrop padding above & below the label in pixels
	    scaleBackdropPaddingY : 2,
	    //Number - The backdrop padding to the side of the label in pixels
	    scaleBackdropPaddingX : 2,
	    //Boolean - Show line for each value in the scale
	    scaleShowLine : true,
	    //Boolean - Stroke a line around each segment in the chart
	    segmentShowStroke : true,
	    //String - The colour of the stroke on each segement.
	    segmentStrokeColor : "#fff",
	    //Number - The width of the stroke value in pixels
	    segmentStrokeWidth : 2,
	    //Number - Amount of animation steps
	    animationSteps : 100,
	    //String - Animation easing effect.
	    animationEasing : "easeOutBounce",
	    //Boolean - Whether to animate the rotation of the chart
	    animateRotate : true,
	    //Boolean - Whether to animate scaling the chart from the centre
	    animateScale : false//,
	    //String - A legend template
	    //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

	}
	
	var initRgba = function(){
		var rgbSet=new Array();
		rgbSet.push([200,200,200]);
		rgbSet.push([150,0,150]);
		rgbSet.push([100,200,200]);
		rgbSet.push([255,0,0]);//rosso
		rgbSet.push([0,255,0]);//verde
		rgbSet.push([0,0,255]);//blu
		rgbSet.push([255,255,0]);//giallo
		rgbSet.push([255,125,0]);//arancio
		rgbSet.push([125,0,255]);
		rgbSet.push([255,100,100]);
		rgbSet.push([0,100,100]);
		return rgbSet;
	}
	
	
	var initBookingCharts = function(idChart, data){
		$("#"+idChart).remove();
		$("#canvasContenitor"+idChart).html('<canvas id="'+idChart+'" width="730" height="380"></canvas>');
		var ctx= $("#"+idChart).get(0).getContext("2d");
		var chart=new Chart(ctx).PolarArea(data, optionsPolar);
		$("#"+idChart+'-legend').html(generateLegendChart(data));
	}
	
	
	var initPizzaCharts = function(idChart,actionString, data,typeChart){
		console.log(data)
		$("#"+idChart).remove();
		$("#canvasContenitor"+idChart).html('<canvas id="'+idChart+'" width="730" height="380"></canvas>');
		var ctx= $("#"+idChart).get(0).getContext("2d");
		var chart;
		
		if(actionString=="yearAction"){
			
			switch ($('#yearButtons .active > input').val()) {
			case "Radar":
				chart = new Chart(ctx).Radar(data, options);				
				break;
			case "Bar":
				chart = new Chart(ctx).Bar(data, options);							
				break;
			case "Line":
				chart = new Chart(ctx).Line(data, options);			
				break;
			default:
				break;
			}
		}
		else if(actionString=="monthAction"){
			switch ($('#monthButtons .active > input').val()) {
			case "Radar":
				chart = new Chart(ctx).Radar(data, options);				
				break;
			case "Bar":
				chart = new Chart(ctx).Bar(data, options);							
				break;
			case "Line":
				chart = new Chart(ctx).Line(data, options);			
				break;
			default:
				break;
			}		
		}
			
		$("#"+idChart+'-legend').html(generateLegendChart(data.datasets));
	}
	
	
	var generateLegendChart= function(data){
		string="<table class='table table-striped' style='font-size:13px;'>";
			for (var int = 0; int < data.length; int++) {
				string+="<tr>";
				string+="<td><div style='height:15px;width:15px;background-color:"+data[int].color+";'></div></td>";
				string+="<td>"+data[int].label+"</td>"
				string+="</tr>";
			}
		string+="</table>";
		console.log(string);
		return string;
	}
	
	var initControls = function(){
		
		rgb=initRgba();
		var d = new Date();
		var month = d.getMonth();
		var day = d.getDate();
		var year = d.getFullYear();

		$(".select-pizza-multiple").select2();
		
		$('#datetimepicker').datetimepicker({
			format: 'MM/YYYY',
		});
		$("#datetimepicker").data("DateTimePicker").date(new Date(year, month, day, 00, 01));
	
		sendAction("yearAction",$("#datetimepicker").data("DateTimePicker").date().format('YYYY'));
		sendAction("monthAction",$("#datetimepicker").data("DateTimePicker").date().format('MM/YYYY'));
	}
	
	var initListeners = function(){
		
		$("#datetimepicker").on("dp.change", function(e) {
			sendAction("yearAction",$("#datetimepicker").data("DateTimePicker").date().format('YYYY'));
			sendAction("monthAction",$("#datetimepicker").data("DateTimePicker").date().format('MM/YYYY'));
		});
		
		$('#pizzasForYears.select-pizza-multiple').on('change',function(e) {
			filterChart("yearAction");
		});
		
		$('#pizzasForMonths.select-pizza-multiple').on('change',function(e) {
			filterChart("monthAction");
		});
		
		$('#yearButtons').on('change',function(e) {
			console.log($('#yearButtons .active > input').val());
			filterChart("yearAction");
		});
		
		$('#monthButtons').on('change',function(e) {
			console.log($('#monthButtons .active > input').val());
			filterChart("monthAction");
		});
	}
	
	var filterChart = function(actionString){
		if(actionString=="yearAction"){
			
			var filterPizzas=$('#pizzasForYears.select-pizza-multiple').val();
			var data=createPizzaData("yearAction",rgb);
			
			if(filterPizzas==undefined){
				initPizzaCharts("yearChart","yearAction",data);
				initBookingCharts("bookingYearChart",createBookingData("yearAction"));
				return;
			}
			
			var dataFiltered=new Object();
			dataFiltered.labels=data.labels;
			dataFiltered.datasets=new Array();
			
			
			for (var int = 0; int < filterPizzas.length; int++) {
				var pizza=filterPizzas[int]
				for (var int2 = 0; int2 < data.datasets.length; int2++) {
					if(data.datasets[int2].label==pizza)
						dataFiltered.datasets.push(data.datasets[int2]);
				}
			}
			console.log(dataFiltered)
			//var typeChart=$('#yearButtons .active > input').val();
			//console.log(typeChart);
			initPizzaCharts("yearChart","yearAction",dataFiltered);
			initBookingCharts("bookingYearChart",createBookingData("yearAction"));
		}
		else if(actionString=="monthAction"){
			
			var filterPizzas=$('#pizzasForMonths.select-pizza-multiple').val();
			var data=createPizzaData("monthAction",rgb);
			
			if(filterPizzas==undefined){
				initPizzaCharts("monthsChart","monthAction",data);
				console.log(createBookingData("monthAction"));
				initBookingCharts("bookingMonthChart",createBookingData("monthAction"));
				return;
			}
			
			var dataFiltered=new Object();
			dataFiltered.labels=data.labels;
			dataFiltered.datasets=new Array();
			
			for (var int = 0; int < filterPizzas.length; int++) {
				var pizza=filterPizzas[int]
				for (var int2 = 0; int2 < data.datasets.length; int2++) {
					if(data.datasets[int2].label==pizza)
						dataFiltered.datasets.push(data.datasets[int2]);
				}
			}
			console.log(dataFiltered)
			//var typeChart=$('#monthButtons .active > input').val();
			//console.log(typeChart);
			initPizzaCharts("monthsChart","monthAction",dataFiltered);
			console.log(createBookingData("monthAction"));
			initBookingCharts("bookingMonthChart",createBookingData("monthAction"));
		}
	}
	
	var sendAction = function(actionString, dateString){
		
		$.ajax({
			url : "/pizzeriastatisticsAjax",
			type : 'GET',
			data : {
				action : actionString,
				date : dateString
			},
			success : function(data) {
				if(actionString=="yearAction"){
					pizzasPerYearFromServer=data[0];
					bookingsPerYearFromServer=data[1];
					console.log(data);
					filterChart("yearAction");
					//initPizzaCharts("yearsChart",actionString,createPizzaData(actionString,rgb));
					console.log(pizzasPerYearFromServer)
				}
				else if(actionString=="monthAction"){
					pizzasPerMonthFromServer=data[0];
					bookingsPerMonthFromServer=data[1];
					console.log(data);
					filterChart("monthAction");
					//initPizzaCharts("monthsChart",actionString,createPizzaData(actionString,rgb));
					console.log(pizzasPerMonthFromServer);
				}
			},
			error : function(data, status, er) {
				alert("error: " + data + " status: " + status + " er:" + er);
			}
		});
	}
	
	
	var createBookingData= function(actionString){
		
		var data;
		if(actionString=="yearAction"){
				data=[
			            {
			            	value: bookingsPerYearFromServer.delivery[0],
			            	color:"#F7464A",
			            	highlight: "#FF5A5E",
			            	label: "Delivery"
			            },
			            {
			            	value: bookingsPerYearFromServer.takeAway[0],
			            	color: "#46BFBD",
			            	highlight: "#5AD3D1",
			            	label: "Take Away"
			            },
			            {
			            	value: bookingsPerYearFromServer.table[0],
			            	color: "#FDB45C",
			            	highlight: "#FFC870",
			            	label: "Table"
			            }]
			
		}
		else if(actionString=="monthAction"){
			data=[
		            {
		            	value: bookingsPerMonthFromServer.delivery[0],
		            	color:"#F7464A",
		            	highlight: "#FF5A5E",
		            	label: "Delivery"
		            },
		            {
		            	value: bookingsPerMonthFromServer.takeAway[0],
		            	color: "#46BFBD",
		            	highlight: "#5AD3D1",
		            	label: "Take Away"
		            },
		            {
		            	value: bookingsPerMonthFromServer.table[0],
		            	color: "#FDB45C",
		            	highlight: "#FFC870",
		            	label: "Table"
		            }]
		}
		return data;
	}
	
	
	var createPizzaData= function(actionString, rgb){
		
		var labels,dataFromServer,data;
		if(actionString=="yearAction"){
			labels=labelsYear;
			dataFromServer=pizzasPerYearFromServer;
		}
		else if(actionString=="monthAction"){
			labels=labelsMonth;
			dataFromServer=pizzasPerMonthFromServer;
		}
		
		data=new Object();
		data.labels=labels;
		data.datasets=new Array();
		
		var keys = [];
		for(var k in dataFromServer) keys.push(k);
		
		for (var int = 0; int < keys.length; int++) {
			var object=new Object();
			console.log()
			object.label=keys[int];
			object.color= "rgba("+rgb[int][0]+","+rgb[int][1]+","+rgb[int][2]+",1)";
			object.fillColor= "rgba("+rgb[int][0]+","+rgb[int][1]+","+rgb[int][2]+",0.2)";
			object.strokeColor= "rgba("+rgb[int][0]+","+rgb[int][1]+","+rgb[int][2]+",1)";
			object.pointColor= "rgba("+rgb[int][0]+","+rgb[int][1]+","+rgb[int][2]+",1)";
			object.pointStrokeColor= "#fff";
			object.pointHighlightFill= "#fff";
			object.pointHighlightStroke= "rgba("+rgb[int][0]+","+rgb[int][1]+","+rgb[int][2]+",1)";
			object.data= dataFromServer[keys[int]];
			data.datasets.push(object);
		}
		
		return data;
	}
	
	return {
		init : function() {
			initControls();
			initListeners();
		}
	}
	
}();