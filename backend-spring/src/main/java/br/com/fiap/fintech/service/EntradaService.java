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

    public Entrada cadastrar(Entrada entrada) {

        if (entrada.getAtivo() == null) {
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

    public Optional<Entrada> buscarPorId(Integer id) {
        return entradaRepository.findById(id);
    }

    public Optional<Entrada> atualizar(
            Integer id,
            Entrada entradaAtualizada) {

        Optional<Entrada> entradaExistente =
                entradaRepository.findById(id);

        if (entradaExistente.isEmpty()) {
            return Optional.empty();
        }

        Entrada entrada = entradaExistente.get();

        entrada.setIdUsuario(
                entradaAtualizada.getIdUsuario()
        );

        entrada.setIdCategoria(
                entradaAtualizada.getIdCategoria()
        );

        entrada.setIdFormaMovimentacao(
                entradaAtualizada.getIdFormaMovimentacao()
        );

        entrada.setValor(
                entradaAtualizada.getValor()
        );

        entrada.setDataEntrada(
                entradaAtualizada.getDataEntrada()
        );

        entrada.setDescricao(
                entradaAtualizada.getDescricao()
        );

        entrada.setAtivo(
                entradaAtualizada.getAtivo()
        );

        entrada.setDataAtualizacao(
                LocalDateTime.now()
        );

        return Optional.of(
                entradaRepository.save(entrada)
        );
    }

    public boolean excluir(Integer id) {

        if (!entradaRepository.existsById(id)) {
            return false;
        }

        entradaRepository.deleteById(id);

        return true;
    }
}