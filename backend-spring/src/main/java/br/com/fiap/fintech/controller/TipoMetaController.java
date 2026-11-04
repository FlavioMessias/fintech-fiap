package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.TipoMeta;
import br.com.fiap.fintech.service.TipoMetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-meta")
public class TipoMetaController {

    @Autowired
    private TipoMetaService tipoMetaService;

    @GetMapping
    public ResponseEntity<List<TipoMeta>> listarTodos() {
        return ResponseEntity.ok(
                tipoMetaService.listarTodos()
        );
    }
}