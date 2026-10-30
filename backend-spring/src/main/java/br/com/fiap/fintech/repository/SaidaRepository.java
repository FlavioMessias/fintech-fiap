package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Saida;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaidaRepository
        extends JpaRepository<Saida, Integer> {
}