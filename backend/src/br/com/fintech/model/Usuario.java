package br.com.fintech.model;

import java.util.ArrayList;
import java.util.List;

public class Usuario {

    private Integer idUsuario;
    private String nome;
    private String email;
    private String telefone;
    private Double saldoAtual;
    private List<Transacao> transacoes;
    private List<MetaFinanceira> metas;

    public Usuario() {
        this.saldoAtual = 0.0;
        this.transacoes = new ArrayList<>();
        this.metas = new ArrayList<>();
    }

    public Usuario(Integer idUsuario, String nome, String email, String telefone) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.saldoAtual = 0.0;
        this.transacoes = new ArrayList<>();
        this.metas = new ArrayList<>();
    }

    public void adicionarTransacao(Transacao transacao) {
        transacao.setUsuario(this);
        transacoes.add(transacao);
        saldoAtual += transacao.calcularImpactoSaldo();
    }

    public void adicionarMeta(MetaFinanceira meta) {
        meta.setUsuario(this);
        metas.add(meta);
    }

    public Double calcularSaldo() {
        Double saldo = 0.0;

        for (Transacao transacao : transacoes) {
            saldo += transacao.calcularImpactoSaldo();
        }

        this.saldoAtual = saldo;
        return saldoAtual;
    }

    public String exibirResumoFinanceiro() {
        return "Usuário: " + nome +
                "\nEmail: " + email +
                "\nSaldo atual: R$ " + saldoAtual +
                "\nQuantidade de transações: " + transacoes.size() +
                "\nQuantidade de metas: " + metas.size();
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Double getSaldoAtual() {
        return saldoAtual;
    }

    public List<Transacao> getTransacoes() {
        return new ArrayList<>(transacoes);
    }

    public List<MetaFinanceira> getMetas() {
        return new ArrayList<>(metas);
    }
}