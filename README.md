# Sistem za evidenciju inspekcijskih kontrola i registrovanih proizvoda (BiH)

## O projektu
Ovaj projekat predstavlja sistem za **evidenciju i pregled izvršenih inspekcijskih kontrola** te **registrovanih proizvoda** na tržištu Bosne i Hercegovine. Sistem je namijenjen inspekcijskim tijelima kako bi se centralizovano vodile informacije o proizvodima, inspekcijskim tijelima i rezultatima kontrola.

## Cilj
Cilj je omogućiti:
- vođenje evidencije o proizvodima i inspekcijskim tijelima,
- vođenje evidencije inspekcijskih kontrola (sa rezultatima i ocjenom sigurnosti proizvoda),
- generisanje statičkih izvještaja za pregled kontrola po parametrima i uvid u detalje pojedinačne kontrole.

## Funkcionalnosti

### 1) Proizvodi — evidencija (unos/izmjena/brisanje)
Sistem omogućava vođenje evidencije proizvoljnog broja proizvoda. Za svaki proizvod se unose:
- **Naziv proizvoda**
- **Proizvođač**
- **Serijski broj** 
- **Zemlja porijekla**
- **Opis** 

### 2) Inspekcijska tijela — evidencija
Sistem omogućava vođenje evidencije proizvoljnog broja inspekcijskih tijela. Za svako inspekcijsko tijelo se unose:
- **Naziv inspekcijskog tijela**
- **Inspektorat**: FBiH, RS, Distrikt Brčko
- **Nadležnost**: Tržišna inspekcija, Zdravstveno–sanitarna inspekcija
- **Kontakt osoba**

### 3) Inspekcijske kontrole — evidencija (unos/izmjena/brisanje)
Sistem omogućava evidenciju proizvoljnog broja inspekcijskih kontrola. Za svaku kontrolu se bilježi:
- **Datum inspekcijske kontrole**
- **Nadležno inspekcijsko tijelo** (odabir iz liste evidentiranih inspekcijskih tijela)
- **Kontrolisani proizvod** (odabir iz liste evidentiranih proizvoda)
- **Rezultati kontrole** (tekstualni opis)
- **Proizvod siguran** (True/False)

### 4) Izvještaj: pregled kontrola po inspekcijskom tijelu i periodu (statički izvještaj)
Sistem omogućava prikaz svih izvršenih inspekcijskih kontrola:
- za **izabrano inspekcijsko tijelo**
- za **izabrani vremenski period**
- **sortirano po datumu kontrole**

Ovaj zahtjev se realizira kao **statički izvještaj**, uz **parametarsku formu** koja omogućava odabir parametara prije pokretanja izvještaja.

### 5) Izvještaj: detalji izabrane inspekcijske kontrole (statički izvještaj)
Sistem omogućava pregled detalja jedne izabrane kontrole, uključujući:
- detalje kontrolisanog proizvoda (**serijski broj, naziv, zemlja porijekla**),
- **datum i vrijeme** kontrole,
- **rezultate kontrole**.

## Poslovna pravila i validacije
- **Nije dozvoljeno unijeti datum inspekcijske kontrole u budućnosti.**

## Napomene o dokumentaciji
Uz implementaciju, projekat sadrži i funkcionalni opis rješenja (tehničku dokumentaciju) sa dijagramima i/ili drugim materijalima korisnim za razumijevanje sistema (npr. opis entiteta, relacija, tokova izvještaja i sl.).
