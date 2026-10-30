package br.com.fiap.fintech.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ENTRADA")
public class Entrada {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "SEQ_ENTRADA"
    )
    @SequenceGenerator(
            name = "SEQ_ENTRADA",
            sequenceName = "SEQ_ENTRADA",
            allocationSize = 1
    )
    @Column(name = "CD_ENTRADA")
    private Integer idEntrada;

    @Column(name = "CD_USUARIO")
    private Integer idUsuario;

    @Column(name = "CD_CATEGORIA")
    private Integer idCategoria;

    @Column(name = "CD_FORMA_MOVIMENTACAO")
    private Integer idFormaMovimentacao;

    @Column(name = "NR_VALOR")
    private BigDecimal valor;

    @Column(name = "DT_ENTRADA")
    private LocalDateTime dataEntrada;

    @Column(name = "DS_ENTRADA")
    private String descricao;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    @Column(name = "IC_ATIVO")
    private String ativo;

    public Entrada() {
    }

    public Integer getIdEntrada() {
        return idEntrada;
    }

    public void setIdEntrada(Integer idEntrada) {
        this.idEntrada = idEntrada;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Integer getIdFormaMovimentacao() {
        return idFormaMovimentacao;
    }

    public void setIdFormaMovimentacao(Integer idFormaMovimentacao) {
        this.idFormaMovimentacao = idFormaMovimentacao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDateTime dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public String getAtivo() {
        return ativo;
    }

    public void setAtivo(String ativo) {
        this.ativo = ativo;
    }
}