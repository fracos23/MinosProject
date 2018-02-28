package it.unical.controllers;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.sql.Blob;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.hsqldb.jdbc.JDBCBlobFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.ContestDAO;
import it.unical.dao.ProblemDAO;
import it.unical.dao.SubmitDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Problem;
import it.unical.entities.Submit;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.AddProblemForm;
import it.unical.forms.SubmitForm;
import it.unical.forms.SubscribeForm;
import it.unical.utils.SessionUtils;

@Controller
public class ProblemController {

	private static final Logger logger = LoggerFactory.getLogger(LogInController.class);

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/problem", method = RequestMethod.GET)
	public String problemMainView(@RequestParam String id, HttpSession session, Model model) {
	setAccountAttribute(session, model);
	 
	ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
	Problem problem = problemDAO.get(Integer.parseInt(id));
	
	SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
	List<Submit> submits = submitDAO.getAllSubmitByProblem(problem.getId_problem());
	
	ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
	Contest contest = contestDAO.get(problem.getId_contest().getIdcontest());
	
	model.addAttribute("problem", problem);
	model.addAttribute("submits", submits);
	model.addAttribute("contest", contest);
	
	return "problemview";
	
	}
	
	@RequestMapping(value = "/submit", method = RequestMethod.POST)
	public String submit(HttpSession session,@ModelAttribute SubmitForm submitForm, Model model) throws FileNotFoundException {
		setAccountAttribute(session, model);
		
		SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
		Submit submit = new Submit();
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		Team team = teamDAO.getByName(submitForm.getTeam());
		InputStream inputStream = new FileInputStream(new File(submitForm.getPath()));
		submit.setIdTeam(team);
		submit.setSolution(submitForm.getPath());
		submitDAO.create(submit);
		
		
		return "/";
	}
	
	@RequestMapping(value = "/addProblem", method = RequestMethod.POST)
	public String addProblem(HttpSession session,@ModelAttribute AddProblemForm problemForm, Model model) throws FileNotFoundException {
		setAccountAttribute(session, model);
		
		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		Problem problem= new Problem();
		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest = contestDAO.get(Integer.parseInt(problemForm.getId()));
		
		String pathTest = problemForm.getPathTest();
		String pathSol = problemForm.getPathSol();
		
		File file1 = new File(pathTest);
		byte[] fileData1 = new byte[(int) file1.length()];
		File file2 = new File(pathSol);
		byte[] fileData2 = new byte[(int) file2.length()];
		 
		try {
		    FileInputStream fileInputStream1 = new FileInputStream(file1);
		    fileInputStream1.read(fileData1);
		    fileInputStream1.close();
		    FileInputStream fileInputStream2 = new FileInputStream(file2);
		    fileInputStream2.read(fileData2);
		    fileInputStream2.close();
		} catch (Exception e) {
		    e.printStackTrace();
		}
		 
		
		problem.setName(problemForm.getName());
		problem.setRankable("");
		problem.setId_contest(contest);
		problem.setTimelimit((float) 1000.0);
		problem.setSol(fileData2);
		problem.setTest(fileData1);
		problemDAO.create(problem);		
		
		
		
		
		return "redirect:/";
	}
	
	private void setAccountAttribute(HttpSession session, Model model) {
		 if (SessionUtils.isUser(session)) {
			UserDAO userDAO = (UserDAO) context.getBean("userDAO");
			User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));
			model.addAttribute("user", user);
			model.addAttribute("typeSession", "Account");
			model.addAttribute("userLogged", true);
		} else {
			model.addAttribute("typeSession", "Login");
		}
	}
}