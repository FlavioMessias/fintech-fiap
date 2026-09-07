package br.com.fintech.model;

public class FormaPagamento {

    private Integer idFormaPagamento;
    private String nomeFormaPagamento;
    private String descricao;
    private Boolean ativo;

    public FormaPagamento() {

    }

    public FormaPagamento(Integer idFormaPagamento, String nomeFormaPagamento, String descricao, Boolean ativo) {
        this.idFormaPagamento = idFormaPagamento;
        this.nomeFormaPagamento = nomeFormaPagamento;
        this.descricao = descricao;
        this.ativo = ativo;
    }

    public void ativarFormaPagamento() {
        this.ativo = true;
    }

    public void desativarFormaPagamento() {
        this.ativo = false;
    }

    public String exibirFormaPagamento() {
        return "Forma de pagamento: " + nomeFormaPagamento +
                "\nDescrição: " + descricao +
                "\nAtivo: " + ativo;
    }

    public Integer getIdFormaPagamento() {
        return idFormaPagamento;
    }

    public void setIdFormaPagamento(Integer idFormaPagamento) {
        this.idFormaPagamento = idFormaPagamento;
    }

    public String getNomeFormaPagamento() {
        return nomeFormaPagamento;
    }

    public void setNomeFormaPagamento(String nomeFormaPagamento) {
        this.nomeFormaPagamento = nomeFormaPagamento;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}