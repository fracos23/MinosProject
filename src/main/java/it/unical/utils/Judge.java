package it.unical.utils;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class Judge
{
	
	private String l;
	private String user;
	
	public Judge(String l, String user)
	{
		this.l=l;
		this.user=user;
	}
	
	
	public String compile(String l, String username, String path) throws IOException {
        System.out.println("Code compilation started...");
        ProcessBuilder p;
        boolean compiled = true;
        if (l.equals("java")) {
            p = new ProcessBuilder("javac", "Main.java");
        } else if (l.equals("c")) {
            p = new ProcessBuilder("gcc","-std=c++0x","-w","-o", "Main", "Main.c");
        } else {
            p = new ProcessBuilder("g++","-std=c++0x","-w", "-o", "Main", "Main.cpp");
        }
        p.directory(new File(path));
        p.redirectErrorStream(true);

        try {
            Process pp = p.start();
            InputStream is = pp.getInputStream();
            String temp;
            try (BufferedReader b = new BufferedReader(new InputStreamReader(is))) {
                while ((temp = b.readLine()) != null) {
                    compiled = false;
                    System.out.println(temp);
                }
                pp.waitFor();
            }

            if (!compiled) {
                is.close();
                return "COMPILE_ERROR";
            }
            is.close();
            return "COMPILE_SUCCESS";

        } catch (InterruptedException e) {
            System.out.println("in compile() " + e);
        }

        return "COMPILE_ERROR";
    }
	
	public String execute(String l, String n, long timeInMillis, String path) throws IOException {
        System.out.println("Code started executing.");
        ProcessBuilder p;
        if (l.equals("java")) {
            p = new ProcessBuilder("java", "Main", n);
        } else if (l.equals("c")) {
            p = new ProcessBuilder("./Main");
        } else {
            p = new ProcessBuilder("./Main");
        }
        p.directory(new File(path));
       
        p.redirectErrorStream(true);
        //System.out.println("Current directory " + "/home/francesco/eclipse-workspace/testJudge/src/dir");
        
        String result=null;
		try {

            Process pp = p.start(); 
            if (!pp.waitFor(timeInMillis, TimeUnit.MILLISECONDS)) {
                return "Time Limit Excedeed";
            }
            int exitCode = pp.exitValue();
            System.out.println("Exit Value = " + pp.exitValue());
            BufferedReader reader = 
                    new BufferedReader(new InputStreamReader(pp.getInputStream()));
    StringBuilder builder = new StringBuilder();
    String line = null;
    while ( (line = reader.readLine()) != null) {
       builder.append(line);
       builder.append(System.getProperty("line.separator"));
    }
    result = builder.toString();
            if(exitCode != 0)
            {
                return "RUN_ERROR";
            }
        } catch (IOException ioe) {
            System.err.println("in execute() "+ioe);
        } catch (InterruptedException ex) {
            System.err.println(ex);
        }
        System.out.println("Code execution finished!");
        //delete executables
      //  deleteExecutables(l);
        return result;
	}
	
	public String match(String result, String pathSol) {
        BufferedReader b1 = null, b2 = null;
        File f1, f2;
        try {
            System.out.println("Matching process started.");
            f1 = new File("/home/francesco/eclipse-workspace/testJudge/src/res/ris.txt");
            System.out.println("Test output exists? [" + f1.exists() + "] Path=" + f1.getAbsolutePath());
           // f2 = new File("/home/francesco/eclipse-workspace/testJudge/src/dir" + "/" + "out("+ user +").txt");
            //System.out.println("Output exists? [" + f2.exists() + "] Path=" + f2.getAbsolutePath());
            Reader inputString = new StringReader(result);
            Reader inputStrings = new StringReader(pathSol);
            b1 = new BufferedReader(inputStrings);
            b2 = new BufferedReader(inputString);

            String s1 = "", s2 = "", temp = "";
            while ((temp = b2.readLine()) != null) {
                s2 += temp.trim() + "\n";  
                
               
            }
            System.out.println(s2);
           // System.out.println(f2.getName() + ":\n" + s2);
            while ((temp = b1.readLine()) != null) {
                s1 += temp.trim() + "\n";
            }
           // System.out.println(f1.getName() + ":\n" + s1);
            System.out.println(s1);
            System.out.println("Matching ended.");
           /* if (userCase) {
                userOutput = s2;
            }*/
            
            if (s1.equals(s2)) {
                return "RIGHT";
            } else {
                return "WRONG";
            }

        } catch (FileNotFoundException ex) {
            System.err.println("in match() "+ex);
        } catch (IOException ex) {
            System.err.println("in match() "+ex);
        } finally {
            try {
                b1.close();
                b2.close();
            } catch (IOException ex) {
                System.err.println("in match() "+ex);
            }
        }
        return "WRONG";
    }
	
	
	public static void main(String [] args) throws IOException 
	{
		/*Judge j = new Judge("java", "Francesco");
		String r = j.compile("java", "", "");
		System.out.println("result "+r);
		r = j.execute("java", "/home/francesco/eclipse-workspace/testJudge/src/main.txt", 1000000);
		System.out.println("result2 "+r);
		r = j.match("","");
		System.out.println("result 3: "+r);*/
	}
}