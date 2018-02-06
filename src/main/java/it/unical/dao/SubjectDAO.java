package it.unical.dao;

import it.unical.entities.Subject;

public interface SubjectDAO {

	public void create(Subject subject);

	public void delete(Subject subject);

	public void update(Subject subject);

	Subject get(Integer id);
}