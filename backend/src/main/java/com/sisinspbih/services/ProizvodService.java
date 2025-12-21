package com.sisinspbih.services;

import com.sisinspbih.model.Proizvod;
import com.sisinspbih.model.Drzava;
import com.sisinspbih.repository.ProizvodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProizvodService {

    private final ProizvodRepository proizvodRepository;

    @Autowired
    public ProizvodService(ProizvodRepository proizvodRepository) {
        this.proizvodRepository = proizvodRepository;
    }

    /**
     * Kreiraj novi proizvod
     */
    public Proizvod kreirajProizvod(Proizvod proizvod) {
        if (proizvod.getNazivProizvoda() == null || proizvod.getNazivProizvoda().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv proizvoda ne može biti prazan!");
        }
        if (proizvod.getProizvodjac() == null || proizvod.getProizvodjac().trim().isEmpty()) {
            throw new IllegalArgumentException("Proizvođač ne može biti prazan!");
        }
        if (proizvod.getDrzavaPorijekla() == null) {
            throw new IllegalArgumentException("Država porijekla mora biti navedena!");
        }

        return proizvodRepository.save(proizvod);
    }

    /**
     * Kreiraj više proizvoda odjednom
     */
    public List<Proizvod> kreirajViseProizvoda(List<Proizvod> proizvodi) {
        for (Proizvod p : proizvodi) {
            if (p.getNazivProizvoda() == null || p.getNazivProizvoda().trim().isEmpty()) {
                throw new IllegalArgumentException("Svi proizvodi moraju imati naziv!");
            }
            if (p.getProizvodjac() == null || p.getProizvodjac().trim().isEmpty()) {
                throw new IllegalArgumentException("Svi proizvodi moraju imati proizvođača!");
            }
            if (p.getDrzavaPorijekla() == null) {
                throw new IllegalArgumentException("Svi proizvodi moraju imati državu porijekla!");
            }
        }
        return proizvodRepository.saveAll(proizvodi);
    }

    /**
     * Dohvati sve proizvode
     */
    @Transactional(readOnly = true)
    public List<Proizvod> dohvatiSveProizvode() {
        return proizvodRepository.findAll();
    }

    /**
     * Dohvati proizvod po ID-u
     */
    @Transactional(readOnly = true)
    public Optional<Proizvod> dohvatiProizvodPoId(Long id) {
        return proizvodRepository.findById(id);
    }

    /**
     * Dohvati proizvod po serijskom broju
     */
    @Transactional(readOnly = true)
    public Optional<Proizvod> dohvatiProizvodPoSerijskomBroju(String serijskiBroj) {
        return proizvodRepository.findBySerijskiBroj(serijskiBroj);
    }

    /**
     * Dohvati proizvode po proizvođaču
     */
    @Transactional(readOnly = true)
    public List<Proizvod> dohvatiProizvodePoProizvodjacu(String proizvodjac) {
        return proizvodRepository.findByProizvodjac(proizvodjac);
    }

    /**
     * Dohvati proizvode po državi porijekla
     */
    @Transactional(readOnly = true)
    public List<Proizvod> dohvatiProizvodeIzDrzave(Drzava drzava) {
        return proizvodRepository.findByDrzavaPorijekla(drzava);
    }

    /**
     * Pretraži proizvode po nazivu (djelimično poklapanje)
     */
    @Transactional(readOnly = true)
    public List<Proizvod> pretraziPoNazivu(String naziv) {
        return proizvodRepository.findByNazivProizvodaContainingIgnoreCase(naziv);
    }

    /**
     * Pretraži proizvode po proizvođaču (djelimično poklapanje)
     */
    @Transactional(readOnly = true)
    public List<Proizvod> pretraziPoProizvodjacu(String proizvodjac) {
        return proizvodRepository.findByProizvodjacContainingIgnoreCase(proizvodjac);
    }

    /**
     * Ažuriraj postojeći proizvod
     */
    public Proizvod azurirajProizvod(Long id, Proizvod azuriraniProizvod) {
        Proizvod postojeciProizvod = proizvodRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Proizvod sa ID-om " + id + " ne postoji!"));

        if (azuriraniProizvod.getNazivProizvoda() != null && !azuriraniProizvod.getNazivProizvoda().trim().isEmpty()) {
            postojeciProizvod.setNazivProizvoda(azuriraniProizvod.getNazivProizvoda());
        }
        if (azuriraniProizvod.getProizvodjac() != null && !azuriraniProizvod.getProizvodjac().trim().isEmpty()) {
            postojeciProizvod.setProizvodjac(azuriraniProizvod.getProizvodjac());
        }
        if (azuriraniProizvod.getDrzavaPorijekla() != null) {
            postojeciProizvod.setDrzavaPorijekla(azuriraniProizvod.getDrzavaPorijekla());
        }
        if (azuriraniProizvod.getOpis() != null) {
            postojeciProizvod.setOpis(azuriraniProizvod.getOpis());
        }

        return proizvodRepository.save(postojeciProizvod);
    }

    /**
     * Obriši proizvod po ID-u
     */
    public void obrisiProizvod(Long id) {
        if (!proizvodRepository.existsById(id)) {
            throw new IllegalArgumentException("Proizvod sa ID-om " + id + " ne postoji!");
        }
        proizvodRepository.deleteById(id);
    }

    /**
     * Obriši sve proizvode
     */
    public void obrisiSveProizvode() {
        proizvodRepository.deleteAll();
    }

    /**
     * Prebroji ukupan broj proizvoda
     */
    @Transactional(readOnly = true)
    public long prebrojiProizvode() {
        return proizvodRepository.count();
    }

    /**
     * Prebroji proizvode od određenog proizvođača
     */
    @Transactional(readOnly = true)
    public Long prebrojiProizvodePoProizvodjacu(String proizvodjac) {
        return proizvodRepository.countByProizvodjac(proizvodjac);
    }

    /**
     * Dohvati sve proizvode sortirane po nazivu
     */
    @Transactional(readOnly = true)
    public List<Proizvod> dohvatiSveProizvodeSortirane() {
        return proizvodRepository.findAllByOrderByNazivProizvodaAsc();
    }
}
