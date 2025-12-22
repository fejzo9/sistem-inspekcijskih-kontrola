package com.sisinspbih.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Klasa Osoba - Embeddable (ugrađena u InspekcijskoTijelo)
 * Predstavlja kontakt osobu inspekcijskog tijela
 */
@Embeddable
public class Osoba {

    @NotBlank(message = "Ime je obavezno!")
    private String ime;

    @NotBlank(message = "Prezime je obavezno!")
    private String prezime;

    @NotBlank(message = "Broj telefona je obavezan!")
    @Pattern(regexp = "^\\+\\d{1,3}\\d{8,12}$", message = "Neispravan format broja telefona! Format: +387602254411 ili +38733665554")
    private String brojTelefona;

    @NotBlank(message = "Email je obavezan!")
    @Email(message = "Neispravan format email adrese!")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email mora sadržavati @ i domen (npr. osmo@gmail.com)")
    private String email;

    // Konstruktori
    public Osoba() {
    }

    public Osoba(String ime, String prezime, String brojTelefona, String email) {
        this.ime = ime;
        this.prezime = prezime;
        this.brojTelefona = validateBrojTelefona(brojTelefona);
        this.email = validateEmail(email);
    }

    // Getteri i Setteri
    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getBrojTelefona() {
        return brojTelefona;
    }

    public void setBrojTelefona(String brojTelefona) {
        this.brojTelefona = validateBrojTelefona(brojTelefona);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = validateEmail(email);
    }

    // Validacija broja telefona
    private String validateBrojTelefona(String brojTelefona) {
        if (brojTelefona == null || brojTelefona.trim().isEmpty()) {
            throw new IllegalArgumentException("Broj telefona ne može biti prazan!");
        }

        // Ukloni sve razmake
        brojTelefona = brojTelefona.replaceAll("\\s+", "");

        // Provjeri format: +pozivniBroj + 8-12 cifara
        if (!brojTelefona.matches("^\\+\\d{1,3}\\d{8,12}$")) {
            throw new IllegalArgumentException(
                    "Neispravan format broja telefona! " +
                            "Primjeri: +387602254411, +38733665554, +381641234567");
        }

        return brojTelefona;
    }

    // Validacija email adrese
    private String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email ne može biti prazan!");
        }

        email = email.trim().toLowerCase();

        // Provjeri da li sadrži @ i .
        if (!email.contains("@") || !email.contains(".")) {
            throw new IllegalArgumentException(
                    "Email mora sadržavati @ i domen! Primjer: osmo@gmail.com");
        }

        // Dodatna validacija strukture
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            throw new IllegalArgumentException(
                    "Neispravan format email adrese! Primjer: osmo@gmail.com");
        }

        return email;
    }

    // Pomoćna metoda za puno ime
    public String getPunoIme() {
        return ime + " " + prezime;
    }

    @Override
    public String toString() {
        return "Osoba{" +
                "ime='" + ime + '\'' +
                ", prezime='" + prezime + '\'' +
                ", brojTelefona='" + brojTelefona + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}