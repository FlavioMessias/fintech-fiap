package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.MetaFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MetaFinanceiraRepository
        extends JpaRepository<MetaFinanceira, Integer> {

    List<MetaFinanceira> findByIdUsuario(Integer idUsuario);

    Optional<MetaFinanceira> findByIdMetaAndIdUsuario(
            Integer idMeta,
            Integer idUsuario
    );
}