package br.com.fiap.fintech.repository;

import br.com.fiap.fintech.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvestimentoRepository
        extends JpaRepository<Investimento, Integer> {

    List<Investimento> findByIdUsuario(Integer idUsuario);

    Optional<Investimento> findByIdInvestimentoAndIdUsuario(
            Integer idInvestimento,
            Integer idUsuario
    );

    @Query(
            value = """
                SELECT COUNT(*)
                FROM CONTA_BANCARIA
                WHERE CD_CONTA = :idConta
                  AND CD_USUARIO = :idUsuario
                  AND IC_ATIVO = 'S'
                """,
            nativeQuery = true
    )
    int contarContaAtivaDoUsuario(
            @Param("idConta") Integer idConta,
            @Param("idUsuario") Integer idUsuario
    );
}