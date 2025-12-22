package com.sisinspbih.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "inspekcijska_tijela")
public class InspekcijskoTijelo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Naziv inspekcijskog tijela je obavezan!")
    @Column(nullable = false, length = 200)
    private String nazivInspekcijskogTijela;

    @NotNull(message = "Inspektorat je obavezan!")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Inspektorat inspektorat;

    @NotNull(message = "Nadležnost je obavezna!")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nadleznosti nadleznosti;

    @Valid
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "ime", column = @Column(name = "kontakt_ime")),
            @AttributeOverride(name = "prezime", column = @Column(name = "kontakt_prezime")),
            @AttributeOverride(name = "brojTelefona", column = @Column(name = "kontakt_telefon")),
            @AttributeOverride(name = "email", column = @Column(name = "kontakt_email"))
    })
    private Osoba kontaktOsoba;

    // Konstruktori
    public InspekcijskoTijelo() {
    }

    public InspekcijskoTijelo(String nazivInspekcijskogTijela, Inspektorat inspektorat,
            Nadleznosti nadleznosti, Osoba kontaktOsoba) {
        this.nazivInspekcijskogTijela = nazivInspekcijskogTijela;
        this.inspektorat = inspektorat;
        this.nadleznosti = nadleznosti;
        this.kontaktOsoba = kontaktOsoba;
    }

    // Getteri i Setteri
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazivInspekcijskogTijela() {
        return nazivInspekcijskogTijela;
    }

    public void setNazivInspekcijskogTijela(String nazivInspekcijskogTijela) {
        this.nazivInspekcijskogTijela = nazivInspekcijskogTijela;
    }

    public Inspektorat getInspektorat() {
        return inspektorat;
    }

    public void setInspektorat(Inspektorat inspektorat) {
        this.inspektorat = inspektorat;
    }

    public Nadleznosti getNadleznosti() {
        return nadleznosti;
    }

    public void setNadleznosti(Nadleznosti nadleznosti) {
        this.nadleznosti = nadleznosti;
    }

    public Osoba getKontaktOsoba() {
        return kontaktOsoba;
    }

    public void setKontaktOsoba(Osoba kontaktOsoba) {
        this.kontaktOsoba = kontaktOsoba;
    }

    @Override
    public String toString() {
        return "InspekcijskoTijelo{" +
                "id=" + id +
                ", nazivInspekcijskogTijela='" + nazivInspekcijskogTijela + '\'' +
                ", inspektorat=" + inspektorat +
                ", nadleznosti=" + nadleznosti +
                ", kontaktOsoba=" + kontaktOsoba +
                '}';
    }
}
