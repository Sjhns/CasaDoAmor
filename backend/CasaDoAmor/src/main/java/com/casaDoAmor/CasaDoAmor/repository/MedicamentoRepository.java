package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;




@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID> {
    Optional<Medicamento> findById(UUID id);
    Medicamento findByNome(String nome);
    Medicamento findByLote(String lote);
    Medicamento findByForma_farmaceutica(String forma_farmaceutica);
    Medicamento findByVia_de_administracao(String via_de_administracao);
    Medicamento findByConcentracao(String concentracao);
    Medicamento findByCategoria_terapeutica(String categoria_terapeutica);
    Medicamento findByLaboratorio_fabricante(String laboratorio_fabricante);
    Medicamento findByValidade(LocalDate validade);
}
