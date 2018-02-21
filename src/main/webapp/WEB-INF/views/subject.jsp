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

<title>Subject Page</title>

<meta name="viewport" content="width=device-width" />
<style>
h2 {
	margin-top: 0;
	margin-bottom: 20px;
}
</style>

</head>
<body>
	<!--  jsp:include page="includes/navbar${typeSession}.jsp" /-->

	<div class="container">

		<div class="row">
		<div class="col-xs-2"></div>
		<div class="col-xs-8 wrapper">
				<div class="bubble bubble-feedbacks">
				<ul class="nav navbar-nav navbar-right">
				<li>
				<button class="btn btn-primary button-add" data-toggle="tooltip" data-placement="bottom">
					<span class="glyphicon glyphicon-plus"></span> Iscriviti
				</button>
				<form:form id="password-form" class="navbar-form form-inline" action="signUpSubject"
						method="POST" modelAttribute="subjectPasswordForm">
						<div class="form-group">
							<div class="input-group">
								<input type="text" class="form-control" name="word" placeholder="Password" />
								<div class="input-group password-submit">
								</div>
							</div>
						</div>
					</form:form></li>
					
			</ul>
				<div>
					<a href="http://www.mat.unical.it"> ${subject} ISCRITTO</a>
					</div>
				<div class="buttons-container">
					
				</div>
				
		</div>
		</div>
		</div>
	</div>
</body>
<script>
	var $searchButton = $('.password-submit');
	$searchButton.on('click', function() {
		$('form#password-form').submit();
	});
</script>