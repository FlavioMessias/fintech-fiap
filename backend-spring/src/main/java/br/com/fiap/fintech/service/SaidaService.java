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

    public Saida cadastrar(Saida saida) {

        if (saida.getAtivo() == null) {
            saida.setAtivo("S");
        }

        if (saida.getStatus() == null) {
            saida.setStatus("PAGO");
        }

        return saidaRepository.save(saida);
    }

    public List<Saida> listarTodas() {
        return saidaRepository.findAll();
    }

    public Optional<Saida> buscarPorId(Integer id) {
        return saidaRepository.findById(id);
    }

    public Optional<Saida> atualizar(
            Integer id,
            Saida saidaAtualizada) {

        Optional<Saida> saidaExistente =
                saidaRepository.findById(id);

        if (saidaExistente.isEmpty()) {
            return Optional.empty();
        }

        Saida saida = saidaExistente.get();

        saida.setIdUsuario(
                saidaAtualizada.getIdUsuario()
        );

        saida.setIdCategoria(
                saidaAtualizada.getIdCategoria()
        );

        saida.setIdFormaMovimentacao(
                saidaAtualizada.getIdFormaMovimentacao()
        );

        saida.setValor(
                saidaAtualizada.getValor()
        );

        saida.setDataSaida(
                saidaAtualizada.getDataSaida()
        );

        saida.setDescricao(
                saidaAtualizada.getDescricao()
        );

        saida.setStatus(
                saidaAtualizada.getStatus()
        );

        saida.setAtivo(
                saidaAtualizada.getAtivo()
        );

        saida.setDataAtualizacao(
                LocalDateTime.now()
        );

        return Optional.of(
                saidaRepository.save(saida)
        );
    }

    public boolean excluir(Integer id) {

        if (!saidaRepository.existsById(id)) {
            return false;
        }

        saidaRepository.deleteById(id);

        return true;
    }
}