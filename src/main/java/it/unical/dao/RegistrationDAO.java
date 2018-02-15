package it.unical.dao;

import java.util.List;

import it.unical.entities.Registration;

public interface RegistrationDAO {

	public void create(Registration registration);

	public void delete(Registration registration);

	public void update(Registration registration);

	Registration get(Integer id);

	List<Registration> getRegistrationByStudent(Integer student);
}