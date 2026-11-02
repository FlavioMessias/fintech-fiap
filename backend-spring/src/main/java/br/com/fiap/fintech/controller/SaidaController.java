package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.Saida;
import br.com.fiap.fintech.service.SaidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    @Autowired
    private SaidaService saidaService;

    @PostMapping
    public ResponseEntity<Saida> cadastrar(
            @Valid @RequestBody Saida saida) {

        Saida saidaCadastrada = saidaService.cadastrar(saida);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saidaCadastrada);
    }

    @GetMapping
    public ResponseEntity<List<Saida>> listarTodas() {

        List<Saida> saidas = saidaService.listarTodas();

        return ResponseEntity.ok(saidas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Saida> buscarPorId(@PathVariable Integer id) {

        return saidaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Saida>> listarPorUsuario(
        @PathVariable Integer idUsuario) {

        return ResponseEntity.ok(
            saidaService.listarPorUsuario(idUsuario)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Saida> atualizar(
            @PathVariable Integer id,
            @Valid @RequestBody Saida saida) {

        return saidaService.atualizar(id, saida)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {

        boolean excluida = saidaService.excluir(id);

        if (!excluida) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}