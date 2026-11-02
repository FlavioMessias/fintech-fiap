package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Entrada;
import br.com.fiap.fintech.service.EntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {

    @Autowired
    private EntradaService entradaService;

    @PostMapping
    public ResponseEntity<Entrada> cadastrar(
            @Valid @RequestBody Entrada entrada) {

        Entrada entradaCadastrada = entradaService.cadastrar(entrada);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(entradaCadastrada);
    }

    @GetMapping
    public ResponseEntity<List<Entrada>> listarTodas() {

        List<Entrada> entradas = entradaService.listarTodas();

        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entrada> buscarPorId(@PathVariable Integer id) {

        return entradaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Entrada>> listarPorUsuario(
        @PathVariable Integer idUsuario) {

        return ResponseEntity.ok(
            entradaService.listarPorUsuario(idUsuario)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entrada> atualizar(
            @PathVariable Integer id,
            @Valid @RequestBody Entrada entrada) {

        return entradaService.atualizar(id, entrada)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        boolean excluida = entradaService.excluir(id);

        if (!excluida) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}