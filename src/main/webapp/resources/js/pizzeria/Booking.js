var Booking = function(){
	
	//NON HO BISOGNO DELL'INITVAR perchè queste due variabili vengono inizializzate ogni volta
	var tableBooking;
	var bookingFromServer;
	var columnId = 6;
	var columnPaid = 5;

	var initDataTable = function() {
		
		tableBooking= $('#bookingTable').DataTable({
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
				    {"string" : "Date"},
				    {"string" : "Time"},
				    {"string" : "Payment"},
				    {"string" : "Id"},
				    {"string" : "Type"},
				    {"string" : "Tables"},
				    {"string" : "AddressTo"},
				    {"string" : "Bill"}
				   
				    ],
			columnDefs : [ {
				/* Shows glutenFree as 'Yes' or 'No. */
				render : function(data, type, row) {
					if(data==false)
						return 'No'
					else
						return 'Yes'	
				},
				targets : 5
			} ],
			order : [ [ 3, 'desc' ] ]
			});
		tableBooking.columns(columnId).visible(false);
		
		var data;
		$.ajax({
			url : "/pizzeriabookingAjax",
			type : 'GET',
			success : function(data) {
				//inizialize table
				bookingFromServer=data;
				initializeBookingTable(data);
			},
			error : function(data, status, er) {
				alert("error: " + data + " status: " + status + " er:" + er);
			}
		});
		
		setControlButtons(true,true,true);
		
		//controllo in caso di richiesta pagina post booking edited
		if(communicator.bookingEdited!==undefined)
			//richiamare send operation
			sendRequest('update', communicator.bookingEdited, function(response) {
				//update row
			});
	}

	var initializeBookingTable = function(bookings){
		
		for (var int = 0; int < bookings.length; int++) {
			var user="-"
			var nome="-"
			if(bookings[int].user!=undefined)
				user=bookings[int].user;
			if(bookings[int].underTheNameOf!=undefined)
				nome=bookings[int].underTheNameOf;
			
			var rowToAdd=[ "", 
			              user,
			              nome,
						  bookings[int].date,
						  bookings[int].time,
						  bookings[int].payment,
						  bookings[int].id];
			
			if(bookings[int].type=="takeAway"){
				rowToAdd.push("TAKE AWAY");
				rowToAdd.push("-");//Tables
				rowToAdd.push("-");//AddressTo
			}
			else if(bookings[int].type=="delivery"){
				rowToAdd.push("DELIVERY");
				rowToAdd.push("-");//Tables
				rowToAdd.push(bookings[int].address.city +", "+bookings[int].address.street+" "+bookings[int].address.number);//AddressTo --> FIX		
			}
			else if(bookings[int].type=="table"){
				rowToAdd.push("TABLE");
				var stringTables="";
				for (var int2 = 0; int2 < bookings[int].tables.length; int2++) {
					stringTables+=bookings[int].tables[int2].number;
					if(int2!==bookings[int].tables.length-1)
						stringTables+=", ";
				}
				rowToAdd.push(stringTables);//Tables  --> FIX
				rowToAdd.push("-");//AddressTo	 	
			}
			
			rowToAdd.push(bookings[int].bill+" &euro;");
			tableBooking.row.add(rowToAdd).draw(false);
		}
		
		tableBooking.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
		
			var dateFromTable=this.data()[3];
			var timeFromTable=this.data()[4];
			var splitDate=dateFromTable.split("/");
			var splitTime=timeFromTable.split(":");
			var date=new Date(); 
			date.setFullYear(splitDate[2], splitDate[1]-1, splitDate[0]);
			date.setHours(splitTime[0], splitTime[1], 0, 0);
			
			if(new Date()>date){
				$(this.node()).css("color","rgb(207,48,45)");
			}
		} );
	}

	var initListeners = function(){
		
		$('#bookingTable tbody').on('click', 'td.details-control', function() {

			var tr = $(this).closest('tr');
			var row = tableBooking.row(tr);
			
			if (row.child.isShown()) {
				row.child.remove();
				tr.removeClass('shown');
			} else {
				
				row.child("<img src='resources/gifs/loading.gif' width='50px' height='50px'></img>").show();
				tr.addClass('shown');
				loadInfoBooking(function (){
					var tableString=format(row.data()[columnId]);
					row.child(tableString).show();
				});
				
				
			}
		});

		$('#bookingTable tbody').on('click', 'tr', function() {
			 
			if ($(this).hasClass('selected')&& tableBooking.row(this).data()!=undefined &&($(this).hasClass("odd")|| $(this).hasClass("even"))) {
				$(this).removeClass('selected');
				setControlButtons(true,true,true);
			
			} 
			else if(!$(this).hasClass('selected') && tableBooking.row(this).data()!=undefined &&($(this).hasClass("odd")|| $(this).hasClass("even")) ){
				tableBooking.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				setControlButtons(false,false,false);
			}//end else if
		});
		
		$("#confermeButtonBooking").on('click',function(){
			var idBooking=tableBooking.row('.selected').data()[columnId];
			sendRequest('conferme', findBooking(idBooking), function(response) {
				tableBooking.row('.selected').remove().draw(false);
				//alert('booking'+idBooking + response);
				callAndSetModal("Booking "+response+"!");
			});	
		});
		
		$("#editButtonBooking").on('click',function(){
			if(tableBooking.row('.selected').data()[columnPaid]==true)
				$('#operationOnPaidBookingModal').modal('show');
			else
				editBooking();
		});
		
		$("#removeButtonBooking").on('click',function(){
			$('#selectionModal').modal('show');
			var idBooking=tableBooking.row('.selected').data()[columnId];
			sendRequest('remove', findBooking(idBooking), function(response) {
				tableBooking.row('.selected').remove().draw(false);
				//alert('booking'+idBooking + response);
				callAndSetModal("Booking "+response+"!");
			});
		});	
	}
	
	function loadInfoBooking(loading){
		setTimeout(function(){loading();},300);
	}
	
	function format(idBooking) {
		string="";
		for (var int = 0; int < bookingFromServer.length; int++) {
			if(bookingFromServer[int].id==idBooking){
				var booking=bookingFromServer[int];
				if(booking.pizzas.length>0){
					string+='<table class="table table-bordered" style="font-size:13px;"><thead><tr>'
							+'<th>Pizza</th>'
							+'<th>GlutenFree</th>'
							+'<th>Size</th>'
							+'<th>Edited</th>'
							+'<th>Ingredients</th>'
							+'<th>Number</th>'
							+'<th>Price</th>'
							+'<th>Total</th>'
							+'</tr></thead>';
					
							
					for (var int2 = 0; int2 < booking.pizzas.length; int2++) {
						string+="<tr>"
								+"<td>"+booking.pizzas[int2].name+"</td>"
								+"<td>"+booking.pizzas[int2].glutenFree+"</td>"
								+"<td>"+booking.pizzas[int2].size+"</td>";
								if(booking.pizzas[int2].ingredientsAdded.length>0 || booking.pizzas[int2].ingredientsRemoved.length>0)
									string+="<td>yes</td>";	
								else
									string+="<td>no</td>";
									
								var ingredientsTotal=new Array();
								//FARE LA DIFFERENZA A MANO
								for (var int3 = 0; int3 < booking.pizzas[int2].ingredientsBase.length; int3++) {
									var idBase=booking.pizzas[int2].ingredientsBase[int3].id;
									var founded=false;
									for (var int4 = 0; int4 < booking.pizzas[int2].ingredientsRemoved.length; int4++) {
										if(idBase==booking.pizzas[int2].ingredientsRemoved[int4].id){
											founded=true;
										}
									}
									if(founded==false)
										ingredientsTotal.push(booking.pizzas[int2].ingredientsBase[int3]);
								}
								//ingredientsTotal=_.difference(booking.pizzas[int2].ingredientsBase,booking.pizzas[int2].ingredientsRemoved);
								ingredientsTotal=_.union(ingredientsTotal,booking.pizzas[int2].ingredientsAdded);
								
								var listIngredients="";
								for (var int3 = 0; int3 < ingredientsTotal.length; int3++) {
									listIngredients+=ingredientsTotal[int3].name;
									if(int3!==ingredientsTotal.length-1)
										listIngredients+=", ";
								}
								
								string+="<td>"+listIngredients+"</td>"
								+"<td>"+booking.pizzas[int2].number+"</td>"
								+"<td>"+booking.pizzas[int2].priceEach+" &euro;</td>";
								var total=new Number(booking.pizzas[int2].number)*new Number(booking.pizzas[int2].priceEach);
								string+="<td>"+total+ " &euro;</td>"
								+"</tr>";
					}
					string+='</table>';
				}
				if(booking.beverages.length>0){
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
					for (var int2 = 0; int2 < booking.beverages.length; int2++) {
						string+="<tr>"
								+"<td>"+booking.beverages[int2].name+"</td>"
								+"<td>"+booking.beverages[int2].brand+"</td>"
								+"<td>"+booking.beverages[int2].type+"</td>"
								+"<td>"+booking.beverages[int2].container+"</td>"
								+"<td>"+booking.beverages[int2].size+"</td>"
								+"<td>"+booking.beverages[int2].number+"</td>"
								+"<td>"+booking.beverages[int2].priceEach+" &euro;</td>"
								+"<td>"+new Number(booking.beverages[int2].number)*(new Number(booking.beverages[int2].priceEach))+" &euro;</td>"
								+"</tr>";
					}
					string+='</table>';
					
				}
			}
		}
		
		return string;
	}

	var sendRequest = function(action, bookingResume, onSuccess) {
		var reducedBooking=reduceBooking(bookingResume);
		var stringB=JSON.stringify(reducedBooking);
		$.ajax({
			method : 'POST',
			url : '/pizzeriabookingAction',
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
	
	var findBooking = function(idBooking){
		for (var int = 0; int < bookingFromServer.length; int++) {
			if(bookingFromServer[int].id==idBooking)
				return bookingFromServer[int];
		}
	}
	
	var editBooking = function(){
		var idBooking=tableBooking.row('.selected').data()[columnId];
		communicator.bookingToEdit=findBooking(idBooking);
		
		$('#content').load("pizzerialiveorder", function(data) {
			$('.nav-pills .active').removeClass('active');
			$("#liLiveOrderTool").addClass('active');
		});
	}	
	
	var setControlButtons = function(boolButtonConferme, boolButtonEdit, boolButtonRemove, boolButtonSave ){
		
		$("#confermeButtonBooking").prop('disabled', boolButtonConferme);
		$("#editButtonBooking").prop('disabled', boolButtonEdit);
		$("#removeButtonBooking").prop('disabled', boolButtonRemove);
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