package com.sisinspbih.services;

import com.sisinspbih.model.InspekcijskaKontrola;
import com.sisinspbih.model.InspekcijskoTijelo;
import com.sisinspbih.model.Proizvod;
import com.sisinspbih.repository.InspekcijskaKontrolaRepository;
import com.sisinspbih.repository.InspekcijskoTijeloRepository;
import com.sisinspbih.repository.ProizvodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InspekcijskaKontrolaService {

    private final InspekcijskaKontrolaRepository kontrolaRepository;
    private final InspekcijskoTijeloRepository tijeloRepository;
    private final ProizvodRepository proizvodRepository;

    @Autowired
    public InspekcijskaKontrolaService(InspekcijskaKontrolaRepository kontrolaRepository,
            InspekcijskoTijeloRepository tijeloRepository,
            ProizvodRepository proizvodRepository) {
        this.kontrolaRepository = kontrolaRepository;
        this.tijeloRepository = tijeloRepository;
        this.proizvodRepository = proizvodRepository;
    }

    public InspekcijskaKontrola kreirajKontrolu(InspekcijskaKontrola kontrola) {
        validirajKontrolu(kontrola);
        popuniVeze(kontrola);
        return kontrolaRepository.save(kontrola);
    }

    public List<InspekcijskaKontrola> kreirajViseKontrola(List<InspekcijskaKontrola> kontrole) {
        for (InspekcijskaKontrola kontrola : kontrole) {
            validirajKontrolu(kontrola);
            popuniVeze(kontrola);
        }
        return kontrolaRepository.saveAll(kontrole);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiSveKontrole() {
        return kontrolaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<InspekcijskaKontrola> dohvatiKontroluPoId(Long id) {
        return kontrolaRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaDatum(LocalDate datum) {
        return kontrolaRepository.findByDatumInspekcijskeKontrole(datum);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaInspekcijskoTijelo(Long tijeloId) {
        InspekcijskoTijelo tijelo = tijeloRepository.findById(tijeloId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inspekcijsko tijelo sa ID-om " + tijeloId + " ne postoji!"));
        return kontrolaRepository.findByNadleznoInspekcijskoTijelo(tijelo);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaProizvod(Long proizvodId) {
        Proizvod proizvod = proizvodRepository.findById(proizvodId)
                .orElseThrow(() -> new IllegalArgumentException("Proizvod sa ID-om " + proizvodId + " ne postoji!"));
        return kontrolaRepository.findByKontrolisaniProizvod(proizvod);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontrolePoSigurnosti(Boolean siguran) {
        return kontrolaRepository.findByProizvodSiguran(siguran);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaPeriod(LocalDate startDatum, LocalDate endDatum) {
        if (startDatum.isAfter(endDatum)) {
            throw new IllegalArgumentException("Početni datum ne može biti poslije krajnjeg datuma!");
        }
        return kontrolaRepository.findByDatumInspekcijskeKontroleBetween(startDatum, endDatum);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleOdDatuma(LocalDate datum) {
        return kontrolaRepository.findKontroleOdDatuma(datum);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleDoDatuma(LocalDate datum) {
        return kontrolaRepository.findKontroleDoDatuma(datum);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiNesigurneProizvode() {
        return kontrolaRepository.findNesigurneProizvode();
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaTijeloPoSigurnosti(Long tijeloId, Boolean siguran) {
        InspekcijskoTijelo tijelo = tijeloRepository.findById(tijeloId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inspekcijsko tijelo sa ID-om " + tijeloId + " ne postoji!"));
        return kontrolaRepository.findByNadleznoInspekcijskoTijeloAndProizvodSiguran(tijelo, siguran);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleZaProizvodPoSigurnosti(Long proizvodId, Boolean siguran) {
        Proizvod proizvod = proizvodRepository.findById(proizvodId)
                .orElseThrow(() -> new IllegalArgumentException("Proizvod sa ID-om " + proizvodId + " ne postoji!"));
        return kontrolaRepository.findByKontrolisaniProizvodAndProizvodSiguran(proizvod, siguran);
    }

    public InspekcijskaKontrola azurirajKontrolu(Long id, InspekcijskaKontrola azuriranaKontrola) {
        InspekcijskaKontrola postojecaKontrola = kontrolaRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("Inspekcijska kontrola sa ID-om " + id + " ne postoji!"));

        if (azuriranaKontrola.getDatumInspekcijskeKontrole() != null) {
            postojecaKontrola.setDatumInspekcijskeKontrole(azuriranaKontrola.getDatumInspekcijskeKontrole());
        }
        if (azuriranaKontrola.getNadleznoInspekcijskoTijelo() != null) {
            postojecaKontrola.setNadleznoInspekcijskoTijelo(azuriranaKontrola.getNadleznoInspekcijskoTijelo());
        }
        if (azuriranaKontrola.getKontrolisaniProizvod() != null) {
            postojecaKontrola.setKontrolisaniProizvod(azuriranaKontrola.getKontrolisaniProizvod());
        }
        if (azuriranaKontrola.getRezultatiKontrole() != null) {
            postojecaKontrola.setRezultatiKontrole(azuriranaKontrola.getRezultatiKontrole());
        }
        if (azuriranaKontrola.getProizvodSiguran() != null) {
            postojecaKontrola.setProizvodSiguran(azuriranaKontrola.getProizvodSiguran());
        }

        return kontrolaRepository.save(postojecaKontrola);
    }

    public void obrisiKontrolu(Long id) {
        if (!kontrolaRepository.existsById(id)) {
            throw new IllegalArgumentException("Inspekcijska kontrola sa ID-om " + id + " ne postoji!");
        }
        kontrolaRepository.deleteById(id);
    }

    public void obrisiSveKontrole() {
        kontrolaRepository.deleteAll();
    }

    @Transactional(readOnly = true)
    public long prebrojiSveKontrole() {
        return kontrolaRepository.count();
    }

    @Transactional(readOnly = true)
    public Long prebrojiKontrolePoSigurnosti(Boolean siguran) {
        return kontrolaRepository.countByProizvodSiguran(siguran);
    }

    @Transactional(readOnly = true)
    public Long prebrojiKontroleZaTijelo(Long tijeloId) {
        InspekcijskoTijelo tijelo = tijeloRepository.findById(tijeloId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inspekcijsko tijelo sa ID-om " + tijeloId + " ne postoji!"));
        return kontrolaRepository.countByNadleznoInspekcijskoTijelo(tijelo);
    }

    @Transactional(readOnly = true)
    public Long prebrojiKontroleZaProizvod(Long proizvodId) {
        Proizvod proizvod = proizvodRepository.findById(proizvodId)
                .orElseThrow(() -> new IllegalArgumentException("Proizvod sa ID-om " + proizvodId + " ne postoji!"));
        return kontrolaRepository.countByKontrolisaniProizvod(proizvod);
    }

    @Transactional(readOnly = true)
    public Long prebrojiKontroleZaDatum(LocalDate datum) {
        return kontrolaRepository.countByDatum(datum);
    }

    @Transactional(readOnly = true)
    public List<InspekcijskaKontrola> dohvatiKontroleSortiranePoNajnovijem() {
        return kontrolaRepository.findAllByOrderByDatumInspekcijskeKontroleDesc();
    }

    private void validirajKontrolu(InspekcijskaKontrola kontrola) {
        if (kontrola.getDatumInspekcijskeKontrole() == null) {
            throw new IllegalArgumentException("Datum inspekcijske kontrole je obavezan!");
        }
        if (kontrola.getNadleznoInspekcijskoTijelo() == null) {
            throw new IllegalArgumentException("Nadležno inspekcijsko tijelo je obavezno!");
        }
        if (kontrola.getKontrolisaniProizvod() == null) {
            throw new IllegalArgumentException("Kontrolisani proizvod je obavezan!");
        }
        if (kontrola.getProizvodSiguran() == null) {
            throw new IllegalArgumentException("Status sigurnosti proizvoda je obavezan!");
        }
    }

    private void popuniVeze(InspekcijskaKontrola kontrola) {
        if (kontrola.getNadleznoInspekcijskoTijelo() != null
                && kontrola.getNadleznoInspekcijskoTijelo().getId() != null) {
            InspekcijskoTijelo tijelo = tijeloRepository.findById(kontrola.getNadleznoInspekcijskoTijelo().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Inspekcijsko tijelo sa ID-om " +
                            kontrola.getNadleznoInspekcijskoTijelo().getId() + " ne postoji!"));
            kontrola.setNadleznoInspekcijskoTijelo(tijelo);
        }

        if (kontrola.getKontrolisaniProizvod() != null && kontrola.getKontrolisaniProizvod().getId() != null) {
            Proizvod proizvod = proizvodRepository.findById(kontrola.getKontrolisaniProizvod().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Proizvod sa ID-om " +
                            kontrola.getKontrolisaniProizvod().getId() + " ne postoji!"));
            kontrola.setKontrolisaniProizvod(proizvod);
        }
    }
}