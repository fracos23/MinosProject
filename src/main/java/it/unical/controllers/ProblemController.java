package it.unical.controllers;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

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
import it.unical.dao.MembershipDAO;
import it.unical.dao.ProblemDAO;
import it.unical.dao.SubmitDAO;
import it.unical.dao.TeamDAO;
import it.unical.dao.UserDAO;
import it.unical.entities.Contest;
import it.unical.entities.Membership;
import it.unical.entities.Problem;
import it.unical.entities.Submit;
import it.unical.entities.Team;
import it.unical.entities.User;
import it.unical.forms.AddProblemForm;
import it.unical.forms.SubmitForm;
import it.unical.forms.SubscribeForm;
import it.unical.utils.Judge;
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
	
	MembershipDAO membershipDAO = (MembershipDAO) context.getBean("membershipDAO");
	List<Membership> memberships = membershipDAO.getTeamByStudent(SessionUtils.getUserIdFromSessionOrNull(session));
	
	
	model.addAttribute("memberships", memberships);
	model.addAttribute("problem", problem);
	model.addAttribute("submits", submits);
	model.addAttribute("contest", contest);
	
	return "problemview";
	
	}
	
	@RequestMapping(value = "/submit", method = RequestMethod.POST)
	public String submit(@RequestParam String problemId, HttpSession session, @RequestParam("team")String team1, @RequestParam String path, Model model) throws IOException {
		setAccountAttribute(session, model);
				
		SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
		
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		Team team = teamDAO.getByName(team1);

		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		Problem problem = problemDAO.get(Integer.parseInt(problemId));

		Submit submit = submitDAO.getAllSubmitByProblemAndTeam(Integer.parseInt(problemId), team.getId());
		switch(Integer.parseInt(problem.getType()))
		{
		case(1):{
						String pathSol = path;
						byte[] data = problem.getTest();
						byte[] data2 = problem.getSol();
						
						pathSol = pathSol.replace("file:///", "/");
						
						File fileSolution = new File(pathSol);
						byte[] fileData = new byte[(int) fileSolution.length()];
						
						pathSol = pathSol.replace("/Main.java", "");
						
						Judge judge = new Judge("java", team.getName());
						
						String result = judge.compile("java", team.getName(), pathSol);
						
						String strTestCase = new String(data, StandardCharsets.UTF_8);
						String strSolution = new String(data2, StandardCharsets.UTF_8);		
						
						if(result.equals("COMPILE_SUCCESS"))
						{
							result = judge.execute("java", strTestCase, 1000, pathSol);
				
							String match = judge.match(result, strSolution);
							if(match.equals("RIGHT"))
								{
								logger.info("corretto");
								if(submit != null)
								{
									submitDAO.delete(submit);
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";
								}
								else
								{
									submit = new Submit();
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";				}
								}
							else 
								{
								logger.info("errato");
								return "redirect:/";
								}
						}
						else return "redirect:/";
			}
		
		case(2):{
					String pathSol = path;
					byte[] data = problem.getTest();
					
					pathSol = pathSol.replace("file:///", "/");
					
					File fileSolution = new File(pathSol);
					byte[] fileData = new byte[(int) fileSolution.length()];
					
					pathSol = pathSol.replace("/Main.java", "");
					
					ArrayList<String> info = executeZip(team, data, pathSol);
					model.addAttribute("problem", problem);
					model.addAttribute("infos", info);
					model.addAttribute("team", team);
					model.addAttribute("path", path);
					
					return "addProblemConfirmation";
		}
		
		
		case(3):{
						String pathSol = path;
						byte[] data2 = problem.getSol();
						
						pathSol = pathSol.replace("file:///", "/");
						
						File fileSolution = new File(pathSol);
						byte[] fileData = new byte[(int) fileSolution.length()];
						
						pathSol = pathSol.replace("/Main.java", "");
						
						Judge judge = new Judge("java", team.getName());
						
						String result = judge.compile("java", team.getName(), pathSol);
						
						String strSolution = new String(data2, StandardCharsets.UTF_8);		
						
						if(result.equals("COMPILE_SUCCESS"))
						{
							result = judge.execute("java", "", 1000, pathSol);
				
							String match = judge.match(result, strSolution);
							if(match.equals("RIGHT"))
								{
								logger.info("corretto");
								if(submit != null)
								{
									submitDAO.delete(submit);
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";
								}
								else
								{
									submit = new Submit();
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";				}
								}
							else 
								{
								logger.info("errato");
								return "redirect:/";
								}
						}
						else return "redirect:/";
			}
		
		case(4):{
						String pathSol = path;
						byte[] data = problem.getTest();
						byte[] data2 = problem.getSol();
						
						pathSol = pathSol.replace("file:///", "/");
						
						File fileSolution = new File(pathSol);
						byte[] fileData = new byte[(int) fileSolution.length()];
						
						pathSol = pathSol.replace("/Main.java", "");
						
						Judge judge = new Judge("java", team.getName());
						
						String result = judge.compile("java", team.getName(), pathSol);
						
						String strTestCase = new String(data, StandardCharsets.UTF_8);
						System.out.println("Gli passo questo test case: "+strTestCase);
						String strSolution = new String(data2, StandardCharsets.UTF_8);		
						
						if(result.equals("COMPILE_SUCCESS"))
						{
							result = judge.execute("java", strTestCase, 1000, pathSol);
				
							String match = judge.match(result, strSolution);
							if(match.equals("RIGHT"))
								{
								logger.info("corretto");
								if(submit != null)
								{
									submitDAO.delete(submit);
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";
								}
								else
								{
									submit = new Submit();
									submit.setIdTeam(team);
									submit.setProblem(problem);
									submit.setInfo(problem.getName());
									//set the score eventually here
									submit.setSolution(fileData);
									submitDAO.create(submit);
									return "problemview";				}
								}
							else 
								{
								logger.info("errato");
								return "redirect:/";
								}
						}
						else return "redirect:/";
		}
		
	}
		return "redirect:/";
	
	}
	
	
	@RequestMapping(value = "/confirm", method = RequestMethod.POST)
	public String confirm(@RequestParam String teamname, @RequestParam String problemid, @RequestParam String path, HttpSession session, Model model){
		setAccountAttribute(session, model);
				
		SubmitDAO submitDAO = (SubmitDAO) context.getBean("submitDAO");
		
		TeamDAO teamDAO = (TeamDAO) context.getBean("teamDAO");
		Team team = teamDAO.getByName(teamname);
		
		Submit submit = submitDAO.getAllSubmitByProblemAndTeam(Integer.parseInt(problemid), team.getId());
		
		File fileSolution = new File(path);
		byte[] fileData = new byte[(int) fileSolution.length()];

		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		Problem problem = problemDAO.get(Integer.parseInt(problemid));
		
		if(submit != null)
		{
			submitDAO.delete(submit);
			
		}
			submit = new Submit();
			submit.setIdTeam(team);
			submit.setProblem(problem);
			submit.setInfo(problem.getName());
			//set the score eventually here
			submit.setSolution(fileData);
		
		submitDAO.create(submit);
		return "redirect:/";
		
		
	}

	@RequestMapping(value = "/addProblem", method = RequestMethod.POST)
	public String addProblem(HttpSession session,@ModelAttribute AddProblemForm problemForm, Model model) throws IOException {
		setAccountAttribute(session, model);
		
		ProblemDAO problemDAO = (ProblemDAO) context.getBean("problemDAO");
		Problem problem= new Problem();
		ContestDAO contestDAO = (ContestDAO) context.getBean("contestDAO");
		Contest contest = contestDAO.get(Integer.parseInt(problemForm.getId()));
		
		switch(Integer.parseInt(problemForm.getType()))
		{
		case(1):{
				String pathTest = problemForm.getPathTest();
				String pathSol = problemForm.getPathSol();
				
				pathTest = pathTest.replace("file:///", "/");
				pathSol = pathSol.replace("file:///", "/");
				
				File file1 = new File(pathTest.trim());
				byte[] fileData1 = new byte[(int) file1.length()];
				File file2 = new File(pathSol);
				byte[] fileData2 = new byte[(int) file2.length()];
				logger.info(pathTest);
				try {
				    FileInputStream fileInputStream1 = new FileInputStream(file1);
				    fileInputStream1.read(fileData1);
				    fileInputStream1.close();
				} catch (Exception e) {
				    e.printStackTrace();
				    return "redirect:/";
				}
				
				try {
				    FileInputStream fileInputStream2 = new FileInputStream(file2);
				    fileInputStream2.read(fileData2);
				    fileInputStream2.close();
				} catch (Exception e) {
					fileData2=null;
				    e.printStackTrace();
				    
				}
				 
				problem.setName(problemForm.getName());
				problem.setType(problemForm.getType());
				problem.setId_contest(contest);
				problem.setJury(contest.getJury());
				problem.setTimelimit((float) 1000.0);
				problem.setSol(fileData2);
				problem.setTest(fileData1);
				problemDAO.create(problem);		
				
				return "redirect:/";
			}
		case(2):{
			String pathTest = problemForm.getPathZip();
			
			pathTest = pathTest.replace("file:///", "/");
			
			File file1 = new File(pathTest.trim());
			byte[] fileData1 = new byte[(int) file1.length()];
			try {
			    FileInputStream fileInputStream1 = new FileInputStream(file1);
			    fileInputStream1.read(fileData1);
			    fileInputStream1.close();
			} catch (Exception e) {
			    e.printStackTrace();
			    return "redirect:/";
			}
			 
			problem.setName(problemForm.getName());
			problem.setType(problemForm.getType());
			problem.setId_contest(contest);
			problem.setJury(contest.getJury());
			problem.setTimelimit((float) 1000.0);
			problem.setTest(fileData1);
			problemDAO.create(problem);		
			
			return "redirect:/";
			}
		case(3):{
					String pathTest = problemForm.getPathAlgorithm();
					
					pathTest = pathTest.replace("file:///", "/");
					File file1 = new File(pathTest.trim());
					byte[] fileData1 = new byte[(int) file1.length()];
					
					try {
					    FileInputStream fileInputStream1 = new FileInputStream(file1);
					    fileInputStream1.read(fileData1);
					    fileInputStream1.close();
					} catch (Exception e) {
					    e.printStackTrace();
					    return "redirect:/";
					}
					
					pathTest = pathTest.replace("/Main.java", "");
					
					Judge judge = new Judge("java", "");
					
					String result = judge.compile("java", "", pathTest);
					
					result = judge.execute("java", "", 1000, pathTest);
					
					byte[] solution = result.getBytes();
					
					problem.setName(problemForm.getName());
					problem.setType(problemForm.getType());
					problem.setId_contest(contest);
					problem.setJury(contest.getJury());
					problem.setTimelimit((float) 1000.0);
					problem.setSol(solution);
					problemDAO.create(problem);	
					
					return "redirect:/";		
		}
		
		case(4):{
					
					String pathTest = problemForm.getPathAlgorithm();
					
					pathTest = pathTest.replace("file:///", "/");
					File file1 = new File(pathTest.trim());
					byte[] fileData1 = new byte[(int) file1.length()];
					
					try {
					    FileInputStream fileInputStream1 = new FileInputStream(file1);
					    fileInputStream1.read(fileData1);
					    fileInputStream1.close();
					} catch (Exception e) {
					    e.printStackTrace();
					    return "redirect:/";
					}
					
					pathTest = pathTest.replace("/Main.java", "");
					
					Judge judge = new Judge("java", "");
					String domain = problemForm.getDomain();

					String test = null;
					
					if(domain.equals("Array Integer"))
					{
						test = generateArray();
					}
					
				//	String strTestCase = new String(test, StandardCharsets.UTF_8);
					
					String result = judge.compile("java", "", pathTest);
					
					
					
					result = judge.execute("java", test, 1000, pathTest);
					logger.info(result);
					if(result.equals("RUN_ERROR"))
						return "redirect:/";
					byte[] solution = result.getBytes();
					
					System.out.println(result);
					
					problem.setName(problemForm.getName());
					problem.setType(problemForm.getType());
					problem.setId_contest(contest);
					problem.setJury(contest.getJury());
					problem.setTimelimit((float) 1000.0);
					problem.setTest(test.getBytes());
					problem.setSol(solution);
					problemDAO.create(problem);	
		}
		}
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
	
	private ArrayList<String> executeZip(Team team, byte[] data, String pathSol)
	{

		Judge judge = new Judge("java", team.getName());
		/////////SCOMPATTO L'ARCHIVIO CHE SI TROVA IN DATA//////
		InputStream fis = null;
    	ZipInputStream zipIs = null;
        ZipEntry zEntry = null;
        boolean found = false;
        ArrayList<String> info = new ArrayList<String> ();
        try {
            fis = new ByteArrayInputStream(data);
            zipIs = new ZipInputStream(new BufferedInputStream(fis));
            int cont = 0;
            int contWrong = 0;
            
            while((zEntry = zipIs.getNextEntry()) != null){
            	cont++;
                System.out.println(zEntry.getName());
                byte[] test = new byte[(int) zEntry.getSize()];
                zipIs.read ( test, 0, test.length);
                String strTestCase = new String(test, StandardCharsets.UTF_8);
                zEntry = zipIs.getNextEntry();
                System.out.println(zEntry.getName());
                byte[] sol = new byte[(int) zEntry.getSize()];
                zipIs.read (sol);
                String strSol = new String(sol, StandardCharsets.UTF_8);
                String result = judge.compile("java", team.getName(), pathSol);
                
           
                /////////////////Judge every file in zip///////////////
                if(result.equals("COMPILE_SUCCESS"))
        		{
                //	info.add("Compilation result: "+result);
        			result = judge.execute("java", strTestCase, 1000, pathSol);
        			
        			if(result.contains("RUN_ERROR") || result.equals("TLE"))
        				info.add("execution result: "+result);
        			////controllare l'esecuzione/////
        			String match = judge.match(result, strSol);
        			if(!match.equals("RIGHT"))
        				{
        				contWrong++;
        				found = true;
        				info.add("Mismatch with: "+zEntry.getName());
        				}
        		}
                
            }
            zipIs.close();
            if(!found)
			{
			logger.info("corretto");
			info.add("No mismatch found");
			info.add("All tests passed!!");
		
				return info;
			}
		else 
			{
			logger.info("errato");
			info.add("Test Failed: "+contWrong+"/"+cont);
				return info;
			}
			
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return info;
	}
	
	
	private String generateArray()
	{
		int cont = 0;
		String ris=""; 
		while(cont<50)
		{
	    Random random = new Random();

	    int n = random.nextInt(20);
	    for (int i = 0; i < n; i++)
	    {
	        ris = ris+random.nextInt(70)+" ";
	    }
	    	ris = ris+"\n";
	    	cont++;
		}
		System.out.println(ris);
		return ris;
	}
	
	
}