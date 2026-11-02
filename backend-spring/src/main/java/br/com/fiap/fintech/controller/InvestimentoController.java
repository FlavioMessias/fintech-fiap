package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Investimento;
import br.com.fiap.fintech.service.InvestimentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investimentos")
public class InvestimentoController {

    @Autowired
    private InvestimentoService investimentoService;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Investimento> cadastrar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody Investimento investimento
    ) {
        Investimento novoInvestimento =
                investimentoService.cadastrar(
                        idUsuario,
                        investimento
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoInvestimento);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Investimento>> listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                investimentoService.listarPorUsuario(idUsuario)
        );
    }

    @GetMapping("/usuario/{idUsuario}/{idInvestimento}")
    public ResponseEntity<Investimento> buscarPorId(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idInvestimento
    ) {
        return investimentoService
                .buscarPorIdDoUsuario(
                        idInvestimento,
                        idUsuario
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/usuario/{idUsuario}/{idInvestimento}")
    public ResponseEntity<Investimento> atualizar(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idInvestimento,
            @Valid @RequestBody Investimento investimento
    ) {
        return investimentoService
                .atualizar(
                        idUsuario,
                        idInvestimento,
                        investimento
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/usuario/{idUsuario}/{idInvestimento}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idInvestimento
    ) {
        if (!investimentoService.excluir(
                idUsuario,
                idInvestimento
        )) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}