import type { InspekcijskoTijelo } from "./InspekcijskoTijelo";
import type { Proizvod } from "./proizvod";

export interface InspekcijskaKontrola {
    id?: number;
    datumInspekcijskeKontrole: string;
    nadleznoInspekcijskoTijelo: InspekcijskoTijelo;
    kontrolisaniProizvod: Proizvod;
    rezultatiKontrole: string;
    proizvodSiguran: boolean;
}
