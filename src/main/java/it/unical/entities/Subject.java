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
	@JoinColumn(name = "id_professor")
	private User id_professor;
	
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private List<Contest> contest;
	
	public Subject()
	{
		this.subjectId = null;
		this.name = null;
		this.id_professor = null;
		
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
		return id_professor;
	}

	public void setId_professor(User id_professor) {
		this.id_professor = id_professor;
	}
	
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}