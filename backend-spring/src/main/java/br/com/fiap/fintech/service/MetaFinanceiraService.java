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

    public MetaFinanceira cadastrar(
            Integer idUsuario,
            MetaFinanceira meta
    ) {
        meta.setIdUsuario(idUsuario);

        if (meta.getValorAtual() == null) {
            meta.setValorAtual(BigDecimal.ZERO);
        }

        if (meta.getStatus() == null ||
                meta.getStatus().isBlank()) {
            meta.setStatus("ATIVA");
        }

        return metaFinanceiraRepository.save(meta);
    }

    public List<MetaFinanceira> listarPorUsuario(
            Integer idUsuario
    ) {
        return metaFinanceiraRepository
                .findByIdUsuario(idUsuario);
    }

    public Optional<MetaFinanceira> buscarPorIdDoUsuario(
            Integer idMeta,
            Integer idUsuario
    ) {
        return metaFinanceiraRepository
                .findByIdMetaAndIdUsuario(
                        idMeta,
                        idUsuario
                );
    }

    public Optional<MetaFinanceira> atualizar(
            Integer idUsuario,
            Integer idMeta,
            MetaFinanceira dadosAtualizados
    ) {
        return metaFinanceiraRepository
                .findByIdMetaAndIdUsuario(
                        idMeta,
                        idUsuario
                )
                .map(meta -> {

                    meta.setIdTipoMeta(
                            dadosAtualizados.getIdTipoMeta()
                    );

                    meta.setNome(
                            dadosAtualizados.getNome()
                    );

                    meta.setValorObjetivo(
                            dadosAtualizados.getValorObjetivo()
                    );

                    meta.setValorAtual(
                            dadosAtualizados.getValorAtual()
                    );

                    meta.setDataInicio(
                            dadosAtualizados.getDataInicio()
                    );

                    meta.setDataPrazo(
                            dadosAtualizados.getDataPrazo()
                    );

                    meta.setStatus(
                            dadosAtualizados.getStatus()
                    );

                    meta.setIcone(
                            dadosAtualizados.getIcone()
                    );

                    meta.setDataAtualizacao(
                            LocalDateTime.now()
                    );

                    return metaFinanceiraRepository.save(meta);
                });
    }

    public boolean excluir(
            Integer idUsuario,
            Integer idMeta
    ) {
        Optional<MetaFinanceira> meta =
                metaFinanceiraRepository
                        .findByIdMetaAndIdUsuario(
                                idMeta,
                                idUsuario
                        );

        if (meta.isEmpty()) {
            return false;
        }

        metaFinanceiraRepository.delete(meta.get());

        return true;
    }
}