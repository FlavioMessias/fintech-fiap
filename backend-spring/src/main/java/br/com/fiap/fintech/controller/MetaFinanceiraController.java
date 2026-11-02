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

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<MetaFinanceira> cadastrar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody MetaFinanceira meta
    ) {
        MetaFinanceira novaMeta =
                metaFinanceiraService.cadastrar(
                        idUsuario,
                        meta
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novaMeta);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MetaFinanceira>> listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                metaFinanceiraService
                        .listarPorUsuario(idUsuario)
        );
    }

    @GetMapping("/usuario/{idUsuario}/{idMeta}")
    public ResponseEntity<MetaFinanceira> buscarPorId(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idMeta
    ) {
        return metaFinanceiraService
                .buscarPorIdDoUsuario(
                        idMeta,
                        idUsuario
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PutMapping("/usuario/{idUsuario}/{idMeta}")
    public ResponseEntity<MetaFinanceira> atualizar(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idMeta,
            @Valid @RequestBody MetaFinanceira meta
    ) {
        return metaFinanceiraService
                .atualizar(
                        idUsuario,
                        idMeta,
                        meta
                )
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/usuario/{idUsuario}/{idMeta}")
    public ResponseEntity<Void> excluir(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idMeta
    ) {
        if (!metaFinanceiraService.excluir(
                idUsuario,
                idMeta
        )) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}