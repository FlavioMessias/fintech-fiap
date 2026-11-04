package br.com.fiap.fintech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TIPO_META")
public class TipoMeta {

    @Id
    @Column(name = "CD_TIPO_META")
    private Integer idTipoMeta;

    @Column(name = "NM_TIPO_META")
    private String nome;

    @Column(name = "NM_ICONE")
    private String icone;

    public TipoMeta() {
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

    public String getIcone() {
        return icone;
    }

    public void setIcone(String icone) {
        this.icone = icone;
    }
}
