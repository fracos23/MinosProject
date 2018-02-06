package it.unical.dao;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Subject;



@SuppressWarnings("unused")
public class SubjectDAOImpl implements SubjectDAO {

	private DatabaseHandler databaseHandler;

	public SubjectDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Subject subject) {
		databaseHandler.create(subject);
	}

	@Override
	public void delete(Subject subject) {
		databaseHandler.delete(subject);
	}

	@Override
	public void update(Subject subject) {
		databaseHandler.update(subject);
	}


	@Override
	public Subject get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from subject where id = :id");
		query.setParameter("id", id);
		Subject subject = (Subject) query.uniqueResult();
		session.close();
		return subject;
	}
}