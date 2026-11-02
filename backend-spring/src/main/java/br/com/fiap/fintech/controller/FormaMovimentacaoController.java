package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.FormaMovimentacao;
import br.com.fiap.fintech.service.FormaMovimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formas-movimentacao")
public class FormaMovimentacaoController {

    @Autowired
    private FormaMovimentacaoService formaMovimentacaoService;

    @GetMapping
    public ResponseEntity<List<FormaMovimentacao>> listarTodas() {
        return ResponseEntity.ok(
                formaMovimentacaoService.listarTodas()
        );
    }
}