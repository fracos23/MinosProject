package it.unical.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "submit")
public class Submit
{
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
 	@Column(name = "id")
	private Integer id;
	
	//relation
	@Column(name = "team_idteam")
	private Integer idTeam;
	
	//relation
	@Column(name = "problem_idproblem")
	private Integer idProblem;
	
	@Column(name = "score")
	private String score;
	
	@Column(name = "info")
	private String info;
	
	@Column(name = "solution")
	private String solution;
	
	public Submit()
	{
		this.id = DatabaseHandler.NO_ID;
		this.idTeam = DatabaseHandler.NO_ID;
		this.idProblem = DatabaseHandler.NO_ID;
		this.score = null;
		this.info = null;
		this.solution = null;
	}

	public Submit(Integer id, Integer idTeam, Integer idProblem, String score, String info, String solution) {
		this.id = id;
		this.idTeam = idTeam;
		this.idProblem = idProblem;
		this.score = score;
		this.info = info;
		this.solution = solution;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getIdTeam() {
		return idTeam;
	}

	public void setIdTeam(Integer idTeam) {
		this.idTeam = idTeam;
	}

	public Integer getIdProblem() {
		return idProblem;
	}

	public void setIdProblem(Integer idProblem) {
		this.idProblem = idProblem;
	}

	public String getScore() {
		return score;
	}

	public void setScore(String score) {
		this.score = score;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getSolution() {
		return solution;
	}

	public void setSolution(String solution) {
		this.solution = solution;
	}
	
	
}