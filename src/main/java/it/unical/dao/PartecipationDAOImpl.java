package it.unical.dao;

import org.hibernate.Query;
import org.hibernate.Session;

import it.unical.entities.Partecipation;

@SuppressWarnings("unused")
public class PartecipationDAOImpl implements PartecipationDAO {

	private DatabaseHandler databaseHandler;

	public PartecipationDAOImpl() {
		databaseHandler = null;
	}

	public DatabaseHandler getDatabaseHandler() {
		return databaseHandler;
	}

	public void setDatabaseHandler(DatabaseHandler databaseHandler) {
		this.databaseHandler = databaseHandler;
	}

	@Override
	public void create(Partecipation partecipation) {
		databaseHandler.create(partecipation);
	}

	@Override
	public void delete(Partecipation partecipation) {
		databaseHandler.delete(partecipation);
	}

	@Override
	public void update(Partecipation partecipation) {
		databaseHandler.update(partecipation);
	}


	@Override
	public Partecipation get(Integer id) {
		Session session = databaseHandler.getSessionFactory().openSession();
		Query query = session.createQuery("from Partecipation where id = :id");
		query.setParameter("id", id);
		Partecipation partecipation = (Partecipation) query.uniqueResult();
		session.close();
		return partecipation;
	}
}