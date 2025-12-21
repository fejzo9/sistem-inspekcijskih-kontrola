package com.sisinspbih.model;

import jakarta.persistence.*;
import java.util.concurrent.atomic.AtomicLong;

@Entity
@Table(name = "proizvodi")
public class Proizvod {

    private static final AtomicLong counter = new AtomicLong(1);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nazivProizvoda;

    @Column(nullable = false)
    private String proizvodjac;

    @Column(unique = true, nullable = false)
    private String serijskiBroj;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Drzava drzavaPorijekla;

    @Column(length = 1000)
    private String opis;

    // Defaultni konstruktor
    public Proizvod() {
    }

    // Konstruktor sa svim parametrima
    public Proizvod(String nazivProizvoda, String proizvodjac, Drzava drzavaPorijekla, String opis) {
        this.nazivProizvoda = nazivProizvoda;
        this.proizvodjac = proizvodjac;
        this.drzavaPorijekla = drzavaPorijekla;
        this.opis = opis;
        this.serijskiBroj = generisiSerijskiBroj();
    }

    // Konstruktor bez opisa
    public Proizvod(String nazivProizvoda, String proizvodjac, Drzava drzavaPorijekla) {
        this.nazivProizvoda = nazivProizvoda;
        this.proizvodjac = proizvodjac;
        this.drzavaPorijekla = drzavaPorijekla;
        this.serijskiBroj = generisiSerijskiBroj();
    }

    // Getteri i Setteri
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNazivProizvoda() {
        return nazivProizvoda;
    }

    public void setNazivProizvoda(String nazivProizvoda) {
        this.nazivProizvoda = nazivProizvoda;
        if (this.proizvodjac != null && !this.proizvodjac.isEmpty()) {
            this.serijskiBroj = generisiSerijskiBroj();
        }
    }

    public String getProizvodjac() {
        return proizvodjac;
    }

    public void setProizvodjac(String proizvodjac) {
        this.proizvodjac = proizvodjac;
        if (this.nazivProizvoda != null && !this.nazivProizvoda.isEmpty()) {
            this.serijskiBroj = generisiSerijskiBroj();
        }
    }

    public String getSerijskiBroj() {
        return serijskiBroj;
    }

    // Generisanje unikatnog serijskog broja
    private String generisiSerijskiBroj() {
        if (proizvodjac == null || proizvodjac.isEmpty() || nazivProizvoda == null || nazivProizvoda.isEmpty()) {
            return null;
        }
        long broj = counter.getAndIncrement();
        return String.format("%s_%s_%010d",
                proizvodjac.replaceAll("\\s+", "_"),
                nazivProizvoda.replaceAll("\\s+", "_"),
                broj);
    }

    public Drzava getDrzavaPorijekla() {
        return drzavaPorijekla;
    }

    public void setDrzavaPorijekla(Drzava drzavaPorijekla) {
        this.drzavaPorijekla = drzavaPorijekla;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    @Override
    public String toString() {
        return "Proizvod{" +
                "id=" + id +
                ", nazivProizvoda='" + nazivProizvoda + '\'' +
                ", proizvodjac='" + proizvodjac + '\'' +
                ", serijskiBroj='" + serijskiBroj + '\'' +
                ", drzavaPorijekla=" + drzavaPorijekla +
                ", opis='" + opis + '\'' +
                '}';
    }
}