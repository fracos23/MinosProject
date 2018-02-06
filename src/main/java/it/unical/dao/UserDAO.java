package it.unical.dao;

import it.unical.entities.User;

public interface UserDAO {

	public void create(User user);

	public void delete(User user);

	public void update(User user);

	User get(Integer id);
}