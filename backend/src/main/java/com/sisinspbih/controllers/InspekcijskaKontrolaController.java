package com.sisinspbih.controllers;

import com.sisinspbih.model.InspekcijskaKontrola;
import com.sisinspbih.services.InspekcijskaKontrolaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/inspekcijske-kontrole")
@CrossOrigin(origins = "*")
public class InspekcijskaKontrolaController {

    private final InspekcijskaKontrolaService service;

    @Autowired
    public InspekcijskaKontrolaController(InspekcijskaKontrolaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> kreirajKontrolu(@Valid @RequestBody InspekcijskaKontrola kontrola) {
        try {
            InspekcijskaKontrola novaKontrola = service.kreirajKontrolu(kontrola);
            return new ResponseEntity<>(novaKontrola, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/vise")
    public ResponseEntity<?> kreirajViseKontrola(@Valid @RequestBody List<InspekcijskaKontrola> kontrole) {
        try {
            List<InspekcijskaKontrola> noveKontrole = service.kreirajViseKontrola(kontrole);
            return new ResponseEntity<>(noveKontrole, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiSveKontrole() {
        List<InspekcijskaKontrola> kontrole = service.dohvatiSveKontrole();
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InspekcijskaKontrola> dohvatiKontroluPoId(@PathVariable Long id) {
        Optional<InspekcijskaKontrola> kontrola = service.dohvatiKontroluPoId(id);
        return kontrola.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/datum/{datum}")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiKontroleZaDatum(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaDatum(datum);
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/tijelo/{tijeloId}")
    public ResponseEntity<?> dohvatiKontroleZaTijelo(@PathVariable Long tijeloId) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaInspekcijskoTijelo(tijeloId);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/proizvod/{proizvodId}")
    public ResponseEntity<?> dohvatiKontroleZaProizvod(@PathVariable Long proizvodId) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaProizvod(proizvodId);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sigurnost/{siguran}")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiKontrolePoSigurnosti(@PathVariable Boolean siguran) {
        List<InspekcijskaKontrola> kontrole = service.dohvatiKontrolePoSigurnosti(siguran);
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/nesigurni")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiNesigurneProizvode() {
        List<InspekcijskaKontrola> kontrole = service.dohvatiNesigurneProizvode();
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/period")
    public ResponseEntity<?> dohvatiKontroleZaPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDatum,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDatum) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaPeriod(startDatum, endDatum);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/od-datuma/{datum}")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiKontroleOdDatuma(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleOdDatuma(datum);
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/do-datuma/{datum}")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiKontroleDoDatuma(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleDoDatuma(datum);
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/tijelo/{tijeloId}/sigurnost/{siguran}")
    public ResponseEntity<?> dohvatiKontroleZaTijeloPoSigurnosti(
            @PathVariable Long tijeloId,
            @PathVariable Boolean siguran) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaTijeloPoSigurnosti(tijeloId, siguran);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/proizvod/{proizvodId}/sigurnost/{siguran}")
    public ResponseEntity<?> dohvatiKontroleZaProizvodPoSigurnosti(
            @PathVariable Long proizvodId,
            @PathVariable Boolean siguran) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleZaProizvodPoSigurnosti(proizvodId, siguran);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sortirano")
    public ResponseEntity<List<InspekcijskaKontrola>> dohvatiKontroleSortiranePoNajnovijem() {
        List<InspekcijskaKontrola> kontrole = service.dohvatiKontroleSortiranePoNajnovijem();
        return new ResponseEntity<>(kontrole, HttpStatus.OK);
    }

    @GetMapping("/filter")
    public ResponseEntity<?> dohvatiKontrolePoFilterima(
            @RequestParam(required = false) Long tijeloId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDatum,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDatum,
            @RequestParam(required = false) Boolean siguran) {
        try {
            List<InspekcijskaKontrola> kontrole = service.dohvatiKontrolePoFilterima(
                    tijeloId, startDatum, endDatum, siguran);
            return new ResponseEntity<>(kontrole, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> azurirajKontrolu(
            @PathVariable Long id,
            @Valid @RequestBody InspekcijskaKontrola kontrola) {
        try {
            InspekcijskaKontrola azuriranaKontrola = service.azurirajKontrolu(id, kontrola);
            return new ResponseEntity<>(azuriranaKontrola, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> obrisiKontrolu(@PathVariable Long id) {
        try {
            service.obrisiKontrolu(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<HttpStatus> obrisiSveKontrole() {
        service.obrisiSveKontrole();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/statistika/ukupno")
    public ResponseEntity<Long> prebrojiSveKontrole() {
        long broj = service.prebrojiSveKontrole();
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }

    @GetMapping("/statistika/sigurnost/{siguran}")
    public ResponseEntity<Long> prebrojiKontrolePoSigurnosti(@PathVariable Boolean siguran) {
        Long broj = service.prebrojiKontrolePoSigurnosti(siguran);
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }

    @GetMapping("/statistika/tijelo/{tijeloId}")
    public ResponseEntity<?> prebrojiKontroleZaTijelo(@PathVariable Long tijeloId) {
        try {
            Long broj = service.prebrojiKontroleZaTijelo(tijeloId);
            return new ResponseEntity<>(broj, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/statistika/proizvod/{proizvodId}")
    public ResponseEntity<?> prebrojiKontroleZaProizvod(@PathVariable Long proizvodId) {
        try {
            Long broj = service.prebrojiKontroleZaProizvod(proizvodId);
            return new ResponseEntity<>(broj, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/statistika/datum/{datum}")
    public ResponseEntity<Long> prebrojiKontroleZaDatum(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate datum) {
        Long broj = service.prebrojiKontroleZaDatum(datum);
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }
}