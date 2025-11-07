package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;



@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID> {
    Optional<Medicamento> findById(UUID id);
    Medicamento findByNome(String nome);
    Medicamento findByLote(String lote);
    Medicamento findByFormaFarmaceutica(String formaFarmaceutica);
    Medicamento findByViaDeAdministracao(String viaDeAdministracao);
    Medicamento findByConcentracao(String concentracao);
    Medicamento findByCategoriaTerapeutica(String categoriaTerapeutica);
    Medicamento findByLaboratorioFabricante(String laboratorioFabricante);
    Medicamento findByValidade(LocalDate validade);
    List<Medicamento> findByEstoqueBaixo();
    List<Medicamento> findByValidadeLessThanEqual(LocalDate dataLimite);
}
