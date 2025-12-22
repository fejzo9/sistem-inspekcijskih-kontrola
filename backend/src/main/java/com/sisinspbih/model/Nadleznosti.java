package com.sisinspbih.model;

public enum Nadleznosti {
    TRZISNA_INSPEKCIJA("Tržišna inspekcija"),
    ZDRAVSTVENO_SANITARNA_INSPEKCIJA("Zdravstveno-sanitarna inspekcija");

    private final String naziv;

    Nadleznosti(String naziv) {
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