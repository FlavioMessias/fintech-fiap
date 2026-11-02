package br.com.fiap.fintech.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "META_FINANCEIRA")
public class MetaFinanceira {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_meta"
    )
    @SequenceGenerator(
            name = "seq_meta",
            sequenceName = "SEQ_META",
            allocationSize = 1
    )
    @Column(name = "CD_META")
    private Integer idMeta;

    @Column(name = "CD_USUARIO")
    private Integer idUsuario;

    @NotNull
    @Column(name = "CD_TIPO_META")
    private Integer idTipoMeta;

    @NotBlank
    @Column(name = "NM_META")
    private String nome;

    @NotNull
    @Positive
    @Column(name = "NR_VALOR_OBJETIVO")
    private BigDecimal valorObjetivo;

    @PositiveOrZero
    @Column(name = "NR_VALOR_ATUAL")
    private BigDecimal valorAtual;

    @NotNull
    @Column(name = "DT_INICIO")
    private LocalDateTime dataInicio;

    @NotNull
    @Column(name = "DT_PRAZO")
    private LocalDateTime dataPrazo;

    @Column(name = "TP_STATUS")
    private String status;

    @Column(name = "NM_ICONE")
    private String icone;

    @Column(name = "DT_ATUALIZACAO")
    private LocalDateTime dataAtualizacao;

    public MetaFinanceira() {
    }

    public Integer getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Integer idMeta) {
        this.idMeta = idMeta;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdTipoMeta() {
        return idTipoMeta;
    }

    public void setIdTipoMeta(Integer idTipoMeta) {
        this.idTipoMeta = idTipoMeta;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValorObjetivo() {
        return valorObjetivo;
    }

    public void setValorObjetivo(BigDecimal valorObjetivo) {
        this.valorObjetivo = valorObjetivo;
    }

    public BigDecimal getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(BigDecimal valorAtual) {
        this.valorAtual = valorAtual;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataPrazo() {
        return dataPrazo;
    }

    public void setDataPrazo(LocalDateTime dataPrazo) {
        this.dataPrazo = dataPrazo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIcone() {
        return icone;
    }

    public void setIcone(String icone) {
        this.icone = icone;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }
}