package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);
}