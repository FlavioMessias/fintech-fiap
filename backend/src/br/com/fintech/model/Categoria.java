package br.com.fintech.model;

public class Categoria {

    private Integer idCategoria;
    private String nomeCategoria;
    private String tipoCategoria;
    private String descricao;

    public Categoria() {

    }

    public Categoria(Integer idCategoria, String nomeCategoria, String tipoCategoria, String descricao) {
        this.idCategoria = idCategoria;
        this.nomeCategoria = nomeCategoria;
        this.tipoCategoria = tipoCategoria;
        this.descricao = descricao;
    }

    public void atualizarCategoria(String nomeCategoria, String tipoCategoria, String descricao) {
        this.nomeCategoria = nomeCategoria;
        this.tipoCategoria = tipoCategoria;
        this.descricao = descricao;
    }

    public String exibirCategoria() {
        return "Categoria: " + nomeCategoria +
                "\nTipo: " + tipoCategoria +
                "\nDescrição: " + descricao;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNomeCategoria() {
        return nomeCategoria;
    }

    public void setNomeCategoria(String nomeCategoria) {
        this.nomeCategoria = nomeCategoria;
    }

    public String getTipoCategoria() {
        return tipoCategoria;
    }

    public void setTipoCategoria(String tipoCategoria) {
        this.tipoCategoria = tipoCategoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}