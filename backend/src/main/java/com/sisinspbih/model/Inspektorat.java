package com.sisinspbih.model;

public enum Inspektorat {
    FBIH("Federacija Bosne i Hercegovine"),
    RS("Republika Srpska"),
    DISTRIKT_BRCKO("Brčko Distrikt BiH");

    private final String naziv;

    Inspektorat(String naziv) {
        this.naziv = naziv;
    }

    public String getNaziv() {
        return naziv;
    }

    @Override
    public String toString() {
        return naziv;
    }
}