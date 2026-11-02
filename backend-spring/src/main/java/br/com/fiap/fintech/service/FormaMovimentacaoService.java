package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.FormaMovimentacao;
import br.com.fiap.fintech.repository.FormaMovimentacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormaMovimentacaoService {

    @Autowired
    private FormaMovimentacaoRepository formaMovimentacaoRepository;

    public List<FormaMovimentacao> listarTodas() {
        return formaMovimentacaoRepository
                .findAllByOrderByDescricaoAsc();
    }
}