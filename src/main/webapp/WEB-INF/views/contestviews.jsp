<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<html>
<head>
<script type="text/javascript" src="resources/js/jquery.js"></script>
<script type="text/javascript" src="resources/js/bootstrap.js"></script>

<link rel="stylesheet" type="text/css" href="resources/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="resources/css/common.css" />
<link rel="stylesheet" type="text/css" href="resources/css/userMainView.css" />

<title>Contest View</title>

<meta name="viewport" content="width=device-width" />

</head>
<body>
	<jsp:include page="includes/navbar${typeSession}.jsp" />

	<div class="container">
		<div class="row">
			<div class="col-xs-4">
				<div class="bubble">
					<div class="profile-image-container">
						<img src="resources/images/images.png" class="img-circle">
					</div>
					<div class="username-container">${searchedUser.name}</div>
				</div>
			</div>
			<div class="col-xs-8 wrapper">
				<div class="bubble bubble-feedbacks">
					<div class="bubble-title">Contest </div>
					<div class="contests">
						<c:forEach items="${searchedUser.contests}" var="contest">
							<div class="contest">
								<div class="contest-name">
									<a href="pizzeriamainview?id=${feedback.pizzeria.id}">${feedback.pizzeria.name}</a>
								</div>
								
								<c:if test="${feedback.comment.length() > 0}">
									<div class="comment">"${feedback.comment}"</div>
								</c:if>
							</div>
						</c:forEach>

					</div>
				</div>
			</div>
		</div>
	</div>

</body>
</html>

