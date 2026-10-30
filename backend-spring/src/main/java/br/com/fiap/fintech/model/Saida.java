package br.com.fiap.fintech.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "SAIDA")
public class Saida {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "SEQ_SAIDA"
    )
    @SequenceGenerator(
            name = "SEQ_SAIDA",
            sequenceName = "SEQ_SAIDA",
            allocationSize = 1
    )
    @Column(name = "CD_SAIDA")
    private Integer idSaida;

    @Column(name = "CD_USUARIO")
    private Integer idUsuario;

    @Column(name = "CD_CATEGORIA")
    private Integer idCategoria;

    @Column(name = "CD_FORMA_MOVIMENTACAO")
    private Integer idFormaMovimentacao;

    @Column(name = "NR_VALOR")
    private BigDecimal valor;

    @Column(name = "DT_SAIDA")
    private LocalDateTime dataSaida;

    @Column(name = "DS_SAIDA")
    private String descricao;

    @Column(name = "TP_STATUS")
    private String status;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    @Column(name = "IC_ATIVO")
    private String ativo;

    public Saida() {
    }

    public Integer getIdSaida() {
        return idSaida;
    }

    public void setIdSaida(Integer idSaida) {
        this.idSaida = idSaida;
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

    public LocalDateTime getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDateTime dataSaida) {
        this.dataSaida = dataSaida;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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