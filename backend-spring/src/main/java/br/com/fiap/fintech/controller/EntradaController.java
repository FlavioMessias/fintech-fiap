package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Entrada;
import br.com.fiap.fintech.service.EntradaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    @Autowired
    private EntradaService entradaService;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Entrada> cadastrar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody Entrada entrada
    ) {
        Entrada novaEntrada =
                entradaService.cadastrar(idUsuario, entrada);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaEntrada);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Entrada>> listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                entradaService.listarPorUsuario(idUsuario)
        );
    }

    @GetMapping("/usuario/{idUsuario}/{idEntrada}")
    public ResponseEntity<Entrada> buscarPorId(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idEntrada
    ) {
        return entradaService
                .buscarPorIdDoUsuario(
                        idEntrada,
                        idUsuario
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/usuario/{idUsuario}/{idEntrada}")
    public ResponseEntity<Entrada> atualizar(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idEntrada,
            @Valid @RequestBody Entrada entrada
    ) {
        return entradaService
                .atualizar(
                        idUsuario,
                        idEntrada,
                        entrada
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/usuario/{idUsuario}/{idEntrada}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idEntrada
    ) {
        if (!entradaService.excluir(
                idUsuario,
                idEntrada
        )) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}