package it.unical.dao;

import it.unical.entities.Professor;

public interface ProfessorDAO {

	public void create(Professor professor);

	public void delete(Professor professor);

	public void update(Professor professor);

	Professor get(Integer id);
}