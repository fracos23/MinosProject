<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
	<section> <!-- Left Sidebar --> <aside id="leftsidebar"
		class="sidebar"> <!-- User Info -->
	<div class="user-info">
		<div class="info-container">
			<div class="name" data-toggle="dropdown" aria-haspopup="true"
				aria-expanded="false">${user.name}${user.surname}</div>
			<div class="id_number">${user.id}</div>
			<a href="javascript:void(0);" class="js-search" data-close="true"><i
				class="material-icons">search</i></a>
		</div>
	</div>
	<!-- #User Info --> <!-- Menu -->
	<div class="menu">
		<ul class="list">
			<li>
				<div id="custom-search-input" style="margin: 16px">
					<div class="input-group col-md-12">
						<input type="text" class="form-control input-lg"
							placeholder="Solutions" /> <span class="input-group-btn">
							<button class="btn btn-info btn-lg" type="button">
								<i class="glyphicon glyphicon-search"></i>
							</button>
						</span>
					</div>
				</div>
			</li>
			<li class="active"><a href="/"> <i class="material-icons">home</i>
					<span>Home</span>
			</a></li>
			<li><a href="#" data-toggle="modal" data-target="#myModal1">
					<i class="material-icons">view_list</i> <span>Add Subject</span>
			</a></li>
			<li><a href="#" data-toggle="modal" data-target="#myModal2">
					<i class="material-icons">content_copy</i> <span>Add Contest</span>
			</a></li>
			<li>
			<li><a href="#" data-toggle="modal" data-target="#myModal3">
					<i class="material-icons">update</i> <span>Add Problem</span>
			</a></li>
			<li><a href="logout"> <i class="fas fa-sign-out-alt"
					style="font-size: 1.5em;"></i> <span
					style="position: relative; bottom: 5px">Logout</span>
			</a></li>

		</ul>
	</div>


	<!-- #Menu --> <!-- Footer -->
	<div class="legal">
		<div class="copyright">&copy; 2017 - 2018 Judge Manager.</div>
		<div class="version">
			<b>Version: </b> 1.0.0
		</div>
	</div>
	<!-- #Footer --> </aside> <!-- #END# Left Sidebar --> </section>
</body>
</html>