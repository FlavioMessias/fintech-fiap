package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.MetaFinanceira;
import br.com.fiap.fintech.repository.MetaFinanceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MetaFinanceiraService {

    @Autowired
    private MetaFinanceiraRepository metaFinanceiraRepository;

    public MetaFinanceira cadastrar(MetaFinanceira meta) {
        if (meta.getValorAtual() == null) {
            meta.setValorAtual(BigDecimal.ZERO);
        }

        if (meta.getStatus() == null || meta.getStatus().isBlank()) {
            meta.setStatus("ATIVA");
        }

        return metaFinanceiraRepository.save(meta);
    }

    public List<MetaFinanceira> listarTodos() {
        return metaFinanceiraRepository.findAll();
    }

    public List<MetaFinanceira> listarPorUsuario(Integer idUsuario) {
        return metaFinanceiraRepository.findByIdUsuario(idUsuario);
    }

    public Optional<MetaFinanceira> buscarPorId(Integer idMeta) {
        return metaFinanceiraRepository.findById(idMeta);
    }

    public Optional<MetaFinanceira> atualizar(
            Integer idMeta,
            MetaFinanceira dadosAtualizados
    ) {
        return metaFinanceiraRepository.findById(idMeta)
                .map(meta -> {

                    meta.setIdUsuario(dadosAtualizados.getIdUsuario());
                    meta.setIdTipoMeta(dadosAtualizados.getIdTipoMeta());
                    meta.setNome(dadosAtualizados.getNome());
                    meta.setValorObjetivo(dadosAtualizados.getValorObjetivo());
                    meta.setValorAtual(dadosAtualizados.getValorAtual());
                    meta.setDataInicio(dadosAtualizados.getDataInicio());
                    meta.setDataPrazo(dadosAtualizados.getDataPrazo());
                    meta.setStatus(dadosAtualizados.getStatus());
                    meta.setIcone(dadosAtualizados.getIcone());
                    meta.setDataAtualizacao(LocalDateTime.now());

                    return metaFinanceiraRepository.save(meta);
                });
    }

    public boolean excluir(Integer idMeta) {
        if (!metaFinanceiraRepository.existsById(idMeta)) {
            return false;
        }

        metaFinanceiraRepository.deleteById(idMeta);
        return true;
    }
}