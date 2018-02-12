var LiveRestaurant = function(){
	
	var tableLiveRestaurant;
	var bookingConfermedFromServer;
	var columnId = 8;
	var columnPayment = 6;
	var columnPriority = 5;

	var initDataTable = function() {
		
		tableLiveRestaurant= $('#liveRestaurantTable').DataTable({
	        "paging":         true,
			columns : [ 
			        {
		                "className":      'details-control',
		                "orderable":      false,
		                "data":           null,
		                "defaultContent": ''
			        },
				    {"string" : "User"},
				    {"string" : "Name"},
				    {"string" : "Data"},
				    {"string" : "Time"},
				    {"string" : "Priority"},
				    {"string" : "Payment"},
				    {"string" : "Bill"},
				    {"string" : "Id"}
				   
				    ],
		    columnDefs : [ {
				/* Shows glutenFree as 'Yes' or 'No. */
				render : function(data, type, row) {
					if(data==false)
						return 'No'
					else
						return 'Yes'	
				},
				targets : 6
			} ],
			order : [ [ 3, 'desc' ] ]
			});
		tableLiveRestaurant.columns(columnId).visible(false);
		
		var data;
		$.ajax({
			url : "/pizzerialiverestaurantAjax",
			type : 'GET',
			success : function(data) {
				//inizialize table
				bookingConfermedFromServer=data;
				initializeLiveRestaurantTable(data);
			},
			error : function(data, status, er) {
				alert("error: " + data + " status: " + status + " er:" + er);
			}
		});
		
		setControlButtons(true,true,true,true,true);
	}

	var initializeLiveRestaurantTable = function(bookingsConfermed){
		
		for (var int = 0; int < bookingsConfermed.length; int++) {
			
			var user="-"
			var nome="-"
			if(bookingsConfermed[int].user!=undefined)
				user=bookingsConfermed[int].user;
			if(bookingsConfermed[int].underTheNameOf!=undefined)
				nome=bookingsConfermed[int].underTheNameOf;
			
			var rowToAdd=[ "", 
						  user,
						  nome,
						  bookingsConfermed[int].date,
						  bookingsConfermed[int].time,
						  bookingsConfermed[int].priority,
						  bookingsConfermed[int].payment,
						  bookingsConfermed[int].bill +" &euro;",
						  bookingsConfermed[int].id];
			tableLiveRestaurant.row.add(rowToAdd).draw(false);
		}
		
		tableLiveRestaurant.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
			
			var priority=this.data()[columnPriority];
			if(priority>=5){
				$(this.node()).css("color","rgb(207,48,45)");
			}
		});
	}

	
	
	
	var initListeners = function(){
		
		$('#liveRestaurantTable tbody').on('click', 'td.details-control', function() {

			var tr = $(this).closest('tr');
			var row = tableLiveRestaurant.row(tr);
			
			if (row.child.isShown()) {
				row.child.remove();
				tr.removeClass('shown');
			} 
			else{
				row.child("<img src='resources/gifs/loading.gif' width='50px' height='50px'></img>").show();
				tr.addClass('shown');
				loadInfoBooking(function (){
					var tableString=format(row.data()[columnId]);
					row.child(tableString).show();
				});
			}
		});

		$('#liveRestaurantTable tbody').on('click', 'tr', function() {
			 
			if ($(this).hasClass('selected')&& tableLiveRestaurant.row(this).data()!=undefined &&($(this).hasClass("odd")|| $(this).hasClass("even"))) {

				$(this).removeClass('selected');
				setControlButtons(true,true,true,true,true);
			
			} 
			else if(!$(this).hasClass('selected') && tableLiveRestaurant.row(this).data()!=undefined &&($(this).hasClass("odd")|| $(this).hasClass("even")) ){
				
				tableLiveRestaurant.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				if(tableLiveRestaurant.row(this).data()[columnPayment]=="true")
						setControlButtons(false,false,false,false,true);
					else
						setControlButtons(false,false,false,false,false);
			}//end else if
		});
		
		$("#collectButtonLiveRestaurant").on('click',function(){
			var idBookingConfermed=tableLiveRestaurant.row('.selected').data()[columnId];
			sendRequest('collect', findBookingConfermed(idBookingConfermed), function(response) {
				tableLiveRestaurant.row('.selected').remove().draw(false);
				callAndSetModal("Booking "+response+"!");
			});
		});
		
		$("#updateButtonLiveRestaurant").on('click',function(){
			editLiveRestaurant();
		});
		
		$("#removeButtonLiveRestaurant").on('click',function(){
			var idBookingConfermed=tableLiveRestaurant.row('.selected').data()[columnId];
			sendRequest('remove', findBookingConfermed(idBookingConfermed), function(response) {
				tableLiveRestaurant.row('.selected').remove().draw(false);
				callAndSetModal("Booking "+response+"!");
			});
		});
		
		$("#sendBackButtonLiveRestaurant").on('click',function(){
			var idBookingConfermed=tableLiveRestaurant.row('.selected').data()[columnId];
			sendRequest('sendBack', findBookingConfermed(idBookingConfermed), function(response) {
				tableLiveRestaurant.row('.selected').remove().draw(false);
				callAndSetModal("Booking "+response+"!");
			});
		});
		
	}
	
	function format(idBookingConfermed) {
		string="";
		for (var int = 0; int < bookingConfermedFromServer.length; int++) {
			if(bookingConfermedFromServer[int].id==idBookingConfermed){
				var bookingConfermed=bookingConfermedFromServer[int];
				
				string = '<table class="attacable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;font-size:14px;margin-bottom:10px;">';
				string += '<tr>' 
						 + '<td><b>Type</b></td>' 
						 + '<td>'
						 + bookingConfermed.type 
						 + '</td>'
						 + '</tr>';
				
				if(bookingConfermed.type=="delivery"){
					string += '<tr>' 
						 + '<td><b>Address</b></td>' 
						 + '<td>'
						 + bookingConfermed.address.city
						 + '  -</td>'
						 + '<td>'
						 + bookingConfermed.address.street
						 + '  -</td>'
						 + '<td>'
						 + bookingConfermed.address.number 
						 + '</td>'
						 + '</tr>';
				}
				else if(bookingConfermed.type=="table"){
					var tablesString="";
					for (var int2 = 0; int2 < bookingConfermed.tables.length; int2++) {
						tablesString+="TableN. "
									+ bookingConfermed.tables[int2].number
									+ " - Max "
									+ bookingConfermed.tables[int2].maxSeats
									+ " - Min "
									+ bookingConfermed.tables[int2].minSeats
						if(int2!=bookingConfermed.tables.length-1)
							tablesString+=', ';
					}
					string += '<tr>' 
						 + '<td><b>Tables</b></td>' 
						 + '<td>'
						 + tablesString
						 + '</td>'
						 + '</tr>';					
				}
				string += '</table>';
				
				if(bookingConfermed.pizzas.length>0){
					string+='<table class="table table-bordered" style="font-size:13px;"><thead><tr>'
							+'<th>Pizza</th>'
							+'<th>Gluten</th>'
							+'<th>Size</th>'
							+'<th>Edited</th>'
							+'<th>Ingredients</th>'
							+'<th>Number</th>'
							+'<th>Price</th>'
							+'<th>Total</th>'
							+'</tr></thead>';
					
							
					for (var int2 = 0; int2 < bookingConfermed.pizzas.length; int2++) {
						string+="<tr>"
								+"<td>"+bookingConfermed.pizzas[int2].name+"</td>"
								+"<td>"+bookingConfermed.pizzas[int2].glutenFree+"</td>"
								+"<td>"+bookingConfermed.pizzas[int2].size+"</td>";
								if(bookingConfermed.pizzas[int2].ingredientsAdded.length>0 || bookingConfermed.pizzas[int2].ingredientsRemoved.length>0)
									string+="<td>yes</td>";	
								else
									string+="<td>no</td>";
									
								var ingredientsTotal=new Array();
								for (var int3 = 0; int3 < bookingConfermed.pizzas[int2].ingredientsBase.length; int3++) {
									var idBase=bookingConfermed.pizzas[int2].ingredientsBase[int3].id;
									var founded=false;
									for (var int4 = 0; int4 < bookingConfermed.pizzas[int2].ingredientsRemoved.length; int4++) {
										if(idBase==bookingConfermed.pizzas[int2].ingredientsRemoved[int4].id){
											founded=true;
										}
									}
									if(founded==false)
										ingredientsTotal.push(bookingConfermed.pizzas[int2].ingredientsBase[int3]);
								}
								//ingredientsTotal=_.difference(bookingConfermed.pizzas[int2].ingredientsBase,bookingConfermed.pizzas[int2].ingredientsRemoved);
								ingredientsTotal=_.union(ingredientsTotal,bookingConfermed.pizzas[int2].ingredientsAdded);
								
								var listIngredients="";
								for (var int3 = 0; int3 < ingredientsTotal.length; int3++) {
									listIngredients+=ingredientsTotal[int3].name;
									if(int3!==ingredientsTotal.length-1)
										listIngredients+=",";
								}
								
								string+="<td>"+listIngredients+"</td>"
								+"<td>"+bookingConfermed.pizzas[int2].number+"</td>"
								+"<td>"+bookingConfermed.pizzas[int2].priceEach+" &euro;</td>"
								+"<td>"+new Number(bookingConfermed.pizzas[int2].number)*new Number(bookingConfermed.pizzas[int2].priceEach)+ " &euro;</td>"
								+"</tr>";
					}
					string+='</table>';
				}
				if(bookingConfermed.beverages.length>0){
					string+='<table class="table table-bordered" style="font-size:13px;"><thead><tr>'
							+'<th>Beverage</th>'
							+'<th>Brand</th>'
							+'<th>Type</th>'
							+'<th>Container</th>'
							+'<th>Size</th>'
							+'<th>Number</th>'
							+'<th>Price</th>'
							+'<th>Total</th>'
							+'</tr></thead>';
					for (var int2 = 0; int2 < bookingConfermed.beverages.length; int2++) {
						string+="<tr>"
								+"<td>"+bookingConfermed.beverages[int2].name+"</td>"
								+"<td>"+bookingConfermed.beverages[int2].brand+"</td>"
								+"<td>"+bookingConfermed.beverages[int2].type+"</td>"
								+"<td>"+bookingConfermed.beverages[int2].container+"</td>"
								+"<td>"+bookingConfermed.beverages[int2].size+"</td>"
								+"<td>"+bookingConfermed.beverages[int2].number+"</td>"	
								+"<td>"+bookingConfermed.beverages[int2].priceEach+" &euro;</td>"
								+"<td>"+new Number(bookingConfermed.beverages[int2].number)*(new Number(bookingConfermed.beverages[int2].priceEach))+" &euro;</td>"
								+"</tr>";
					}
					string+='</table>';
					
				}
			}
		}
		return string;
	}

	function loadInfoBooking(loading){
		setTimeout(function(){loading();},300);
	}
	
	var sendRequest = function(action, bookingResume, onSuccess) {
		var reducedBookingResume=reduceBooking(bookingResume);
		var stringB=JSON.stringify(reducedBookingResume);
		$.ajax({
			method : 'POST',
			url : '/pizzerialiverestaurantAction',
			data :{
				action: action,
				booking: stringB
			},
			success : function(response) {
				onSuccess(response);
			}
		});
	};
	
	var reduceBooking = function(booking){
		var newBooking=_.clone(booking);
		var beverages=new Array();
		var address=new Object();
		var tables=new Array();
		
		for (var int = 0; int < booking.beverages.length; int++) {
			beverages.push(_.pick(booking.beverages[int],'id','number'));
		}
		newBooking.beverages=beverages;
		//newBooking=_.omit(newBooking,'pizzas','beverages');
		
		if(booking.type=="delivery"){
			addressId=booking.address['id'];
			newBooking.address=new Object();
			newBooking.address.id=addressId;
		}
		else if(booking.type=="table"){
		
			for (var int = 0; int < booking.tables.length; int++) {
				tables.push(booking.tables[int]['id']);
			}
			newBooking.tables=tables;
		}
		return newBooking;
	}
	
	var findBookingConfermed = function(idBooking){
		for (var int = 0; int < bookingConfermedFromServer.length; int++) {
			if(bookingConfermedFromServer[int].id==idBooking)
				return bookingConfermedFromServer[int];
		}
	}
	
	var editLiveRestaurant = function(){
		var idLiveRestaurant=tableLiveRestaurant.row('.selected').data()[columnId];
		communicator.bookingToEdit=findBookingConfermed(idLiveRestaurant);
		
		$('#content').load("pizzerialiveorder", function(data) {
			$('.nav-pills .active').removeClass('active');
			$("#liLiveOrderTool").addClass('active');
		});
	}
	
	var setControlButtons = function(boolButtonComplete, boolButtonUpdate, boolButtonRemove, boolButtonSendBack){
		
		$("#collectButtonLiveRestaurant").prop('disabled', boolButtonComplete);
		$("#updateButtonLiveRestaurant").prop('disabled', boolButtonUpdate);
		$("#removeButtonLiveRestaurant").prop('disabled', boolButtonRemove);
		$("#sendBackButtonLiveRestaurant").prop('disabled', boolButtonSendBack);
	}
	
	var callAndSetModal = function(message){
		$("#modalMessage").text(message);
		$('#modalAlert').modal('show');
	}
	
	return {
		init : function() {
			initDataTable();
			initListeners();
		}
	}
	
}();