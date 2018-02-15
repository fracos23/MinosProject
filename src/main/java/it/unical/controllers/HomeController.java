package it.unical.controllers;


import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.MembershipDAO;
import it.unical.dao.RegistrationDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Membership;
import it.unical.entities.Registration;
import it.unical.entities.User;
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
		List<String> teams = null;
		for(int i=0; i<memberships.size(); i++)
		{
			teams.add(memberships.get(i).getTeam().getName());
		}
		
		
		RegistrationDAO registrationDAO = (RegistrationDAO) context.getBean("regisrationDAO");
		List<Registration> registrations = registrationDAO.getRegistrationByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		List<String> subjects= null;
		for(int i=0; i<registrations.size(); i++)
		{
			subjects.add(registrations.get(i).getSubject().getName());
		}
		
		model.addAttribute(MODEL_ATTRIBUTE_USER, user);
		model.addAttribute("teams", teams);
		model.addAttribute("subjects", subjects);
		
		
	}

	
}