package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EntradaRepository
        extends JpaRepository<Entrada, Integer> {

    List<Entrada> findByIdUsuario(Integer idUsuario);

    Optional<Entrada> findByIdEntradaAndIdUsuario(
            Integer idEntrada,
            Integer idUsuario
    );
}