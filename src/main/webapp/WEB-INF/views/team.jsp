<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<%@ page session="false"%>
<html>
<head>
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js"></script>

<script type="text/javascript" src="resources/js/maps.js"></script>

<script type="text/javascript" src="resources/js/user/homeUser.js"></script>

<link rel="stylesheet" type="text/css" href="resources/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/homeUser.css" />

<title>Team </title>

<meta name="viewport" content="width=device-width" />

<style type="text/css">
</style>
</head>
<body>
	<jsp:include page="includes/navbarAccount.jsp" />

	<div class="container">
		<div class="row">
			<div class="col-xs-4">
				<div class="bubble">
					<div class="profile-image-container">
						<img src="resources/images/no-image.png" class="img-circle">
					</div>
					
					<div class="name-container">${team.name}
					<ul class="nav navbar-nav navbar-right">
						<c:if test="${userLogged}">
							<a href="#"
								data-toggle="modal" data-target="#myModal"
								class="btn btn-primary button-bookatable createTeam">Cerca Contest</a>
						</c:if>
						</ul>
					</div>
					<div class="username-container">${team.id}</div>
					
				</div>
				<div class="bubble info-bubble">
					<div class="bubble-title">Member</div>
					<c:choose>
						<c:when test="${students.size() > 0}">
							<div class="teams">
								<c:forEach items="${students}" var="student">
									<div class="feedback">
										<div class="pizzeria-name">
											<div>${student.user.id}</div>
											<div>${student.user.name}</div>
											<div>${student.user.surname}</div>
										</div>
									</div>
								</c:forEach>
							</div>
						</c:when>
						<c:otherwise>
							<div class="no-team">Team has no member</div>
						</c:otherwise>
					</c:choose>
				</div>
			</div>
			<div class="col-xs-8 wrapper">
				<div class="bubble">
					<div class="bubble-title">Your submissions</div>
					<h4>Latest:</h4>
					<c:forEach items="${submits}" var="submit">
									<div class="submit">
										<div class="submit">
											<a href="contestviews">${submit.problem.name} (qua ci metto la data) ${submit.score} </a>
										</div>
									</div>
								</c:forEach>
				</div>
				
				<div class="bubble">
					<div class="bubble-title">Contest a cui il team partecipa</div>
					<c:forEach items="${contests}" var="contest">
									<div class="contest">
										<div class="contest">
											<div> ${contest.name} ${contest.idcontest}</div>
											
										</div>
									</div>
						</c:forEach>
				</div>
			</div>
		</div>
	</div>
	<div id="myModal" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title">Cerca Contest</h4>
							</div>
							<form:form class="navbar-form form-inline" action="addTeam" method="post"
						modelAttribute="addTeamForm">
						<div class="form-group">
							<div>Nome del Contest:</div>
							<input type="text" class="form-control" name="name" placeholder="Nome Contest">
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Cerca" />
						</div>
					</form:form>
						</div>
					</div>
				</div>
</body>

</html>