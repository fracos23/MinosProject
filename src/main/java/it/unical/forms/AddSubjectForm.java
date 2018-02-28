package it.unical.forms;

public class AddSubjectForm {
	
	private String id;
	private String year;
	private String name;
	private String password;
	private String user_professor;
	
	public AddSubjectForm()
	{
		this.id="";
		this.name="";
		this.year="";
		this.password="";
		this.user_professor="";
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUser_professor() {
		return user_professor;
	}

	public void setUser_professor(String user_professor) {
		this.user_professor = user_professor;
	}
	
}