package com.casaDoAmor.CasaDoAmor.repository;

import com.casaDoAmor.CasaDoAmor.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, UUID> {

    List<Medicamento> findByNome(String nome);
    List<Medicamento> findByLote(String lote);

    List<Medicamento> findByFormaFarmaceutica(String formaFarmaceutica);
    List<Medicamento> findByViaDeAdministracao(String viaDeAdministracao);
    List<Medicamento> findByConcentracao(String concentracao);
    List<Medicamento> findByCategoriaTerapeutica(String categoriaTerapeutica);
    List<Medicamento> findByLaboratorioFabricante(String laboratorioFabricante);

    List<Medicamento> findByEstoqueMaximo(long estoqueMaximo);
    List<Medicamento> findByEstoqueMinimo(long estoqueMinimo);

    List<Medicamento> findByDenominacaoGenericaId(UUID denominacaoGenericaId);

    @Query("SELECT m FROM Medicamento m WHERE m.validade <= :dataLimite")
    List<Medicamento> buscarPorVencimentoAntesDe(@Param("dataLimite") LocalDate dataLimite);
}
