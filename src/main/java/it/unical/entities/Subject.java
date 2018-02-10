package it.unical.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "subject")
public class Subject
{
	@EmbeddedId
	private SubjectId subjectId;
	
	@Column(name = "name")
	private String name;
	
	// associazione con professor
	@Column(name = "id_professor")
	private Integer id_professor;
	
	@OneToMany(mappedBy = "subject", fetch = FetchType.LAZY)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private List<Contest> contest;
	
	public Subject()
	{
		this.subjectId = null;
		this.name = null;
		this.id_professor = DatabaseHandler.NO_ID;
		
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

	public Integer getId_professor() {
		return id_professor;
	}

	public void setId_professor(Integer id_professor) {
		this.id_professor = id_professor;
	}
	
	
}