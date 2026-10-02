package br.com.fintech.model;

import java.time.LocalDateTime;

public abstract class Transacao {

    private Integer idTransacao;
    private Usuario usuario;
    private Categoria categoria;
    private FormaMovimentacao formaMovimentacao;
    private Double valor;
    private LocalDateTime dataTransacao;
    private String descricao;
    private LocalDateTime dataAtualizacao;
    private String ativo;

    public Transacao() {
    }

    public Transacao(
            Integer idTransacao,
            Usuario usuario,
            Categoria categoria,
            FormaMovimentacao formaMovimentacao,
            Double valor,
            LocalDateTime dataTransacao,
            String descricao,
            LocalDateTime dataAtualizacao,
            String ativo
    ) {
        this.idTransacao = idTransacao;
        this.usuario = usuario;
        this.categoria = categoria;
        this.formaMovimentacao = formaMovimentacao;
        setValor(valor);
        this.dataTransacao = dataTransacao;
        this.descricao = descricao;
        this.dataAtualizacao = dataAtualizacao;
        this.ativo = ativo;
    }

    public abstract Double calcularImpactoSaldo();

    public String exibirResumo() {
        return "Descrição: " + descricao +
                "\nValor: R$ " + valor +
                "\nData: " + dataTransacao +
                "\nCategoria: " + categoria.getNomeCategoria() +
                "\nForma de movimentação: " +
                formaMovimentacao.getDescricaoForma();
    }

    public boolean valorValido() {
        return valor != null && valor > 0;
    }

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public FormaMovimentacao getFormaMovimentacao() {
        return formaMovimentacao;
    }

    public void setFormaMovimentacao(FormaMovimentacao formaMovimentacao) {
        this.formaMovimentacao = formaMovimentacao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException(
                    "O valor da transação deve ser maior que zero."
            );
        }

        this.valor = valor;
    }

    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
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