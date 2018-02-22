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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.ContestDAO;
import it.unical.dao.MembershipDAO;
import it.unical.dao.ProblemDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Membership;
import it.unical.entities.Problem;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.SubjectPasswordForm;
import it.unical.utils.SessionUtils;

@Controller
public class ContestController {

	private static final Logger logger = LoggerFactory.getLogger(LogInController.class);

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/contest", method = RequestMethod.GET)
	public String contestMainView(@RequestParam String name, HttpSession session, Model model) {

		setAccountAttribute(session, model);
		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest = contestDAO.getContestByName(name);
		MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
		List<Membership> memberships = membershipDAO.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		ArrayList<Team> teams = new ArrayList<Team>(memberships.size());
		for(int i=0; i<memberships.size(); i++)
			teams.add(teamDAO.get(memberships.get(i).getId()));
		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		List<Problem> problems = problemDAO.getProblemOfAContest(contest.getIdcontest());
		
		model.addAttribute("teams", teams);
		model.addAttribute("problems", problems);
		return "contestviews";

	}
	
	@RequestMapping(value = "/subscribe", method = RequestMethod.POST)
	public String subjectSignUp(HttpSession session,@RequestParam String name,  Model model) {
		
		
		
		return null;	
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