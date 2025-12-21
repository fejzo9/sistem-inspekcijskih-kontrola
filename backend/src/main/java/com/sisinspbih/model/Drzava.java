package com.sisinspbih.model;

public enum Drzava {
    // Balkan
    BOSNA_I_HERCEGOVINA("Bosna i Hercegovina"),
    CRNA_GORA("Crna Gora"),
    HRVATSKA("Hrvatska"),
    SRBIJA("Srbija"),
    SLOVENIJA("Slovenija"),
    MAKEDONIJA("Sjeverna Makedonija"),
    ALBANIJA("Albanija"),
    KOSOVO("Kosovo"),

    // Evropa
    AUSTRIJA("Austrija"),
    NJEMACKA("Njemačka"),
    FRANCUSKA("Francuska"),
    ITALIJA("Italija"),
    SPANIJA("Španija"),
    ENGLESKA("Engleska"),
    IRSKA("Irska"),
    SKOTSKA("Škotska"),
    PORTUGAL("Portugal"),
    HOLANDIJA("Holandija"),
    BELGIJA("Belgija"),
    SVAJCARSKA("Švajcarska"),
    GRCKA("Grčka"),
    TURSKA("Turska"),
    POLJSKA("Poljska"),
    CESKA("Češka"),
    SLOVACKA("Slovačka"),
    MADJARSKA("Mađarska"),
    RUMUNIJA("Rumunija"),
    BUGARSKA("Bugarska"),
    NORVESKA("Norveška"),
    SVEDSKA("Švedska"),
    FINSKA("Finska"),
    DANSKA("Danska"),
    ISLAND("Island"),
    UKRAJINA("Ukrajina"),

    // Azija
    KINA("Kina"),
    JAPAN("Japan"),
    JUZNA_KOREJA("Južna Koreja"),
    INDIJA("Indija"),
    TAJLAND("Tajland"),
    VIJETNAM("Vijetnam"),
    INDONEZIJA("Indonezija"),
    MALEZIJA("Malezija"),
    SINGAPUR("Singapur"),
    FILIPINI("Filipini"),
    PAKISTAN("Pakistan"),
    BANGLADES("Bangladeš"),
    SAUDIJSKA_ARABIJA("Saudijska Arabija"),
    UAE("Ujedinjeni Arapski Emirati"),
    IZRAEL("Izrael"),
    IRAN("Iran"),
    IRAK("Irak"),

    // Amerika
    AMERIKA("Sjedinjene Američke Države"),
    KANADA("Kanada"),
    MEKSIKO("Meksiko"),
    BRAZIL("Brazil"),
    ARGENTINA("Argentina"),
    CILE("Čile"),
    KOLUMBIJA("Kolumbija"),
    VENEZUELA("Venezuela"),
    PERU("Peru"),

    // Afrika
    JUZNOAFRICKA_REPUBLIKA("Južnoafrička Republika"),
    EGIPAT("Egipat"),
    MAROKO("Maroko"),
    NIGERIJA("Nigerija"),
    KENIJA("Kenija"),
    ETIOPIJA("Etiopija"),
    GANA("Gana"),

    // Okeanija
    AUSTRALIJA("Australija"),
    NOVI_ZELAND("Novi Zeland"),

    // Rusija i okolne zemlje
    RUSIJA("Rusija"),
    BJELORUSIJA("Bjelorusija"),
    KAZAHSTAN("Kazahstan"),
    GRUZIJA("Gruzija"),
    JERMENIJA("Jermenija"),
    AZERBEJDZAN("Azerbejdžan"),

    // Ostalo
    LUKSEMBURG("Luksemburg"),
    MONAKO("Monako"),
    LIHTENŠTAJN("Lihtenštajn"),
    MALTA("Malta"),
    KIPAR("Kipar"),
    ESTONIJA("Estonija"),
    LATVIJA("Latvija"),
    LITVANIJA("Litvanija");

    private final String naziv;

    Drzava(String naziv) {
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
