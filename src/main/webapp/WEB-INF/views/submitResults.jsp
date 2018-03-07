<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>

<script type="text/javascript" src="resources/js/user/homeUser.js"></script>
<style>
.city {display:none}
</style>

<link rel="stylesheet" type="text/css" href="resources/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/homeUser.css" />

<title>Home User</title>

<meta name="viewport" content="width=device-width" />
<meta name="viewport" content="width=device-width" />
<style>
h2 {
	margin-top: 0;
	margin-bottom: 20px;
}
</style>
</head>
<body>
<c:choose>
	<c:when test="${user.professor == true}">
	<jsp:include page="includes/navbarAccount.jsp" />
	<div class="container">

		<div class="row">
		<div class="col-xs-2"></div>
		<div class="col-xs-8 wrapper">
				<div class="bubble bubble-feedbacks">
					<div class="bubble-title">Result found for '${word}':</div>
  					 <c:forEach items="${submits}" var="mapElement">
     					<div> Contest: <a href="contes?name=${mapElement.key}"> ${mapElement.key}</a>:</div><br>
         				  <c:forEach items="${mapElement.value}" var="listElement" >
             				 <div>Team :${listElement.team.name} <div>Score: ${listElement.score}</div></div><br>
          				 </c:forEach>
   					</c:forEach>
					
					
					</div>
				</div>
		</div>
		</div>			
	</c:when>
	<c:otherwise>

<h4>Impossibile accedere alla pagina</h4>
</c:otherwise>
</c:choose>