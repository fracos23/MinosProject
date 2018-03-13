package it.unical.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import it.unical.dao.JuryDAO;
import it.unical.dao.JuryMemberDAO;
import it.unical.dao.JuryMemberDAOImpl;
import it.unical.dao.MembershipDAO;
import it.unical.dao.PartecipationDAO;
import it.unical.dao.ProblemDAO;
import it.unical.dao.RegistrationDAO;
import it.unical.dao.SubjectDAO;
import it.unical.dao.SubmitDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Jury;
import it.unical.entities.JuryMember;
import it.unical.entities.Membership;
import it.unical.entities.Partecipation;
import it.unical.entities.Problem;
import it.unical.entities.Registration;
import it.unical.entities.Subject;
import it.unical.entities.SubjectId;
import it.unical.entities.Submit;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.AddContestForm;
import it.unical.forms.AddSubjectForm;
import it.unical.forms.AddTeamForm;
import it.unical.forms.SearchForm;
import it.unical.forms.SignInForm;
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

	@RequestMapping(value = "/signin", method = RequestMethod.POST)
	public String signIn(@ModelAttribute SignInForm form, HttpSession session, Model model) {
		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = new User(Integer.parseInt(form.getId()), form.getName(), form.getSurname(), form.getPassword(),
				form.getEmail(), false);
		userDAO.create(user);
		return "redirect:/";
	}

	private void populateUserModel(HttpSession session, Model model) {
		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));

		// carica attributi utente se è studente
		if (!user.isProfessor()) {
			MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
			List<Membership> memberships = membershipDAO
					.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
			TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
			ArrayList<Team> teams = new ArrayList<Team>(memberships.size());
			for (int i = 0; i < memberships.size(); i++) {
				teams.add(teamDAO.get(memberships.get(i).getTeam().getId()));
			}

			RegistrationDAO registrationDAO = (RegistrationDAO) context.getBean("registrationDAO");
			List<Registration> registrations = registrationDAO
					.getRegistrationByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
			ArrayList<String> subjects = new ArrayList<String>(10); // da modificare il valore
			for (int i = 0; i < registrations.size(); i++) {
				subjects.add(registrations.get(i).getSubject().getName());
			}

			SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
			ArrayList<Submit> submits = new ArrayList<Submit>();
			for (int i = 0; i < teams.size(); i++) {
				for (int j = 0; j < submitDAO.getAllSubmitByTeam((teams.get(i).getId())).size(); j++)
					submits.add(submitDAO.getAllSubmitByTeam((teams.get(i).getId())).get(j));// sono più submit
			}

			PartecipationDAO partecipationDAO = (PartecipationDAO) context.getBean("partecipationDAO");
			ArrayList<Partecipation> contests = new ArrayList<Partecipation>();
			for (int i = 0; i < teams.size(); i++) {
				for (int j = 0; j < partecipationDAO.getContestByTeam(teams.get(i).getId()).size(); j++)
					contests.add(partecipationDAO.getContestByTeam(teams.get(i).getId()).get(j));// sono più submit
			}

			model.addAttribute(MODEL_ATTRIBUTE_USER, user);
			// Storico personale
			model.addAttribute("teams", teams);
			model.addAttribute("subjects", subjects);
			model.addAttribute("submits", submits);
			model.addAttribute("contests", contests);
		}
		// carica attributi utente se è professore
		else {
			SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
			List<Subject> subjects = subjectDAO.getAllSubjectFromProfessor(user.getId());

			ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
			ArrayList<Contest> contests = new ArrayList<Contest>();
			for (int i = 0; i < subjects.size(); i++) {
				int size = contestDAO.getContestBySubject(subjects.get(i).getSubjectId().getId_subject(),
						Integer.parseInt(subjects.get(i).getSubjectId().getYear())).size();
				for (int j = 0; j < size; j++) {
					contests.add(contestDAO.getContestBySubject(subjects.get(i).getSubjectId().getId_subject(),
							Integer.parseInt(subjects.get(i).getSubjectId().getYear())).get(j));
				}
			}

			JuryMemberDAO juryMemberDAO = (JuryMemberDAO) context.getBean("jurymemberDAO");
			List<JuryMember> juries = juryMemberDAO.getJurysFromProfessor(user.getId());
			ArrayList<Contest> contestJury = new ArrayList<Contest>(juries.size());
			logger.info("contest con giuria   " + juries.size());
			for (int i = 0; i < juries.size(); i++) {
				for (int j = 0; j < contestDAO.getContestByJury(juries.get(i).getJury().getId_jury()).size(); j++) {
					contestJury.add(contestDAO.getContestByJury(juries.get(i).getJury().getId_jury()).get(j));

				}
			}
			// contestJury.add(contestDAO.getContestByJury(juries.get(i).getJury().getId_jury()));

			model.addAttribute(MODEL_ATTRIBUTE_USER, user);
			model.addAttribute("subjects", subjects);
			model.addAttribute("contests", contests);
			model.addAttribute("contestjuries", contestJury);
		}

	}

	// research back-end
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
		List<Team> result4 = new ArrayList<Team>();
		MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
		List<Membership> memberships = membershipDAO.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
		try {
			for (int i = 0; i < users.size(); i++) {
				if (users.get(i).getId().toString().contains(form.getWord()))
					result.add(users.get(i));
			}
			for (int j = 0; j < subjects.size(); j++) {
				if ((subjects.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase()))
						|| (subjects.get(j).getSubjectId().getId_subject() == Integer.parseInt(form.getWord())))
					result2.add(subjects.get(j));
			}

			for (int j = 0; j < contests.size(); j++) {
				if ((contests.get(j).getName().toLowerCase().contains(form.getWord().toLowerCase()))
						|| (contests.get(j).getIdcontest() == (Integer.parseInt(form.getWord()))))
					result3.add(contests.get(j));
			}
			for (Membership membership : memberships) {
				result4.add(membership.getTeam());

			}
		} catch (Exception e) {
			// TODO handle it
		}
		setAccountAttribute(session, model);
		model.addAttribute("UserResult", result);
		model.addAttribute("SubjectResult", result2);
		model.addAttribute("ContestResult", result3);
		model.addAttribute("TeamResult", result4);

		return "searchResults";
	}

	@RequestMapping(value = "/addSubject", method = RequestMethod.POST)
	public String addSubject(@ModelAttribute("addSubjectForm") AddSubjectForm form, HttpSession session, Model model) {
		setAccountAttribute(session, model);

		// controllo se il corso esiste già
		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));
		if (form.getName() != "") {
			SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
			Subject subject = new Subject();
			SubjectId subjectId = new SubjectId();
			subjectId.setId_subject(Integer.parseInt(form.getId()));
			subjectId.setYear(form.getYear());
			subject.setSubjectId(subjectId);
			subject.setName(form.getName());
			subject.setPassword(form.getPassword());
			subject.setId_professor(user);
			subjectDAO.create(subject);

			return "redirect:/";
		} else
			return "redirect:/";
	}

	@RequestMapping(value = "/addContest", method = RequestMethod.POST)
	public String addContest(@ModelAttribute AddContestForm addContestForm, @RequestParam String restriction,
			HttpSession session, Model model) {
		setAccountAttribute(session, model);

		// controllo se il corso esiste già
		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = userDAO.get(SessionUtils.getUserIdFromSessionOrNull(session));

		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest = new Contest();
		SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
		Subject subject = subjectDAO.get(Integer.parseInt(addContestForm.getSubjectId()));
		JuryDAO juryDAO = (JuryDAO) context.getBean("juryDAO");
		Jury jury = juryDAO.get(Integer.parseInt(addContestForm.getJury()));

		contest.setName(addContestForm.getName());
		contest.setRestriction(Integer.parseInt(restriction));
		contest.setSubject(subject);
		contest.setJury(jury);
		contest.setDeadline(
				"" + addContestForm.getYear() + "/" + addContestForm.getMonth() + "/" + addContestForm.getDay());
		contestDAO.create(contest);
		return "redirect:/";

	}

	@RequestMapping(value = "/searchProblem", method = RequestMethod.POST)
	public String searchProblem(@ModelAttribute SearchForm form, HttpSession session, Model model) {

		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest;
		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		List<Problem> problems = problemDAO.getByName(form.getWord());
		SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
		List<Submit> submit;
		Map<String, List<Submit>> submits = new HashMap<String, List<Submit>>();

		for (int i = 0; i < problems.size(); i++) {
			submit = submitDAO.getAllSubmitByProblem(problems.get(i).getId_problem());
			contest = contestDAO.get(problems.get(i).getId_contest().getIdcontest());
			submits.put(contest.getName(), submit);

		}

		setAccountAttribute(session, model);
		model.addAttribute("submits", submits);
		model.addAttribute("word", form.getWord());

		return "submitResults";
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