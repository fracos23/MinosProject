<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page session="false"%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>Judge Manager</title>
    <!-- Favicon-->
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>

    <!-- Google Fonts -->
    
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">

    <!-- Bootstrap Core Css -->
    <link href="resources/plugins/bootstrap/css/bootstrap.css" rel="stylesheet">

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
    <div class="overlay">
    </div>
    <div class="button">
        <a href="javascript:void(0);" class="bars" style="display: block;"></a>
    </div>
    <!-- #END# Overlay For Sidebars -->
    <!-- Search Bar -->
    <div class="search-bar">
        <div class="search-icon">
            <i class="material-icons">search</i>
        </div>
        <input type="text" placeholder="START TYPING...">
        <div class="close-search">
            <i class="material-icons">close</i>
        </div>
    </div>
    <section>
        <!-- Left Sidebar -->
        <aside id="leftsidebar" class="sidebar">
            <!-- User Info -->
            <div class="user-info">
                <div class="info-container">
                    <div class="name" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${user.name} ${user.surname}</div>
                    <div class="id_number">${user.id}</div>
                    <a href="javascript:void(0);" class="js-search" data-close="true"><i class="material-icons">search</i></a>
                </div>
            </div>
            <!-- #User Info -->
            <!-- Menu -->
            <div class="menu">
                <ul class="list">
                    <li class="active">
                        <a href="javascript:void(0);">
                            <i class="material-icons">home</i>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);">
                            <i class="material-icons">view_list</i>
                            <span>Teams</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);">
                            <i class="material-icons">content_copy</i>
                            <span>Create File</span>
                        </a>
                    </li>
                    <li>
                        <li>
                            <a href="pages/changelogs.html">
                                <i class="material-icons">update</i>
                                <span>Contests</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <!-- #Menu -->
                <!-- Footer -->
                <div class="legal">
                    <div class="copyright">
                        &copy; 2017 - 2018 Judge Manager.
                    </div>
                    <div class="version">
                        <b>Version: </b> 1.0.0
                    </div>
                </div>
                <!-- #Footer -->
            </aside>
            <!-- #END# Left Sidebar -->
        </section>
    </div>
    <section class="content">
        <div class="container-fluid">
            <div class="block-header">
                <c:choose>
                    <c:when test="${user.professor == false}">
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
                                        <td>Team A</td>
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
                <div class="col-sm-6">
                 <div class="card">
                    <div class="header">
                        <h2>CONTEST A CUI SEI ISCRITTO</h2>
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
                                        <td>${contest.contest.name}</td>
                                        <td>${contest.contest.subject.name}</td>
                                        <td>
                                            <div class="dropdown">
                                                <a class="dropdown-toggle" data-toggle="dropdown" style="color: #bf0418">Problems
                                                 <span class="caret"></span></a>
                                                 <ul class="dropdown-menu">
                                                  <li><a href="#">HTML</a></li>
                                                  <li><a href="#">CSS</a></li>
                                                  <li><a href="#">JavaScript</a></li>
                                              </ul>
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
      <div class="col-sm-6">
         <div class="card">
            <div class="header">
                <h2>CORSI CHE SEGUI</h2>
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
                                <td> ${subject}</td>
                                <td><a href="<c:url value='subject?name=${subject}'/>"><i class="fas fa-link" style="color:#bf0418;font-size: 1.1em;"></i></a></td>
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
    </c:when>
    <c:otherwise>
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
                <form:form id="navbar-search-form" class="navbar-form form-inline" action="searchProblem"
                        method="POST" modelAttribute="searchForm">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="text" class="form-control" name="word" placeholder="Search Problem" />
                                <div class="input-group-addon navbar-search-submit">
                                    <span class="glyphicon glyphicon-search"></span>
                                </div>
                            </div>
                        </div>
                    </form:form>
                <div class="col-md-5">
                
                <a href="#" data-toggle="modal" data-target="#myModal1" class="btn btn-primary button-add" data-toggle="tooltip" data-placement="bottom">
                    <span class="glyphicon glyphicon-plus"></span> Add Subject
                </a><div></div><br>
                <a href="#" data-toggle="modal" data-target="#myModal2" class="btn btn-success button-update" data-toggle="tooltip" data-placement="bottom">
                    <span class="glyphicon glyphicon-plus"></span> Add Contest
                </a><div></div><br>
                <a href="#" data-toggle="modal" data-target="#myModal3" class="btn btn-danger button-delete" data-toggle="tooltip" data-placement="bottom">
                    <span class="glyphicon glyphicon-plus"></span> Add Problem
                </a><div></div><br>
            </div>
            </div>
            <div class="col-xs-8 wrapper">
                <div class="bubble">
                    <div class="bubble-title">Corsi Attivi</div>
                    <h4>Latest:</h4>
                    <c:forEach items="${subjects}" var="subject">
                                    <div class="subject">
                                        <div class="subject">
                                            <a href="/contest?name=">${subject.name}</a>
                                        </div>
                                    </div>
                                </c:forEach>
                </div>
                <div class="bubble">
                    <div class="bubble-title">Contes Creati:</div>
                    <c:forEach items="${contests}" var="contest">
                                    <div class="subject">
                                        <div class="subject">
                                            <a href="<c:url value="/subject?name=${contest.name}" />"> ${contest.name}</a>
                                            <a>  </a>
                                            <a href="https://www.mat.unical.it/informatica"> Sito corso </a>
                                        </div>
                                    </div>
                        </c:forEach>
                </div>
                <div class="bubble">
                    <div class="bubble-title">Giuria di cui sei membro:</div>
                    <c:forEach items="${contestjuries}" var="contestjury">
                                    <div class="jury">
                                        <div class="jury">
                                            <div> ${contestjury.jury.id_jury}  <a href="https://www.mat.unical.it/informatica"/>(${contestjury.name})</a>
                                            
                                            </div>
                                        </div>
                                    </div>
                        </c:forEach>
                </div>
            </div>
            </div>
            </div>
            <div id="myModal1" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Crea Nuovo Subject</h4>
                            </div>
                            <form:form class="navbar-form form-inline" action="addSubject" method="post"
                        modelAttribute="addSubjectForm">
                        <div class="form-group">
                            <div>Id del corso:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id">
                        </div><br>
                            
                        <div class="form-group">
                            <div>Year:</div>
                            <input type="text" class="form-control" name="year" placeholder="Year">
                        </div><br>
                        <div class="form-group">
                            <div>Nome:</div>
                            <input type="text" class="form-control" name="name" placeholder="Name">
                        </div><br>
                        <div class="form-group">
                            <div>Password:</div>
                            <input type="text" class="form-control" name="password" placeholder="Password">
                        </div><br>
                        <div class="modal-footer">
                        <input type="submit" class="btn btn-primary button-login" value="Add Subject" />
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
                            <form:form class="navbar-form form-inline" action="addContest" method="post"
                        modelAttribute="addContestForm">
                        <div class="form-group">
                            <div>Nome del Contest:</div>
                            <input type="text" class="form-control" name="name" placeholder="Name">
                        </div><br>
                            
                        <div class="form-group">
                            <div>Corso:</div>
                            <input type="text" name="subjectId" placeholder="Id Subject">
                        </div><br>
                        <div class="form-group">
                            <div>Corso:</div>
                            <input type="text" name="jury" placeholder="Id Jury">
                        </div><br>
                        <div class="form-group">
                            <div>Data Scadenza:</div>
                            <input type="text" maxlength="2" class="form-control" name="day" placeholder="dd">
                            <input type="text" maxlength="2" class="form-control" name="month" placeholder="mm">
                            <input type="text" maxlength="4" class="form-control" name="year" placeholder="yyyy">
                        </div><br>
                        <div class="modal-footer">
                        <input type="submit" class="btn btn-primary button-login" value="Add Contest" />
                        </div>
                    </form:form>
                        </div>
                    </div>
                </div>
                <div id="myModal3" class="modal fade">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Inserisci Problema</h4>
                            </div>
                            <div class="w3-bar w3-border-bottom">
   <button class="tablink w3-bar-item w3-button" onclick="openCity(event, '1')">Problem 1</button>
   <button class="tablink w3-bar-item w3-button" onclick="openCity(event, '2')">Problem 2</button>
   <button class="tablink w3-bar-item w3-button" onclick="openCity(event, '3')">Problem 3</button>
   <button class="tablink w3-bar-item w3-button" onclick="openCity(event, '4')">Problem 4</button>
  </div>
                            <div id="1" class="w3-container city">
                            <form:form class="navbar-form form-inline" action="addProblem" method="post"
                        modelAttribute="problemForm">
                        <div class="form-group">
                        <input type="hidden" name="type" value="1"/>
                        </div>
                        <div class="form-group">
                            <div>Id del contest:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id Subject">
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
                        <div id="2" class="w3-container city">
                        <form:form class="navbar-form form-inline" action="addProblem" method="post"
                        modelAttribute="problemForm">
                        <div class="form-group">
                        <input type="hidden" name="type" value="2"/>
                        </div>
                        <div class="form-group">
                            <div>Id del contest:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id Subject">
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
                        <div id="3" class="w3-container city">
                        <form:form class="navbar-form form-inline" action="addProblem" method="post"
                        modelAttribute="problemForm">
                        <div class="form-group">
                        <input type="hidden" name="type" value="3"/>
                        </div>
                        <div class="form-group">
                            <div>Id del contest:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id Subject">
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
                        <div id="4" class="w3-container city">
                        <form:form id="4" class="navbar-form form-inline" action="addProblem" method="post"
                        modelAttribute="problemForm">
                        <div class="form-group">
                        <input type="hidden" name="type" value="4"/>
                        </div>
                        <div class="form-group">
                            <div>Id del contest:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id Subject">
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
                        </div><br>
                        <div class="modal-footer">
                        <input type="submit" class="btn btn-primary button-login" value="Add Problem" />
                        </div>
                    </form:form>
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
                            <form:form class="navbar-form form-inline" action="addProblem2" method="post"
                        modelAttribute="problemForm">
                        <div class="form-group">
                            <div>Id del contest:</div>
                            <input type="text" class="form-control" name="id" placeholder="Id Contest">
                        </div><br>
                        <div class="form-group">
                            <div>Nome problema:</div>
                            <input type="text" class="form-control" name="name" placeholder="Name">
                        </div><br>
                        <div class="form-group">
                            <div>Dominio Applicativo:</div>
                            <input type="text" class="form-control" name="description" placeholder="Dominio Applicativo">
                        </div><br>
                        
                        <div class="modal-footer">
                        <input type="submit" class="btn btn-primary button-login" value="Add Problem" />
                        </div>
                    </form:form>
                        </div>
                    </div>
                </div>
</c:otherwise>
            </c:choose>
</section>


<!-- Jquery Core Js -->
<script src="resources/plugins/jquery/jquery.min.js"></script>

<!-- Bootstrap Core Js -->
<script src="resources/plugins/bootstrap/js/bootstrap.js"></script>

<!-- Waves Effect Plugin Js -->
<script src="resources/plugins/node-waves/waves.js"></script>
<!-- Custom Js -->
<script src="resources/js/admin.js"></script>
<script src="resources/js/pages/index.js"></script>


</body>

</html>