package com.sisinspbih.controllers;

import com.sisinspbih.model.Proizvod;
import com.sisinspbih.model.Drzava;
import com.sisinspbih.services.ProizvodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/proizvodi")
@CrossOrigin(origins = "*")
public class ProizvodController {

    private final ProizvodService proizvodService;

    @Autowired
    public ProizvodController(ProizvodService proizvodService) {
        this.proizvodService = proizvodService;
    }

    /**
     * CREATE - Kreiraj novi proizvod
     * POST /proizvodi
     */
    @PostMapping
    public ResponseEntity<Proizvod> kreirajProizvod(@RequestBody Proizvod proizvod) {
        try {
            Proizvod noviProizvod = proizvodService.kreirajProizvod(proizvod);
            return new ResponseEntity<>(noviProizvod, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * CREATE - Kreiraj više proizvoda odjednom
     * POST /proizvodi/vise
     */
    @PostMapping("/vise")
    public ResponseEntity<List<Proizvod>> kreirajViseProizvoda(@RequestBody List<Proizvod> proizvodi) {
        try {
            List<Proizvod> noviProizvodi = proizvodService.kreirajViseProizvoda(proizvodi);
            return new ResponseEntity<>(noviProizvodi, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * READ - Dohvati sve proizvode
     * GET /proizvodi
     */
    @GetMapping
    public ResponseEntity<List<Proizvod>> dohvatiSveProizvode() {
        List<Proizvod> proizvodi = proizvodService.dohvatiSveProizvode();
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * READ - Dohvati proizvod po ID-u
     * GET /proizvodi/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Proizvod> dohvatiProizvodPoId(@PathVariable Long id) {
        Optional<Proizvod> proizvod = proizvodService.dohvatiProizvodPoId(id);
        return proizvod.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati proizvod po serijskom broju
     * GET /proizvodi/serijski/{serijskiBroj}
     */
    @GetMapping("/serijski/{serijskiBroj}")
    public ResponseEntity<Proizvod> dohvatiProizvodPoSerijskomBroju(@PathVariable String serijskiBroj) {
        Optional<Proizvod> proizvod = proizvodService.dohvatiProizvodPoSerijskomBroju(serijskiBroj);
        return proizvod.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati proizvode po proizvođaču
     * GET /proizvodi/proizvodjac/{proizvodjac}
     */
    @GetMapping("/proizvodjac/{proizvodjac}")
    public ResponseEntity<List<Proizvod>> dohvatiProizvodePoProizvodjacu(@PathVariable String proizvodjac) {
        List<Proizvod> proizvodi = proizvodService.dohvatiProizvodePoProizvodjacu(proizvodjac);
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * READ - Dohvati proizvode iz određene države
     * GET /proizvodi/drzava/{drzava}
     */
    @GetMapping("/drzava/{drzava}")
    public ResponseEntity<List<Proizvod>> dohvatiProizvodeIzDrzave(@PathVariable Drzava drzava) {
        List<Proizvod> proizvodi = proizvodService.dohvatiProizvodeIzDrzave(drzava);
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * READ - Pretraži proizvode po nazivu
     * GET /proizvodi/pretraga/naziv?naziv=...
     */
    @GetMapping("/pretraga/naziv")
    public ResponseEntity<List<Proizvod>> pretraziPoNazivu(@RequestParam String naziv) {
        List<Proizvod> proizvodi = proizvodService.pretraziPoNazivu(naziv);
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * READ - Pretraži proizvode po proizvođaču
     * GET /proizvodi/pretraga/proizvodjac?proizvodjac=...
     */
    @GetMapping("/pretraga/proizvodjac")
    public ResponseEntity<List<Proizvod>> pretraziPoProizvodjacu(@RequestParam String proizvodjac) {
        List<Proizvod> proizvodi = proizvodService.pretraziPoProizvodjacu(proizvodjac);
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * READ - Dohvati sve proizvode sortirane po nazivu
     * GET /proizvodi/sortirano
     */
    @GetMapping("/sortirano")
    public ResponseEntity<List<Proizvod>> dohvatiSveProizvodeSortirane() {
        List<Proizvod> proizvodi = proizvodService.dohvatiSveProizvodeSortirane();
        return new ResponseEntity<>(proizvodi, HttpStatus.OK);
    }

    /**
     * UPDATE - Ažuriraj proizvod
     * PUT /proizvodi/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Proizvod> azurirajProizvod(@PathVariable Long id, @RequestBody Proizvod proizvod) {
        try {
            Proizvod azuriraniProizvod = proizvodService.azurirajProizvod(id, proizvod);
            return new ResponseEntity<>(azuriraniProizvod, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    /**
     * DELETE - Obriši proizvod po ID-u
     * DELETE /proizvodi/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> obrisiProizvod(@PathVariable Long id) {
        try {
            proizvodService.obrisiProizvod(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * DELETE - Obriši sve proizvode
     * DELETE /proizvodi
     */
    @DeleteMapping
    public ResponseEntity<HttpStatus> obrisiSveProizvode() {
        proizvodService.obrisiSveProizvode();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Statistika - Prebroji proizvode
     * GET /proizvodi/statistika/ukupno
     */
    @GetMapping("/statistika/ukupno")
    public ResponseEntity<Long> prebrojiProizvode() {
        long brojProizvoda = proizvodService.prebrojiProizvode();
        return new ResponseEntity<>(brojProizvoda, HttpStatus.OK);
    }

    /**
     * Statistika - Prebroji proizvode po proizvođaču
     * GET /proizvodi/statistika/proizvodjac/{proizvodjac}
     */
    @GetMapping("/statistika/proizvodjac/{proizvodjac}")
    public ResponseEntity<Long> prebrojiProizvodePoProizvodjacu(@PathVariable String proizvodjac) {
        Long brojProizvoda = proizvodService.prebrojiProizvodePoProizvodjacu(proizvodjac);
        return new ResponseEntity<>(brojProizvoda, HttpStatus.OK);
    }

    /**
     * Dohvati sve dostupne države
     * GET /proizvodi/drzave
     */
    @GetMapping("/drzave")
    public ResponseEntity<Drzava[]> dohvatiSveDrzave() {
        return new ResponseEntity<>(Drzava.values(), HttpStatus.OK);
    }
}
