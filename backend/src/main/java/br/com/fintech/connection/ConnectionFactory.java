package br.com.fintech.connection;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConnectionFactory {

    private static final Properties PROPERTIES = carregarProperties();

    private ConnectionFactory() {
    }

    public static Connection getConnection() throws SQLException {

        String url = obterConfiguracao("ORACLE_URL");
        String usuario = obterConfiguracao("ORACLE_USER");
        String senha = obterConfiguracao("ORACLE_PASSWORD");

        return DriverManager.getConnection(
                url,
                usuario,
                senha
        );
    }

    private static String obterConfiguracao(String chave) {

        String valor = System.getenv(chave);

        if (valor != null && !valor.isBlank()) {
            return valor;
        }

        valor = PROPERTIES.getProperty(chave);

        if (valor == null || valor.isBlank()) {
            throw new IllegalStateException(
                    "Configuração não encontrada: " + chave
            );
        }

        return valor;
    }

    private static Properties carregarProperties() {

        Properties properties = new Properties();

        try (
                InputStream input =
                        ConnectionFactory.class
                                .getClassLoader()
                                .getResourceAsStream("database.properties")
        ) {

            if (input != null) {
                properties.load(input);
            }

        } catch (IOException e) {
            throw new RuntimeException(
                    "Erro ao carregar database.properties.",
                    e
            );
        }

        return properties;
    }
}