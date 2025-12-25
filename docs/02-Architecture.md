# Sistem inspekcijskih kontrola – Arhitektura

Ovaj dokument daje kratak pregled arhitekture sistema i detaljnije objašnjava modul **Reports** (generisanje izvještaja #4 i #5).

---

## 1) Pregled arhitekture

### Tehnološki stack
- **Frontend:** React (Vite) + Axios (HTTP klijent)
- **Backend:** Java 21 + Spring Boot (REST API) 
- **Baza:** PostgreSQL (relaciona baza)
- **ORM:** JPA/Hibernate
- **Build:** Gradle (backend) / npm (frontend)

### Arhitektura (3-slojna arhitektura)
Sistem je klasična web aplikacija u 3 sloja:

1. **Presentation (React)**
   - UI: stranice, forme, tabele, filteri, grafici
   - Pozivi prema backendu kroz REST API
   
2. **Application/Business (Spring Boot)**
   - Kontroleri (REST) primaju zahtjeve
   - Servisi sadrže poslovnu logiku
   - Repozitoriji (JPA) rade upite prema bazi
   - DTO sloj: mapiranje entiteta u strukture pogodne za UI i izvještaje

3. **Data (PostgreSQL)**
   - Trajni podaci o inspekcijskim tijelima, nadležnostima, subjektima, kontrolama, mjerama itd.
   - Indeksi na poljima koja se često filtriraju (datumi, status, inspektorat, tip kontrole…)

### Tok podataka (request → response)
1. React šalje HTTP zahtjev (Axios) ka Spring Boot endpointu.
2. Spring Security validira JWT i autorizaciju (role/permissions).
3. Controller prosljeđuje zahtjev Service sloju.
4. Service poziva Repository sloj (JPA/SQL) i vrši agregacije / transformacije.
5. Service vraća DTO (JSON) ili binarni fajl (PDF/XLSX) nazad kroz Controller.
6. React renderuje rezultat (tabela, grafik, download fajla).

---

## 2) Struktura modula (backend)

Organizacija paketa:    

- `controller/`  
  REST endpointi: npr. `ProizvodController`

- `services/`  
  Poslovna logika: `ProizvodService`

- `repository/`  
  Upiti ka bazi: `ProizvodRepository`,

- `model/entity/`  
  JPA entiteti: `Proizvod`

- `security/`  
  WebSecurityConfig

---

## 3) Modul “Reports”

### Svrha
Modul **Reports** omogućava:
- filtriranje i prikaz filtriranih podataka (po periodu, inspektoratu, tijelu, nadležnosti, statusu…),
- prikaz rezultata u UI (tabele),
- izvoz u formatima (PDF za preuzimanje).

### Ulazi/izlazi (koncept)
- **Ulazi (filteri):**
  - period (`dateFrom`, `dateTo`)
  - inspektorat / entitet (FBiH / RS / BD)
  - inspekcijsko tijelo
  - nadležnost (TRŽIŠNA, ZDRAVSTVENO-SANITARNA…)
  - proizvod siguran (true/false)
- **Izlazi:**
  - filtrirani podaci (prikaz kontrola, detalji kontrole…)

---

## 4) Izvještaj #4 – Filtrirani pregled kontrola (po tijelu i periodu)

### Tipični sadržaj izvještaja #4
- Inspekcijsko tijelo (naziv)
- Period (od-do)
- Broj kontrola ukupno
- Broj sigurnih proizvoda
- Broj nesigurnih proizvoda
- Prikaz kontrola

### Kako se generiše (backend logika)
1. **Controller** primi filtere (query params ili body):
   - `dateFrom`, `dateTo`, `inspektorat`, `bodyId`, `nadleznost`, `status`
2. **Service** validira filtere (npr. `dateFrom <= dateTo`) i priprema upit.
3. **Repository** izvrši agregacijski upit:
   - GROUP BY `inspection_body_id` (i eventualno `inspektorat`)
   - COUNT(*) za kontrole
   - SUM/COUNT za nepravilnosti/mjere

---

## 5) Izvještaj #5 – Detalji inspekcijske kontrole

### Prikaz detalja kontrole
- Datum kontrole (yyyy-MM-dd)
- Detalji kontrolisanog proizvoda
- Naziv inspekcijskog tijela
- Status sigurnosti proizvoda
- Rezultati kontrole

### Kako React prikazuje izvještaj #5
- Filteri: period, proizvod, inspekcijsko tijelo, sigurnost proizvoda i rezultati kontrole

---

## 6) Kratki “flow” dijagram za Reports

1) **UI**: korisnik izabere filtere → klik “Generiši”
2) **Frontend**: `GET /api/reports/{4|5}?...`
3) **Backend**:
   - Auth (JWT) → autorizacija
   - Service priprema agregacijski upit
   - Repository vraća projekcije/agregate
   - Mapiranje u DTO
4) **UI**: render tabele i “Download” exporta


