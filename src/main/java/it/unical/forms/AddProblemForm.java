package it.unical.forms;

public class AddProblemForm {
	
	private String id;
	private String name;
	private String type;
	private String pathTest;
	private String pathSol;
	private String description;
	private String pathZip;
	private String pathAlgorithm;
	private String domain;
	
	
	public String getPathZip() {
		return pathZip;
	}

	public void setPathZip(String pathZip) {
		this.pathZip = pathZip;
	}

	public String getPathAlgorithm() {
		return pathAlgorithm;
	}

	public void setPathAlgorithm(String pathAlgorithm) {
		this.pathAlgorithm = pathAlgorithm;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	public AddProblemForm()
	{
		this.id="";
		this.name="";
		this.pathTest="";
		this.pathSol="";
		this.type="";
		this.description="";
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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