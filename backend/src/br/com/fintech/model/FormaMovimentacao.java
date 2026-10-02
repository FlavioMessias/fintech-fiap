package br.com.fintech.model;

import java.time.LocalDateTime;

public class FormaMovimentacao {

    private Integer idForma;
    private String descricaoForma;
    private String tipoForma;
    private LocalDateTime dataCriacao;

    public FormaMovimentacao() {
    }

    public FormaMovimentacao(
            Integer idForma,
            String descricaoForma,
            String tipoForma,
            LocalDateTime dataCriacao
    ) {
        this.idForma = idForma;
        this.descricaoForma = descricaoForma;
        this.tipoForma = tipoForma;
        this.dataCriacao = dataCriacao;
    }

    public Integer getIdForma() {
        return idForma;
    }

    public void setIdForma(Integer idForma) {
        this.idForma = idForma;
    }

    public String getDescricaoForma() {
        return descricaoForma;
    }

    public void setDescricaoForma(String descricaoForma) {
        this.descricaoForma = descricaoForma;
    }

    public String getTipoForma() {
        return tipoForma;
    }

    public void setTipoForma(String tipoForma) {
        this.tipoForma = tipoForma;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    @Override
    public String toString() {
        return "FormaMovimentacao{" +
                "idForma=" + idForma +
                ", descricaoForma='" + descricaoForma + '\'' +
                ", tipoForma='" + tipoForma + '\'' +
                ", dataCriacao=" + dataCriacao +
                '}';
    }
}