var LiveOrderTool = function(){
	/*Identificativi universali:
		-Bevande: id(per ora corrispondono agli id del database, l'ideale è fare una crittografia degli id del database, ed usare quelli localmente)
		-Ingredienti: id 
		-Pizze: nome + nome ingredienti
	*/
	var confirmedBooking=false;
	var loadedBookingToEditId=-1;//l'id di un eventuale booking che si sta modificando
	var pizzeFromServer;//è la lista delle pizze, con i suoi ingredienti basilari, fornite dalla pizzeria e che risiedono sul database
	var beverageFromServer;//è la lista di tutte le bevande fornite dalla pizzeria e che risiedono sul database
	var pizzeriaIngredientsFromServer;//è la lista di tutti gli ingredienti di cui è fornita la pizzeria
	
	var pizzaList = new Array();//è la lista delle pizze ordinate dal client
	var beverageList = new Array();//è la lista delle bevande  ordinate dal client
	
	//VIEW
	var tablePizza, tableBeverage;//tabelle
	//Id generator
	var codePizza = 0;//l'id delle pizze viene generato al momento, è un id valido localmente in quanto le pizze create non esistono sul database  
	
	//costanti
	var columnId = 5;
	var columnNumber = 4;

	var initVar = function(){
		
		confirmedBooking=false;
		loadedBookingToEditId=-1;
		pizzeFromServer=new Object();
		beverageFromServer=new Object();
		pizzeriaIngredientsFromServer=new Object();
		pizzaList = new Array();
		beverageList = new Array();
		tablePizza=new Object();
		tableBeverage=new Object();
		codePizza = 0;
		columnId = 5;
		columnNumber = 4;
	}
	
	var initLiveTool = function(){
			console.log(pizzaList);
			//datepicker
			$('#datetimepicker1').datetimepicker({
				format: 'DD/MM/YYYY HH:mm',
			});
			$('#datetimepicker1').data("DateTimePicker").date(moment());
			$('#datetimepicker1').focusout(function(){
				if($("#datetimepicker1").data("DateTimePicker").date()==null)
					$('#datetimepicker1').data("DateTimePicker").date(moment());
				
				getAvailableTableAndSetOnSelect();
			});
			//creazione SELECT2
			$(".js-example-basic-single").select2();
			$(".js-example-basic-multiple").select2();
			//creazione bootsrap-switch
			$(".switch-radio1").bootstrapSwitch();
			checkTypeBooking("takeAway");
			mapsAutocomplete.initMaps('maps-autocomplete-input');
			//proprietà bottoni di modifica disabilitati al caricamento della pagina
			setControlButtons("pizza", false, true, true);
			setControlButtons("beverage", false, true, true);
			$("#bookingUserInput").prop("disabled",true);

			tablePizza = $('#resumeTablePizza').DataTable({
				"scrollY" : "320px",
				"scrollCollapse" : true,
				"paging" : false,
				columns : [{
					"className" : 'details-control',
					"orderable" : false,
					"data" : null,
					"defaultContent" : ''
				}, {
					"string" : "pizza"
				}, {
					"string" : "glutenFree"
				}, {
					"string" : "size"
				}, {
					"string" : "number"
				}, {
					"string" : "id"
				} ],
				columnDefs : [ {
					/* Shows glutenFree as 'Yes' or 'No. */
					render : function(data, type, row) {
						if(data=="false")
							return 'No'
						else
							return 'Yes'	
					},
					targets : 2
				} ],
				order : [ [ 5, 'asc' ] ]
			});

			
			tableBeverage = $('#resumeTableBeverage').DataTable({
				"scrollY" : "300px",
				"scrollCollapse" : true,
				"paging" : false,
				columns : [ {
					"string" : "beverage"
				}, {
					"string" : "name"
				}, {
					"string" : "container"
				}, {
					"string" : "size"
				}, {
					"string" : "number"
				}, {
					"string" : "id"
				} ],
				order : [ [ 5, 'asc' ] ]
			});
			
			
			//Nascondo la colonna codePizza e codeBeverage in quanto non deve essere visibile
			tablePizza.columns(columnId).visible(false);
			tableBeverage.columns(columnId).visible(false);

			$.ajax({
				url : "/pizzerialiveorderPizzas",
				type : 'GET',
				success : function(pizzeria) {
					
					//init From server
					pizzeFromServer = pizzeria.pizzas;
					beverageFromServer = pizzeria.beverages;
					pizzeriaIngredientsFromServer = pizzeria.allPizzeriaIngredients;
					//popolazione pizzas: fatta con SPRING
					//popolazione beverage
					createBeverage(beverageFromServer);
					//se la pagina è stata invocata per modificare un booking
					if(communicator.bookingToEdit!== undefined){
						
						var bookingToEdit=communicator.bookingToEdit;
						
						/***********INFO SUL PRECEDENTE BOOKING***************/
						confirmedBooking=bookingToEdit.confirmed;
						loadedBookingToEditId=bookingToEdit.id;
						/*****************************************************/
						for (var int = 0; int < bookingToEdit.pizzas.length; int++) {
							var pizzaPostMapping= mapping(bookingToEdit.pizzas[int]);
							resolvePizza(false,pizzaPostMapping,bookingToEdit.pizzas[int].number);
						}
						for (var int2 = 0; int2 < bookingToEdit.beverages.length; int2++) {
							resolveBeverage(false,bookingToEdit.beverages[int2]);
						}
						//settare le intestazioni 
						initHeading(bookingToEdit);
						//Eliminare subito l'oggetto dal communicator
						communicator.bookingToEdit=undefined;
					}
					else
						getAvailableTableAndSetOnSelect();
				},
				error : function(data, status, er) {
					alert("error: " + data + " status: "
							+ status + " er:" + er);
				}
			});		
		}
	
	
	var initListeners = function(){
		
		//listener che ad ogni selezione della pizza carica tutti i suoi ingredienti
		$('#pizzaList.js-example-basic-single').on('select2-selected',function(e) {
				loadIngredientsForPizza($("#pizzaList.js-example-basic-single").select2('data').text);
		});
		
		//listener per aggiungere i dettagli di una riga*/
		$('#resumeTablePizza tbody').on('click','td.details-control', function() {

			var tr = $(this).closest('tr');
			var row = tablePizza.row(tr);
			if (row.child.isShown()) {
				row.child.remove();
				tr.removeClass('shown');
			} 
			else {
				row.child(format(row.data())).show();
				tr.addClass('shown');
			}
		});

		$('#confermeOrder').on("click",function(){
			if(validatorHeading())
				sendOrder();
		});
		
		mapsAutocomplete.setOnPlaceChangedListener(function(address, longitude) {
			//console.log(address);
			//console.log(location);
			if(address.city!=undefined)
				$("#bookingCityInput").val(address.city);
			if(address.street!=undefined)
				$("#bookingStreetInput").val(address.street);
			if(address.number!=undefined)
				$("#bookingNumberInput").val(address.number);
		});
		//Beverage listener
		$('#confermeButtonBeverage').on("click",function(){
			resolveBeverage(false);
		});
		$('#editButtonBeverage').on("click",function(){
			resolveBeverage(true);
		});
		$('#removeButtonBeverage').on("click",function(){
			removeItem('beverage');
		});
		$('#decrementCounterBeverage').on("click",function(){
			counterItem('counterBeverage','d');
		});
		$('#incrementCounterBeverage').on("click",function(){
			counterItem('counterBeverage','i');
		});
		//Pizza listener
		$('#confermeButtonPizza').on("click",function(){
			resolvePizza(false);
		});
		$('#editButtonPizza').on("click",function(){
			resolvePizza(true);
		});
		$('#removeButtonPizza').on("click",function(){
			removeItem('pizza');
		});
		$('#decrementCounterPizza').on("click",function(){
			counterItem('counterPizza','d');
		});
		$('#incrementCounterPizza').on("click",function(){
			counterItem('counterPizza','i');
		});
		
		$('.switch-radio1').on('switchChange.bootstrapSwitch', function(event, state) {
			  checkTypeBooking(this.value);
			});
		
		//Listener che selezione la riga e carica i dati del selezionato
		$('#resumeTablePizza tbody').on('click','tr',function() {
			if ($(this).hasClass('selected') && tablePizza.row(this).data() != undefined && ($(this).hasClass("odd") || $(this).hasClass("even"))) {
				
				$(this).removeClass('selected');
				setControlButtons("pizza", false, true, true);
				resetControls("pizza");
				
			} 
			else if (!$(this).hasClass('selected') && tablePizza.row(this).data() != undefined && ($(this).hasClass("odd") || $(this).hasClass("even"))) {
								
				tablePizza.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				setControlButtons("pizza", true, false, false);
	
				var code = tablePizza.row($(this)).data()[columnId];
				var number = tablePizza.row($(this)).data()[columnNumber];
				for (var j = 0; j < pizzaList.length; j++) {
						if (pizzaList[j].getCode() == code) {
							loadInfoForPizzaControls( pizzaList[j],number);
						}
					}
				}//end else if
			});

		/*Listener che selezione la riga e carica i dati del selezionato*/
		$('#resumeTableBeverage tbody').on('click','tr',function() {

			if($(this).hasClass('selected') && tableBeverage.row(this).data() != undefined && ($(this).hasClass("odd")||  $(this).hasClass("even"))) {
								
				$(this).removeClass('selected');
				setControlButtons("beverage", false, true, true);
				resetControls("beverage");
					
			} 
			else if (!$(this).hasClass('selected') && tableBeverage.row(this).data() != undefined && ($(this).hasClass("odd") || $(this).hasClass("even"))) {
								
				tableBeverage.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				setControlButtons("beverage", true, false, false);
				var number = tableBeverage.row($(this)).data()[columnNumber];
				var id = tableBeverage.row($(this)).data()[columnId];
				
				//setting controlsBeverage
				$('#counterBeverage').val(number);
				for (var int = 0; int < beverageFromServer.length; int++) {
					if(beverageFromServer[int].id==id){
						var string=beverageFromServer[int].brand+" "+beverageFromServer[int].name+" - "+beverageFromServer[int].container+" - size:"+beverageFromServer[int].size;
						$("#beverageList.js-example-basic-single").select2('data', {
							id: "idBev_"+id,
							text : string
						});						
					}
				}
			}//end else if
		});

	} 
	/*****************************************************   FUNZIONI COMUNI ********************************************************************************/
	var createBooking = function(){
		

		var booking=new Object();
		booking.beverages=extractData("beverages");
		booking.pizzas=extractData("pizzas");
		booking.date=extractData("date");
		
		//console.log(extractData("beverages"));
		//console.log(extractData("pizzas"));
	
		if($("[value='delivery']").is(':checked')){
			//console.log(extractData("address"));
			booking.address=extractData("address");
			booking.type="delivery";
		}
		else if($("[value='table']").is(':checked')){
			//console.log(extractData("tables"));
			booking.tables=extractData("tables");
			booking.type="table";
		}
		else{
			booking.type="takeAway";
		}
		
		var user=extractData("user");
		var name=extractData("name");
		
		if(user!=undefined || user!="" || user!="User")
			booking.user=user;
		if(name!=undefined || name!="" || name!="Name")	
			booking.underTheNameOf=name;
		
		var dateTime=extractData("date");
		booking.date=dateTime.split(" ")[0];
		booking.time=dateTime.split(" ")[1];
		
		if(loadedBookingToEditId!=-1){
			booking.id=loadedBookingToEditId;
		}
		else{
			booking.id=undefined;
		}
		
		booking.confirmed=confirmedBooking;
		return booking;
		//console.log(extractData("date"));
	}
	
	var sendOrder = function() {
		var booking=createBooking();
		console.log(booking);
		
		var stringBooking = JSON.stringify(booking);		
		$.ajax({
			url : "/pizzerialiveorderConferme",
			type : 'POST',
			data : {
				booking : stringBooking
			},
			success : function(data) {
				//console.log(data)
				//callAndSetModal("Booking "+data+"!");
				if(confirmedBooking){
					$('#content').load("pizzerialiverestaurant", function(data) {
						$('.nav-pills .active').removeClass('active');
						$("#liLiveRestaurant").addClass('active');
					});					
				}
				else{
					$('#content').load("pizzeriabooking", function(data) {
						$('.nav-pills .active').removeClass('active');
						$("#liManageBooking").addClass('active');
					});					
				}
				
			},
			error : function(data, status, er) {
				alert("error: " + data + " status: " + status + " er:" + er);
			}
		});
	}

	var checkTypeBooking = function(type){
		if(type=="delivery"){
			$("#tables").prop("disabled",true);
			$(".address").prop("disabled",false);
		}
		else if(type=="takeAway"){
			$("#tables").prop("disabled",true);
			$(".address").prop("disabled",true);
		}
		else if(type=="table"){
			$("#tables").prop("disabled",false);
			$(".address").prop("disabled",true);
		}
	}
	
	var removeItem = function(type) {
		
		if (type === "pizza") {
			var code = tablePizza.row('.selected').data()[columnId];
			var indexToRemove = -1;
			for (var j = 0; j < pizzaList.length; j++) {
				if (pizzaList[j].getCode() == code) {
					indexToRemove = j;
				}
			}
			if (indexToRemove != -1)
				pizzaList.splice(indexToRemove, 1);
			
			tablePizza.row('.selected').remove().draw(false);
			setControlButtons("pizza", false, true, true);
		} 
		else {//type beverage
			tableBeverage.row('.selected').remove().draw(false);
			setControlButtons("beverage", false, true, true);
		}
	}

	var resetControls = function(type) {

		if (type === "pizza") {
			$("#addIngredients.js-example-basic-multiple").select2('data', "");
			$("#removeIngredients.js-example-basic-multiple").select2('data',"");
			$('#counterPizza').val(1);
			
			$('#glutenButtons .active').removeClass("active");
			$('#glutenButtons > label:first-child').addClass("active");
			$('#sizeButtons .active').removeClass("active");
			$('#sizeButtons > label:first-child').addClass("active");
			
		} else {
			$('#counterBeverage').val(1);
		}
	}

	var counterItem = function(idTextInput, type) {
		//type --> i: increment - d: decrement
		if (type === "i")
			$('#' + idTextInput).val(new Number($('#' + idTextInput).val()) + 1);
		else {
			if($('#' + idTextInput).val() > 1)
				$('#' + idTextInput).val(new Number($('#' + idTextInput).val()) - 1);
		}
	}
	
	var setControlButtons = function(type,boolButtonConferme, boolButtonEdit, boolButtonRemove ){
		
		if(type=="pizza"){
			$("#editButtonPizza").prop('disabled', boolButtonEdit);
			$("#removeButtonPizza").prop('disabled', boolButtonRemove);
			$("#confermeButtonPizza").prop('disabled', boolButtonConferme);
		}
		else{
			$("#editButtonBeverage").prop('disabled', boolButtonEdit);
			$("#removeButtonBeverage").prop('disabled', boolButtonRemove);
			$("#confermeButtonBeverage").prop('disabled', boolButtonConferme);
		}
		
	}
	
	var initHeading = function(booking){
	
		//set switchedBotton
		if(booking.type!="takeAway")
			$("[value='"+booking.type+"']").bootstrapSwitch('toggleState');
		//set Date
		var dateConverted=booking.date.split("/");
		var dateString=dateConverted[2]+"-"+dateConverted[1]+"-"+dateConverted[0];
		var date=new Date(dateString);
		var time=booking.time.split(":");
		date.setHours(time[0], time[1], time[2]);
		$('#datetimepicker1').data("DateTimePicker").date(date);
		
		//set User or Name
		if(booking.user!=undefined){
			$("#bookingUserInput").val(booking.user);
			$("#bookingNameInput").prop("disabled",true);
		}
		else{//user undefined e name diverso da undefined
			$("#bookingNameInput").val(booking.underTheNameOf);
			$("#bookingUserInput").prop("disabled",true);
		}
		
		//set Address
		if(booking.type=="delivery"){
			$("#bookingCityInput").val(booking.address.city);
			$("#bookingStreetInput").val(booking.address.street);
			$("#bookingNumberInput").val(booking.address.number);
		}
		
		if(booking.type=="table"){
			var tablesId=new Array();
			for (var int = 0; int < booking.tables.length; int++) {
				tablesId.push(booking.tables[int].id);
			}
			$("#tables.js-example-basic-multiple").val(tablesId).trigger("change");
			//DISABILITARE i tavoli non disponibili
		}
		
		getAvailableTableAndSetOnSelect();
	}
	
	var extractData = function(dataType){
		switch (dataType) {
		case "beverages":
			var orderBeverages = new Array();
			var rows = tableBeverage.rows().data();
			for (var int = 0; int < tableBeverage.rows().count(); int++) {
				var dataRow = rows[int];
				var id = dataRow[columnId];
				for (var int2 = 0; int2 < beverageFromServer.length; int2++) {
					if (beverageFromServer[int2].id == id) {
						beverageList.push(beverageFromServer[int2]);
						orderBeverages.push({
							number : dataRow[columnNumber],
							id : beverageFromServer[int2].id
						});
					}
				}
			}
			return orderBeverages;
			break;
		case "pizzas":
			var orderPizzas = new Array();
			var rows = tablePizza.rows().data();
			for (var int = 0; int < tablePizza.rows().count(); int++) {
				var dataRow = rows[int];
				for (var int2 = 0; int2 < pizzaList.length; int2++) {
					if (dataRow[columnId] == pizzaList[int2].getCode()) {
						orderPizzas.push({
							number : dataRow[columnNumber],
							glutenFree : pizzaList[int2].getGlutenFree(),
							ingredientsAdded:pizzaList[int2].getIngredientsAdded(),
							//ingredientsBase:pizzaList[int2].,
							ingredientsRemoved:pizzaList[int2].getIngredientsRemoved(),
							name:pizzaList[int2].getName(),
							size:pizzaList[int2].getSize()
						})
					}
				}
			}
			return orderPizzas;
			break;
		case "tables":
			var tables= $("#tables").select2("val");
			return tables;
		break;
		case "address":
			var address=new Object();
			address.city=$("#bookingCityInput").val();
			address.street=$("#bookingStreetInput").val();
			address.number=$("#bookingNumberInput").val();
			return address;
			break;
		case "user":
			return $("#bookingUserInput").val();
			break;
		case "name":
			return $("#bookingNameInput").val();
			break;
		case "date":
			return $("#datetimepicker1").data("DateTimePicker").date().format('DD/MM/YYYY HH:mm');
			break;

		default:
			break;
		}
	}

	/*************** FUNZIONI UTILITA SOLO PER PIZZA *****************************************************************************************************************/

	var mapping= function(pizzaFromBooking){
		
	
			var pizza= new Pizza();
			pizza.setName(pizzaFromBooking.name);
			pizza.setSize(pizzaFromBooking.size);
			pizza.setGlutenFree(pizzaFromBooking.glutenFree);
			var ingredientsToAdd=pizzaFromBooking.ingredientsAdded;
			var ingredientsToRemove=pizzaFromBooking.ingredientsRemoved;
			if (ingredientsToAdd.length > 0 || ingredientsToRemove.length > 0) {
				pizza.setEdited(true);
				for (var int1 = 0; int1 < ingredientsToAdd.length; int1++) {
					pizza.getIngredientsAdded().push({
						id : ingredientsToAdd[int1].id,
						text : ingredientsToAdd[int1].name
					});
				}
				for (var int2 = 0; int2 < ingredientsToRemove.length; int2++) {
					pizza.getIngredientsRemoved().push({
						id : ingredientsToRemove[int2].id,
						text : ingredientsToRemove[int2].name
					});
				}
			}	
		return pizza;
	}
	
	
	
	var extractPizzas = function() {

		var orderPizzas = new Array();
		var rows = tablePizza.rows().data();
		for (var int = 0; int < tablePizza.rows().count(); int++) {
			var dataRow = rows[int];
			for (var int2 = 0; int2 < pizzaList.length; int2++) {
				if (dataRow[columnId] == pizzaList[int2].getCode()) {
					orderPizzas.push({
						number : dataRow[columnNumber],
						pizza : pizzaList[int2]
					})
				}
			}
		}
		return orderPizzas;
	}

	//nei casi di EDIT consente di caricare le informazioni sugli strumenti di creazione pizza 
	var loadInfoForPizzaControls = function(pizza, number) {
		$("#pizzaList.js-example-basic-single").select2('data', {
			text : pizza.getName()
		});

		loadIngredientsForPizza(pizza.getName());
		$("#addIngredients.js-example-basic-multiple").select2('data',pizza.getIngredientsAdded());
		$("#removeIngredients.js-example-basic-multiple").select2('data',pizza.getIngredientsRemoved());
		$('#counterPizza').val(number);
		
		
		$('#sizeButtons .active').removeClass("active");
		switch (pizza.getSize()) {
		case "SMALL":			
			$('#sizeButtons > label:eq(0)').addClass("active");
			break;
		case "NORMAL":
			$('#sizeButtons > label:eq(1)').addClass("active");
			break;
		case "MAXI":
			$('#sizeButtons > label:eq(2)').addClass("active");
			break;
		default:
			break;
		}
			
		$('#glutenButtons .active').removeClass("active");
		switch (pizza.getGlutenFree()) {
		case "false":
			$('#glutenButtons > label:eq(0)').addClass("active");	
			break;
		case "true":
			$('#glutenButtons > label:eq(1)').addClass("active");		
			break;
		default:
			break;
		}
	}

	//carica sui select2 sia gli ingredienti base che quelli aggiungibili ad una pizza
	var loadIngredientsForPizza = function(pizzaName) {
		$("li.select2-search-choice").remove();
		$("#addIngredients.js-example-basic-multiple > option").remove();
		$("#removeIngredients.js-example-basic-multiple > option").remove();
		for (var int = 0; int < pizzeFromServer.length; int++) {
			if (pizzeFromServer[int].name == pizzaName) {
				
				var difference=new Array();
				for (var int2 = 0; int2 < pizzeriaIngredientsFromServer.length; int2++) {
					var currentPizzeriaIngredient=pizzeriaIngredientsFromServer[int2];
					var found=false;
					for (var int3 = 0; int3 < pizzeFromServer[int].ingredients.length; int3++) {
						if(currentPizzeriaIngredient.name==pizzeFromServer[int].ingredients[int3].name){
							found=true;
						}
					}
					
					if(found==false){
						difference.push(currentPizzeriaIngredient);
					}
				}
				
				for (var int2 = 0; int2 < difference.length; int2++) {
					$("#addIngredients.js-example-basic-multiple").append(
							"<option value="+difference[int2].id+">"
									+ difference[int2].name + "</option>");
				}
				//appendiamo gli ingredienti base della pizza all select degli ingredienti rimovibili
				for (var int2 = 0; int2 < pizzeFromServer[int].ingredients.length; int2++) {
					$("#removeIngredients.js-example-basic-multiple").append(
							"<option value="+pizzeFromServer[int].ingredients[int2].id+">"
									+ pizzeFromServer[int].ingredients[int2].name
									+ "</option>");
				}
				return;
			}
		}
	}

	var resolvePizza = function(editing,pizzaFromBooking,numberOfItem) {

		var pizza = new Pizza();
		var pizzaNumber;
		var ingredientsToAdd;
		var ingredientsToRemove;
		
		if(pizzaFromBooking===undefined){
			
			var namePizzaSelected = $("#pizzaList.js-example-basic-single").select2("data").text;
			if (namePizzaSelected == "Select Pizza") {
				callAndSetModal("Select pizza please!");
				return;
			}
			
			if($.isNumeric($('#counterPizza').val()) && $('#counterPizza').val()>0)
				pizzaNumber = $('#counterPizza').val();
			else
				pizzaNumber = 1;
			
			ingredientsToAdd = $('#addIngredients.js-example-basic-multiple').select2("data");
			ingredientsToRemove = $('#removeIngredients.js-example-basic-multiple').select2("data");
			
			pizza.setGlutenFree($('#glutenButtons .active > input').val());
			pizza.setSize($('#sizeButtons .active > input').val());
			pizza.setName(namePizzaSelected);
			
			if (ingredientsToAdd.length > 0 || ingredientsToRemove.length > 0) {
				pizza.setEdited(true);
				for (var int1 = 0; int1 < ingredientsToAdd.length; int1++) {
					pizza.getIngredientsAdded().push({
						id : ingredientsToAdd[int1].id,
						text : ingredientsToAdd[int1].text
					});
				}
				for (var int2 = 0; int2 < ingredientsToRemove.length; int2++) {
					pizza.getIngredientsRemoved().push({
						id : ingredientsToRemove[int2].id,
						text : ingredientsToRemove[int2].text
					});
				}
			}	
		}
		else{//pizzaFromBooking e numberOfItem sono entrambi diversi da undefined
			pizza=pizzaFromBooking;
			pizzaNumber=numberOfItem;
		}
		
		//se sto modificando un ordine già esistente
		if (editing === true) {
			var code = tablePizza.row($('#resumeTablePizza tbody > tr.odd.selected,tr.even.selected')).data()[columnId];
			pizza.setCode(code);

			var indexToRemove;
			for (var j = 0; j < pizzaList.length; j++) {
				if (pizzaList[j].getCode() == code)
					indexToRemove = j;
			}
			//rimuovere dalla lista la pizza vecchia
			//aggiungere la nuova
			pizzaList.splice(indexToRemove, 1);
			//prima di pushare questa nuova pizza bisogna vedere se ne esiste una uguale
			//se ne esiste una uguale bisogna rimuovere questa , e modificare la nuova trovata
			if (checkPizzaExistence(pizza) != -1) {
				var rows = tablePizza.rows().data();
				//console.log(tablePizza.rows().count());
				for (var int = 0; int < tablePizza.rows().count(); int++) {
					var dataRow = rows[int];
					if (dataRow[columnId] == code) {
						//rimozione della vecchia riga
						for (var int2 = 0; int2 < tablePizza.rows().count(); int2++) {
							if (tablePizza.row(int2).data()[columnId] == rows[int][columnId]) {
								tablePizza.row(int2).remove().draw(false);
							}
						}
					}
				}
				editResumePizzaItem(checkPizzaExistence(pizza), pizzaNumber,false);
				return;
			}
			pizzaList.push(pizza);
			editResumePizzaItem(code, pizzaNumber, true);
			setControlButtons("pizza", false, true, true);
		}
		//se invece sto creando una nuova pizza o se già esisteva la stessa di quella creata allora gli sto aggiungendo numeri al contatore
		else {
			var code = checkPizzaExistence(pizza);
			//se ritorno -1 la pizza ancora non esiste, per cui ne creo una nuova
			if (code === -1) {
				
				
				pizza.setCode(codePizza);
				//generazione nuovo codice unico (meglio trovare un modo alternativo per produrre codici univoci XD)
				codePizza++;
				addResumePizzaItem(pizza, pizzaNumber, false);
			}
			//la pizza già esiste, si aggiorna solo quella già esistente
			else {
				editResumePizzaItem(code, pizzaNumber, false);
			}
		}
		//reset button			
		resetControls("pizza");
	}

	var editResumePizzaItem = function(code, number, loaded) {
		//mi serve la dimensione della lista delle pizze per poter accedere correttamente all'oggetto rows

		var rows = tablePizza.rows().data();
		for (var int = 0; int < tablePizza.rows().count(); int++) {
			var dataRow = rows[int];
			if (dataRow[columnId] == code) {
				found = true;
				var newNumber;
				if (loaded === false)
					newNumber = new Number(dataRow[columnNumber]) + new Number(number);
				else
					newNumber = new Number(number);

				//rimozione della vecchia riga
				//PEZZA PER RIMUOVERE LA RIGA VECCHIA
				for (var int2 = 0; int2 < tablePizza.rows().count(); int2++) {
					if (tablePizza.row(int2).data()[columnId] == rows[int][columnId]) {
						tablePizza.row(int2).remove().draw(false);
					}
				}
				for (var j = 0; j < pizzaList.length; j++) {
					if (pizzaList[j].getCode() == code) {
						var pizzaCurrent = pizzaList[j];
						tablePizza.row.add(
								["", 
								 pizzaCurrent.getName(),
								 pizzaCurrent.getGlutenFree(),
								 pizzaCurrent.getSize(),
								 newNumber.toString(),
								 pizzaCurrent.getCode()]).draw(false);

						//FACCIAMO scrollare la scroll fino alla nuova riga aggiunta
						$('.dataTables_scrollBody').animate({
							scrollTop : $('#resumeTablePizza tbody > tr:last-child').offset().top
						}, 100);

						return;
					}
				}

				//update pizzaList	
			}
		}
		
	}

	var addResumePizzaItem = function(pizza, number) {

		pizzaList.push(pizza);

		var n=new String(number);
		tablePizza.row.add([ "",
		                     pizza.getName(),
		                     pizza.getGlutenFree(),
		                     pizza.getSize(),
		                     n.toString(),
		                     pizza.getCode() ]).draw(false);

		$('.dataTables_scrollBody').animate({
			scrollTop : $('#resumeTablePizza tbody > tr:last-child').offset().top
		}, 100);
	}

	//verifico se la pizza esiste già nella coda delle pizze
	var checkPizzaExistence = function(pizza) {

		var codeFounded = -1;
		for (var i = 0; i < pizzaList.length; i++) {

			if (pizzaList[i].getName() === pizza.getName()
					&& pizzaList[i].getGlutenFree() === pizza.getGlutenFree()
					&& pizzaList[i].getSize() === pizza.getSize()) {

				var equalAdded = true;
				var equalRemoved = true;
				if (pizzaList[i].getIngredientsAdded().length === pizza
						.getIngredientsAdded().length
						&& pizzaList[i].getIngredientsRemoved().length === pizza
								.getIngredientsRemoved().length) {

					for (var int1 = 0; int1 < pizza.getIngredientsAdded().length; int1++) {
						var ingredient = pizza.getIngredientsAdded()[int1].text;
						var equal = false;
						for (var int2 = 0; int2 < pizzaList[i]
								.getIngredientsAdded().length; int2++) {
							if (ingredient === pizzaList[i]
									.getIngredientsAdded()[int2].text)
								equal = true;
						}

						if (equal === false)
							equalAdded = false;//continue;
					}

					for (var int1 = 0; int1 < pizza.getIngredientsRemoved().length; int1++) {
						var ingredient = pizza.getIngredientsRemoved()[int1].text;
						var equal = false;
						for (var int2 = 0; int2 < pizzaList[i]
								.getIngredientsRemoved().length; int2++) {
							if (ingredient === pizzaList[i].getIngredientsRemoved()[int2].text)
								equal = true;
						}

						if (equal === false)
							equalRemoved = false;//continue;
					}
					if (equalAdded === true && equalRemoved === true) {					
						return pizzaList[i].getCode();
					}

				}//fine if interno
			}//fine if esterno
		}//fine for
		return codeFounded;
	}

	function format(d) {
		//console.log(d[0]);
		// `d` is the original data object for the row
		var code = d[columnId];
		for (var j = 0; j < pizzaList.length; j++) {
			if (pizzaList[j].getCode() == code) {
				var added = false;
				var string = '<table class="attacable" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;font-size:14px;">';
				if (pizzaList[j].getIngredientsAdded().length > 0) {
					string += '<tr>' + '<td><b>Ingredients added</b></td>' + '<td>'
							+ pizzaList[j].toStringIngredientsAdded() + '</td>'
							+ '</tr>';
					added = true;
				}
				if (pizzaList[j].getIngredientsRemoved().length > 0) {
					string += '<tr>' + '<td><b>Ingredients removed</b></td>' + '<td>'
							+ pizzaList[j].toStringIngredientsRemoved()
							+ '</td>' + '</tr>';
					added = true;
				}

				if (added === false) {
					string += '<tr>Pizza Base</tr>';
				}

				string += '</table>';
				return string;
			}
		}

	}

	/*************** FUNZIONI UTILITA SOLO PER BEVANDA *****************************************************************************************************************/

	var extractBeverages = function() {

		var orderBeverages = new Array();
		var rows = tableBeverage.rows().data();
		for (var int = 0; int < tableBeverage.rows().count(); int++) {
			var dataRow = rows[int];
			var id = dataRow[columnId];
			for (var int2 = 0; int2 < beverageFromServer.length; int2++) {
				if (beverageFromServer[int2].id == id) {
					beverageList.push(beverageFromServer[int2]);
					orderBeverages.push({
						number : dataRow[columnNumber],
						beverage : beverageFromServer[int2]
					});
				}
			}
		}
		return orderBeverages;
	}

	//questa funzione può essere semplificata in quanto ormai non mi serve più l'oggetto beverages ordinato
	//basta solo appendere alla lista delle bevande
	var createBeverage = function(beverages) {
		beverages = _.groupBy(beverages, 'type');
		$.each(beverages,function(type) {
			beverages[type] = _.groupBy(beverages[type],
					'brand');
			var int = 0;
							
				$.each(beverages[type],function(brand) {
					beverages[type][brand] = _.groupBy(beverages[type][brand],'name');
												
					$.each(beverages[type][brand],function(name) {
						beverages[type][brand][name] = _.groupBy(beverages[type][brand][name],'container');
																	
						$.each(beverages[type][brand][name],function(container) {
																						
							var currentBeverage = beverages[type][brand][name][container];
							$("#beverageList").append("<option class='"+type+"' value='idBev_"+currentBeverage[0].id+"'>"
														+ brand
														+ " "
														+ name
														+ " - "
														+ container
														+ " - size:"
														+ currentBeverage[0].size
														+ "</option>");
							int++;
						});
					});
				});
				$("." + type).wrapAll("<optgroup label='"+type+"'>");
			});
	}

	var resolveBeverage = function(editing,beverageFromBooking) {

		var beverageNumber;
		var beverageSelectedId;
		var res=new Array();
		
		if(beverageFromBooking===undefined){
			
			if ($("#beverageList.js-example-basic-single").select2("data").text == "Select Beverage") {
				callAndSetModal("Select beverage please!");
				return;
			}
			
			if($.isNumeric($('#counterBeverage').val()) && $('#counterBeverage').val()>0)
				beverageNumber = $('#counterBeverage').val();
			else
				beverageNumber = 1;
			
			beverageSelectedId = $("#beverageList.js-example-basic-single").select2("data");
			res= beverageSelectedId.id.split("_");			
		}
		else{
			beverageNumber=beverageFromBooking.number;
			res.push("pezza");
			res.push(beverageFromBooking.id);
		}

		var code = checkBeverageExistence(res[1]);
		if (editing === true) {
			//se sto modificando la bibita, e ne sto mettendo una che già esiste
			if (code != -1 && code != tableBeverage.row('.selected').data()[columnId]) {
				removeItem("beverage");//rimuove il selezionato corrente
				editResumeBeverageItem(code, beverageNumber, false);
				return;
			}

			var indexToRemove = tableBeverage.row($('#resumeTableBeverage tbody > tr.odd.selected,tr.even.selected')).data()[columnId];
			editResumeBeverageItem(indexToRemove, beverageNumber, true);
			setControlButtons("beverage", false, true, true);
		}
		//sto creando una nuova bevanda o se già esisteva la stessa di quella creata allora gli sto aggiungendo numeri al contatore
		else {
			//se ritorno -1 la bevanda ancora non esiste, per cui ne creo una nuova
			if (code == -1) {
				for (var int = 0; int < beverageFromServer.length; int++) {
					if (beverageFromServer[int].id == res[1]) {
						var currentBeverage = beverageFromServer[int];
						tableBeverage.row.add(
								[ currentBeverage.brand, currentBeverage.name,
										currentBeverage.container,
										currentBeverage.size, beverageNumber,
										currentBeverage.id ]).draw(false);
						resetControls("beverage");
						return;

					}
				}
			}
			//la bevanda già esiste, si aggiorna solo quella già esistente
			else {
				editResumeBeverageItem(code, beverageNumber, false);
			}
		}
		//reset button			
		resetControls("beverage");
	}

	var editResumeBeverageItem = function(idBeverage, number, loaded) {
		
		var rows = tableBeverage.rows().data();
		for (var int = 0; int < tableBeverage.rows().count(); int++) {
			var dataRow = rows[int];
			if (dataRow[columnId] == idBeverage) {
				found = true;
				var newNumber;
				if (loaded === false)
					newNumber = new Number(dataRow[columnNumber]) + new Number(number);
				else
					newNumber = new Number(number);

				//rimozione della vecchia riga
				for (var int2 = 0; int2 < tableBeverage.rows().count(); int2++) {
					if (tableBeverage.row(int2).data()[columnId] == rows[int][columnId]) {
						tableBeverage.row(int2).remove().draw(false);
					}
				}
				//aggiunta della nuova riga (PURTROPPO NON È POSSIBILE EDITARE DIRETTAMENTE LA RIGA)
				for (var int = 0; int < beverageFromServer.length; int++) {
					var beverageSelectedId = $("#beverageList.js-example-basic-single").select2("data");
					var res = beverageSelectedId.id.split("_");
					if (beverageFromServer[int].id == res[1]) {
						var currentBeverage = beverageFromServer[int];
						tableBeverage.row.add(
								[ currentBeverage.brand, currentBeverage.name,
								  currentBeverage.container,
								  currentBeverage.size, newNumber,
								  currentBeverage.id ]).draw(false);
						return;

					}
				}

				//update pizzaList	
			}
		}

	}

	//verifico se la bevanda esiste direttamente sulla tabella, non conviene salvarmi una lista di bevande in quanto non ho problematiche come ad esempio posso avere con gli ingredienti delle pizze
	var checkBeverageExistence = function(idBeverage) {

		var codeFounded = -1;
		var rows = tableBeverage.rows().data();
		for (var int = 0; int < tableBeverage.rows().count(); int++) {
			var dataRow = rows[int];
			if (dataRow[columnId] == idBeverage) {
				codeFounded = dataRow[columnId];
			}
		}
		return codeFounded;
	}
	
	var validatorHeading = function(){
		
		//resetFormError
		$("#datetimepicker1").closest("div").parent().removeClass("has-error");
		$("#bookingNameInput").closest("div").removeClass("has-error");
		$("#bookingNameInput").tooltip("disable");
		$("#bookingCityInput").closest("div").removeClass("has-error");
		$("#bookingCityInput").tooltip("disable");
		$("#bookingStreetInput").closest("div").removeClass("has-error");
		$("#bookingStreetInput").tooltip("disable");
		$("#bookingNumberInput").closest("div").removeClass("has-error");
		$("#bookingNumberInput").tooltip("disable");
		$("#tables").closest("div").removeClass("has-error");
		
		var pattern=/^([a-zA-Z\xE0\xE8\xE9\xF9\xF2\xEC\x27]\s?)+$/; //caratteri, lettere accentate apostrofo e un solo spazio fra le parole
		var patternNumber=/^\d+$/;
		
		if ($("#datetimepicker1").data("DateTimePicker").date()==null){
			//alert("Inserire il campo data!");
			$("#datetimepicker1").closest("div").parent().addClass("has-error");
			$('html, body').animate({
				scrollTop: $(".row.booking-data").offset().top
			}, 1000);
			return false;
		}
		else{
			var dateSelected=$("#datetimepicker1").data("DateTimePicker").date();
			if(dateSelected<moment().valueOf()){
				callAndSetModal("Only him can go into the past! Do you have a Delorean? It doesen't seem..",true);
				return false;
			}
		}
		
		if($("#bookingNameInput").prop("disabled")==false){
			if (!pattern.test($("#bookingNameInput").val())){
				//alert("Il campo name non e\' valido!");
				$("#bookingNameInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
			if($("#bookingNameInput").val().length>25){
				$("#bookingNameInput").closest("div").addClass("has-error");
				$("#bookingNameInput").tooltip("enable");
				$("#bookingNameInput").tooltip("show");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
		}
		
		if($("[value='delivery']").is(':checked')){
			
			if (!pattern.test($("#bookingCityInput").val())){
				//alert("Il campo city non e\' valido!");
				$("#bookingCityInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: 0
				}, 1000);
				return false;
			}
			
			if (!pattern.test($("#bookingStreetInput").val())){
				//alert("Il campo street non e\' valido!");
				$("#bookingStreetInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
			
			if (!patternNumber.test($("#bookingNumberInput").val())){
				//alert("Il campo street non e\' valido!");
				$("#bookingNumberInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
			
			if($("#bookingCityInput").val().length>20){
				$("#bookingCityInput").tooltip("enable");
				$("#bookingCityInput").tooltip("show");
				$("#bookingCityInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: 0
				}, 1000);
				return false;
			}

			if($("#bookingStreetInput").val().length>25){
				$("#bookingStreetInput").tooltip("enable");
				$("#bookingStreetInput").tooltip("show");
				$("#bookingStreetInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
		
			if($("#bookingNumberInput").val().length>4){
				$("#bookingNumberInput").tooltip("enable");
				$("#bookingNumberInput").tooltip("show");
				$("#bookingNumberInput").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
			
		}
		else if($("[value='table']").is(':checked')){
			if($("#tables").select2("val").length==0){
				//alert("Seleziona un tavolo!");
				$("#tables").closest("div").addClass("has-error");
				$('html, body').animate({
					scrollTop: $(".row.booking-data").offset().top
				}, 1000);
				return false;
			}
		}
		if(pizzaList.length==0){
			callAndSetModal("You have to add at least one pizza!");
			return false;
		}
		return true;
	}
	
	var callAndSetModal = function(message,special){
		$("#modalMessage").empty();
		if(special==true){
			$("#modalMessage").html("<h4>"+message+"</h4><img src='resources/images/backToTheFuture.png' width='500px' height='350px'></img>");
		}
		else{
			$("#modalMessage").text(message);				
		}
		$('#modalAlert').modal('show');
	}
	
	var getAvailableTableAndSetOnSelect = function(){
		var selectedTablesId= $("#tables").select2("val");
		var dateTime=extractData("date");
		var date=dateTime.split(" ")[0];
		var time=dateTime.split(" ")[1];
		$.ajax({
			url : "/pizzerialiveorderTable",
			type : 'GET',
			data : {
				date : date,
				time : time
			},
			success : function(data) {
				//resettare tutti gli option
				$("#tables > option").each(function(){
					$(this).prop("disabled",false);
				});
				
				$("#tables > option").each(function(){
					
					var idTable=$(this).val();
					var setDisability=true;
					for (var int2 = 0; int2 < selectedTablesId.length; int2++) {
						if(idTable==selectedTablesId[int2])
							setDisability=false;
					}
					
					if(setDisability){
						var availability=false;
						for (var int = 0; int < data.length; int++) {
							var idTableFromServer=data[int].id;
							if(idTableFromServer==idTable)
								availability=true;
						}	
						
						if(availability==false){
							$(this).prop("disabled",true);
						}
					}
				});
				
			},
			error : function(data, status, er) {
				alert("error: " + data + " status: " + status + " er:" + er);
			}
		});
	}
	
	return {
		init : function() {
			initVar();
			initLiveTool();
			initListeners();
		}
	}
}();