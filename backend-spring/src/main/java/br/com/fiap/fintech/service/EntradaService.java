package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.Entrada;
import br.com.fiap.fintech.repository.EntradaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EntradaService {

    @Autowired
    private EntradaRepository entradaRepository;

    public Entrada cadastrar(
            Integer idUsuario,
            Entrada entrada
    ) {
        entrada.setIdUsuario(idUsuario);

        if (entrada.getAtivo() == null ||
                entrada.getAtivo().isBlank()) {
            entrada.setAtivo("S");
        }

        return entradaRepository.save(entrada);
    }

    public List<Entrada> listarTodas() {
        return entradaRepository.findAll();
    }

    public List<Entrada> listarPorUsuario(Integer idUsuario) {
        return entradaRepository.findByIdUsuario(idUsuario);
}

    public Optional<Entrada> buscarPorIdDoUsuario(
            Integer idEntrada,
            Integer idUsuario
    ) {
        return entradaRepository
                .findByIdEntradaAndIdUsuario(
                        idEntrada,
                        idUsuario
                );
    }

    public Optional<Entrada> atualizar(
            Integer idUsuario,
            Integer idEntrada,
            Entrada dadosAtualizados
    ) {
        return entradaRepository
                .findByIdEntradaAndIdUsuario(
                        idEntrada,
                        idUsuario
                )
                .map(entrada -> {

                    entrada.setIdCategoria(
                            dadosAtualizados.getIdCategoria()
                    );

                    entrada.setIdFormaMovimentacao(
                            dadosAtualizados.getIdFormaMovimentacao()
                    );

                    entrada.setValor(
                            dadosAtualizados.getValor()
                    );

                    entrada.setDataEntrada(
                            dadosAtualizados.getDataEntrada()
                    );

                    entrada.setDescricao(
                            dadosAtualizados.getDescricao()
                    );

                    entrada.setAtivo(
                            dadosAtualizados.getAtivo()
                    );

                    entrada.setDataAtualizacao(
                            LocalDateTime.now()
                    );

                    return entradaRepository.save(entrada);
                });
    }

    public boolean excluir(
            Integer idUsuario,
            Integer idEntrada
    ) {
        Optional<Entrada> entrada =
                entradaRepository
                        .findByIdEntradaAndIdUsuario(
                                idEntrada,
                                idUsuario
                        );

        if (entrada.isEmpty()) {
            return false;
        }

        entradaRepository.delete(entrada.get());

        return true;
    }
}