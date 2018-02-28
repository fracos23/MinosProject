package it.unical.entities;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "problem")
public class Problem
{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 	@Column(name = "id_problem")
	private Integer id_problem;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "test")
	private byte[] test;
	
	@Column(name = "timelimit")
	private Float timelimit;
	
	@Column(name = "rankable")
	private String rankable;
	
	@Column(name = "sol")
	private byte[] sol;
	
	@Column(name = "description")
	private String description;
	
	@ManyToOne
	@JoinColumn(name = "id_jury")
	private Jury jury;

	@ManyToOne
	@JoinColumn(name = "contest_idcontest")
	private Contest id_contest;
	
	public Problem ()
	{
		this.id_problem = DatabaseHandler.NO_ID;
		this.name = null;
		this.test = null;
		this.timelimit = null;
		this.rankable = null;
		this.sol = null;
		this.description = null;
	}

	public Integer getId_problem() {
		return id_problem;
	}

	public void setId_problem(Integer id_problem) {
		this.id_problem = id_problem;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public byte[] getTest() {
		return test;
	}

	public void setTest(byte[] test) {
		this.test = test;
	}

	public Float getTimelimit() {
		return timelimit;
	}

	public void setTimelimit(Float timelimit) {
		this.timelimit = timelimit;
	}

	public String getRankable() {
		return rankable;
	}

	public void setRankable(String rankable) {
		this.rankable = rankable;
	}

	public byte[] getSol() {
		return sol;
	}

	public void setSol(byte[] sol) {
		this.sol = sol;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Contest getId_contest() {
		return id_contest;
	}

	public void setId_contest(Contest id_contest) {
		this.id_contest = id_contest;
	}
	
}