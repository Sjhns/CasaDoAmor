package com.casaDoAmor.CasaDoAmor.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID>, JpaSpecificationExecutor<Medicamento>{
    Optional<Medicamento> findById(UUID id);
    Medicamento findByNome(String nome);
    List<Medicamento> findByFormaFarmaceutica(String formaFarmaceutica);
    List<Medicamento> findByViaDeAdministracao(String viaDeAdministracao);
    List<Medicamento> findByConcentracao(String concentracao);
    List<Medicamento> findByCategoriaTerapeutica(String categoriaTerapeutica);
    List<Medicamento> findByLaboratorioFabricante(String laboratorioFabricante);
    List<Medicamento> findByEstoqueMaximo(long estoqueMaximo);
    List<Medicamento> findByEstoqueMinimo(long estoqueMinimo);
    List<Medicamento> findByDenominacaoGenericaId(UUID denominacaoGenerica);
}
