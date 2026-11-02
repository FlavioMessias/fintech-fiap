package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MetaFinanceiraRepository
        extends JpaRepository<MetaFinanceira, Integer> {

    List<MetaFinanceira> findByIdUsuario(Integer idUsuario);
}