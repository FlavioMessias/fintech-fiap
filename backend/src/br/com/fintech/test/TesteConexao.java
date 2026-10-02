package br.com.fintech.test;

import br.com.fintech.connection.ConnectionFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class TesteConexao {

    public static void main(String[] args) {

        try {
            Class.forName("oracle.jdbc.OracleDriver");
            System.out.println("Driver Oracle carregado com sucesso!");

        } catch (ClassNotFoundException e) {
            System.err.println("Driver Oracle não encontrado.");
            System.err.println(e.getMessage());
            return;
        }

        try (Connection connection = ConnectionFactory.getConnection()) {

            System.out.println("Conexão com o Oracle realizada com sucesso!");
            System.out.println(
                    "Banco: " + connection.getMetaData().getDatabaseProductName()
            );
            System.out.println(
                    "Versão: " + connection.getMetaData().getDatabaseProductVersion()
            );

        } catch (SQLException e) {

            System.err.println("Erro ao conectar ao Oracle.");
            System.err.println("Mensagem: " + e.getMessage());
        }
    }
}