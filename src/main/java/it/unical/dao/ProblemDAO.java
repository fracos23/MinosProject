package it.unical.dao;

import it.unical.entities.Problem;

public interface ProblemDAO {

	public void create(Problem problem);

	public void delete(Problem problem);

	public void update(Problem problem);

	Problem get(Integer id);
}