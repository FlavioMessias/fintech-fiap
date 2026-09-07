package br.com.fintech.model;

public class Saida extends Transacao {

    private String tipoDespesa;
    private Boolean despesaFixa;

    public Saida() {

    }

    public Saida(Integer idTransacao, Double valor, String descricao, String dataTransacao,
                 Categoria categoria, FormaPagamento formaPagamento,
                 String tipoDespesa, Boolean despesaFixa) {
        super(idTransacao, valor, descricao, dataTransacao, categoria, formaPagamento);
        this.tipoDespesa = tipoDespesa;
        this.despesaFixa = despesaFixa;
    }

    @Override
    public Double calcularImpactoSaldo() {
        return getValor() * -1;
    }

    @Override
    public String exibirResumo() {
        return "SAÍDA FINANCEIRA" +
                "\nTipo de despesa: " + tipoDespesa +
                "\nDespesa fixa: " + despesaFixa +
                "\n" + super.exibirResumo() +
                "\nImpacto no saldo: R$ " + calcularImpactoSaldo();
    }

    public String getTipoDespesa() {
        return tipoDespesa;
    }

    public void setTipoDespesa(String tipoDespesa) {
        this.tipoDespesa = tipoDespesa;
    }

    public Boolean getDespesaFixa() {
        return despesaFixa;
    }

    public void setDespesaFixa(Boolean despesaFixa) {
        this.despesaFixa = despesaFixa;
    }
}