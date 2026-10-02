package br.com.fintech.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionFactory {

    private static final String URL = System.getenv("ORACLE_URL");
    private static final String USER = System.getenv("ORACLE_USER");
    private static final String PASSWORD = System.getenv("ORACLE_PASSWORD");

    private ConnectionFactory() {
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}