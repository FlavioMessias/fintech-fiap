package br.com.fiap.fintech.service;

import br.com.fiap.fintech.model.TipoMeta;
import br.com.fiap.fintech.repository.TipoMetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoMetaService {

    @Autowired
    private TipoMetaRepository tipoMetaRepository;

    public List<TipoMeta> listarTodos() {
        return tipoMetaRepository
                .findAllByOrderByNomeAsc();
    }
}