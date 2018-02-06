package it.unical.dao;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Professor;


@SuppressWarnings("unused")
public class ProfessorDAOImpl implements ProfessorDAO {

	private DatabaseHandler databaseHandler;

	public ProfessorDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Professor professor) {
		databaseHandler.create(professor);
	}

	@Override
	public void delete(Professor professor) {
		databaseHandler.delete(professor);
	}

	@Override
	public void update(Professor professor) {
		databaseHandler.update(professor);
	}


	@Override
	public Professor get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from professor where id = :id");
		query.setParameter("id", id);
		Professor professor = (Professor) query.uniqueResult();
		session.close();
		return professor;
	}
}