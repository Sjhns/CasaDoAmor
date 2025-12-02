# 🏗️ Arquitetura do Sistema de Notificações

## 📐 Diagrama de Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                     SISTEMA CASA DO AMOR                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│   CONTROLLER    │      │     SERVICE      │      │  REPOSITORY  │
└─────────────────┘      └──────────────────┘      └──────────────┘

┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│ Estoque         │──────│ EstoqueService   │──────│ EstoqueRepo  │
│ Controller      │      │                  │      └──────────────┘
└─────────────────┘      │  salvar()        │
                         │  despachar()     │      ┌──────────────┐
                         │                  │──────│ Medicamento  │
                         └────────┬─────────┘      │ Repo         │
                                  │                └──────────────┘
                                  │
                                  │ Injeta
                                  ▼
                         ┌──────────────────┐
                         │ Notificacao      │
                         │ Service          │
                         │                  │
                         │ ✓ verificar      │
                         │   Criticos()     │
                         │ ✓ verificar      │
                         │   Vencidos()     │
                         │ ✓ verificar      │
                         │   Proximos()     │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌──────────────────┐        ┌─────────────────┐
          │ EmailService     │        │ Notificacao     │
          │                  │        │ Repository      │
          │ enviarEmail()    │        │                 │
          └────────┬─────────┘        │ save()          │
                   │                  │ findByLida...() │
                   │                  └─────────────────┘
                   ▼                           │
          ┌──────────────────┐                │
          │ JavaMailSender   │                │
          │ (Spring Mail)    │                │
          └────────┬─────────┘                │
                   │                           │
                   ▼                           ▼
          ┌──────────────────┐        ┌─────────────────┐
          │   SMTP Server    │        │  MySQL Database │
          │   (Mailtrap)     │        │                 │
          └──────────────────┘        └─────────────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ gestor@          │
          │ casadoamor.org   │
          └──────────────────┘
```

## 🔄 Fluxo de Execução

### 1️⃣ ENTRADA DE MEDICAMENTO

```
POST /api/estoques
    │
    ▼
EstoqueService.salvar()
    │
    ├─► Valida estoque máximo
    ├─► Salva no banco
    ├─► Registra no histórico
    │
    ▼
NotificacaoService.verificarMedicamentosCriticos()
    │
    ├─► Calcula saldo total
    ├─► Compara com estoque mínimo
    │
    ▼ (SE CRÍTICO)
    ├─► criarNotificacao()  ────► [Banco de Dados]
    │
    └─► EmailService.enviarEmail()  ────► [SMTP] ────► [Email]
```

### 2️⃣ DESPACHO DE MEDICAMENTO

```
POST /api/estoques/despacho
    │
    ▼
EstoqueService.realizarDespacho()
    │
    ├─► Remove do estoque (FIFO)
    ├─► Registra no histórico
    ├─► Se zerou → Delete medicamento
    │
    ▼ (SE NÃO ZEROU)
NotificacaoService.verificarMedicamentosCriticos()
    │
    └─► (mesmo fluxo acima)
```

### 3️⃣ VERIFICAÇÃO AGENDADA (Diária 7h)

```
@Scheduled(cron = "0 0 7 * * ?")
    │
    ▼
NotificacaoService.executarVerificacaoAgendada()
    │
    ├─► verificarMedicamentosCriticos()
    │   └─► Para cada medicamento
    │       └─► Se estoque ≤ mínimo
    │           ├─► Cria notificação
    │           └─► Envia email
    │
    ├─► verificarMedicamentosVencidos()
    │   └─► Para cada lote
    │       └─► Se vencimento < hoje
    │           ├─► Cria notificação
    │           └─► Envia email
    │
    └─► verificarMedicamentosProximosVencimento()
        └─► Para cada lote
            └─► Se vencimento em < 30 dias
                ├─► Cria notificação
                └─► Envia email
```

### 4️⃣ CONSULTA DE NOTIFICAÇÕES (Frontend)

```
GET /api/notificacoes/nao-lidas
    │
    ▼
NotificacaoController.listarNaoLidas()
    │
    ▼
NotificacaoRepository.findByLidaFalseOrderByDataCriacaoDesc()
    │
    ▼
[JSON Response com notificações]
```

## 📊 Modelo de Dados

### Entidade: Notificacao

```sql
CREATE TABLE notificacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo_alerta VARCHAR(50) NOT NULL,
    mensagem VARCHAR(500) NOT NULL,
    nome_medicamento VARCHAR(200),
    data_vencimento DATETIME,
    quantidade INT,
    data_criacao DATETIME NOT NULL,
    lida BOOLEAN DEFAULT FALSE
);
```

### Tipos de Alerta

```
┌─────────────────────┬──────────────────────────────────┐
│ ESTOQUE_CRITICO     │ Quantidade ≤ Estoque Mínimo      │
├─────────────────────┼──────────────────────────────────┤
│ VENCIDO             │ Data Vencimento < Hoje           │
├─────────────────────┼──────────────────────────────────┤
│ PROXIMO_VENCIMENTO  │ Vence em < 30 dias               │
├─────────────────────┼──────────────────────────────────┤
│ SISTEMA             │ Eventos automáticos do sistema   │
└─────────────────────┴──────────────────────────────────┘
```

## 🔐 Prevenção de Duplicatas

```
Antes de criar notificação:
    │
    ▼
Buscar notificações não lidas
    │
    ▼
Filtrar por:
    ├─► Mesmo tipo de alerta
    ├─► Mesmo medicamento
    └─► Mesma data de vencimento (se aplicável)
    │
    ▼
Se já existe → NÃO cria nova notificação
Se não existe → Cria notificação + Envia email
```

## 🎯 Pontos de Integração

### Services que usam NotificacaoService

```
EstoqueService
    ├─► salvar()           → verifica críticos
    └─► realizarDespacho() → verifica críticos

MedicamentoService (futuro)
    ├─► salvar()           → pode notificar cadastro
    └─► deletar()          → pode notificar exclusão
```

### Configurações (application.properties)

```properties
# SMTP
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=XXXXX
spring.mail.password=XXXXX

# Notificações
app.notificacao.email-responsavel=gestor@casadoamor.org
```

## 📈 Escalabilidade

### Melhorias Futuras

```
┌─────────────────────────────────────────────┐
│ 1. Fila de Emails (RabbitMQ/Kafka)         │
│    └─► Processamento assíncrono            │
├─────────────────────────────────────────────┤
│ 2. Templates HTML (Thymeleaf)              │
│    └─► Emails mais bonitos                 │
├─────────────────────────────────────────────┤
│ 3. Múltiplos Destinatários                 │
│    └─► Por tipo de alerta                  │
├─────────────────────────────────────────────┤
│ 4. Notificações Push (Firebase)            │
│    └─► App mobile                          │
├─────────────────────────────────────────────┤
│ 5. SMS (Twilio)                            │
│    └─► Alertas críticos urgentes           │
├─────────────────────────────────────────────┤
│ 6. Webhooks                                │
│    └─► Integração com outros sistemas      │
└─────────────────────────────────────────────┘
```

## 🧪 Testabilidade

### Unit Tests

```java
@Test
void deveEnviarEmailQuandoEstoqueCritico() {
    // Arrange
    Medicamento med = criarMedicamento(estoqueMin: 10);
    adicionarEstoque(med, quantidade: 5);

    // Act
    notificacaoService.verificarMedicamentosCriticos();

    // Assert
    verify(emailService).enviarEmail(
        eq("gestor@casadoamor.org"),
        contains("Estoque Crítico"),
        any()
    );
}
```

### Integration Tests

```java
@Test
void deveIntegrarComBancoEEnviarEmail() {
    // Simula fluxo completo
    estoqueSalvo = estoqueService.salvar(dto);

    List<Notificacao> notifs = notifRepo.findByLidaFalse();
    assertThat(notifs).hasSize(1);
    assertThat(notifs.get(0).getTipoAlerta())
        .isEqualTo("ESTOQUE_CRITICO");
}
```

---

✅ **Arquitetura sólida, desacoplada e testável!**
