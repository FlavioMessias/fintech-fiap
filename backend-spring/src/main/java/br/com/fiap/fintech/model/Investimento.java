package br.com.fiap.fintech.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "INVESTIMENTO")
public class Investimento {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_investimento"
    )
    @SequenceGenerator(
            name = "seq_investimento",
            sequenceName = "SEQ_INVESTIMENTO",
            allocationSize = 1
    )
    @Column(name = "CD_INVESTIMENTO")
    private Integer idInvestimento;

    @Column(name = "CD_USUARIO")
    private Integer idUsuario;

    @NotNull
    @Column(name = "CD_CONTA_BANCARIA")
    private Integer idContaBancaria;

    @NotBlank
    @Column(name = "NM_INVESTIMENTO")
    private String nome;

    @NotBlank
    @Column(name = "TP_INVESTIMENTO")
    private String tipo;

    @NotNull
    @Positive
    @Column(name = "NR_VALOR_APLICADO")
    private BigDecimal valorAplicado;

    @NotNull
    @Column(name = "DT_INVESTIMENTO")
    private LocalDateTime dataInvestimento;

    @Column(name = "DS_INVESTIMENTO")
    private String descricao;

    @NotBlank
    @Column(name = "TP_STATUS")
    private String status;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    @Column(name = "IC_ATIVO")
    private String ativo;

    public Investimento() {
    }

    public Integer getIdInvestimento() {
        return idInvestimento;
    }

    public void setIdInvestimento(Integer idInvestimento) {
        this.idInvestimento = idInvestimento;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdContaBancaria() {
        return idContaBancaria;
    }

    public void setIdContaBancaria(Integer idContaBancaria) {
        this.idContaBancaria = idContaBancaria;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getValorAplicado() {
        return valorAplicado;
    }

    public void setValorAplicado(BigDecimal valorAplicado) {
        this.valorAplicado = valorAplicado;
    }

    public LocalDateTime getDataInvestimento() {
        return dataInvestimento;
    }

    public void setDataInvestimento(LocalDateTime dataInvestimento) {
        this.dataInvestimento = dataInvestimento;
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