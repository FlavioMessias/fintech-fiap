package br.com.fintech.model;

public abstract class Transacao {

    private Integer idTransacao;
    private Double valor;
    private String descricao;
    private String dataTransacao;
    private Usuario usuario;
    private Categoria categoria;
    private FormaPagamento formaPagamento;

    public Transacao() {

    }

    public Transacao(Integer idTransacao, Double valor, String descricao, String dataTransacao,
                     Categoria categoria, FormaPagamento formaPagamento) {
        this.idTransacao = idTransacao;
        setValor(valor);
        this.descricao = descricao;
        this.dataTransacao = dataTransacao;
        this.categoria = categoria;
        this.formaPagamento = formaPagamento;
    }

    public abstract Double calcularImpactoSaldo();

    public String exibirResumo() {
        return "Descrição: " + descricao +
                "\nValor: R$ " + valor +
                "\nData: " + dataTransacao +
                "\nCategoria: " + categoria.getNomeCategoria() +
                "\nForma de pagamento: " + formaPagamento.getNomeFormaPagamento();
    }

    public Boolean valorValido() {
        return valor != null && valor > 0;
    }

    public Integer getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Integer idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        if (valor == null || valor <= 0) {
            throw new IllegalArgumentException("O valor da transação deve ser maior que zero.");
        }

        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public String getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(String dataTransacao) {
        this.dataTransacao = dataTransacao;
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

    public FormaPagamento getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(FormaPagamento formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}