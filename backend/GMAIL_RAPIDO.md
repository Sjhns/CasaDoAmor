# ⚡ Configuração Rápida - Copie e Cole

## 📋 Template Pronto para Gmail

### 1️⃣ Substitua no `application.properties`

**Localize estas linhas:**

```properties
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=3a6680b936c248
spring.mail.password=c386523b62148a
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Email do responsavel que recebera as notificacoes
app.notificacao.email-responsavel=gestor@casadoamor.org
```

**Cole isso no lugar:**

```properties
# ========================================
# CONFIGURAÇÃO GMAIL - EDITE AQUI! ✏️
# ========================================

spring.mail.host=smtp.gmail.com
spring.mail.port=587

# ALTERE para seu email do Gmail
spring.mail.username=SEU_EMAIL_AQUI@gmail.com

# ALTERE para a senha de app (gere em: https://myaccount.google.com/apppasswords)
spring.mail.password=SUA_SENHA_DE_APP_AQUI

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# ALTERE para o email que vai receber os alertas (pode ser o mesmo acima)
app.notificacao.email-responsavel=SEU_EMAIL_AQUI@gmail.com
```

---

## 🎯 Exemplo Real (APENAS PARA REFERÊNCIA)

**NÃO copie estes valores, são apenas exemplos!**

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=iury.sistema@gmail.com
spring.mail.password=abcd efgh ijkl mnop
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

app.notificacao.email-responsavel=iury.sistema@gmail.com
```

⚠️ **Lembre-se**: Remova os espaços da senha de app!

-   ❌ Errado: `abcd efgh ijkl mnop`
-   ✅ Certo: `abcdefghijklmnop`

---

## 🚀 Teste Imediato

Depois de salvar e reiniciar o backend:

### Via cURL (Windows PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/notificacoes/verificar-agora" -Method POST
```

### Via Browser

Instale a extensão "REST Client" e use:

```
POST http://localhost:8080/api/notificacoes/verificar-agora
```

### Ou crie um estoque crítico manualmente

```json
POST http://localhost:8080/api/estoques
Content-Type: application/json

{
  "medicamentoId": "seu-id-aqui",
  "quantidade": 5,
  "lote": "TESTE-001",
  "status": "DISPONIVEL"
}
```

---

## ✅ Verificação Rápida

### Logs do Console

Procure por:

```
✅ Sucesso: Nenhum erro nos logs
❌ Erro: "AuthenticationFailedException" → Senha de app incorreta
❌ Erro: "Could not connect" → Verifique host/porta
```

### Gmail

-   📥 Verifique a **Caixa de Entrada**
-   📧 Verifique a pasta **SPAM**
-   ⏱️ Aguarde até 2 minutos

---

## 🎨 Como Vai Aparecer o Email

```
─────────────────────────────────────
De: iury.sistema@gmail.com
Para: iury.sistema@gmail.com
Data: 02/12/2025 10:30
─────────────────────────────────────
Assunto: ⚠️ Alerta: Estoque Crítico - Dipirona 500mg
─────────────────────────────────────

O medicamento Dipirona 500mg está com estoque crítico!

Quantidade atual: 5 unidades
Estoque mínimo: 10 unidades

Por favor, providencie a reposição com urgência.
─────────────────────────────────────
```

---

## 🔄 Voltar para Mailtrap (Testes)

Se quiser voltar para o ambiente de testes:

```properties
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=3a6680b936c248
spring.mail.password=c386523b62148a
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

app.notificacao.email-responsavel=gestor@casadoamor.org
```

---

## 💡 Dica Pro

Crie dois arquivos de configuração:

### `application-dev.properties` (Desenvolvimento)

```properties
spring.mail.host=sandbox.smtp.mailtrap.io
spring.mail.port=2525
spring.mail.username=3a6680b936c248
spring.mail.password=c386523b62148a
```

### `application-prod.properties` (Produção)

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

**Ative o perfil desejado:**

```bash
# Desenvolvimento
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Produção
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

✅ **É só isso! Super simples e 100% funcional com Gmail!**
