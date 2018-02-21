<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>
<link rel="stylesheet" type="text/css" href="resources/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/userMainView.css" />
<link rel="stylesheet" type="text/css" href="resources/css/pizza.css" />
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>
<script type="text/javascript" src="resources/js/moment.js"></script>
<script type="text/javascript"
	src="resources/js/bootstrap-datepicker.js"></script>
<script type="text/javascript"
	src="https://maps.googleapis.com/maps/api/js"></script>

<script type="text/javascript" src="resources/js/maps.js"></script>

<script type="text/javascript"
	src="resources/js/pizzeria/pizzeriaMainView.js"></script>
	
<script type="text/javascript">
	// function modal
	$(document)
			.ready(
					function() {
						var idBooking;
						//createBook
						$(".createBook").on('click', function() {
							var id = parseInt($(this).data("pizzeria"));
					$.ajax({
						type : "POST",
						url : "/pizzeriamainview/createBook",
						data : {
							idPizzeria : id

						},
						success : function(response) {
							idBooking = response;

						}
					});
				});

				$(".addBook").on('click',function() {
							var seats = $("#bookInputSeats").val();
							var dateTime = $("#bookDatetimePicker").data('DateTimePicker').date().format('DD/MM/YYYY HH:mm');
							var d = dateTime.split(" ")[0];
							var t = dateTime.split(" ")[1];
							var pizzeria = $(this).data('pizzeria');					
							$.ajax({
								type : "POST",
								url : "/pizzeriamainview/booking",
								data : {
									seats : seats,
									date : d,
									time : t,
									idbooking : idBooking

								},
								success : function(response) {
									if (response == "booked") {
										$("#myModal").modal('toggle');
										$('.datetimepicker').data('DateTimePicker').date(new Date());
										$("#bookInputSeats").val(1);
										
									} else if (response == "errordate") {
										$(".errorBookingMessage").text("Invalid Date. Please select a valid Date.");
									} else if (response == "errortables") {
										$(".errorBookingMessage").text("No tables available.Please check number of required seats and date.");
									}
								}
							});
						});

						$(".cancelBook").on('click', function() {
							$.ajax({
								type : "POST",
								url : "/pizzeriamainview/cancelBook",
								data : {
									idbooking : idBooking
								},
								success : function(response) {

								}
							});
						});
						$(".addItemToBook").on('click', function() {
							var button = $(this);
							var idpizza = $(this).data('id');

							$.ajax({
								type : "POST",
								url : "/pizzeriamainview/addPizza",
								data : {
									idpizza : idpizza,
									idbooking : idBooking
								},
								success : function(response) {
									button.siblings('.glyphicon-ok').show();
									button.attr('disabled', 'disabled');
								}
							});
						})

					});
</script>
<title>Team Page</title>

<meta name="viewport" content="width=device-width" />
<style>
h2 {
	margin-top: 0;
	margin-bottom: 20px;
}
</style>

</head>
<body>
	<jsp:include page="includes/navbar${typeSession}.jsp"/>

	<div class="container">

		<div class="row">
		<div class="col-xs-2"></div>
		<div class="col-xs-8 wrapper">
		<div class="bubble info-bubble">
					<div class="bubble-title">Your Teams</div>
					<div class="pizzeria-buttons-container">
					<ul class="nav navbar-nav navbar-right">
						<c:if test="${userLogged}">
							<a href="#"
								data-toggle="modal" data-target="#myModal"
								class="btn btn-primary button-bookatable createBook">Crea Team</a>
						</c:if>
						</ul>
					</div>
					<c:choose>
						<c:when test="${teams.size() > 0}">
							<div class="teams">
								<c:forEach items="${teams}" var="team">
									<div class="feedback">
										<div class="pizzeria-name">
											<a href="teamsviews.jsp">${team.name}</a>
										</div>
									</div>
								</c:forEach>
							</div>
						</c:when>
						<c:otherwise>
							<div class="no-team">You have no team yet.</div>
						</c:otherwise>
					</c:choose>
				</div>
				</div>
				</div>
	</div>
	<div id="myModal" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">Crea Nuovo Team</h4>
							</div>
							<div class="modal-body">
						<form:form class="navbar-form form-inline" action="login" method="post"
						modelAttribute="logInForm">
						<div class="form-group">
							<div>Nome del Team:</div>
							<input type="text" class="form-control" name="nameTeam" placeholder="Nome Team">
						</div><br>
							
						<div class="form-group">
							<div>Primo Membro:</div>
							<input type="text" class="form-control" name="firstMember" placeholder="matricola">
						</div><br>
						<div class="form-group">
							<div>Secondo Membro:</div>
							<input type="text" class="form-control" name="secondMember" placeholder="matricola">
						</div><br>
						<div class="form-group">
							<div>Terzo Membro:</div>
							<input type="text" class="form-control" name="thirdMember" placeholder="matricola">
						</div><br>
					</form:form>
							</div>
							<div class="modal-footer">
								<div class="row">
									<div class="seatsDiv col-xs-3">
										<input id="bookInputSeats" type="number" class="form-control"
											name="numeroPosti" value="1">
									</div>
									<div class="form-group col-xs-5">
										<div id="bookDatetimePicker"
											class='input-group date datetimepicker'>
											<input type='text' class="form-control" /> <span
												class="input-group-addon"> <span
												class="glyphicon glyphicon-calendar"></span>
											</span>
										</div>
									</div>
								</div>
								<div class="row errorBookingMessage"></div>
								<button type="button" class="btn btn-default cancelBook"
									data-dismiss="modal">Chiudi</button>
								<a href="#" data-id="${pizzeriaPizza.id}"
									data-pizzeria="${pizzeriaResult.id}" data-dismiss=""
									class="btn btn-primary button-bookatable addBook">Conferma</a>
							</div>
						</div>
					</div>
				</div>
</body>
<script>
	var $searchButton = $('.button-add');
	$searchButton.on('click', function() {
		$('form#password-form').submit();
	});
</script>
