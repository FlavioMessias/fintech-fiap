package br.com.fintech.test;

import br.com.fintech.dao.EntradaDAO;
import br.com.fintech.model.Categoria;
import br.com.fintech.model.Entrada;
import br.com.fintech.model.FormaMovimentacao;
import br.com.fintech.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;

public class TesteEntradaDAO {

    public static void main(String[] args) {

        EntradaDAO entradaDAO = new EntradaDAO();

        Categoria categoria = new Categoria();
        categoria.setIdCategoria(1);

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

        Entrada entrada1 = new Entrada(
                usuario1,
                categoria,
                formaMovimentacao,
                3500.00,
                LocalDateTime.now(),
                "Salário Ana"
        );

        Entrada entrada2 = new Entrada(
                usuario2,
                categoria,
                formaMovimentacao,
                4200.00,
                LocalDateTime.now(),
                "Salário Bruno"
        );

        Entrada entrada3 = new Entrada(
                usuario3,
                categoria,
                formaMovimentacao,
                3900.00,
                LocalDateTime.now(),
                "Salário Carla"
        );

        Entrada entrada4 = new Entrada(
                usuario4,
                categoria,
                formaMovimentacao,
                5000.00,
                LocalDateTime.now(),
                "Salário Daniel"
        );

        Entrada entrada5 = new Entrada(
                usuario5,
                categoria,
                formaMovimentacao,
                4100.00,
                LocalDateTime.now(),
                "Salário Eduarda"
        );

        entradaDAO.insert(entrada1);
        entradaDAO.insert(entrada2);
        entradaDAO.insert(entrada3);
        entradaDAO.insert(entrada4);
        entradaDAO.insert(entrada5);

        List<Entrada> entradas = entradaDAO.getAll();

        System.out.println("===== ENTRADAS CADASTRADAS =====");

        for (Entrada entrada : entradas) {
            System.out.println(entrada);
        }
    }
}