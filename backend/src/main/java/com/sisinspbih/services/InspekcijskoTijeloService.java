package com.sisinspbih.services;

import com.sisinspbih.model.InspekcijskoTijelo;
import com.sisinspbih.model.Inspektorat;
import com.sisinspbih.model.Nadleznosti;
import com.sisinspbih.repository.InspekcijskoTijeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InspekcijskoTijeloService {

    private final InspekcijskoTijeloRepository repository;

    @Autowired
    public InspekcijskoTijeloService(InspekcijskoTijeloRepository repository) {
        this.repository = repository;
    }

    public InspekcijskoTijelo kreirajInspekcijskoTijelo(InspekcijskoTijelo tijelo) {

        if (tijelo.getNazivInspekcijskogTijela() == null || tijelo.getNazivInspekcijskogTijela().trim().isEmpty()) {
            throw new IllegalArgumentException("Naziv inspekcijskog tijela je obavezan!");
        }

        if (tijelo.getInspektorat() == null) {
            throw new IllegalArgumentException("Inspektorat je obavezan!");
        }

        if (tijelo.getNadleznosti() == null) {
            throw new IllegalArgumentException("Nadležnost je obavezna!");
        }

        if (tijelo.getKontaktOsoba() == null) {
            throw new IllegalArgumentException("Kontakt osoba je obavezna!");
        }

        // Provjeri da li već postoji tijelo sa istim nazivom
        if (repository.existsByNazivInspekcijskogTijela(tijelo.getNazivInspekcijskogTijela())) {
            throw new IllegalArgumentException(
                    "Inspekcijsko tijelo sa nazivom '" + tijelo.getNazivInspekcijskogTijela() + "' već postoji!");
        }

        return repository.save(tijelo);
    }

    public List<InspekcijskoTijelo> kreirajViseInspekcijskihTijela(List<InspekcijskoTijelo> tijela) {
        for (InspekcijskoTijelo tijelo : tijela) {
            if (tijelo.getNazivInspekcijskogTijela() == null || tijelo.getNazivInspekcijskogTijela().trim().isEmpty()) {
                throw new IllegalArgumentException("Sva inspekcijska tijela moraju imati naziv!");
            }
            if (tijelo.getInspektorat() == null) {
                throw new IllegalArgumentException("Sva inspekcijska tijela moraju imati inspektorat!");
            }
            if (tijelo.getNadleznosti() == null) {
                throw new IllegalArgumentException("Sva inspekcijska tijela moraju imati nadležnost!");
            }
            if (tijelo.getKontaktOsoba() == null) {
                throw new IllegalArgumentException("Sva inspekcijska tijela moraju imati kontakt osobu!");
            }
        }
        return repository.saveAll(tijela);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiSvaTijela() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<InspekcijskoTijelo> dohvatiTijeloPoId(Long id) {
        return repository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<InspekcijskoTijelo> dohvatiTijeloPoNazivu(String naziv) {
        return repository.findByNazivInspekcijskogTijela(naziv);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiTijelaPoInspektoratu(Inspektorat inspektorat) {
        return repository.findByInspektorat(inspektorat);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiTijelaPoNadleznosti(Nadleznosti nadleznosti) {
        return repository.findByNadleznosti(nadleznosti);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiTijelaPoInspektoratuINadleznosti(
            Inspektorat inspektorat, Nadleznosti nadleznosti) {
        return repository.findByInspektoratAndNadleznosti(inspektorat, nadleznosti);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> pretraziPoNazivu(String naziv) {
        return repository.findByNazivInspekcijskogTijelaContainingIgnoreCase(naziv);
    }

    @Transactional(readOnly = true)
    public Optional<InspekcijskoTijelo> dohvatiTijeloPoKontaktEmailu(String email) {
        return repository.findByKontaktEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<InspekcijskoTijelo> dohvatiTijeloPoKontaktTelefonu(String telefon) {
        return repository.findByKontaktTelefon(telefon);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiTijelaPoKontaktOsobi(String ime, String prezime) {
        return repository.findByKontaktOsoba(ime, prezime);
    }

    public InspekcijskoTijelo azurirajTijelo(Long id, InspekcijskoTijelo azuriranoTijelo) {
        InspekcijskoTijelo postojeceTijelo = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inspekcijsko tijelo sa ID-om " + id + " ne postoji!"));

        // Ažuriramo polja
        if (azuriranoTijelo.getNazivInspekcijskogTijela() != null &&
                !azuriranoTijelo.getNazivInspekcijskogTijela().trim().isEmpty()) {
            postojeceTijelo.setNazivInspekcijskogTijela(azuriranoTijelo.getNazivInspekcijskogTijela());
        }

        if (azuriranoTijelo.getInspektorat() != null) {
            postojeceTijelo.setInspektorat(azuriranoTijelo.getInspektorat());
        }

        if (azuriranoTijelo.getNadleznosti() != null) {
            postojeceTijelo.setNadleznosti(azuriranoTijelo.getNadleznosti());
        }

        if (azuriranoTijelo.getKontaktOsoba() != null) {
            postojeceTijelo.setKontaktOsoba(azuriranoTijelo.getKontaktOsoba());
        }

        return repository.save(postojeceTijelo);
    }

    public void obrisiTijelo(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Inspekcijsko tijelo sa ID-om " + id + " ne postoji!");
        }
        repository.deleteById(id);
    }

    public void obrisiSvaTijela() {
        repository.deleteAll();
    }

    @Transactional(readOnly = true)
    public long prebrojiSvaTijela() {
        return repository.count();
    }

    @Transactional(readOnly = true)
    public Long prebrojiTijelaPoInspektoratu(Inspektorat inspektorat) {
        return repository.countByInspektorat(inspektorat);
    }

    @Transactional(readOnly = true)
    public Long prebrojiTijelaPoNadleznosti(Nadleznosti nadleznosti) {
        return repository.countByNadleznosti(nadleznosti);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskoTijelo> dohvatiSvaTijelaSortirana() {
        return repository.findAllByOrderByNazivInspekcijskogTijelaAsc();
    }
}