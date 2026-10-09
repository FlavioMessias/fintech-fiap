package br.com.fintech.dao;

import br.com.fintech.connection.ConnectionFactory;
import br.com.fintech.model.Categoria;
import br.com.fintech.model.FormaMovimentacao;
import br.com.fintech.model.Saida;
import br.com.fintech.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class SaidaDAO {

    public void insert(Saida saida) {

        String sql = """
                INSERT INTO saida (
                    cd_usuario,
                    cd_categoria,
                    cd_forma_movimentacao,
                    nr_valor,
                    dt_saida,
                    ds_saida,
                    tp_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection connection = ConnectionFactory.getConnection();
                PreparedStatement statement = connection.prepareStatement(sql)
        ) {

            statement.setInt(
                    1,
                    saida.getUsuario().getIdUsuario()
            );

            statement.setInt(
                    2,
                    saida.getCategoria().getIdCategoria()
            );

            statement.setInt(
                    3,
                    saida.getFormaMovimentacao().getIdForma()
            );

            statement.setDouble(
                    4,
                    saida.getValor()
            );

            statement.setTimestamp(
                    5,
                    Timestamp.valueOf(saida.getDataTransacao())
            );

            statement.setString(
                    6,
                    saida.getDescricao()
            );

            statement.setString(
                    7,
                    saida.getStatus()
            );

            statement.executeUpdate();

            System.out.println(
                    "Saída cadastrada com sucesso: "
                            + saida.getDescricao()
            );

        } catch (SQLException e) {
            System.err.println("Erro ao cadastrar saída.");
            System.err.println("Mensagem: " + e.getMessage());
        }
    }

    public List<Saida> getAll() {

        List<Saida> saidas = new ArrayList<>();

        String sql = """
                SELECT
                    cd_saida,
                    cd_usuario,
                    cd_categoria,
                    cd_forma_movimentacao,
                    nr_valor,
                    dt_saida,
                    ds_saida,
                    tp_status,
                    dt_atualizacao,
                    ic_ativo
                FROM saida
                ORDER BY cd_saida
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

                Timestamp dataSaida =
                        resultSet.getTimestamp("dt_saida");

                Timestamp dataAtualizacao =
                        resultSet.getTimestamp("dt_atualizacao");

                Saida saida = new Saida(
                        resultSet.getInt("cd_saida"),
                        usuario,
                        categoria,
                        formaMovimentacao,
                        resultSet.getDouble("nr_valor"),
                        dataSaida != null
                                ? dataSaida.toLocalDateTime()
                                : null,
                        resultSet.getString("ds_saida"),
                        resultSet.getString("tp_status"),
                        dataAtualizacao != null
                                ? dataAtualizacao.toLocalDateTime()
                                : null,
                        resultSet.getString("ic_ativo")
                );

                saidas.add(saida);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao consultar saídas.");
            System.err.println("Mensagem: " + e.getMessage());
        }

        return saidas;
    }
}