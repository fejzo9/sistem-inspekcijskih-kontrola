package com.sisinspbih.controllers;

import com.sisinspbih.model.InspekcijskoTijelo;
import com.sisinspbih.model.Inspektorat;
import com.sisinspbih.model.Nadleznosti;
import com.sisinspbih.services.InspekcijskoTijeloService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/inspekcijska-tijela")
@CrossOrigin(origins = "*")
public class InspekcijskoTijeloController {

    private final InspekcijskoTijeloService service;

    @Autowired
    public InspekcijskoTijeloController(InspekcijskoTijeloService service) {
        this.service = service;
    }

    /**
     * CREATE - Kreiraj novo inspekcijsko tijelo
     * POST /inspekcijska-tijela
     */
    @PostMapping
    public ResponseEntity<?> kreirajTijelo(@Valid @RequestBody InspekcijskoTijelo tijelo) {
        try {
            InspekcijskoTijelo novoTijelo = service.kreirajInspekcijskoTijelo(tijelo);
            return new ResponseEntity<>(novoTijelo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * CREATE - Kreiraj više tijela odjednom
     * POST /inspekcijska-tijela/vise
     */
    @PostMapping("/vise")
    public ResponseEntity<?> kreirajViseTijela(@Valid @RequestBody List<InspekcijskoTijelo> tijela) {
        try {
            List<InspekcijskoTijelo> novaTijela = service.kreirajViseInspekcijskihTijela(tijela);
            return new ResponseEntity<>(novaTijela, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * READ - Dohvati sva inspekcijska tijela
     * GET /inspekcijska-tijela
     */
    @GetMapping
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiSvaTijela() {
        List<InspekcijskoTijelo> tijela = service.dohvatiSvaTijela();
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Dohvati tijelo po ID-u
     * GET /inspekcijska-tijela/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<InspekcijskoTijelo> dohvatiTijeloPoId(@PathVariable Long id) {
        Optional<InspekcijskoTijelo> tijelo = service.dohvatiTijeloPoId(id);
        return tijelo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati tijelo po nazivu
     * GET /inspekcijska-tijela/naziv/{naziv}
     */
    @GetMapping("/naziv/{naziv}")
    public ResponseEntity<InspekcijskoTijelo> dohvatiTijeloPoNazivu(@PathVariable String naziv) {
        Optional<InspekcijskoTijelo> tijelo = service.dohvatiTijeloPoNazivu(naziv);
        return tijelo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati tijela po inspektoratu
     * GET /inspekcijska-tijela/inspektorat/{inspektorat}
     */
    @GetMapping("/inspektorat/{inspektorat}")
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiTijelaPoInspektoratu(
            @PathVariable Inspektorat inspektorat) {
        List<InspekcijskoTijelo> tijela = service.dohvatiTijelaPoInspektoratu(inspektorat);
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Dohvati tijela po nadležnosti
     * GET /inspekcijska-tijela/nadleznost/{nadleznost}
     */
    @GetMapping("/nadleznost/{nadleznost}")
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiTijelaPoNadleznosti(
            @PathVariable Nadleznosti nadleznost) {
        List<InspekcijskoTijelo> tijela = service.dohvatiTijelaPoNadleznosti(nadleznost);
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Dohvati tijela po inspektoratu i nadležnosti
     * GET /inspekcijska-tijela/filter?inspektorat=...&nadleznost=...
     */
    @GetMapping("/filter")
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiTijelaPoFilteru(
            @RequestParam Inspektorat inspektorat,
            @RequestParam Nadleznosti nadleznost) {
        List<InspekcijskoTijelo> tijela = service.dohvatiTijelaPoInspektoratuINadleznosti(
                inspektorat, nadleznost);
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Pretraži tijela po nazivu
     * GET /inspekcijska-tijela/pretraga?naziv=...
     */
    @GetMapping("/pretraga")
    public ResponseEntity<List<InspekcijskoTijelo>> pretraziPoNazivu(@RequestParam String naziv) {
        List<InspekcijskoTijelo> tijela = service.pretraziPoNazivu(naziv);
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Dohvati tijelo po email adresi kontakt osobe
     * GET /inspekcijska-tijela/kontakt/email/{email}
     */
    @GetMapping("/kontakt/email/{email}")
    public ResponseEntity<InspekcijskoTijelo> dohvatiTijeloPoKontaktEmailu(@PathVariable String email) {
        Optional<InspekcijskoTijelo> tijelo = service.dohvatiTijeloPoKontaktEmailu(email);
        return tijelo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati tijelo po telefonu kontakt osobe
     * GET /inspekcijska-tijela/kontakt/telefon/{telefon}
     */
    @GetMapping("/kontakt/telefon/{telefon}")
    public ResponseEntity<InspekcijskoTijelo> dohvatiTijeloPoKontaktTelefonu(@PathVariable String telefon) {
        Optional<InspekcijskoTijelo> tijelo = service.dohvatiTijeloPoKontaktTelefonu(telefon);
        return tijelo.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * READ - Dohvati tijela po kontakt osobi
     * GET /inspekcijska-tijela/kontakt/osoba?ime=...&prezime=...
     */
    @GetMapping("/kontakt/osoba")
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiTijelaPoKontaktOsobi(
            @RequestParam String ime,
            @RequestParam String prezime) {
        List<InspekcijskoTijelo> tijela = service.dohvatiTijelaPoKontaktOsobi(ime, prezime);
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * READ - Dohvati sva tijela sortirana po nazivu
     * GET /inspekcijska-tijela/sortirano
     */
    @GetMapping("/sortirano")
    public ResponseEntity<List<InspekcijskoTijelo>> dohvatiSvaTijelaSortirana() {
        List<InspekcijskoTijelo> tijela = service.dohvatiSvaTijelaSortirana();
        return new ResponseEntity<>(tijela, HttpStatus.OK);
    }

    /**
     * UPDATE - Ažuriraj tijelo
     * PUT /inspekcijska-tijela/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> azurirajTijelo(
            @PathVariable Long id,
            @Valid @RequestBody InspekcijskoTijelo tijelo) {
        try {
            InspekcijskoTijelo azuriranoTijelo = service.azurirajTijelo(id, tijelo);
            return new ResponseEntity<>(azuriranoTijelo, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * DELETE - Obriši tijelo po ID-u
     * DELETE /inspekcijska-tijela/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> obrisiTijelo(@PathVariable Long id) {
        try {
            service.obrisiTijelo(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * DELETE - Obriši sva tijela
     * DELETE /inspekcijska-tijela
     */
    @DeleteMapping
    public ResponseEntity<HttpStatus> obrisiSvaTijela() {
        service.obrisiSvaTijela();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * STATISTIKA - Prebroji sva tijela
     * GET /inspekcijska-tijela/statistika/ukupno
     */
    @GetMapping("/statistika/ukupno")
    public ResponseEntity<Long> prebrojiSvaTijela() {
        long broj = service.prebrojiSvaTijela();
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }

    /**
     * STATISTIKA - Prebroji tijela po inspektoratu
     * GET /inspekcijska-tijela/statistika/inspektorat/{inspektorat}
     */
    @GetMapping("/statistika/inspektorat/{inspektorat}")
    public ResponseEntity<Long> prebrojiTijelaPoInspektoratu(@PathVariable Inspektorat inspektorat) {
        Long broj = service.prebrojiTijelaPoInspektoratu(inspektorat);
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }

    /**
     * STATISTIKA - Prebroji tijela po nadležnosti
     * GET /inspekcijska-tijela/statistika/nadleznost/{nadleznost}
     */
    @GetMapping("/statistika/nadleznost/{nadleznost}")
    public ResponseEntity<Long> prebrojiTijelaPoNadleznosti(@PathVariable Nadleznosti nadleznost) {
        Long broj = service.prebrojiTijelaPoNadleznosti(nadleznost);
        return new ResponseEntity<>(broj, HttpStatus.OK);
    }

    /**
     * Dohvati sve inspektorate
     * GET /inspekcijska-tijela/inspektorati
     */
    @GetMapping("/inspektorati")
    public ResponseEntity<Inspektorat[]> dohvatiSveInspektorate() {
        return new ResponseEntity<>(Inspektorat.values(), HttpStatus.OK);
    }

    /**
     * Dohvati sve nadležnosti
     * GET /inspekcijska-tijela/nadleznosti
     */
    @GetMapping("/nadleznosti")
    public ResponseEntity<Nadleznosti[]> dohvatiSveNadleznosti() {
        return new ResponseEntity<>(Nadleznosti.values(), HttpStatus.OK);
    }
}
