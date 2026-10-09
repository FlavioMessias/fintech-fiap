package br.com.fintech.test;

import br.com.fintech.dao.UsuarioDAO;
import br.com.fintech.model.Usuario;

import java.util.List;

public class TesteUsuarioDAO {

    public static void main(String[] args) {

        UsuarioDAO usuarioDAO = new UsuarioDAO();

        Usuario usuario1 = new Usuario(
                "Ana Becker",
                "ana.becker@fintech.com",
                "hash_ana"
        );

        Usuario usuario2 = new Usuario(
                "Bruno Alexandre",
                "bruno.alexandre@fintech.com",
                "hash_bruno"
        );

        Usuario usuario3 = new Usuario(
                "Carla Radames",
                "carla.radames@fintech.com",
                "hash_carla"
        );

        Usuario usuario4 = new Usuario(
                "Daniel Vorcaro",
                "daniel.vorcaro@fintech.com",
                "hash_daniel"
        );

        Usuario usuario5 = new Usuario(
                "Eduarda Zaratul",
                "eduarda.Zaratul@fintech.com",
                "hash_eduarda"
        );

        usuarioDAO.insert(usuario1);
        usuarioDAO.insert(usuario2);
        usuarioDAO.insert(usuario3);
        usuarioDAO.insert(usuario4);
        usuarioDAO.insert(usuario5);

        List<Usuario> usuarios = usuarioDAO.getAll();

        System.out.println("===== USUÁRIOS CADASTRADOS =====");

        for (Usuario usuario : usuarios) {
            System.out.println(usuario);
        }
    }
}