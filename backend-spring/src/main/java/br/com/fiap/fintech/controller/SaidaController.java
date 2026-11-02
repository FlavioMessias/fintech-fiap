package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Saida;
import br.com.fiap.fintech.service.SaidaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    @Autowired
    private SaidaService saidaService;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Saida> cadastrar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody Saida saida
    ) {
        Saida novaSaida =
                saidaService.cadastrar(idUsuario, saida);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaSaida);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Saida>> listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                saidaService.listarPorUsuario(idUsuario)
        );
    }

    @GetMapping("/usuario/{idUsuario}/{idSaida}")
    public ResponseEntity<Saida> buscarPorId(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idSaida
    ) {
        return saidaService
                .buscarPorIdDoUsuario(idSaida, idUsuario)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/usuario/{idUsuario}/{idSaida}")
    public ResponseEntity<Saida> atualizar(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idSaida,
            @Valid @RequestBody Saida saida
    ) {
        return saidaService
                .atualizar(
                        idUsuario,
                        idSaida,
                        saida
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/usuario/{idUsuario}/{idSaida}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idSaida
    ) {
        if (!saidaService.excluir(
                idUsuario,
                idSaida
        )) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}