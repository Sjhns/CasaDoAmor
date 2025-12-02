# 📧 Sistema de Notificações por Email - Casa do Amor

## 🎯 Visão Geral

O sistema de notificações por email está **totalmente integrado** e funcionando automaticamente. Ele monitora o estoque de medicamentos e envia alertas por email quando necessário.

## ✅ O Que Foi Implementado

### 1. **Verificações Automáticas Diárias** (7h da manhã)

-   ⚠️ **Estoque Crítico**: Detecta medicamentos abaixo do estoque mínimo
-   🚨 **Medicamentos Vencidos**: Identifica lotes já vencidos
-   ⏰ **Vencimento Próximo**: Alerta sobre medicamentos que vencem em 30 dias

### 2. **Notificações em Tempo Real**

-   Após **entrada de estoque**: Verifica se ainda está crítico
-   Após **despacho**: Detecta se ficou em nível crítico

### 3. **Duplo Sistema de Alerta**

-   **Banco de Dados**: Notificações persistidas para consulta no frontend
-   **Email**: Alertas enviados para o responsável do sistema

## 🔧 Configuração

### Email de Destino

Edite o arquivo `application.properties`:

```properties
# Email que receberá as notificações
app.notificacao.email-responsavel=seu-email@empresa.com
```

### Servidor SMTP

Atualmente configurado para **Mailtrap** (ambiente de testes). Para produção, altere:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu-email@gmail.com
spring.mail.password=sua-senha-de-app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 📋 Tipos de Notificações

### ESTOQUE_CRITICO

**Quando dispara**: Quantidade ≤ Estoque Mínimo  
**Ação**: Envia email + Cria notificação no sistema  
**Email**:

```
Assunto: ⚠️ Alerta: Estoque Crítico - [Nome do Medicamento]
Corpo:
  Quantidade atual: X unidades
  Estoque mínimo: Y unidades
  Por favor, providencie a reposição com urgência.
```

### VENCIDO

**Quando dispara**: Data de vencimento < Data atual  
**Ação**: Envia email + Cria notificação no sistema  
**Email**:

```
Assunto: 🚨 Alerta: Medicamento Vencido - [Nome do Medicamento]
Corpo:
  Lote: [Código do Lote]
  Vencimento: [Data]
  Quantidade: X unidades
  Por favor, remova este lote do estoque imediatamente!
```

### PROXIMO_VENCIMENTO

**Quando dispara**: Vencimento em menos de 30 dias  
**Ação**: Envia email + Cria notificação no sistema  
**Email**:

```
Assunto: ⏰ Alerta: Vencimento Próximo - [Nome do Medicamento]
Corpo:
  Lote: [Código do Lote]
  Vencimento: [Data]
  Dias restantes: X
  Quantidade: Y unidades
  Planeje a utilização ou descarte adequado.
```

## 🔄 Fluxo de Integração

### Entrada de Medicamentos

```
EstoqueService.salvar()
    ↓
Salva no banco
    ↓
Registra no histórico
    ↓
NotificacaoService.verificarMedicamentosCriticos()
    ↓
Se crítico → Cria notificação + Envia email
```

### Despacho de Medicamentos

```
EstoqueService.realizarDespacho()
    ↓
Remove do estoque
    ↓
Registra no histórico
    ↓
NotificacaoService.verificarMedicamentosCriticos()
    ↓
Se ficou crítico → Cria notificação + Envia email
```

### Verificação Agendada (Diária às 7h)

```
@Scheduled(cron = "0 0 7 * * ?")
    ↓
verificarMedicamentosCriticos()
verificarMedicamentosVencidos()
verificarMedicamentosProximosVencimento()
    ↓
Para cada problema encontrado:
  - Cria notificação no banco
  - Envia email
```

## 🎨 Endpoints da API

### Listar Notificações Não Lidas

```http
GET /api/notificacoes/nao-lidas
```

### Listar Todas as Notificações

```http
GET /api/notificacoes
```

### Marcar Como Lida

```http
PUT /api/notificacoes/{id}/marcar-lida
```

### Marcar Todas Como Lidas

```http
PUT /api/notificacoes/marcar-todas-lidas
```

### Excluir Notificação

```http
DELETE /api/notificacoes/{id}
```

## 📂 Estrutura dos Arquivos

```
backend/CasaDoAmor/src/main/java/com/casaDoAmor/CasaDoAmor/
├── service/
│   ├── NotificacaoService.java  ← Lógica de verificação e emails
│   ├── EmailService.java        ← Envio de emails
│   ├── EstoqueService.java      ← Integrado com notificações
│   └── MedicamentoService.java  ← Logs de operações
├── controller/
│   └── NotificacaoController.java ← API REST
├── model/
│   └── Notificacao.java         ← Entidade JPA
└── repository/
    └── NotificacaoRepository.java
```

## 🧪 Como Testar

### 1. Testar Estoque Crítico

```java
// Cadastre um medicamento com estoque mínimo = 10
// Adicione apenas 8 unidades
// Um email será enviado automaticamente
```

### 2. Testar Vencimento

```java
// Crie um lote com data de vencimento próxima
// Aguarde a verificação das 7h ou chame manualmente:
notificacaoService.verificarMedicamentosProximosVencimento();
```

### 3. Verificação Manual (para testes)

Você pode criar um endpoint de teste no controller:

```java
@GetMapping("/api/notificacoes/verificar-agora")
public ResponseEntity<String> verificarAgora() {
    notificacaoService.executarVerificacaoAgendada();
    return ResponseEntity.ok("Verificações executadas!");
}
```

## 🔐 Segurança

⚠️ **Importante**: Em produção:

1. Use variáveis de ambiente para credenciais SMTP
2. Configure SSL/TLS adequadamente
3. Use senhas de aplicativo (não senha pessoal)
4. Implemente rate limiting para emails

## 📊 Prevenção de Spam

O sistema já possui proteção contra duplicação:

-   ✅ Verifica se já existe notificação não lida do mesmo tipo
-   ✅ Não envia emails duplicados para o mesmo problema
-   ✅ Apenas uma notificação por medicamento/tipo

## 🚀 Próximas Melhorias Sugeridas

1. **Templates HTML** para emails mais bonitos
2. **Configuração de múltiplos destinatários**
3. **Notificações por SMS** (integração com Twilio)
4. **Dashboard** de notificações no frontend
5. **Logs de envio** de emails
6. **Retry automático** em caso de falha de envio
7. **Webhooks** para integração com outros sistemas

## 📝 Notas Técnicas

-   **@EnableScheduling** já está ativo em `CasaDoAmorApplication.java`
-   **Cron Expression**: `0 0 7 * * ?` = Todo dia às 7:00 AM
-   **Timezone**: Baseado no fuso horário do servidor
-   **Transações**: Todas as operações são transacionais
-   **Error Handling**: Falhas de email não quebram o fluxo principal

---

✅ **Sistema 100% Funcional e Pronto para Uso!**
