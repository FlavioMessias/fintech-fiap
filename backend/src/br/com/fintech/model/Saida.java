package br.com.fintech.model;

import java.time.LocalDateTime;

public class Saida extends Transacao {

    private String status;

    public Saida() {
    }

    // Construtor para novos registros
    public Saida(
            Usuario usuario,
            Categoria categoria,
            FormaMovimentacao formaMovimentacao,
            Double valor,
            LocalDateTime dataSaida,
            String descricao,
            String status
    ) {
        super(
                null,
                usuario,
                categoria,
                formaMovimentacao,
                valor,
                dataSaida,
                descricao,
                null,
                "S"
        );

        this.status = status;
    }

    // Construtor para registros recuperados do Oracle
    public Saida(
            Integer idSaida,
            Usuario usuario,
            Categoria categoria,
            FormaMovimentacao formaMovimentacao,
            Double valor,
            LocalDateTime dataSaida,
            String descricao,
            String status,
            LocalDateTime dataAtualizacao,
            String ativo
    ) {
        super(
                idSaida,
                usuario,
                categoria,
                formaMovimentacao,
                valor,
                dataSaida,
                descricao,
                dataAtualizacao,
                ativo
        );

        this.status = status;
    }

    @Override
    public Double calcularImpactoSaldo() {
        return getValor() * -1;
    }

    @Override
    public String exibirResumo() {
        return "SAÍDA FINANCEIRA" +
                "\nStatus: " + status +
                "\n" + super.exibirResumo() +
                "\nImpacto no saldo: R$ " + calcularImpactoSaldo();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Saida{" +
                "idSaida=" + getIdTransacao() +
                ", usuario=" + getUsuario().getIdUsuario() +
                ", categoria=" + getCategoria().getIdCategoria() +
                ", formaMovimentacao=" +
                getFormaMovimentacao().getIdForma() +
                ", valor=" + getValor() +
                ", dataSaida=" + getDataTransacao() +
                ", descricao='" + getDescricao() + '\'' +
                ", status='" + status + '\'' +
                ", dataAtualizacao=" + getDataAtualizacao() +
                ", ativo='" + getAtivo() + '\'' +
                '}';
    }
}