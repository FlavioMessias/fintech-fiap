package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository
        extends JpaRepository<Categoria, Integer> {

    List<Categoria> findAllByOrderByNomeAsc();
}