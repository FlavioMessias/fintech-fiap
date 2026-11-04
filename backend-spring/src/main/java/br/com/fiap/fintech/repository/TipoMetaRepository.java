package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.TipoMeta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoMetaRepository
        extends JpaRepository<TipoMeta, Integer> {

    List<TipoMeta> findAllByOrderByNomeAsc();
}