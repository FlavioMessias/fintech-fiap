package br.com.fintech.model;

public class Categoria {

    private Integer idCategoria;
    private Integer idCategoriaPai;
    private String nomeCategoria;
    private String tipoCategoria;
    private String nomeIcone;

    public Categoria() {
    }

    public Categoria(
            Integer idCategoria,
            Integer idCategoriaPai,
            String nomeCategoria,
            String tipoCategoria,
            String nomeIcone
    ) {
        this.idCategoria = idCategoria;
        this.idCategoriaPai = idCategoriaPai;
        this.nomeCategoria = nomeCategoria;
        this.tipoCategoria = tipoCategoria;
        this.nomeIcone = nomeIcone;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public Integer getIdCategoriaPai() {
        return idCategoriaPai;
    }

    public void setIdCategoriaPai(Integer idCategoriaPai) {
        this.idCategoriaPai = idCategoriaPai;
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

    public String getNomeIcone() {
        return nomeIcone;
    }

    public void setNomeIcone(String nomeIcone) {
        this.nomeIcone = nomeIcone;
    }

    @Override
    public String toString() {
        return "Categoria{" +
                "idCategoria=" + idCategoria +
                ", idCategoriaPai=" + idCategoriaPai +
                ", nomeCategoria='" + nomeCategoria + '\'' +
                ", tipoCategoria='" + tipoCategoria + '\'' +
                ", nomeIcone='" + nomeIcone + '\'' +
                '}';
    }
}