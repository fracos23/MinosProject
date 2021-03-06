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
		Query query = session.createQuery("from Contest where idcontest = :idcontest");
		query.setParameter("idcontest", id);
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
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Contest> getContestBySubject(Integer subject, Integer year) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Contest where id_subject = :subject and year = :year");
		query.setParameter("subject", subject);
		query.setParameter("year", year);
		List<Contest> contests =  query.list();
		session.close();
		return contests;
	}
	
	@Override
	public List<Contest> getContestByJury(Integer jury) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Contest where id_jury= :jury");
		query.setParameter("jury", jury);
		List<Contest> contests = query.list();
		session.close();
		return contests;
	}

	@Override
	public Contest getContestByName(String name) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Contest where name = :name");
		query.setParameter("name", name);
		Contest contests =  (Contest) query.uniqueResult();
		session.close();
		return contests;
	}
}
