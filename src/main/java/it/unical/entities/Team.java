package it.unical.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "team")
public class Team
{
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
 	@Column(name = "id_team")
	private Integer id_team;
	
 	@Column(name = "name")
	private String name;
 	
 	public Team()
 	{
 		this.id_team = DatabaseHandler.NO_ID;
 		this.name = null;
 	}

	public Team(Integer id_team, String name) {
		this.id_team = id_team;
		this.name = name;
	}

	public Integer getId_team() {
		return id_team;
	}

	public void setId_team(Integer id_team) {
		this.id_team = id_team;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
 	
}