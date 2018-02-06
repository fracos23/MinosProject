package it.unical.dao;

import it.unical.entities.Contest;

public interface ContestDAO {

	public void create(Contest contest);

	public void delete(Contest contest);

	public void update(Contest contest);
	
	public Contest get(Integer id);
}