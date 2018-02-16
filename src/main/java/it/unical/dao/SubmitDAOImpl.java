package it.unical.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Registration;
import it.unical.entities.Submit;



@SuppressWarnings("unused")
public class SubmitDAOImpl implements SubmitDAO {

	private DatabaseHandler databaseHandler;

	public SubmitDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Submit submit) {
		databaseHandler.create(submit);
	}

	@Override
	public void delete(Submit submit) {
		databaseHandler.delete(submit);
	}

	@Override
	public void update(Submit submit) {
		databaseHandler.update(submit);
	}


	@Override
	public Submit get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Submit where id = :id");
		query.setParameter("id", id);
		Submit submit = (Submit) query.uniqueResult();
		session.close();
		return submit;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Submit> getAllSubmitByTeam(Integer team) {

		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Submit where id_team = :team");
		query.setParameter("team", team);
		List<Submit> submits = (List<Submit>) query.list();
		session.close();
		return submits;
	}
}