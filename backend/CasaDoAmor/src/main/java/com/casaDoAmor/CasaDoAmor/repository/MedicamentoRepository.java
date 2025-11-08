package com.casaDoAmor.CasaDoAmor.repository; 

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.Query;

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
    List<Medicamento> findByValidadeLessThanEqual(LocalDate dataLimite);
    @Query("SELECT m FROM Medicamento m WHERE m.validade <= :dataLimite")
    List<Medicamento> buscarPorVencimentoAntesDe(@Param("dataLimite") LocalDate dataLimite);
}
