package br.com.fiap.fintech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "FORMA_MOVIMENTACAO")
public class FormaMovimentacao {

    @Id
    @Column(name = "CD_FORMA")
    private Integer idForma;

    @Column(name = "DS_FORMA")
    private String descricao;

    @Column(name = "TP_FORMA")
    private String tipo;

    public FormaMovimentacao() {
    }

    public Integer getIdForma() {
        return idForma;
    }

    public void setIdForma(Integer idForma) {
        this.idForma = idForma;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}