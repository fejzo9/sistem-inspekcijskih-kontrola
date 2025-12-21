package com.sisinspbih.repository;

import com.sisinspbih.model.Proizvod;
import com.sisinspbih.model.Drzava;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProizvodRepository extends JpaRepository<Proizvod, Long> {

    // Pronađi proizvod po serijskom broju
    Optional<Proizvod> findBySerijskiBroj(String serijskiBroj);

    // Pronađi sve proizvode odredjenog proizvodjača
    List<Proizvod> findByProizvodjac(String proizvodjac);

    // Pronađi sve proizvode po nazivu
    List<Proizvod> findByNazivProizvoda(String nazivProizvoda);

    // Pronađi sve proizvode iz određene države
    List<Proizvod> findByDrzavaPorijekla(Drzava drzava);

    // Pronađi proizvode čiji naziv sadrži određeni string (case insensitive)
    List<Proizvod> findByNazivProizvodaContainingIgnoreCase(String naziv);

    // Pronađi proizvode čiji proizvođač sadrži određeni string (case insensitive)
    List<Proizvod> findByProizvodjacContainingIgnoreCase(String proizvodjac);

    // Provjeri da li postoji proizvod sa datim serijskim brojem
    boolean existsBySerijskiBroj(String serijskiBroj);

    // Prebroji proizvode od određenog proizvođača
    @Query("SELECT COUNT(p) FROM Proizvod p WHERE p.proizvodjac = ?1")
    Long countByProizvodjac(String proizvodjac);

    // Pronađi sve proizvode sa sortiranjem po nazivu
    List<Proizvod> findAllByOrderByNazivProizvodaAsc();
}
