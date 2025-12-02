# 🧪 Guia de Teste Rápido - Sistema de Notificações

## 🚀 Como Testar em 5 Minutos

### Pré-requisitos

-   ✅ Backend rodando (porta 8080)
-   ✅ Banco de dados MySQL configurado
-   ✅ Email configurado no `application.properties`

---

## 📬 Teste 1: Verificação Manual de Notificações

### Via Postman/Insomnia/cURL

```bash
# Executar verificação manual
POST http://localhost:8080/api/notificacoes/verificar-agora
```

**Resposta esperada:**

```
✅ Verificações executadas com sucesso! Confira os emails e notificações.
```

**O que acontece:**

-   Sistema varre todos os medicamentos
-   Cria notificações para problemas encontrados
-   Envia emails para o responsável

---

## 📊 Teste 2: Estoque Crítico

### Passo 1: Cadastrar medicamento com estoque baixo

```bash
# 1. Criar medicamento com estoque mínimo = 10
POST http://localhost:8080/api/medicamentos
Content-Type: application/json

{
  "nome": "Dipirona 500mg",
  "denominacaoGenericaId": 1,
  "formaFarmaceutica": "Comprimido",
  "viaDeAdministracao": "Oral",
  "concentracao": "500mg",
  "categoriaTerapeutica": "Analgésico",
  "laboratorioFabricante": "Genérico",
  "estoqueMinimo": 10,
  "estoqueMaximo": 100
}

# 2. Adicionar apenas 8 unidades (abaixo do mínimo)
POST http://localhost:8080/api/estoques
Content-Type: application/json

{
  "medicamentoId": "[ID_DO_MEDICAMENTO]",
  "quantidade": 8,
  "lote": "LOTE-001",
  "status": "DISPONIVEL",
  "validadeAposAberto": "2025-12-31"
}
```

**Resultado esperado:**

-   ✅ Notificação criada no banco
-   ✅ Email enviado com alerta de estoque crítico

### Passo 2: Verificar notificações

```bash
# Listar notificações não lidas
GET http://localhost:8080/api/notificacoes/nao-lidas
```

**Resposta esperada:**

```json
[
    {
        "id": 1,
        "tipoAlerta": "ESTOQUE_CRITICO",
        "mensagem": "Estoque crítico: Dipirona 500mg está com apenas 8 unidades!",
        "nomeMedicamento": "Dipirona 500mg",
        "quantidade": 8,
        "lida": false,
        "dataCriacao": "2025-12-02T10:30:00"
    }
]
```

---

## 📅 Teste 3: Vencimento Próximo

### Criar medicamento com vencimento em 15 dias

```bash
POST http://localhost:8080/api/estoques
Content-Type: application/json

{
  "medicamentoId": "[ID_DO_MEDICAMENTO]",
  "quantidade": 50,
  "lote": "LOTE-VENCE-BREVE",
  "status": "DISPONIVEL",
  "validadeAposAberto": "2025-12-17"  # 15 dias a partir de hoje
}

# Executar verificação
POST http://localhost:8080/api/notificacoes/verificar-agora
```

**Resultado esperado:**

-   ✅ Email com alerta de vencimento próximo
-   ✅ Notificação tipo "PROXIMO_VENCIMENTO"

---

## 🚨 Teste 4: Medicamento Vencido

### Criar medicamento já vencido

```bash
POST http://localhost:8080/api/estoques
Content-Type: application/json

{
  "medicamentoId": "[ID_DO_MEDICAMENTO]",
  "quantidade": 30,
  "lote": "LOTE-VENCIDO",
  "status": "DISPONIVEL",
  "validadeAposAberto": "2025-11-01"  # Data no passado
}

# Executar verificação
POST http://localhost:8080/api/notificacoes/verificar-agora
```

**Resultado esperado:**

-   ✅ Email urgente sobre medicamento vencido
-   ✅ Notificação tipo "VENCIDO"

---

## 📧 Verificar Emails no Mailtrap

1. Acesse: https://mailtrap.io
2. Login com as credenciais do `application.properties`
3. Verifique a caixa de entrada
4. Você verá os emails com os alertas

---

## 🔄 Teste 5: Fluxo Completo de Despacho

```bash
# 1. Criar medicamento com estoque no limite
POST http://localhost:8080/api/medicamentos
{
  "nome": "Ibuprofeno 600mg",
  "estoqueMinimo": 20,
  "estoqueMaximo": 200,
  ...
}

# 2. Adicionar 25 unidades (um pouco acima do mínimo)
POST http://localhost:8080/api/estoques
{
  "medicamentoId": "[ID]",
  "quantidade": 25,
  ...
}

# 3. Despachar 10 unidades (vai ficar com 15, abaixo do mínimo)
POST http://localhost:8080/api/estoques/despacho
{
  "medicamentoId": "[ID]",
  "quantidade": 10,
  "paciente": "João Silva",
  "observacao": "Tratamento dor crônica"
}
```

**Resultado esperado:**

-   ✅ Despacho realizado
-   ✅ Sistema detecta estoque crítico automaticamente
-   ✅ Email enviado
-   ✅ Notificação criada

---

## 📱 Teste 6: Interface do Frontend

### Verificar notificações não lidas

```bash
GET http://localhost:8080/api/notificacoes/nao-lidas
```

### Marcar como lida

```bash
PUT http://localhost:8080/api/notificacoes/1/marcar-lida
```

### Marcar todas como lidas

```bash
PUT http://localhost:8080/api/notificacoes/marcar-todas-lidas
```

### Excluir notificação

```bash
DELETE http://localhost:8080/api/notificacoes/1
```

---

## 🐛 Troubleshooting

### Emails não estão sendo enviados

1. **Verificar logs do console**:

    ```
    Erro ao enviar email: [mensagem]
    ```

2. **Verificar configuração SMTP**:

    ```properties
    # application.properties
    spring.mail.host=sandbox.smtp.mailtrap.io
    spring.mail.port=2525
    spring.mail.username=3a6680b936c248
    spring.mail.password=c386523b62148a
    ```

3. **Testar conexão SMTP manualmente**

### Notificações duplicadas

-   Sistema já previne duplicatas
-   Só cria notificação se não houver uma não lida do mesmo tipo para o mesmo medicamento

### Agendamento não funciona

Verificar se `@EnableScheduling` está presente em `CasaDoAmorApplication.java`:

```java
@SpringBootApplication
@EnableScheduling  // ← Deve estar presente
public class CasaDoAmorApplication {
    ...
}
```

---

## 📊 Checklist de Testes

-   [ ] Cadastrar medicamento com estoque crítico
-   [ ] Verificar criação de notificação
-   [ ] Verificar recebimento de email
-   [ ] Despachar medicamento até ficar crítico
-   [ ] Criar lote com vencimento próximo
-   [ ] Criar lote já vencido
-   [ ] Executar verificação manual via API
-   [ ] Marcar notificação como lida
-   [ ] Excluir notificação
-   [ ] Aguardar execução agendada (7h)

---

## 🎯 Exemplo de Resposta de Email

### Estoque Crítico

```
De: sistema@casadoamor.org
Para: gestor@casadoamor.org
Assunto: ⚠️ Alerta: Estoque Crítico - Dipirona 500mg

O medicamento Dipirona 500mg está com estoque crítico!

Quantidade atual: 8 unidades
Estoque mínimo: 10 unidades

Por favor, providencie a reposição com urgência.
```

### Vencimento Próximo

```
De: sistema@casadoamor.org
Para: gestor@casadoamor.org
Assunto: ⏰ Alerta: Vencimento Próximo - Ibuprofeno 600mg

O medicamento Ibuprofeno 600mg está próximo do vencimento!

Lote: LOTE-001
Vencimento: 2025-12-17
Dias restantes: 15
Quantidade: 50 unidades

Planeje a utilização ou descarte adequado.
```

---

✅ **Sistema pronto para uso em produção!**
