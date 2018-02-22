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
					<div class="bubble-title">
					Your Teams
					<ul class="nav navbar-nav navbar-right">
						<c:if test="${userLogged}">
							<a href="#"
								data-toggle="modal" data-target="#myModal"
								class="btn btn-primary button-bookatable createTeam">Crea Team</a>
						</c:if>
						</ul>
					</div>
					
					
					<c:choose>
						<c:when test="${teams.size() > 0}">
							<div class="teams">
								<c:forEach items="${teams}" var="team">
									<div class="feedback">
										<div class="pizzeria-name">
											<a href="teamview?name=${team.name}">${team.name}</a>
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
							<form:form class="navbar-form form-inline" action="addTeam" method="post"
						modelAttribute="addTeamForm">
						<div class="form-group">
							<div>Nome del Team:</div>
							<input type="text" class="form-control" name="name" placeholder="Nome Team">
						</div><br>
							
						<div class="form-group">
							<div>Primo Membro:</div>
							<input type="text" class="form-control" name="member1" placeholder="matricola">
						</div><br>
						<div class="form-group">
							<div>Secondo Membro:</div>
							<input type="text" class="form-control" name="member2" placeholder="matricola">
						</div><br>
						<div class="form-group">
							<div>Terzo Membro:</div>
							<input type="text" class="form-control" name="member3" placeholder="matricola">
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Add Team" />
						</div>
					</form:form>
						</div>
					</div>
				</div>
</body>

