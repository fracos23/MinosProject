package it.unical.dao;

import it.unical.entities.Submit;

public interface SubmitDAO {

	public void create(Submit submit);

	public void delete(Submit submit);

	public void update(Submit submit);

	Submit get(Integer id);
}