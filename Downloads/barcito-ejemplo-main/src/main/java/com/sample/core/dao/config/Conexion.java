package com.sample.core.dao.config;
 

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Logger;

public class Conexion {
	
	private static final Logger log = Logger.getLogger(Conexion.class
			.getPackage().getName());
	
	  private static final String HOST = "localhost";
	    // Eliminamos el "/" del final para controlarlo mejor abajo
	    private static final String URL = "jdbc:mysql://" + HOST + ":3306"; 
	    private static final String DBNAME = "Rodado";
	    
	    private static final String TIMEZONE = "?useUnicode=true&serverTimezone=UTC";
	    private static final String DRIVER = "com.mysql.cj.jdbc.Driver"; // Driver actualizado
	                
	    private static final String USUARIO = "root";
	    private static final String PASSWORD = ""; // Asegúrate de que coincida con tu MySQL

	private static Conexion instance = Conexion.getInstance();
	 
	private Connection conn;
	
	private Conexion() {}
	
	public Connection dameConnection() {
		
		try {
			Class.forName(DRIVER);
			conn = DriverManager.getConnection(URL+"/"+ DBNAME+TIMEZONE, USUARIO, PASSWORD);
			if (!conn.isClosed()) {
				
				//log.info("conectado a la base de datos");
			}	
			return conn;
		} catch (ClassNotFoundException e) {
			//log.error("Error de acceso al driver" + e.getMessage());
			e.printStackTrace();
		} catch (SQLException e) {
			//log.error("Error de SQL" + e.getMessage());
		}
		return null;
	}
	
	 public static Conexion getInstance() {
	       if (instance == null) {
	    	   instance = new Conexion();
	       }
	       return instance;
	   }

	 
}
