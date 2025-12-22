export const Inspektorat = {
    FBIH: "FBIH",
    RS: "RS",
    DISTRIKT_BRCKO: "DISTRIKT_BRCKO"
} as const;

export type Inspektorat = (typeof Inspektorat)[keyof typeof Inspektorat];

export const InspektoratDisplay: Record<Inspektorat, string> = {
    [Inspektorat.FBIH]: "Federacija Bosne i Hercegovine",
    [Inspektorat.RS]: "Republika Srpska",
    [Inspektorat.DISTRIKT_BRCKO]: "Brčko Distrikt BiH"
};

export const Nadleznosti = {
    TRZISNA_INSPEKCIJA: "TRZISNA_INSPEKCIJA",
    ZDRAVSTVENO_SANITARNA_INSPEKCIJA: "ZDRAVSTVENO_SANITARNA_INSPEKCIJA"
} as const;

export type Nadleznosti = (typeof Nadleznosti)[keyof typeof Nadleznosti];

export const NadleznostiDisplay: Record<Nadleznosti, string> = {
    [Nadleznosti.TRZISNA_INSPEKCIJA]: "Tržišna inspekcija",
    [Nadleznosti.ZDRAVSTVENO_SANITARNA_INSPEKCIJA]: "Zdravstveno-sanitarna inspekcija"
};

export interface Osoba {
    ime: string;
    prezime: string;
    brojTelefona: string;
    email: string;
}

export interface InspekcijskoTijelo {
    id?: number;
    nazivInspekcijskogTijela: string;
    inspektorat: Inspektorat | string;
    nadleznosti: Nadleznosti | string;
    kontaktOsoba: Osoba;
}
