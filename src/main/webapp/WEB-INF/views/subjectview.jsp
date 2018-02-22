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
	<jsp:include page="includes/navbar${typeSession}.jsp"/>

	<div class="container">

		<div class="row">
		<div class="col-xs-2"></div>
		<div class="col-xs-8 wrapper">
				<div class="bubble bubble-feedbacks">
				
				<ul class="nav navbar-nav navbar-right">
				<li>
				
				<form:form id="password-form" class="navbar-form form-inline" action="signUpSubject?name=${name}"
						method="POST" modelAttribute="subjectPasswordForm">
						
						<div class="form-group">
							<div class="input-group">
							
								<input type="text" class="form-control" name="password" placeholder="Password"/>
												
							</div>
						</div>
					</form:form></li>
					<li>
					<button class="btn btn-primary button-add" data-toggle="tooltip" >
									 Iscriviti
								</button>
					</li>
					
			</ul>
					<div>
					<a href="http://www.mat.unical.it/informatica/${name}"> ${name} </a>
					</div>
				
				
		</div>
		<div class="bubble">
					<div class="bubble-title">Subject contests</div>
					<h4>Latest:</h4>
					<c:forEach items="${contests}" var="contest">
									<div class="contest">
										<div class="contest">
											<a href="contest?name=${contest.name}">${contest.name}</a>
										</div>
									</div>
								</c:forEach>
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