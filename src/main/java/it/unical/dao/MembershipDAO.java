package it.unical.dao;

import it.unical.entities.Membership;

public interface MembershipDAO {

	public void create(Membership membership);

	public void delete(Membership membership);

	public void update(Membership membership);

	Membership get(Integer id);
}