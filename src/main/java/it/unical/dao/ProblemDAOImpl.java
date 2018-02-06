package it.unical.dao;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Problem;

@SuppressWarnings("unused")
public class ProblemDAOImpl implements ProblemDAO {

	private DatabaseHandler databaseHandler;

	public ProblemDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Problem problem) {
		databaseHandler.create(problem);
	}

	@Override
	public void delete(Problem problem) {
		databaseHandler.delete(problem);
	}

	@Override
	public void update(Problem problem) {
		databaseHandler.update(problem);
	}


	@Override
	public Problem get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from problem where id = :id");
		query.setParameter("id", id);
		Problem problem = (Problem) query.uniqueResult();
		session.close();
		return problem;
	}
}