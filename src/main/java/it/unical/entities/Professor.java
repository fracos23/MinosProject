package it.unical.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import it.unical.dao.DatabaseHandler;

@Entity
@Table(name = "professor")
public class Professor
{
	@Id
	@Column(name = "id")
	private Integer id; 
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "surname")
	private String surname;
	
	@Column(name = "password")
	private String password;
	
	@Column(name = "email")
	private String email;
	
	public Professor()
	{
		this.id=DatabaseHandler.NO_ID;
		this.name="";
		this.surname="";
		this.password="";
		this.email = "";
	}
	
	public Professor(Integer matricola, String name, String surname, String password, String email)
	{
		this.id = matricola;
		this.name = name;
		this.surname = surname;
		this.password = password;
		this.email = email;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	
}