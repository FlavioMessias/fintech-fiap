package br.com.fiap.fintech.controller;

import br.com.fiap.fintech.model.ContaBancaria;
import br.com.fiap.fintech.service.ContaBancariaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contas-bancarias")
public class ContaBancariaController {

    @Autowired
    private ContaBancariaService contaBancariaService;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<ContaBancaria>>
    listarPorUsuario(
            @PathVariable Integer idUsuario
    ) {
        return ResponseEntity.ok(
                contaBancariaService
                        .listarAtivasPorUsuario(idUsuario)
        );
    }
}