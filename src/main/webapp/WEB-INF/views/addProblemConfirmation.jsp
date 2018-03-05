<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>
<link rel="stylesheet" type="text/css"
	href="resources/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<link rel="stylesheet" type="text/css"
	href="resources/css/userMainView.css" />
<link rel="stylesheet" type="text/css" href="resources/css/pizza.css" />

<title>Problem Page</title>

<meta name="viewport" content="width=device-width" />
<style>
h2 {
	margin-top: 0;
	margin-bottom: 20px;
}
</style>

</head>
<body>
	<jsp:include page="includes/navbar${typeSession}.jsp" />

	<div class="container">
	
		<div class="row">
			<div class="col-xs-2"></div>
			<div class="col-xs-8 wrapper">
				<div class="bubble bubble-feedbacks">
					<h4>Problem: ${problem.name}</h4>					
				</div>
				<div class="bubble">
					<div class="bubble-title">Submission Info:</div>
						<c:forEach items="${infos}" var="info">
									<div class="info">
										<div class="info">
										<div>${info}</div><br>
										</div>
									</div>
						</c:forEach>
						<div>Vuoi salvare la soluzione?: </div>
				<form action = "/confirm" method = "post">
				<input type="hidden" value="${problem.id_problem}" name="problemid">
				<input type="hidden" value="${path}" name="path">
				<input type="hidden" value="${team.name}" name="teamname">
				<input type="submit" value="Confirm" />
				</form>
				</div>
				
			</div>
	</div>
	</div>
</body>