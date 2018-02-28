package it.unical.forms;

public class AddProblemForm {
	
	private String id;
	private String name;
	private String pathTest;
	private String pathSol;
	
	public AddProblemForm()
	{
		this.id="";
		this.name="";
		this.pathTest="";
		this.pathSol="";
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPathTest() {
		return pathTest;
	}

	public void setPathTest(String pathTest) {
		this.pathTest = pathTest;
	}

	public String getPathSol() {
		return pathSol;
	}

	public void setPathSol(String pathSol) {
		this.pathSol = pathSol;
	}
}