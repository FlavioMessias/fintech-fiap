package br.com.fintech.dao;

import br.com.fintech.connection.ConnectionFactory;
import br.com.fintech.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    public void insert(Usuario usuario) {

        String sql = """
                INSERT INTO usuario (
                    nm_usuario,
                    nm_email,
                    ds_senha_hash
                )
                VALUES (?, ?, ?)
                """;

        try (
                Connection connection = ConnectionFactory.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)
        ) {

            statement.setString(1, usuario.getNome());
            statement.setString(2, usuario.getEmail());
            statement.setString(3, usuario.getSenhaHash());

            statement.executeUpdate();

            System.out.println("Usuário cadastrado com sucesso: " + usuario.getNome());

        } catch (SQLException e) {
            System.err.println("Erro ao cadastrar usuário.");
            System.err.println("Mensagem: " + e.getMessage());
        }
    }

    public List<Usuario> getAll() {

        List<Usuario> usuarios = new ArrayList<>();

        String sql = """
                SELECT
                    cd_usuario,
                    nm_usuario,
                    nm_email,
                    ds_senha_hash,
                    dt_cadastro,
                    dt_atualizacao,
                    ic_ativo
                FROM usuario
                ORDER BY cd_usuario
                """;

        try (
                Connection connection = ConnectionFactory.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
                ResultSet resultSet = statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Timestamp dataCadastro =
                        resultSet.getTimestamp("dt_cadastro");

                Timestamp dataAtualizacao =
                        resultSet.getTimestamp("dt_atualizacao");

                Usuario usuario = new Usuario(
                        resultSet.getInt("cd_usuario"),
                        resultSet.getString("nm_usuario"),
                        resultSet.getString("nm_email"),
                        resultSet.getString("ds_senha_hash"),
                        dataCadastro != null
                                ? dataCadastro.toLocalDateTime()
                                : null,
                        dataAtualizacao != null
                                ? dataAtualizacao.toLocalDateTime()
                                : null,
                        resultSet.getString("ic_ativo")
                );

                usuarios.add(usuario);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao consultar usuários.");
            System.err.println("Mensagem: " + e.getMessage());
        }

        return usuarios;
    }
}