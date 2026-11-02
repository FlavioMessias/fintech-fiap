package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.FormaMovimentacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormaMovimentacaoRepository
        extends JpaRepository<FormaMovimentacao, Integer> {

    List<FormaMovimentacao> findAllByOrderByDescricaoAsc();
}