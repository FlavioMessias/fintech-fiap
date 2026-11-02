package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.Investimento;
import br.com.fiap.fintech.repository.InvestimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    private static final Set<String> TIPOS_VALIDOS = Set.of(
            "RENDA_FIXA",
            "ACAO",
            "ETF",
            "FII",
            "FUNDO",
            "CRIPTO",
            "OUTRO"
    );

    private static final Set<String> STATUS_VALIDOS = Set.of(
            "ATIVO",
            "RESGATADO",
            "VENCIDO"
    );

    public Investimento cadastrar(
            Integer idUsuario,
            Investimento investimento
    ) {
        investimento.setIdUsuario(idUsuario);

        validarDados(investimento);

        if (investimento.getStatus() == null ||
                investimento.getStatus().isBlank()) {
            investimento.setStatus("ATIVO");
        }

        if (investimento.getAtivo() == null ||
                investimento.getAtivo().isBlank()) {
            investimento.setAtivo("S");
        }

        return investimentoRepository.save(investimento);
    }

    public List<Investimento> listarTodos() {
        return investimentoRepository.findAll();
    }

    public List<Investimento> listarPorUsuario(Integer idUsuario) {
        return investimentoRepository.findByIdUsuario(idUsuario);
    }

    public Optional<Investimento> buscarPorIdDoUsuario(
            Integer idInvestimento,
            Integer idUsuario
    ) {
        return investimentoRepository
                .findByIdInvestimentoAndIdUsuario(
                        idInvestimento,
                        idUsuario
                );
    }

    public Optional<Investimento> atualizar(
            Integer idUsuario,
            Integer idInvestimento,
            Investimento dadosAtualizados
    ) {
        return investimentoRepository
                .findByIdInvestimentoAndIdUsuario(
                        idInvestimento,
                        idUsuario
                )
                .map(investimento -> {

                    dadosAtualizados.setIdUsuario(idUsuario);

                    validarDados(dadosAtualizados);

                    investimento.setIdContaBancaria(
                            dadosAtualizados.getIdContaBancaria()
                    );

                    investimento.setNome(
                            dadosAtualizados.getNome()
                    );

                    investimento.setTipo(
                            dadosAtualizados.getTipo()
                    );

                    investimento.setValorAplicado(
                            dadosAtualizados.getValorAplicado()
                    );

                    investimento.setDataInvestimento(
                            dadosAtualizados.getDataInvestimento()
                    );

                    investimento.setDescricao(
                            dadosAtualizados.getDescricao()
                    );

                    investimento.setStatus(
                            dadosAtualizados.getStatus()
                    );

                    investimento.setAtivo(
                            dadosAtualizados.getAtivo()
                    );

                    investimento.setDataAtualizacao(
                            LocalDateTime.now()
                    );

                    return investimentoRepository.save(investimento);
                });
    }

    public boolean excluir(
            Integer idUsuario,
            Integer idInvestimento
    ) {
        Optional<Investimento> investimento =
                investimentoRepository
                        .findByIdInvestimentoAndIdUsuario(
                                idInvestimento,
                                idUsuario
                        );

        if (investimento.isEmpty()) {
            return false;
        }

        investimentoRepository.delete(investimento.get());

        return true;
    }

    private void validarDados(Investimento investimento) {

        String tipo = investimento.getTipo().toUpperCase();

        if (!TIPOS_VALIDOS.contains(tipo)) {
            throw new IllegalArgumentException(
                    "Tipo de investimento inválido."
            );
        }

        investimento.setTipo(tipo);

        if (investimento.getStatus() != null &&
                !investimento.getStatus().isBlank()) {

            String status =
                    investimento.getStatus().toUpperCase();

            if (!STATUS_VALIDOS.contains(status)) {
                throw new IllegalArgumentException(
                        "Status de investimento inválido."
                );
            }

            investimento.setStatus(status);
        }

        int contaValida =
                investimentoRepository.contarContaAtivaDoUsuario(
                        investimento.getIdContaBancaria(),
                        investimento.getIdUsuario()
                );

        if (contaValida == 0) {
            throw new IllegalArgumentException(
                    "A conta bancária não pertence ao usuário informado."
            );
        }
    }
}