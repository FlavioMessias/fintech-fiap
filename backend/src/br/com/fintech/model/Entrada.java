package br.com.fintech.model;

public class Entrada extends Transacao {

    private String origemEntrada;

    public Entrada() {

    }

    public Entrada(Integer idTransacao, Double valor, String descricao, String dataTransacao,
                   Categoria categoria, FormaPagamento formaPagamento, String origemEntrada) {
        super(idTransacao, valor, descricao, dataTransacao, categoria, formaPagamento);
        this.origemEntrada = origemEntrada;
    }

    @Override
    public Double calcularImpactoSaldo() {
        return getValor();
    }

    @Override
    public String exibirResumo() {
        return "ENTRADA FINANCEIRA" +
                "\nOrigem: " + origemEntrada +
                "\n" + super.exibirResumo() +
                "\nImpacto no saldo: +R$ " + calcularImpactoSaldo();
    }

    public String getOrigemEntrada() {
        return origemEntrada;
    }

    public void setOrigemEntrada(String origemEntrada) {
        this.origemEntrada = origemEntrada;
    }
}