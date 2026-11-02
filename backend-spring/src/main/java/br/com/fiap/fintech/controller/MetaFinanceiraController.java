package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.MetaFinanceira;
import br.com.fiap.fintech.service.MetaFinanceiraService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
public class MetaFinanceiraController {

    @Autowired
    private MetaFinanceiraService metaFinanceiraService;

    @PostMapping
    public ResponseEntity<MetaFinanceira> cadastrar(
            @Valid @RequestBody MetaFinanceira meta
    ) {
        MetaFinanceira novaMeta =
                metaFinanceiraService.cadastrar(meta);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaMeta);
    }

    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> listarTodos() {
        return ResponseEntity.ok(
                metaFinanceiraService.listarTodos()
        );
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MetaFinanceira>> listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                metaFinanceiraService.listarPorUsuario(idUsuario)
        );
    }

    @GetMapping("/{idMeta}")
    public ResponseEntity<MetaFinanceira> buscarPorId(
            @PathVariable Integer idMeta
    ) {
        return metaFinanceiraService.buscarPorId(idMeta)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{idMeta}")
    public ResponseEntity<MetaFinanceira> atualizar(
            @PathVariable Integer idMeta,
            @Valid @RequestBody MetaFinanceira meta
    ) {
        return metaFinanceiraService.atualizar(idMeta, meta)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{idMeta}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer idMeta
    ) {
        if (!metaFinanceiraService.excluir(idMeta)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}