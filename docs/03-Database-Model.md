# Sistem inspekcijskih kontrola - Database Model

## Pregled
Sistem koristi relacionu bazu (PostgreSQL) za evidenciju:
- proizvoda,
- inspekcijskih tijela,
- inspekcijskih kontrola.

Model je dizajniran tako da jedna inspekcijska kontrola referencira tačno **jedan proizvod** i tačno **jedno inspekcijsko tijelo**

---

## ER dijagram

> ER dijagram je exportovan pomoću alata DBeaver i slika se nalazi u folderu images.

![ER_Diagram](./images/kontrola_db%20-%20public.png)

---

## Tabele i polja

### 1) `proizvodi` (Proizvodi)
Sadrži evidenciju registrovanih proizvoda.

**Kolone (minimalno):**
- `id` - int8, (PK)
- `drzava_porijekla` - varchar(255), (NOT NULL)
- `naziv_proizvoda` - varchar(255), (NOT NULL)
- `opis` - varchar(1000), (NULL – opcionalno)
- `proizvodjac` - varchar(255), (NOT NULL)
- `serijski_broj` - varchar(255), (NOT NULL)

**Napomene:**
- `serial_number` se sam generiše na osnovu naziva proizvoda i proizvođača, te mu se dodijeli broj, koji zajedno čine serijski broj.
- `description` je opcionalno u skladu sa zahtjevom.

---

### 2) `inspekcijska_tijela` (Inspekcijska tijela)
Sadrži evidenciju inspekcijskih tijela koji vrše kontrole.

**Kolone (minimalno):**
- `id` - int8, (PK)
- `inspektorat` - varchar(255), (NOT NULL), enum vrijednosti: `FBiH`, `RS`, `BD`
- `naziv_inspekcijskog_tijela` - varchar(200), (NOT NULL)
- `nadleznost` - varchar(255), (NOT NULL), enum vrijednosti: `TRZISNA_INSPEKCIJA`, `ZDRAVSTVENO_SANITARNA_INSPEKCIJA`
- `kontakt_ime` - varchar(255), (NOT NULL)
- `kontakt_prezime` - varchar(255), (NOT NULL)
- `kontakt_telefon` - varchar(255), (NOT NULL)
- `kontakt_email` - varchar(255), (NOT NULL)

#### Kontakt osoba 
Kontakt osoba je riješena na način da je napravljena klasa osoba - koja je Embeddable i onda je ugrađena u klasu InspekcijskoTijelo i mapirano je u tabelu inspekcijska_tijela.

**V“Embedded” polja unutar tabele `inspection_bodies`**
- `kontakt_ime` (NULL)
- `kontakt_prezime` (NULL)
- `kontakt_telefon` (NULL)
- `kontakt_email` (NULL)

---

### 3) `inspekcijske_kontrole` (Inspekcijske kontrole)
Sadrži evidenciju svih izvršenih inspekcijskih kontrola.

**Kolone:**
- `id` - int8, (PK)
- `datum_inspekcijske_kontr` - date, (NOT NULL)
- `proizvod_siguran` - BOOL, (NOT NULL)
- `rezultati_kontrole` - VARCHAR(2000)(NULL)
- `proizvod_id` - int8, (FK → `proizvodi.id`, NOT NULL)
- `inspekcijsko_tijelo_id` - int8, (FK → `inspekcijska_tijela.id`, NOT NULL)

**Poslovno pravilo (validacija datuma):**
- Nije dozvoljeno unijeti datum/vrijeme kontrole u budućnosti.
- Ovo se provjerava **na backendu** (server-side), i na frontendu radi boljeg UX-a.

---

## Relacije (ključne veze)

### `inspekcijska_tijela (1) → (N) inspekcijske_kontrole`
Jedno inspekcijsko tijelo može izvršiti više kontrola.
- FK: `inspekcijske_kontrole.inspekcijsko_tijelo_id` → `inspekcijska_tijela.id`

### `proizvodi (1) → (N) inspekcijske_kontrole`
Jedan proizvod može biti kontrolisan više puta.
- FK: `inspekcijske_kontrole.proizvod_id` → `proizvodi.id`

---

## Enumeracije: Inspektorat i Nadležnost

### Inspektorat
Lista vrijednosti:
- `FBiH`
- `RS`
- `BD` 

### Nadležnost
Lista vrijednosti:
- `TRZISNA_INSPEKCIJA`
- `ZDRAVSTVENO_SANITARNA_INSPEKCIJA`

**Način čuvanja u bazi:**
- čuvano kao `VARCHAR` (string), kako bi zapisi bili čitljivi i stabilni kroz promjene redoslijeda enum vrijednosti (npr. u JPA: `@Enumerated(EnumType.STRING)`).

---

## Integritet podataka (preporučene restrikcije)
- NOT NULL na obaveznim poljima (naziv, proizvođač, država porijekla, inspektorat, nadležnost, datum kontrole, rezultati, proizvod_siguran).
- FK ograničenja na `inspekcijske_kontrole` prema `proizvodi` i `inspekcijska_tijela`.
