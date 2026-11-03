package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.ContaBancaria;
import br.com.fiap.fintech.repository.ContaBancariaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContaBancariaService {

    @Autowired
    private ContaBancariaRepository contaBancariaRepository;

    public List<ContaBancaria> listarAtivasPorUsuario(
            Integer idUsuario
    ) {
        return contaBancariaRepository
                .findByIdUsuarioAndAtivoOrderByNomeBancoAsc(
                        idUsuario,
                        "S"
                );
    }
}