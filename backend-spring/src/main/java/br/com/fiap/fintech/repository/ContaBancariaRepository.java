package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.ContaBancaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaBancariaRepository
        extends JpaRepository<ContaBancaria, Integer> {

    List<ContaBancaria>
    findByIdUsuarioAndAtivoOrderByNomeBancoAsc(
            Integer idUsuario,
            String ativo
    );
}