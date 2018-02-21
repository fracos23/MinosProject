package it.unical.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.MembershipDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Membership;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.utils.SessionUtils;

@Controller
public class TeamController {

	private static final Logger logger = LoggerFactory.getLogger(LogInController.class);

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/createteam", method = RequestMethod.GET)
	public String subjectMainView( HttpSession session, Model model) {

		MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
		List<Membership> memberships = membershipDAO.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		ArrayList<Team> teams = new ArrayList<Team> (memberships.size());
		for(int i=0; i<memberships.size(); i++)
		{
			teams.add(teamDAO.get(memberships.get(i).getTeam().getId()));
		}
		setAccountAttribute(session, model);
		model.addAttribute("teams", teams);
		return "teamviews";

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