import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

public class test
{
	public static void main(String [] args) throws SQLException 
	{
		Connection connection = null;
		Session session = null;
		
		String host = "160.97.63.136";
		String servUser = "ubuntu";
		int port = 9418;
		 String privateKey = "/home/francesco/eclipse-workspace/Minos/res/coscotesi.pem";
		
		String rhost = "localhost";
		int rport = 3306;
		int lport = 3307;
		
		String driverName = "com.mysql.jdbc.Driver";
        String db2Url = "jdbc:mysql://localhost:" + lport + "/minosDB";
        String dbUsr = "root";
        String dbPwd = "root";
        
        try {
            JSch jsch = new JSch();
         // Set the ssh file and the passphrase
            jsch.addIdentity(privateKey);
            // Get SSH session
            session = jsch.getSession(servUser, host, port);
            java.util.Properties config = new java.util.Properties();
            // Never automatically add new host keys to the host file
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            // Connect to remote server
            session.connect();
            // Apply the port forwarding
            session.setPortForwardingL(lport, rhost, rport);
            // Connect to remote database
            Class.forName(driverName);
            connection = DriverManager.getConnection(db2Url, dbUsr, dbPwd);
            
            System.out.println ("Connection to database established!");
            
            Statement st = connection.createStatement();
            String query = "select * from user ;" ;
            ResultSet rs = st.executeQuery(query) ;
            
            while(rs.next())
            {
            	System.out.println(rs.getString(1));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            if(connection != null && !connection.isClosed()){
                connection.close();
            }
            if(session !=null && session.isConnected()){
                session.disconnect();
            }
        }
    }
		
}