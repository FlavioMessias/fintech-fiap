package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Entrada;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntradaRepository
        extends JpaRepository<Entrada, Integer> {
}