package it.unical.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import it.unical.entities.Contest;
import it.unical.entities.Subject;

@SuppressWarnings("unused")
public class ContestDAOImpl implements ContestDAO {

	private DatabaseHandler databaseHandler;

	public ContestDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Contest contest) {
		databaseHandler.create(contest);
	}

	@Override
	public void delete(Contest contest) {
		databaseHandler.delete(contest);
	}

	@Override
	public void update(Contest contest) {
		databaseHandler.update(contest);
	}


	@Override
	public Contest get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from contest where id = :id");
		query.setParameter("id", id);
		Contest contest = (Contest) query.uniqueResult();
		session.close();
		return contest;
	}
	
	@Override
	public List<Contest> getAll() {
		Session session = databaseHandler.getSessionFactory().openSession();
		List<Contest> contests = session.createQuery("from Contest").list();
		session.close();
		return contests;
	}
}
