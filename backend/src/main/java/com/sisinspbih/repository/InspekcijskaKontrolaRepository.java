package com.sisinspbih.repository;

import com.sisinspbih.model.InspekcijskaKontrola;
import com.sisinspbih.model.InspekcijskoTijelo;
import com.sisinspbih.model.Proizvod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InspekcijskaKontrolaRepository extends JpaRepository<InspekcijskaKontrola, Long> {

    List<InspekcijskaKontrola> findByDatumInspekcijskeKontrole(LocalDate datum);

    List<InspekcijskaKontrola> findByNadleznoInspekcijskoTijelo(InspekcijskoTijelo tijelo);

    List<InspekcijskaKontrola> findByKontrolisaniProizvod(Proizvod proizvod);

    List<InspekcijskaKontrola> findByProizvodSiguran(Boolean siguran);

    List<InspekcijskaKontrola> findByDatumInspekcijskeKontroleBetween(LocalDate startDatum, LocalDate endDatum);

    List<InspekcijskaKontrola> findByNadleznoInspekcijskoTijeloAndProizvodSiguran(
            InspekcijskoTijelo tijelo, Boolean siguran);

    List<InspekcijskaKontrola> findByKontrolisaniProizvodAndProizvodSiguran(
            Proizvod proizvod, Boolean siguran);

    @Query("SELECT k FROM InspekcijskaKontrola k WHERE k.datumInspekcijskeKontrole >= ?1")
    List<InspekcijskaKontrola> findKontroleOdDatuma(LocalDate datum);

    @Query("SELECT k FROM InspekcijskaKontrola k WHERE k.datumInspekcijskeKontrole <= ?1")
    List<InspekcijskaKontrola> findKontroleDoDatuma(LocalDate datum);

    @Query("SELECT k FROM InspekcijskaKontrola k WHERE k.proizvodSiguran = false")
    List<InspekcijskaKontrola> findNesigurneProizvode();

    Long countByProizvodSiguran(Boolean siguran);

    Long countByNadleznoInspekcijskoTijelo(InspekcijskoTijelo tijelo);

    Long countByKontrolisaniProizvod(Proizvod proizvod);

    @Query("SELECT COUNT(k) FROM InspekcijskaKontrola k WHERE k.datumInspekcijskeKontrole = ?1")
    Long countByDatum(LocalDate datum);

    List<InspekcijskaKontrola> findAllByOrderByDatumInspekcijskeKontroleDesc();

    boolean existsByKontrolisaniProizvodAndDatumInspekcijskeKontrole(Proizvod proizvod, LocalDate datum);
}
