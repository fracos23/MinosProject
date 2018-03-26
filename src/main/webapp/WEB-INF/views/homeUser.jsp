<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
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


</head>

<body class="theme-red">
	<!-- Page Loader -->
	<div class="page-loader-wrapper">
		<div class="loader">
			<div class="preloader">
				<div class="spinner-layer pl-red">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>
			<p>Please wait...</p>
		</div>
	</div>
	<!-- #END# Page Loader -->
	<!-- Overlay For Sidebars -->
	<div class="overlay"></div>
	<div class="button">
		<a href="javascript:void(0);" class="bars" style="display: block;"></a>
	</div>
	<!-- #END# Overlay For Sidebars -->
	<!-- Search Bar -->
	<div class="search-bar">
		<div class="search-icon">
			<i class="material-icons">search</i>
		</div>
		<form:form id="navbar-search-form" class="navbar-form form-inline"
			action="search" method="POST" modelAttribute="searchForm"
			style="margin: 0px !important;padding: 0px !important;">
			<input type="text" name="word" placeholder="START TYPING...">
		</form:form>
		<div class="close-search">
			<i class="material-icons">close</i>
		</div>
	</div>
	<!-- navbar -->
	<c:if test="${user.professor == false}">
		<jsp:include page="includes/navbarStudent.jsp"></jsp:include>
	</c:if>
	<c:if test="${user.professor == true}">
		<jsp:include page="includes/navbarTeacher.jsp"></jsp:include>
	</c:if>
	<!-- end navbar -->
	<c:if test="${user.professor == false}">
		<section class="content">
			<div class="container-fluid">
				<div class="block-header">
					<div class="card">
						<div class="header">
							<h2>YOUR SUBMISSIONS</h2>
						</div>
						<div class="body">
							<div class="table-responsive">
								<table class="table table-hover dashboard-task-infos">
									<thead>
										<tr>
											<th>Contest</th>
											<th>Probelm</th>
											<th>Team</th>
											<th>Date</th>
											<th>Score</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										<c:forEach items="${submits}" var="submit">
											<tr>
												<td>${submit.problem.name}</td>
												<td>Sort</td>
												<td>${submit.team.name}</td>
												<td>00-00-00</td>
												<td>${problem.score}</td>
												<td><span class="label bg-green">Done</span></td>
											</tr>
										</c:forEach>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-7">
							<div class="card">
								<div class="header">
									<h2>CONTEST SUBSCRIBED</h2>
								</div>
								<div class="body">
									<div class="table-responsive">
										<table class="table table-hover dashboard-task-infos">
											<thead>
												<tr>
													<th>Name</th>
													<th>Corso</th>
													<th>Problems</th>
													<th>Deadline</th>
												</tr>
											</thead>
											<tbody>
												<c:forEach items="${contests}" var="contest">
													<tr>
														<td><a href="contest?name=${contest.contest.name}">${contest.contest.name}</a></td>
														<td>${contest.contest.subject.name}</td>
														<td>
															<button onclick="myFunction()" class="dropbtn">Dropdown</button>
															<div id="myDropdown" class="dropdown-content">
																<a href="javascript:void(0);">Home</a> <a href="#about">About</a>
																<a href="#contact">Contact</a>
															</div>
														</td>
														<td>${contest.contest.deadline}</td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div class="col-sm-5">
							<div class="card">
								<div class="header">
									<h2>COURSES FOLLOWED</h2>
								</div>
								<div class="body">
									<div class="table-responsive">
										<table class="table table-hover dashboard-task-infos">
											<thead>
												<tr>
													<th>Corso</th>
													<th>Pagina</th>
												</tr>
											</thead>
											<tbody>
												<c:forEach items="${subjects}" var="subject">
													<tr>
														<td>${subject}</td>
														<td><a
															href="<c:url value='subject?name=${subject}'/>"><i
																class="fas fa-link"
																style="color: #bf0418; font-size: 1.1em;"></i></a></td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
	</c:if>

	<c:if test="${user.professor == true}">
		<!--                               PROFESSOR PAGE                         -->

		<jsp:include page="includes/navbarTeacher.jsp"></jsp:include>

		<section class="content">
			<div class="container-fluid">
				<div class="block-header">
					<div class="card">
						<div class="header">
							<h2>CONTEST CREATED</h2>
						</div>
						<div class="body">
							<div class="table-responsive">
								<table class="table table-hover dashboard-task-infos">
									<thead>
										<tr>
											<th>Name</th>
											<th>Deadline</th>
											<th>Subject</th>
											<th>Year</th>
											<th>Jury</th>
											<th>Open</th>
										</tr>
									</thead>
									<tbody>
										<c:forEach items="${contests}" var="contest">
											<tr>
												<td>${contest.name}</td>
												<td>${contest.deadline}</td>
												<td>${contest.subject.subjectId.id_subject}</td>
												<td>${contest.subject.subjectId.year}</td>
												<td>${contest.jury.id_jury}</td>
												<td>${contest.restriction}</td>
											</tr>
										</c:forEach>
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-7">
							<div class="card">
								<div class="header">
									<h2>Active Subjects</h2>
								</div>
								<div class="body">
									<div class="table-responsive">
										<table class="table table-hover dashboard-task-infos">
											<thead>
												<tr>
													<th>Name</th>
													<th>Id Subject</th>
													<th>Year</th>
													<th>Password</th>
												</tr>
											</thead>
											<tbody>
												<c:forEach items="${subjects}" var="subject">
													<tr>
														<td>${subject.name}</td>
														<td>${subject.subjectId.id_subject}</td>
														<td>${subject.subjectId.year}</td>
														<td>
															<button onclick="myFunction()" class="dropbtn">${subject.password}</button>
															<div id="myDropdown" class="dropdown-content">
																<a href="javascript:void(0);">Reimposta</a>
															</div>
														</td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div class="col-sm-5">
							<div class="card">
								<div class="header">
									<h2>JURY MEMBER</h2>
								</div>
								<div class="body">
									<div class="table-responsive">
										<table class="table table-hover dashboard-task-infos">
											<thead>
												<tr>
													<th>Jury Id</th>
													<th>Contest</th>
												</tr>
											</thead>
											<tbody>
												<c:forEach items="${contestjuries}" var="jury">
													<tr>
														<td>${jury.jury.id_jury}</td>
														<td>${jury.name}</td>
													</tr>
												</c:forEach>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
		<div id="myModal1" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Crea Nuovo Subject</h4>
					</div>
					<form:form class="navbar-form form-inline" action="addSubject"
						method="post" modelAttribute="addSubjectForm">
						<div class="form-group">
							<div>Id del corso:</div>
							<input type="text" class="form-control" name="id"
								placeholder="Id">
						</div>
						<br>

						<div class="form-group">
							<div>Year:</div>
							<input type="text" class="form-control" name="year"
								placeholder="Year">
						</div>
						<br>
						<div class="form-group">
							<div>Nome:</div>
							<input type="text" class="form-control" name="name"
								placeholder="Name">
						</div>
						<br>
						<div class="form-group">
							<div>Password:</div>
							<input type="text" class="form-control" name="password"
								placeholder="Password">
						</div>
						<br>
						<div class="modal-footer">
							<input type="submit" class="btn btn-primary button-login"
								value="Add Subject" />
						</div>
					</form:form>
				</div>
			</div>
		</div>
		<div id="myModal2" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Crea Contest:</h4>
					</div>
					<form:form class="navbar-form form-inline" action="addContest"
						method="post" modelAttribute="addContestForm">
						<div class="form-group">
							<div>Nome del Contest:</div>
							<input type="text" class="form-control" name="name"
								placeholder="Name">
						</div>
						<br>

						<div class="form-group">
							<div>Corso:</div>
							<input type="text" name="subjectId" placeholder="Id Subject">
						</div>
						<br>
						<div class="form-group">
							<div>Corso:</div>
							<input type="text" name="jury" placeholder="Id Jury">
						</div>
						<br>
						<div class="form-group">
							<div>Data Scadenza:</div>
							<input type="text" id="datepicker">
						</div>
						<br>
						<div class="modal-footer">
							<input type="submit" class="btn btn-primary button-login"
								value="Add Contest" />
						</div>
					</form:form>
				</div>
			</div>
		</div>
		<div id="myModal3" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="tabs">
						<div class="wizard">
							<div class="wizard-inner">
								<div class="connecting-line"></div>
								<ul class="nav nav-tabs" role="tablist">

									<li role="presentation" class="active"><a href="#step1"
										data-toggle="tab" aria-controls="step1" role="tab"
										title="Step 1"> <span class="round-tab"> <i
												class="far fa-copy"
												style="position: relative; bottom: 10px; color: gray"></i>
										</span>
									</a></li>

									<li role="presentation"><a href="#step2" data-toggle="tab"
										aria-controls="step2" role="tab" title="Step 2"> <span
											class="round-tab"> <i class="far fa-file-archive"
												style="position: relative; bottom: 10px; color: gray"></i>
										</span>
									</a></li>
									<li role="presentation"><a href="#step3" data-toggle="tab"
										aria-controls="step3" role="tab" title="Step 3"> <span
											class="round-tab"> <i class="far fa-file-code"
												style="position: relative; bottom: 10px; color: gray"></i>
										</span>
									</a></li>

									<li role="presentation"><a href="#complete"
										data-toggle="tab" aria-controls="complete" role="tab"
										title="Complete"> <span class="round-tab"> <i
												class="fas fa-wrench"
												style="position: relative; bottom: 10px; color: gray"></i>
										</span>
									</a></li>
								</ul>
							</div>

							<form role="form">
								<div class="tab-content" style="margin: 0 16px 0 16px;">
									<div class="tab-pane active" role="tabpanel" id="step1">
										<h3>Problem 1</h3>
										<form:form class="navbar-form form-inline" action="addProblem" method="post"
						modelAttribute="problemForm">
						<div class="form-group">
						<input type="hidden" name="type" value="1"/>
						</div>
						<div class="form-group">
							<div>Id del contest:</div>
							<input type="text" class="form-control" name="id" placeholder="Id Cotest">
						</div><br>
						<div class="form-group">
							<div>Nome problema:</div>
							<input type="text" class="form-control" name="name" placeholder="Name">
						</div><br>
						<div>Insert TestCaseFile and SolutionFile</div>
						<div class="form-group">
							<div>Path TestCase:</div>
							<input type="text" class="form-control" name="pathTest" placeholder="Path TestCase">
						</div><br>
						<div class="form-group">
							<div>Path Soluzioni:</div>
							<input type="text" class="form-control" name="pathSol" placeholder="Path Solutions">
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Add Problem" />
						</div>
						</form:form>
										
									</div>
									<div class="tab-pane" role="tabpanel" id="step2">
										<h3>Problem 2</h3>
										<form:form class="navbar-form form-inline" action="addProblem" method="post"
						modelAttribute="problemForm">
						<div class="form-group">
						<input type="hidden" name="type" value="2"/>
						</div>
						<div class="form-group">
							<div>Id del contest:</div>
							<input type="text" class="form-control" name="id" placeholder="Id Contest">
						</div><br>
						<div class="form-group">
							<div>Nome problema:</div>
							<input type="text" class="form-control" name="name" placeholder="Name">
						</div><br>
						<div class="form-group">
							<div>Path Zip:</div>
							<input type="text" class="form-control" name="pathZip" placeholder="Path Zip">
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Add Problem" />
						</div>
						</form:form>
									</div>
									<div class="tab-pane" role="tabpanel" id="step3">
										<h3>Problem 3</h3>
										<form:form class="navbar-form form-inline" action="addProblem" method="post"
						modelAttribute="problemForm">
						<div class="form-group">
						<input type="hidden" name="type" value="3"/>
						</div>
						<div class="form-group">
							<div>Id del contest:</div>
							<input type="text" class="form-control" name="id" placeholder="Id Contest">
						</div><br>
						<div class="form-group">
							<div>Nome problema:</div>
							<input type="text" class="form-control" name="name" placeholder="Name">
						</div><br>
						<div class="form-group">
							<div>Path Algorithm:</div>
							<input type="text" class="form-control" name="pathAlgorithm" placeholder="Path Algorithm">
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Add Problem" />
						</div>
						</form:form>
									</div>
									<div class="tab-pane" role="tabpanel" id="complete">
										<form:form id="4" class="navbar-form form-inline" action="addProblem" method="post"
						modelAttribute="problemForm">
						<div class="form-group">
						<input type="hidden" name="type" value="4"/>
						</div>
						<div class="form-group">
							<div>Id del contest:</div>
							<input type="text" class="form-control" name="id" placeholder="Id Contest">
						</div><br>
						<div class="form-group">
							<div>Nome problema:</div>
							<input type="text" class="form-control" name="name" placeholder="Name">
						</div><br>
						<div class="form-group">
							<div>Path Algorithm:</div>
							<input type="text" class="form-control" name="pathAlgorithm" placeholder="Path Algorithm">
						</div><br>
						<div class="form-group">
							<div>Domain:</div>
						<input type="radio" name="domain" value="Array Integer" checked> Array Integer<br>
						<input type="radio" name="domain" value="String"> String<br>
						</div><br>
						<div class="modal-footer">
						<input type="submit" class="btn btn-primary button-login" value="Add Problem" />
						</div>
					</form:form>
									</div>
									<div class="clearfix"></div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="myModal4" class="modal fade">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title">Inserisci Problema</h4>
					</div>
					<form:form class="navbar-form form-inline" action="addProblem2"
						method="post" modelAttribute="problemForm">
						<div class="form-group">
							<div>Id del contest:</div>
							<input type="text" class="form-control" name="id"
								placeholder="Id Contest">
						</div>
						<br>
						<div class="form-group">
							<div>Nome problema:</div>
							<input type="text" class="form-control" name="name"
								placeholder="Name">
						</div>
						<br>
						<div class="form-group">
							<div>Dominio Applicativo:</div>
							<input type="text" class="form-control" name="description"
								placeholder="Dominio Applicativo">
						</div>
						<br>

						<div class="modal-footer">
							<input type="submit" class="btn btn-primary button-login"
								value="Add Problem" />
						</div>
					</form:form>
				</div>
			</div>
		</div>
	</c:if>



	<!-- Jquery Core Js -->
	<script src="resources/plugins/jquery/jquery.min.js"></script>

	<!-- Bootstrap Core Js -->
	<script src="resources/plugins/bootstrap/js/bootstrap.js"></script>

	<!-- Waves Effect Plugin Js -->
	<script src="resources/plugins/node-waves/waves.js"></script>
	<!-- Custom Js -->
	<script src="resources/js/admin.js"></script>
	<script src="resources/js/pages/index.js"></script>
	<script>
		var $searchButton = $('.navbar-search-submit');
		$searchButton.on('click', function() {
			$('form#navbar-search-form').submit();
		});

		/* When the user clicks on the button, 
		toggle between hiding and showing the dropdown content */
		function myFunction() {
			document.getElementById("myDropdown").classList.toggle("show");
		}

		// Close the dropdown if the user clicks outside of it
		window.onclick = function(event) {
			if (!event.target.matches('.dropbtn')) {

				var dropdowns = document
						.getElementsByClassName("dropdown-content");
				var i;
				for (i = 0; i < dropdowns.length; i++) {
					var openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('show')) {
						openDropdown.classList.remove('show');
					}
				}
			}
		}
	</script>

</body>

</html>