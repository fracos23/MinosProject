package it.unical.dao;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Registration;


@SuppressWarnings("unused")
public class RegistrationDAOImpl implements RegistrationDAO {

	private DatabaseHandler databaseHandler;

	public RegistrationDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Registration registration) {
		databaseHandler.create(registration);
	}

	@Override
	public void delete(Registration registration) {
		databaseHandler.delete(registration);
	}

	@Override
	public void update(Registration registration) {
		databaseHandler.update(registration);
	}


	@Override
	public Registration get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from registration where id = :id");
		query.setParameter("id", id);
		Registration registration = (Registration) query.uniqueResult();
		session.close();
		return registration;
	}
}