package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.Saida;
import br.com.fiap.fintech.repository.SaidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SaidaService {

    @Autowired
    private SaidaRepository saidaRepository;

    public Saida cadastrar(
            Integer idUsuario,
            Saida saida
    ) {
        saida.setIdUsuario(idUsuario);

        if (saida.getAtivo() == null ||
                saida.getAtivo().isBlank()) {
            saida.setAtivo("S");
        }

        if (saida.getStatus() == null ||
                saida.getStatus().isBlank()) {
            saida.setStatus("PAGO");
        }

        return saidaRepository.save(saida);
    }

    public List<Saida> listarTodas() {
        return saidaRepository.findAll();
    }

    public List<Saida> listarPorUsuario(Integer idUsuario) {
        return saidaRepository.findByIdUsuario(idUsuario);
    }

    public Optional<Saida> buscarPorIdDoUsuario(
            Integer idSaida,
            Integer idUsuario
    ) {
        return saidaRepository
                .findByIdSaidaAndIdUsuario(
                        idSaida,
                        idUsuario
                );
    }

    public Optional<Saida> atualizar(
            Integer idUsuario,
            Integer idSaida,
            Saida dadosAtualizados
    ) {
        return saidaRepository
                .findByIdSaidaAndIdUsuario(
                        idSaida,
                        idUsuario
                )
                .map(saida -> {

                    saida.setIdCategoria(
                            dadosAtualizados.getIdCategoria()
                    );

                    saida.setIdFormaMovimentacao(
                            dadosAtualizados.getIdFormaMovimentacao()
                    );

                    saida.setValor(
                            dadosAtualizados.getValor()
                    );

                    saida.setDataSaida(
                            dadosAtualizados.getDataSaida()
                    );

                    saida.setDescricao(
                            dadosAtualizados.getDescricao()
                    );

                    saida.setStatus(
                            dadosAtualizados.getStatus()
                    );

                    saida.setAtivo(
                            dadosAtualizados.getAtivo()
                    );

                    saida.setDataAtualizacao(
                            LocalDateTime.now()
                    );

                    return saidaRepository.save(saida);
                });
    }

    public boolean excluir(
            Integer idUsuario,
            Integer idSaida
    ) {
        Optional<Saida> saida =
                saidaRepository
                        .findByIdSaidaAndIdUsuario(
                                idSaida,
                                idUsuario
                        );

        if (saida.isEmpty()) {
            return false;
        }

        saidaRepository.delete(saida.get());

        return true;
    }
}