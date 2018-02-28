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
import it.unical.dao.PartecipationDAO;
import it.unical.dao.ProblemDAO;
import it.unical.dao.RegistrationDAO;
import it.unical.dao.SubjectDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Membership;
import it.unical.entities.Partecipation;
import it.unical.entities.Problem;
import it.unical.entities.Registration;
import it.unical.entities.Subject;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.SearchForm;
import it.unical.forms.SubjectPasswordForm;
import it.unical.forms.SubscribeForm;
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
		ArrayList<Team> teams = new ArrayList<Team>(memberships.size());
		for(int i=0; i<memberships.size(); i++)
		{
			teams.add(memberships.get(i).getTeam());
		}	
		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		List<Problem> problems = problemDAO.getProblemOfAContest(contest.getIdcontest());
		logger.info("contesttttt "+problems.size());
		model.addAttribute("teams", teams);
		model.addAttribute("problems", problems);
		model.addAttribute("contest", contest.getIdcontest());
		return "contestviews";

	}
	
	@RequestMapping(value = "/subscribe", method = RequestMethod.POST)
	public String contestSignUp(HttpSession session,@ModelAttribute SubscribeForm subscribeForm, Model model) {
		//controlli del team (team già iscritto e membri iscritti al corso oppure è professore)
		setAccountAttribute(session, model);
		
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		Team team = teamDAO.getByName(subscribeForm.getTeam());
		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest = contestDAO.get(Integer.parseInt(subscribeForm.getContest()));
		PartecipationDAO partecipationDAO = (PartecipationDAO) context.getBean("partecipationDAO");
		Partecipation partecipation = partecipationDAO.getTeamPartecipation(team.getId(),contest.getIdcontest());
		SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
		Subject subject = subjectDAO.get(contest.getSubject().getSubjectId().getId_subject());
		if(partecipation != null)
		{
			logger.info("il team è già iscritto");
			
			model.addAttribute("name", contest.getName());
			return "redirect:/contest";
		}
		else
		{
			//controllo se i membri sono iscritti al corso e se il prof ha stabilito tale regola!
			MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
			List<Membership> members= membershipDAO.getStudentsByTeam(team.getId());
			RegistrationDAO registrationDAO = (RegistrationDAO) context.getBean("registrationDAO");
			for(int i=0; i<members.size(); i++)
			{
				if(registrationDAO.getRegistration(members.get(i).getUser().getId(), subject.getSubjectId()) ==  null)
				{
					logger.info("non tutti i membri sono iscritti al corso");
					return "redirect:/contest?name="+subject.getName();
				}
			}
			//tutti i membri sono iscritti quindi possono registrarsi
			partecipation = new Partecipation();
			partecipation.setContest(contest);
			partecipation.setTeam(team);
			partecipationDAO.create(partecipation);
			return "iscritto";
		}
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