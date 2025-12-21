# Sistem inspekcijskih kontrola (BiH) – Frontend

Ovo je frontend dio aplikacije za **evidenciju inspekcijskih kontrola** i **registrovanih proizvoda** na tržištu Bosne i Hercegovine.  
Frontend omogućava korisniku (inspekcijskom tijelu / operateru sistema) pregled i upravljanje proizvodima, inspekcijskim tijelima i inspekcijskim kontrolama, kao i pristup izvještajima.

## Preduslovi
- Node.js (v18+)
- NPM

## Podešavanje
1. Instaliraj zavisnosti:
   ```bash
   npm install
    ```

## Pokretanje aplikacije
Pokreni razvojni server:
```bash
npm run dev
```
Aplikacija će biti dostupna na: `http://localhost:5173`.

## Features
- **Modern UI**: Styled with Tailwind CSS.
- **Authentication**: Login and Register pages integrated with the backend.
- **Protected Routes**: Dashboard accessible only after login.

## Funkcionalnosti (pregled)

- **Proizvodi**: unos, izmjena, brisanje i pregled liste proizvoda

- **Inspekcijska tijela**: unos, izmjena, brisanje i pregled liste inspekcijskih tijela

- **Inspekcijske kontrole**: unos, izmjena, brisanje i pregled kontrola

## Izvještaji:

- pregled kontrola po izabranom inspekcijskom tijelu i vremenskom periodu (sortirano po datumu)

- detalji izabrane inspekcijske kontrole (proizvod + datum/vrijeme + rezultati)

## Česti problemi

- Ako frontend ne može pozvati backend:

    - provjeri da backend radi na http://localhost:8080
    - provjeri CORS podešavanja na backendu
    - provjeri da API URL u frontendu pokazuje na tačnu adresu
