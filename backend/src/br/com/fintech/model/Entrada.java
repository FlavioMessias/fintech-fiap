package br.com.fintech.model;

import java.time.LocalDateTime;

public class Entrada extends Transacao {

    public Entrada() {
    }

    // Para novos registros
    public Entrada(
            Usuario usuario,
            Categoria categoria,
            FormaMovimentacao formaMovimentacao,
            Double valor,
            LocalDateTime dataEntrada,
            String descricao
    ) {
        super(
                null,
                usuario,
                categoria,
                formaMovimentacao,
                valor,
                dataEntrada,
                descricao,
                null,
                "S"
        );
    }

    // Para registros recuperados do Oracle
    public Entrada(
            Integer idEntrada,
            Usuario usuario,
            Categoria categoria,
            FormaMovimentacao formaMovimentacao,
            Double valor,
            LocalDateTime dataEntrada,
            String descricao,
            LocalDateTime dataAtualizacao,
            String ativo
    ) {
        super(
                idEntrada,
                usuario,
                categoria,
                formaMovimentacao,
                valor,
                dataEntrada,
                descricao,
                dataAtualizacao,
                ativo
        );
    }

    @Override
    public Double calcularImpactoSaldo() {
        return getValor();
    }

    @Override
    public String exibirResumo() {
        return "ENTRADA FINANCEIRA" +
                "\n" + super.exibirResumo() +
                "\nImpacto no saldo: +R$ " + calcularImpactoSaldo();
    }

    @Override
    public String toString() {
        return "Entrada{" +
                "idEntrada=" + getIdTransacao() +
                ", usuario=" + getUsuario().getIdUsuario() +
                ", categoria=" + getCategoria().getIdCategoria() +
                ", formaMovimentacao=" +
                getFormaMovimentacao().getIdForma() +
                ", valor=" + getValor() +
                ", dataEntrada=" + getDataTransacao() +
                ", descricao='" + getDescricao() + '\'' +
                ", dataAtualizacao=" + getDataAtualizacao() +
                ", ativo='" + getAtivo() + '\'' +
                '}';
    }
}