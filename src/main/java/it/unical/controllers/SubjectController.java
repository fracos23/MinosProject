package it.unical.controllers;

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

import it.unical.dao.SubjectDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Subject;
import it.unical.entities.User;
import it.unical.forms.SubjectPasswordForm;
import it.unical.utils.SessionUtils;


@Controller
public class SubjectController {

	private static final Logger logger = LoggerFactory.getLogger(LogInController.class);

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/subject", method = RequestMethod.GET)
	public String subjectMainView(@RequestParam String name, HttpSession session, Model model) {

		setAccountAttribute(session, model);
		model.addAttribute("name", name);
		return "subjectview";

	}
	
	@RequestMapping(value = "/signUpSubject", method = RequestMethod.POST)
	public String login(HttpSession session,@RequestParam String name, @ModelAttribute("subjectPasswordForm") SubjectPasswordForm form,  Model model) {

		SubjectDAO subjectDAO = (SubjectDAO) context.getBean("subjectDAO");
		Subject subject = subjectDAO.get(name);
		setAccountAttribute(session, model);
		if(subject.getPassword().equals(form.getpassword()))
		{
			
			return "iscritto";
		}
			
		return "index";

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
