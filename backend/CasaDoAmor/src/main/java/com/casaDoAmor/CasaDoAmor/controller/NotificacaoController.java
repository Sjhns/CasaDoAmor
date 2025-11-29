// package com.casaDoAmor.CasaDoAmor.controller;

// import com.casaDoAmor.CasaDoAmor.model.Estoque;
// import com.casaDoAmor.CasaDoAmor.model.Medicamento;
// import com.casaDoAmor.CasaDoAmor.model.Notificacao;
// import com.casaDoAmor.CasaDoAmor.repository.EstoqueRepository;
// import com.casaDoAmor.CasaDoAmor.repository.MedicamentoRepository;
// import com.casaDoAmor.CasaDoAmor.repository.NotificacaoRepository;
// import com.casaDoAmor.CasaDoAmor.service.NotificacaoService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.context.annotation.Profile;
// import org.springframework.http.HttpStatus;
// import java.time.LocalDate;
// import java.util.List;

// @RestController
// @RequestMapping("/api/notificacoes")
// public class NotificacaoController {

//     private final NotificacaoService notificacaoService;
//     private final NotificacaoRepository notificacaoRepository;
//     private final MedicamentoRepository medicamentoRepository;
//     private final EstoqueRepository estoqueRepository; 

//     public NotificacaoController(NotificacaoService notificacaoService,
//                                  NotificacaoRepository notificacaoRepository,
//                                  MedicamentoRepository medicamentoRepository,
//                                  EstoqueRepository estoqueRepository) {
//         this.notificacaoService = notificacaoService;
//         this.notificacaoRepository = notificacaoRepository;
//         this.medicamentoRepository = medicamentoRepository;
//         this.estoqueRepository = estoqueRepository;
//     }

//     @GetMapping
//     public List<Notificacao> listarNotificacoes() {
//         return notificacaoRepository.findAll();
//     }

//     @Profile("dev")
//     @GetMapping("/gerar-dados-teste")
//     public ResponseEntity<String> gerarDadosTeste() {
//         try {
//             Medicamento medVencendo = new Medicamento();
//             medVencendo.setNome("Dipirona Vencendo");
//             medVencendo.setFormaFarmaceutica("Comprimido");
//             medVencendo.setViaDeAdministracao("Oral");
//             medVencendo.setConcentracao("500mg");
//             medVencendo.setCategoriaTerapeutica("Analgesico");
//             medVencendo.setLaboratorioFabricante("Medley");
//             medicamentoRepository.save(medVencendo);

//             Medicamento medEstoque = new Medicamento();
//             medEstoque.setNome("Paracetamol Acabando");
//             medEstoque.setFormaFarmaceutica("Comprimido");
//             medEstoque.setViaDeAdministracao("Oral");
//             medEstoque.setConcentracao("750mg");
//             medEstoque.setCategoriaTerapeutica("Analgesico");
//             medEstoque.setLaboratorioFabricante("EMS");
//             medicamentoRepository.save(medEstoque);

//             Estoque estoqueBaixo = new Estoque();
//             estoqueBaixo.setQuantidade(5L);
        
//             estoqueBaixo.setStatus("ATIVO");
//             estoqueBaixo.setMedicamento(medEstoque);
//             estoqueRepository.save(estoqueBaixo);

//             return ResponseEntity.ok("DADOS DE TESTE (VENCIMENTO E ESTOQUE) CRIADOS. " + 
//                                       "Execute /api/notificacoes/testar-verificacao");
//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.internalServerError().body("Erro ao criar dado de teste: " + e.getMessage());
//         }
//     }

//     @Profile("dev")
//     @GetMapping("/testar-verificacao")
//     public ResponseEntity<String> testarVerificacaoManual() {
//         try {
//             // notificacaoService.verificarMedicamentosCriticos();
//             return ResponseEntity.ok("Verificação executada com sucesso! " +
//                                       "Confira seu e-mail (2) e o endpoint /api/notificacoes (2).");
//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.internalServerError().body("Erro ao executar verificação: " + e.getMessage());
//         }
//     }
// }
