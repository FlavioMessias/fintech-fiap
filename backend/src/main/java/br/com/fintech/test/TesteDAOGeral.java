package br.com.fintech.test;

import br.com.fintech.dao.EntradaDAO;
import br.com.fintech.dao.SaidaDAO;
import br.com.fintech.dao.UsuarioDAO;
import br.com.fintech.model.Categoria;
import br.com.fintech.model.Entrada;
import br.com.fintech.model.FormaMovimentacao;
import br.com.fintech.model.Saida;
import br.com.fintech.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;

public class TesteDAOGeral {

    public static void main(String[] args) {

        UsuarioDAO usuarioDAO = new UsuarioDAO();
        EntradaDAO entradaDAO = new EntradaDAO();
        SaidaDAO saidaDAO = new SaidaDAO();

        String identificador =
                String.valueOf(System.currentTimeMillis());

        // =========================
        // USUÁRIOS
        // =========================

        Usuario usuario1 = new Usuario(
                "Ana Becker",
                "ana.becker." + identificador + "@fintech.com",
                "hash_ana"
        );

        Usuario usuario2 = new Usuario(
                "Bruno Alexandre",
                "bruno.alexandre." + identificador + "@fintech.com",
                "hash_bruno"
        );

        Usuario usuario3 = new Usuario(
                "Carla Radames",
                "carla.radames." + identificador + "@fintech.com",
                "hash_carla"
        );

        Usuario usuario4 = new Usuario(
                "Daniel Vorcaro",
                "daniel.vorcaro." + identificador + "@fintech.com",
                "hash_daniel"
        );

        Usuario usuario5 = new Usuario(
                "Eduarda Zaratul",
                "eduarda.zaratul." + identificador + "@fintech.com",
                "hash_eduarda"
        );

        usuarioDAO.insert(usuario1);
        usuarioDAO.insert(usuario2);
        usuarioDAO.insert(usuario3);
        usuarioDAO.insert(usuario4);
        usuarioDAO.insert(usuario5);

        List<Usuario> usuarios = usuarioDAO.getAll()
                .stream()
                .filter(usuario ->
                        usuario.getEmail().contains(identificador))
                .toList();

        System.out.println("\n===== USUÁRIOS CADASTRADOS =====");

        for (Usuario usuario : usuarios) {
            System.out.println(usuario);
        }

        if (usuarios.size() != 5) {
            throw new IllegalStateException(
                    "Não foi possível recuperar os 5 usuários cadastrados."
            );
        }

        // =========================
        // DADOS DE RELACIONAMENTO
        // =========================

        Categoria categoriaEntrada = new Categoria();
        categoriaEntrada.setIdCategoria(1);

        Categoria categoriaSaida = new Categoria();
        categoriaSaida.setIdCategoria(2);

        FormaMovimentacao formaMovimentacao =
                new FormaMovimentacao();

        formaMovimentacao.setIdForma(1);

        // =========================
        // ENTRADAS
        // =========================

        double[] valoresEntrada = {
                3500.00,
                4200.00,
                3900.00,
                5000.00,
                4100.00
        };

        for (int i = 0; i < usuarios.size(); i++) {

            Entrada entrada = new Entrada(
                    usuarios.get(i),
                    categoriaEntrada,
                    formaMovimentacao,
                    valoresEntrada[i],
                    LocalDateTime.now(),
                    "Entrada teste " + identificador
            );

            entradaDAO.insert(entrada);
        }

        List<Entrada> entradas = entradaDAO.getAll()
                .stream()
                .filter(entrada ->
                        entrada.getDescricao().contains(identificador))
                .toList();

        System.out.println("\n===== ENTRADAS CADASTRADAS =====");

        for (Entrada entrada : entradas) {
            System.out.println(entrada);
        }

        // =========================
        // SAÍDAS
        // =========================

        double[] valoresSaida = {
                150.00,
                85.00,
                120.00,
                65.00,
                200.00
        };

        for (int i = 0; i < usuarios.size(); i++) {

            Saida saida = new Saida(
                    usuarios.get(i),
                    categoriaSaida,
                    formaMovimentacao,
                    valoresSaida[i],
                    LocalDateTime.now(),
                    "Saída teste " + identificador,
                    "PAGO"
            );

            saidaDAO.insert(saida);
        }

        List<Saida> saidas = saidaDAO.getAll()
                .stream()
                .filter(saida ->
                        saida.getDescricao().contains(identificador))
                .toList();

        System.out.println("\n===== SAÍDAS CADASTRADAS =====");

        for (Saida saida : saidas) {
            System.out.println(saida);
        }
    }
}