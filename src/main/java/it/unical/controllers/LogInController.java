package it.unical.controllers;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.context.WebApplicationContext;

import it.unical.dao.UserDAO;
import it.unical.entities.User;
import it.unical.forms.LogInForm;
import it.unical.utils.SessionUtils;


@Controller
public class LogInController {

	private static final Logger logger = LoggerFactory.getLogger(LogInController.class);

	@Autowired
	private WebApplicationContext context;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(HttpSession session, @ModelAttribute("logInForm") LogInForm form) {

		UserDAO userDAO = (UserDAO) context.getBean("userDAO");
		User user = userDAO.get(form.getEmail());

		if (user != null) {
			//PasswordHashing hashing = (PasswordHashing) context.getBean("passwordHashing");
			//String passwordHash = hashing.getHash(form.getPassword(), account.getSalt());
			String password = form.getPassword();
			//if (passwordHash.equals(account.getPassword())) {
			if(password.equals(user.getPassword())) 
			{
				if(user.isProfessor())
				{
				SessionUtils.storeUserIdInSession(session, user);	
				return "redirect:/";
				}
				else SessionUtils.storeUserIdInSession(session, user);	
			} 
			else {
				logger.info("Login failed");
				return "index2";
			}
		}

		return "redirect:/";

	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String logout(HttpSession session) {
		SessionUtils.clearSession(session);
		return "redirect:/";
	}
}