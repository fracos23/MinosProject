<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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

<title>Home User</title>

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
					<div class="name-container">${user.name}<span> </span>${user.surname}</div>
					<div class="username-container">${user.id}</div>
				</div>
				<div class="bubble info-bubble">
					<div class="bubble-title">Your latest activity</div>
					<c:choose>
						<c:when test="${teams.size() > 0}">
							<div class="feedbacks-header">
								<a href="teamsviews.jsp">View all Teams</a>
							</div>
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
			<div class="col-xs-8 wrapper">
				<div class="bubble">
					<div class="bubble-title">Your submissions</div>
					<h4>Latest:</h4>
					<c:forEach items="${submits}" var="submit">
									<div class="submit">
										<div class="submit">
											<a href="contestviews">${submit.problem.name} (qua ci metto la data) ${problem.score} </a>
										</div>
									</div>
								</c:forEach>
				</div>
				<div class="bubble">
					<div class="bubble-title">Corsi che segui</div>
					<c:forEach items="${subjects}" var="subject">
									<div class="subject">
										<div class="subject">
											<a href="<c:url value="/subject?name=${subject}" />"> ${subject}</a>
											<a>  </a>
											<a href="https://www.mat.unical.it/informatica"> Sito corso </a>
										</div>
									</div>
						</c:forEach>
				</div>
				<div class="bubble">
					<div class="bubble-title">Contest a cui sei iscritto</div>
					<c:forEach items="${contests}" var="contest">
									<div class="contest">
										<div class="contest">
											<div> ${contest.contest.name} ${contest.contest.idcontest}</div>
											
										</div>
									</div>
						</c:forEach>
				</div>
			</div>
		</div>
	</div>
</body>

</html>