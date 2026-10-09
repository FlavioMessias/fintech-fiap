package br.com.fintech.model;

public class MetaFinanceira {

    private Integer idMeta;
    private String nomeMeta;
    private String descricao;
    private Double valorObjetivo;
    private Double valorAtual;
    private String dataInicio;
    private String dataPrazo;
    private Usuario usuario;

    public MetaFinanceira() {

    }

    public MetaFinanceira(Integer idMeta, String nomeMeta, String descricao, Double valorObjetivo,
                          Double valorAtual, String dataInicio, String dataPrazo) {
        this.idMeta = idMeta;
        this.nomeMeta = nomeMeta;
        this.descricao = descricao;
        setValorObjetivo(valorObjetivo);
        setValorAtual(valorAtual);
        this.dataInicio = dataInicio;
        this.dataPrazo = dataPrazo;
    }

    public void adicionarValor(Double valor) {
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException("O valor adicionado deve ser maior que zero.");
        }

        this.valorAtual += valor;

        if (this.valorAtual > this.valorObjetivo) {
            this.valorAtual = this.valorObjetivo;
        }
    }

    public Double calcularProgresso() {
        return (valorAtual / valorObjetivo) * 100;
    }

    public Boolean metaConcluida() {
        return valorAtual >= valorObjetivo;
    }

    public String exibirMeta() {
        return "Meta: " + nomeMeta +
                "\nDescrição: " + descricao +
                "\nValor objetivo: R$ " + valorObjetivo +
                "\nValor atual: R$ " + valorAtual +
                "\nProgresso: " + calcularProgresso() + "%" +
                "\nMeta concluída: " + metaConcluida();
    }

    public Integer getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Integer idMeta) {
        this.idMeta = idMeta;
    }

    public String getNomeMeta() {
        return nomeMeta;
    }

    public void setNomeMeta(String nomeMeta) {
        this.nomeMeta = nomeMeta;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public Double getValorObjetivo() {
        return valorObjetivo;
    }

    public void setValorObjetivo(Double valorObjetivo) {
        if (valorObjetivo == null || valorObjetivo <= 0) {
            throw new IllegalArgumentException("O valor objetivo deve ser maior que zero.");
        }

        this.valorObjetivo = valorObjetivo;
    }

    public Double getValorAtual() {
        return valorAtual;
    }

    public void setValorAtual(Double valorAtual) {
        if (valorAtual == null || valorAtual < 0) {
            throw new IllegalArgumentException("O valor atual não pode ser negativo.");
        }

        this.valorAtual = valorAtual;
    }

    public String getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(String dataInicio) {
        this.dataInicio = dataInicio;
    }

    public String getDataPrazo() {
        return dataPrazo;
    }

    public void setDataPrazo(String dataPrazo) {
        this.dataPrazo = dataPrazo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}