package com.sisinspbih.repository;

import com.sisinspbih.model.InspekcijskoTijelo;
import com.sisinspbih.model.Inspektorat;
import com.sisinspbih.model.Nadleznosti;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InspekcijskoTijeloRepository extends JpaRepository<InspekcijskoTijelo, Long> {

    // Pronađi po nazivu
    Optional<InspekcijskoTijelo> findByNazivInspekcijskogTijela(String naziv);

    // Pronađi sva tijela po inspektoratu
    List<InspekcijskoTijelo> findByInspektorat(Inspektorat inspektorat);

    // Pronađi sva tijela po nadležnosti
    List<InspekcijskoTijelo> findByNadleznosti(Nadleznosti nadleznosti);

    // Pronađi tijela po inspektoratu i nadležnosti
    List<InspekcijskoTijelo> findByInspektoratAndNadleznosti(Inspektorat inspektorat, Nadleznosti nadleznosti);

    // Pretraži po nazivu (djelimično poklapanje, case insensitive)
    List<InspekcijskoTijelo> findByNazivInspekcijskogTijelaContainingIgnoreCase(String naziv);

    // Pronađi po email adresi kontakt osobe
    @Query("SELECT it FROM InspekcijskoTijelo it WHERE it.kontaktOsoba.email = ?1")
    Optional<InspekcijskoTijelo> findByKontaktEmail(String email);

    // Pronađi po broju telefona kontakt osobe
    @Query("SELECT it FROM InspekcijskoTijelo it WHERE it.kontaktOsoba.brojTelefona = ?1")
    Optional<InspekcijskoTijelo> findByKontaktTelefon(String telefon);

    // Pronađi po imenu i prezimenu kontakt osobe
    @Query("SELECT it FROM InspekcijskoTijelo it WHERE it.kontaktOsoba.ime = ?1 AND it.kontaktOsoba.prezime = ?2")
    List<InspekcijskoTijelo> findByKontaktOsoba(String ime, String prezime);

    // Prebroji tijela po inspektoratu
    Long countByInspektorat(Inspektorat inspektorat);

    // Prebroji tijela po nadležnosti
    Long countByNadleznosti(Nadleznosti nadleznosti);

    // Provjeri da li postoji tijelo sa datim nazivom
    boolean existsByNazivInspekcijskogTijela(String naziv);

    // Dohvati sva tijela sortirana po nazivu
    List<InspekcijskoTijelo> findAllByOrderByNazivInspekcijskogTijelaAsc();
}
