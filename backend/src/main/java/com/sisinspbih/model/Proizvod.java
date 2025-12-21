package com.sisinspbih.model;

import jakarta.persistence.*;

import java.text.Normalizer;
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

    // -------------------------------------------------
    // Helper: normalizuje tekst u "ASCII slug"
    // č/ć/š/ž -> c/c/s/z, đ -> dj, dž -> dz, whitespace -> _
    // -------------------------------------------------
    private static String toAsciiSlug(String input) {
        if (input == null)
            return null;

        String s = input.trim();
        if (s.isEmpty())
            return "";

        // 1) Posebni slučajevi prije normalizacije
        // Č / Ć / č / ć -> C / c
        s = s.replace("Č", "C")
                .replace("Ć", "C")
                .replace("č", "c")
                .replace("ć", "c");

        // DŽ / Dž / dž -> DZ / Dz / dz
        s = s.replace("DŽ", "DZ")
                .replace("Dž", "Dz")
                .replace("dž", "dz");

        // Đ / đ -> Dj / dj
        s = s.replace("Đ", "Dj")
                .replace("đ", "dj");

        // Š / š -> S / s
        s = s.replace("Š", "S")
                .replace("š", "s");

        // Ž / ž -> Z / z
        s = s.replace("Ž", "Z")
                .replace("ž", "z");

        // 2) Skidanje dijakritika (č/ć/š/ž -> c/c/s/z)
        s = Normalizer.normalize(s, Normalizer.Form.NFD);
        s = s.replaceAll("\\p{M}+", "");

        // 3) Whitespace -> underscore
        s = s.replaceAll("\\s+", "_");

        // 4) Ukloni sve osim slova/brojeva/_-.
        s = s.replaceAll("[^A-Za-z0-9_\\-\\.]", "");

        // 5) Sredi višestruke underscore i rubove
        s = s.replaceAll("_+", "_");
        s = s.replaceAll("^_+|_+$", "");

        return s;
    }

    // -------------------------------------------------
    // Generisanje unikatnog serijskog broja
    // Format: PROIZVODJAC_NAZIV_0000000001
    // -------------------------------------------------
    private String generisiSerijskiBroj() {
        if (proizvodjac == null || proizvodjac.isBlank() || nazivProizvoda == null || nazivProizvoda.isBlank()) {
            return null;
        }

        String p = toAsciiSlug(proizvodjac);
        String n = toAsciiSlug(nazivProizvoda);

        // Ako nakon čišćenja ostane prazno (npr. samo simboli), vrati null
        if (p == null || n == null || p.isEmpty() || n.isEmpty()) {
            return null;
        }

        long broj = counter.getAndIncrement();

        return String.format("%s_%s_%010d", p, n, broj);
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