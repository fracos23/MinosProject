package it.unical.entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "contest")
public class Contest
{
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 	@Column(name = "idcontest")
		private Integer idcontest;
	 	
	 	@Column(name = "restriction")
		private Integer restriction;

		@Column(name = "name")
		private String name;
		
		@Column(name = "deadline")
		private String deadline;
		
		@Column(name = "url_image")
		private String url_image;
	 	
		@Column(name = "rankable")
		private String rankable;
		
		@ManyToOne
		@JoinColumns({
		@JoinColumn(name = "id_subject"),
		@JoinColumn(name = "year")})
		private Subject subject;
		
		@ManyToOne
		@JoinColumn(name = "id_jury")
		private Jury jury;
		
		
		
		
		public Contest()
		{
			this.idcontest =  DatabaseHandler.NO_ID;
			this.name = null;
			this.deadline = null;
			this.url_image = null;
			this.rankable = null;
			this.subject = null;
			this.jury = null;
		}
		
		public Contest(String name, String deadline, String url_image, String rankable, Subject subject, Jury jury)
		{
			this.name = name;
			this.deadline = deadline;
			this.url_image = url_image;
			this.rankable = rankable;
			this.subject = subject;
			this.jury = jury;
		}

		public Integer getIdcontest() {
			return idcontest;
		}

		public void setIdcontest(Integer idcontest) {
			this.idcontest = idcontest;
		}

		public String getName() {
			return name;
		}
		
		public Integer getRestriction() {
			return restriction;
		}

		public void setRestriction(Integer restriction) {
			this.restriction = restriction;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getDeadline() {
			return deadline;
		}

		public void setDeadline(String deadline) {
			this.deadline = deadline;
		}

		public String getUrl_image() {
			return url_image;
		}

		public void setUrl_image(String url_image) {
			this.url_image = url_image;
		}

		public String getRankable() {
			return rankable;
		}

		public void setRankable(String rankable) {
			this.rankable = rankable;
		}

		public Subject getSubject() {
			return subject;
		}

		public void setSubject(Subject subject) {
			this.subject = subject;
		}

		public Jury getJury() {
			return jury;
		}

		public void setJury(Jury jury) {
			this.jury = jury;
		}
		
		

}