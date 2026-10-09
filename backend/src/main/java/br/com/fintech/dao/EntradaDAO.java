package br.com.fintech.dao;

import br.com.fintech.connection.ConnectionFactory;
import br.com.fintech.model.Categoria;
import br.com.fintech.model.Entrada;
import br.com.fintech.model.FormaMovimentacao;
import br.com.fintech.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class EntradaDAO {

    public void insert(Entrada entrada) {

        String sql = """
                INSERT INTO entrada (
                    cd_usuario,
                    cd_categoria,
                    cd_forma_movimentacao,
                    nr_valor,
                    dt_entrada,
                    ds_entrada
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection connection = ConnectionFactory.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    entrada.getUsuario().getIdUsuario()
            );

            statement.setInt(
                    2,
                    entrada.getCategoria().getIdCategoria()
            );

            statement.setInt(
                    3,
                    entrada.getFormaMovimentacao().getIdForma()
            );

            statement.setDouble(
                    4,
                    entrada.getValor()
            );

            statement.setTimestamp(
                    5,
                    Timestamp.valueOf(entrada.getDataTransacao())
            );

            statement.setString(
                    6,
                    entrada.getDescricao()
            );

            statement.executeUpdate();

            System.out.println(
                    "Entrada cadastrada com sucesso: "
                            + entrada.getDescricao()
            );

        } catch (SQLException e) {
            System.err.println("Erro ao cadastrar entrada.");
            System.err.println("Mensagem: " + e.getMessage());
        }
    }

    public List<Entrada> getAll() {

        List<Entrada> entradas = new ArrayList<>();

        String sql = """
                SELECT
                    cd_entrada,
                    cd_usuario,
                    cd_categoria,
                    cd_forma_movimentacao,
                    nr_valor,
                    dt_entrada,
                    ds_entrada,
                    dt_atualizacao,
                    ic_ativo
                FROM entrada
                ORDER BY cd_entrada
                """;

        try (
                Connection connection = ConnectionFactory.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql);
                ResultSet resultSet = statement.executeQuery()
        ) {

            while (resultSet.next()) {

                Usuario usuario = new Usuario();
                usuario.setIdUsuario(
                        resultSet.getInt("cd_usuario")
                );

                Categoria categoria = new Categoria();
                categoria.setIdCategoria(
                        resultSet.getInt("cd_categoria")
                );

                FormaMovimentacao formaMovimentacao =
                        new FormaMovimentacao();

                formaMovimentacao.setIdForma(
                        resultSet.getInt("cd_forma_movimentacao")
                );

                Timestamp dataEntrada =
                        resultSet.getTimestamp("dt_entrada");

                Timestamp dataAtualizacao =
                        resultSet.getTimestamp("dt_atualizacao");

                Entrada entrada = new Entrada(
                        resultSet.getInt("cd_entrada"),
                        usuario,
                        categoria,
                        formaMovimentacao,
                        resultSet.getDouble("nr_valor"),
                        dataEntrada != null
                                ? dataEntrada.toLocalDateTime()
                                : null,
                        resultSet.getString("ds_entrada"),
                        dataAtualizacao != null
                                ? dataAtualizacao.toLocalDateTime()
                                : null,
                        resultSet.getString("ic_ativo")
                );

                entradas.add(entrada);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao consultar entradas.");
            System.err.println("Mensagem: " + e.getMessage());
        }

        return entradas;
    }
}