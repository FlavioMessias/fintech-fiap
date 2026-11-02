package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Saida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaidaRepository
        extends JpaRepository<Saida, Integer> {

        List<Saida> findByIdUsuario(Integer idUsuario);
}