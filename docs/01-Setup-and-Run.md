# Sistem Inspekcijskih Kontrola - Setup i Pokretanje

Ovaj dokument opisuje kako postaviti i pokrenuti projekat "Sistem Inspekcijskih Kontrola".

---

## 📋 Preduslovi

Prije pokretanja projekta, osigurajte da imate instalirano sljedeće:

- **Java JDK** : 21+ , Koristite OpenJDK ili Oracle JDK 
- **Node.js** : 18+ , Preporučena LTS verzija 
- **npm** : 9+ , Dolazi uz Node.js 
- **PostgreSQL** : 14+ , Baza podataka 
- **Git** : 2.x , Za kloniranje projekta 

### Provjera verzija

```bash
# Java
java -version

# Node.js
node -v

# npm
npm -v

# PostgreSQL
psql --version
```

---

## Konfiguracija Baze Podataka

### 1. Kreiranje baze

Povežite se na PostgreSQL i kreirajte bazu:

```sql
CREATE DATABASE `kontrola_db`;
```

### 2. Podešavanje kredencijala

Backend koristi sljedeće default postavke za konekciju:

|   Parametar  |   Vrijednost  |
|--------------|---------------|
| **Host**     | `localhost`   |
| **Port**     | `5432`        |
| **Database** | `kontrola_db` |
| **Username** | `postgres`    |
| **Password** | `postgres`    |

---

## ⚙️ Konfiguracija

### Backend (`application.properties`)

Lokacija: `backend/src/main/resources/application.properties`

```properties
# Konekcija na bazu
spring.datasource.url=jdbc:postgresql://localhost:5432/kontrola_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

```

### Frontend

Frontend koristi Vite i po defaultu se povezuje na backend putem `axios`. API URL se može konfigurirati u servis fajlovima unutar `frontend/src/services/`.

---

## 🚀 Pokretanje Projekta

### Backend

```bash
# Pozicionirajte se u backend folder
cd backend

# Pokrenite aplikaciju (Gradle)
./gradlew bootRun

# Na Windows-u koristite:
gradlew.bat bootRun
```

Backend će se pokrenuti na: **http://localhost:8080**

### Frontend

```bash
# Pozicionirajte se u frontend folder
cd frontend

# Instalirajte dependencije (samo prvi put)
npm install

# Pokrenite development server
npm run dev
```

Frontend će se pokrenuti na: **http://localhost:5173**

---

## 🔌 Default Portovi

|          Servis           | Port |          URL          |
|---------------------------|------|-----------------------|
| **Backend (Spring Boot)** | 8080 | http://localhost:8080 |
|     **Frontend (Vite)**   | 5173 | http://localhost:5173 |
|       **PostgreSQL**      | 5432 |     localhost:5432    |

---

## 🔗 Primjer Konekcije na Bazu

### JDBC Connection String

```
jdbc:postgresql://localhost:5432/kontrola_db
```

### Testiranje konekcije (psql)

```bash
psql -h localhost -p 5432 -U postgres -d kontrola_db
```

### Primjer iz aplikacije

```java
// Spring Boot automatski konfiguriše konekciju na osnovu application.properties
@Autowired
private JdbcTemplate jdbcTemplate;
```

---

## 📁 Struktura Projekta

```
sistem-inspekcijskih-kontrola/
├── backend/                   # Spring Boot 
│   ├── src/main/java/         # Java source kod
│   ├── src/main/resources/    # Konfiguracija (application.properties)
│   └── build.gradle           # Gradle dependencies
├── frontend/                  # React aplikacija
│   ├── src/                   # React komponente i stranice
│   ├── package.json           # NPM dependencies
│   └── vite.config.ts         # Vite konfiguracija
└── docs/                      # Dokumentacija
```

---

## 🛠️ Korisne Komande

### Backend

```bash
# Build projekta
./gradlew build

# Pokretanje testova
./gradlew test

# Čišćenje build foldera
./gradlew clean
```

### Frontend

```bash
# Pokretanje dev servera
npm run dev

# Build za produkciju
npm run build

# Linting
npm run lint

# Preview production build-a
npm run preview
```

---

## ❗ Rješavanje Problema

### Backend se ne pokreće

1. Provjerite da li PostgreSQL radi
2. Provjerite kredencijale u `application.properties`
3. Provjerite da li je baza `kontrola_db` kreirana

### Frontend ne može komunicirati s backend-om

1. Provjerite da li backend radi na portu 8080
2. Provjerite CORS konfiguraciju na backendu
3. Provjerite API URL u frontend servisima

### Port je već zauzet

```bash
# Linux/Mac - pronađite proces na portu
lsof -i :8080
lsof -i :5173

# Ugasite proces
kill -9 <PID>
```

---

## 📞 Dodatne Informacije

Za više informacija o projektu, pogledajte README.md u root folderu projekta.
