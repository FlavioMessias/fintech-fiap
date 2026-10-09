package br.com.fintech.test;

import br.com.fintech.dao.SaidaDAO;
import br.com.fintech.model.Categoria;
import br.com.fintech.model.FormaMovimentacao;
import br.com.fintech.model.Saida;
import br.com.fintech.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;

public class TesteSaidaDAO {

    public static void main(String[] args) {

        SaidaDAO saidaDAO = new SaidaDAO();

        Categoria categoria = new Categoria();
        categoria.setIdCategoria(2);

        FormaMovimentacao formaMovimentacao =
                new FormaMovimentacao();

        formaMovimentacao.setIdForma(1);

        Usuario usuario1 = new Usuario();
        usuario1.setIdUsuario(5);

        Usuario usuario2 = new Usuario();
        usuario2.setIdUsuario(6);

        Usuario usuario3 = new Usuario();
        usuario3.setIdUsuario(7);

        Usuario usuario4 = new Usuario();
        usuario4.setIdUsuario(8);

        Usuario usuario5 = new Usuario();
        usuario5.setIdUsuario(9);

        Saida saida1 = new Saida(
                usuario1,
                categoria,
                formaMovimentacao,
                150.00,
                LocalDateTime.now(),
                "Supermercado Ana",
                "PAGO"
        );

        Saida saida2 = new Saida(
                usuario2,
                categoria,
                formaMovimentacao,
                85.00,
                LocalDateTime.now(),
                "Restaurante Bruno",
                "PAGO"
        );

        Saida saida3 = new Saida(
                usuario3,
                categoria,
                formaMovimentacao,
                120.00,
                LocalDateTime.now(),
                "Compras Carla",
                "PAGO"
        );

        Saida saida4 = new Saida(
                usuario4,
                categoria,
                formaMovimentacao,
                65.00,
                LocalDateTime.now(),
                "Almoço Daniel",
                "PAGO"
        );

        Saida saida5 = new Saida(
                usuario5,
                categoria,
                formaMovimentacao,
                200.00,
                LocalDateTime.now(),
                "Mercado Eduarda",
                "PAGO"
        );

        saidaDAO.insert(saida1);
        saidaDAO.insert(saida2);
        saidaDAO.insert(saida3);
        saidaDAO.insert(saida4);
        saidaDAO.insert(saida5);

        List<Saida> saidas = saidaDAO.getAll();

        System.out.println("===== SAÍDAS CADASTRADAS =====");

        for (Saida saida : saidas) {
            System.out.println(saida);
        }
    }
}