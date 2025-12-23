package com.sisinspbih.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Entity
@Table(name = "inspekcijske_kontrole")
public class InspekcijskaKontrola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Datum inspekcijske kontrole je obavezan!")
    @PastOrPresent(message = "Datum ne može biti u budućnosti!")
    @Column(nullable = false)
    private LocalDate datumInspekcijskeKontrole;

    @NotNull(message = "Nadležno inspekcijsko tijelo je obavezno!")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inspekcijsko_tijelo_id", nullable = false)
    private InspekcijskoTijelo nadleznoInspekcijskoTijelo;

    @NotNull(message = "Kontrolisani proizvod je obavezan!")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "proizvod_id", nullable = false)
    private Proizvod kontrolisaniProizvod;

    @Column(length = 2000)
    private String rezultatiKontrole;

    @NotNull(message = "Status sigurnosti proizvoda je obavezan!")
    @Column(nullable = false)
    private Boolean proizvodSiguran;

    public InspekcijskaKontrola() {
    }

    public InspekcijskaKontrola(LocalDate datumInspekcijskeKontrole,
            InspekcijskoTijelo nadleznoInspekcijskoTijelo,
            Proizvod kontrolisaniProizvod,
            String rezultatiKontrole,
            Boolean proizvodSiguran) {
        this.datumInspekcijskeKontrole = validateDatum(datumInspekcijskeKontrole);
        this.nadleznoInspekcijskoTijelo = nadleznoInspekcijskoTijelo;
        this.kontrolisaniProizvod = kontrolisaniProizvod;
        this.rezultatiKontrole = rezultatiKontrole;
        this.proizvodSiguran = proizvodSiguran;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDatumInspekcijskeKontrole() {
        return datumInspekcijskeKontrole;
    }

    public void setDatumInspekcijskeKontrole(LocalDate datumInspekcijskeKontrole) {
        this.datumInspekcijskeKontrole = validateDatum(datumInspekcijskeKontrole);
    }

    public InspekcijskoTijelo getNadleznoInspekcijskoTijelo() {
        return nadleznoInspekcijskoTijelo;
    }

    public void setNadleznoInspekcijskoTijelo(InspekcijskoTijelo nadleznoInspekcijskoTijelo) {
        this.nadleznoInspekcijskoTijelo = nadleznoInspekcijskoTijelo;
    }

    public Proizvod getKontrolisaniProizvod() {
        return kontrolisaniProizvod;
    }

    public void setKontrolisaniProizvod(Proizvod kontrolisaniProizvod) {
        this.kontrolisaniProizvod = kontrolisaniProizvod;
    }

    public String getRezultatiKontrole() {
        return rezultatiKontrole;
    }

    public void setRezultatiKontrole(String rezultatiKontrole) {
        this.rezultatiKontrole = rezultatiKontrole;
    }

    public Boolean getProizvodSiguran() {
        return proizvodSiguran;
    }

    public void setProizvodSiguran(Boolean proizvodSiguran) {
        this.proizvodSiguran = proizvodSiguran;
    }

    private LocalDate validateDatum(LocalDate datum) {
        if (datum == null) {
            throw new IllegalArgumentException("Datum inspekcijske kontrole ne može biti null!");
        }

        if (datum.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Datum inspekcijske kontrole ne može biti u budućnosti! " +
                            "Maksimalan datum je: " + LocalDate.now());
        }

        return datum;
    }

    @Override
    public String toString() {
        return "InspekcijskaKontrola{" +
                "id=" + id +
                ", datumInspekcijskeKontrole=" + datumInspekcijskeKontrole +
                ", nadleznoInspekcijskoTijelo=" + nadleznoInspekcijskoTijelo.getNazivInspekcijskogTijela() +
                ", kontrolisaniProizvod=" + kontrolisaniProizvod.getNazivProizvoda() +
                ", proizvodSiguran=" + proizvodSiguran +
                '}';
    }
}
