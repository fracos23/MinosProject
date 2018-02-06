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
	
	@Column(name = "pdf")
	private String pdf;
	
	@Column(name = "timelimit")
	private Float timelimit;
	
	@Column(name = "rankable")
	private String rankable;
	
	@Column(name = "url_image")
	private String url_image;
	
	@Column(name = "description")
	private String description;
	
//	@Column(name = "contest_idcontest")
//	private Integer contest_idcontest;
	
	@ManyToOne
	@JoinColumn(name = "contest_idcontest")
	private Contest id_contest;
	
	public Problem ()
	{
		this.id_problem = DatabaseHandler.NO_ID;
		this.name = null;
		this.pdf = null;
		this.timelimit = null;
		this.rankable = null;
		this.url_image = null;
		this.description = null;
//		this.contest_idcontest = null;
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

	public String getPdf() {
		return pdf;
	}

	public void setPdf(String pdf) {
		this.pdf = pdf;
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

	public String getUrl_image() {
		return url_image;
	}

	public void setUrl_image(String url_image) {
		this.url_image = url_image;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

/*	public Integer getContest_idcontest() {
		return contest_idcontest;
	}

	public void setContest_idcontest(Integer contest_idcontest) {
		this.contest_idcontest = contest_idcontest;
	}
*/

	public Contest getId_contest() {
		return id_contest;
	}

	public void setId_contest(Contest id_contest) {
		this.id_contest = id_contest;
	}
	
}