package it.unical.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "subject")
public class Subject
{
	@EmbeddedId
	private SubjectId subjectId;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "password")
	private String password;

	@ManyToOne
	@JoinColumn(name = "user_professor")
	private User professor;
	
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private List<Contest> contest;
	
	public Subject()
	{
		this.subjectId = null;
		this.name = null;
		this.professor = null;
		
	}

	public SubjectId getSubjectId() {
		return subjectId;
	}

	public void setSubjectId(SubjectId subjectId) {
		this.subjectId = subjectId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getId_professor() {
		return professor;
	}

	public void setId_professor(User professor) {
		this.professor = professor;
	}
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}