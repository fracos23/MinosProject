<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta
	content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
	name="viewport">
<title>Judge Manager</title>
<!-- Favicon-->
<link rel="icon" href="favicon.ico" type="image/x-icon">
<script defer
	src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>

<!-- Google Fonts -->

<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
	rel="stylesheet" type="text/css">

<!-- Bootstrap Core Css -->
<link href="resources/plugins/bootstrap/css/bootstrap.css"
	rel="stylesheet">

<!-- Animation Css -->
<link href="resources/plugins/animate-css/animate.css" rel="stylesheet" />

<!-- Morris Chart Css-->
<link href="resources/plugins/morrisjs/morris.css" rel="stylesheet" />

<!-- Custom Css -->
<link href="resources/css/style.css" rel="stylesheet">

<link href="resources/css/contest.css" rel="stylesheet">

<!-- Jquery Core Js -->
<script src="resources/plugins/jquery/jquery.min.js"></script>

<!-- Bootstrap Core Js -->
<script src="resources/plugins/bootstrap/js/bootstrap.js"></script>



</head>
<body>
	<jsp:include page="includes/navbarStudent.jsp"></jsp:include>
	<section class="content">
		<div class="container-fluid">
			<div class="block-header">
				<div class="card modify-card">
					<div class="pn-ProductNav_Wrapper">
						<nav id="pnProductNav" class="pn-ProductNav">
							<div id="pnProductNavContents" class="pn-ProductNav_Contents">
								<c:forEach items="${problems}" var="problem" varStatus="status">
									<a href="#" class="pn-ProductNav_Link"
										${status.first ? 'aria-selected="true"' : ''}>${problem.name }</a>
								</c:forEach>
								<span id="pnIndicator" class="pn-ProductNav_Indicator"></span>
							</div>
						</nav>
						<button id="pnAdvancerLeft" class="pn-Advancer pn-Advancer_Left"
							type="button">
							<svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 551 1024">
				<path
									d="M445.44 38.183L-2.53 512l447.97 473.817 85.857-81.173-409.6-433.23v81.172l409.6-433.23L445.44 38.18z" /></svg>
						</button>
						<button id="pnAdvancerRight" class="pn-Advancer pn-Advancer_Right"
							type="button">
							<svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 551 1024">
				<path
									d="M105.56 985.817L553.53 512 105.56 38.183l-85.857 81.173 409.6 433.23v-81.172l-409.6 433.23 85.856 81.174z" /></svg>
						</button>
					</div>
					<div class="body">
						<c:forEach items="${problems}" var="problem" varStatus="status">
							<div id="body-${problem.name }"
								${status.first ? '' : 'style="display:none"'}>
								<h4>Problem: ${problem.name}</h4>
								<div class="bubble">
									<div class="bubble-title">Descrizione del problema:</div>
									<div>${problem.description}</div>
									<br>

								</div>
								<div class="bubble">
									<div class="bubble-title">Submit:</div>
									<c:forEach items="${submits}" var="submit">
										<div class="submit">
											<div class="submit">
												<div>Team: ${submit.team.name}</div>
												<div>Score: ${submit.score}</div>
											</div>
											<br>
										</div>
									</c:forEach>
								</div>
								<form:form class="navbar-form form-inline"
									action="submit?problemId=${problem.id_problem}" method="post"
									modelAttribute="submitForm">
									<div class="form-group">
										<div>Nome del Team:</div>
										<label for="team">Select Team: </label> <select
											class="form-control" id="team" name="team">
											<c:forEach items="${teams}" var="team">
												<option>${team.name}</option>
											</c:forEach>
										</select>
										<div>Soluzione:</div>
										<input type="text" class="form-control" name="path"
											placeholder="Path"> 
									</div>
									<div>
										<input type="submit" class="btn btn-primary button-login"
											value="Invia" style="margin: 19px; float: right;" />
									</div>
								</form:form>
							</div>
						</c:forEach>
					</div>
				</div>

			</div>
		</div>
	</section>

	<script src="resources/js/contest.js" type="text/javascript"></script>
	<!-- Jquery Core Js -->
	<script src="resources/plugins/jquery/jquery.min.js"></script>

	<!-- Bootstrap Core Js -->
	<script src="resources/plugins/bootstrap/js/bootstrap.js"></script>
	<script type="text/javascript">
		$(function() {
			$('#fileUpload').change( function(event) {
			    var tmppath = URL.createObjectURL(event.target.files[0]);
			    console.log(tmppath);
			});
		});
	</script>
</body>
</html>
