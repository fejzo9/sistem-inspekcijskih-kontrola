# Sistem inspekcijskih kontrola (BiH) – Backend

Ovo je backend dio aplikacije za **evidenciju inspekcijskih kontrola** i **registrovanih proizvoda** na tržištu Bosne i Hercegovine.  
Backend pruža API za upravljanje proizvodima, inspekcijskim tijelima i inspekcijskim kontrolama, kao i za generisanje izvještaja.

## Preduslovi
- Java 17 ili novija
- PostgreSQL (npr. na portu 5432)
- Gradle (opcionalno – wrapper je uključen)

## Podešavanje
1. Provjeri da PostgreSQL radi i kreiraj bazu podataka (naziv prilagodi ako koristiš drugi):
   ```sql
   CREATE DATABASE inspections_db;
    ```
2.  Apdejtaj `src/main/resources/application.properties` sa svojim kredencijalima baze podataka (`postgres`/`postgres`).

## Pokretanje aplikacije
Da biste pokrenuli server:
```bash
./gradlew bootRun
```
Server će se pokrenuti na `http://localhost:8080`.

## Testiranje

Pokretanje testova:
```bash
./gradlew test
```

## Build (pakovanje aplikacije)

Kreiranje build-a:
```bash
./gradlew clean build
```
Nakon build-a, artefakt se obično nalazi u: build/libs/