package it.unical.controllers;


import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.ContestDAO;
import it.unical.dao.MembershipDAO;
import it.unical.dao.PartecipationDAO;
import it.unical.dao.RegistrationDAO;
import it.unical.dao.SubjectDAO;
import it.unical.dao.SubmitDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Membership;
import it.unical.entities.Partecipation;
import it.unical.entities.Registration;
import it.unical.entities.Subject;
import it.unical.entities.Submit;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.SearchForm;
import it.unical.utils.SessionUtils;


@Controller
public class HomeController {

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	private static final String MODEL_ATTRIBUTE_USER = "user";

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Model model, HttpSession session) {
		logger.info("Home page requested.");

		if (SessionUtils.isUser(session)) {
			populateUserModel(session, model);
			return "homeUser";
		} 

		return "login";
	}

	private void populateUserModel(HttpSession session, Model model) {
		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));
		
		MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
		List<Membership> memberships = membershipDAO.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		ArrayList<Team> teams = new ArrayList<Team> (memberships.size());
		for(int i=0; i<memberships.size(); i++)
		{
			teams.add(teamDAO.get(memberships.get(i).getTeam().getId()));
		}
		
		
		RegistrationDAO registrationDAO = (RegistrationDAO) context.getBean("registrationDAO");
		List<Registration> registrations = registrationDAO.getRegistrationByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		ArrayList<String> subjects= new ArrayList<String>(10); //da modificare il valore
		for(int i=0; i<registrations.size(); i++)
		{
			subjects.add(registrations.get(i).getSubject().getName());
		}
		
		SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
		ArrayList<Submit> submits = new ArrayList<Submit>(10); //da modificare il valore
		for(int i=0; i<teams.size(); i++)
		{
			for(int j=0; j<submitDAO.getAllSubmitByTeam((teams.get(i).getId())).size(); j++)
				submits.add(submitDAO.getAllSubmitByTeam((teams.get(i).getId())).get(j));//sono più submit
		}
		
		PartecipationDAO partecipationDAO = (PartecipationDAO) context.getBean("partecipationDAO");
		ArrayList<Partecipation> contests = new ArrayList<Partecipation>(10); //da modificare il valore
		for(int i=0; i<teams.size(); i++)
		{
			for(int j=0; j<partecipationDAO.getContestByTeam(teams.get(i).getId()).size(); j++)
				contests.add(partecipationDAO.getContestByTeam(teams.get(i).getId()).get(j));//sono più submit
		}
		
		model.addAttribute(MODEL_ATTRIBUTE_USER, user);
		//Storico personale
		model.addAttribute("teams", teams);
		model.addAttribute("subjects", subjects);
		model.addAttribute("submits", submits);
		model.addAttribute("contests", contests);
		
	}
	
	//research back-end
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public String search(@ModelAttribute SearchForm form, HttpSession session, Model model) {

		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		List<User> users = userDAO.getAll();
		SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
		List<Subject> subjects = subjectDAO.getAll();
		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		List<Contest> contests = contestDAO.getAll();
		List<User> result = new ArrayList<User>();
		List<Subject> result2 = new ArrayList<Subject>();
		List<Contest> result3 = new ArrayList<Contest>();
		try
		{
		for (int i = 0; i < users.size(); i++) {
			if (users.get(i).getId().toString().contains(form.getWord()))
				result.add(users.get(i));
		}
		for (int j = 0; j < subjects.size(); j++) {
			if ((subjects.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase())) || (subjects.get(j).getSubjectId().getId_subject() == Integer.parseInt(form.getWord())))
				result2.add(subjects.get(j));
		}
		
		for (int j = 0; j < contests.size(); j++) {
			if ((contests.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase())) || (contests.get(j).getIdcontest() == (Integer.parseInt(form.getWord()))))
				result3.add(contests.get(j));
		}
		} catch(Exception e)
		{
			for (int i = 0; i < users.size(); i++) {
				if (users.get(i).getId().toString().contains(form.getWord()))
					result.add(users.get(i));
			}
			for (int j = 0; j < subjects.size(); j++) {
				if ((subjects.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase())))
					result2.add(subjects.get(j));
			}
			
			for (int j = 0; j < contests.size(); j++) {
				if ((contests.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase())))
					result3.add(contests.get(j));
		}
		}
		setAccountAttribute(session, model);
		model.addAttribute("UserResult", result);
		model.addAttribute("SubjectResult", result2);
		model.addAttribute("ContestResult", result3);

		return "resultpage";
	}

	private void setAccountAttribute(HttpSession session, Model model) {
		if (SessionUtils.isUser(session)) {
			UserDAO userDAO = (UserDAO) context.getBean("userDAO");
			User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));
			model.addAttribute("user", user);
			model.addAttribute("typeSession", "Account");
		} else {
			model.addAttribute("typeSession", "Login");
		}
	}
	
}