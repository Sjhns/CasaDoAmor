# 📧 Configuração de Gmail para Notificações

## ✅ SIM! Você pode usar um Gmail real e vai funcionar perfeitamente!

---

## 🔧 Passo a Passo Completo

### **PASSO 1: Gerar Senha de App no Gmail**

⚠️ **IMPORTANTE**: Não use sua senha normal do Gmail! Use uma "Senha de App".

#### 1.1. Acesse sua conta Google

-   Vá para: https://myaccount.google.com/

#### 1.2. Ative a Verificação em Duas Etapas (se ainda não tiver)

-   Navegue: **Segurança** → **Verificação em duas etapas**
-   Siga os passos para ativar

#### 1.3. Crie uma Senha de App

-   Vá para: https://myaccount.google.com/apppasswords
-   Ou navegue: **Segurança** → **Senhas de app**
-   Selecione:
    -   **App**: Selecione "E-mail"
    -   **Dispositivo**: Selecione "Outro" e digite "Casa do Amor Backend"
-   Clique em **GERAR**
-   **Copie a senha de 16 caracteres** (algo como: `abcd efgh ijkl mnop`)
-   ⚠️ **Guarde essa senha!** Você não poderá vê-la novamente.

---

### **PASSO 2: Configurar o `application.properties`**

Edite o arquivo:

```
backend/CasaDoAmor/src/main/resources/application.properties
```

**Substitua a seção de email por:**

```properties
# ========================================
# CONFIGURAÇÃO DE EMAIL (GMAIL)
# ========================================

# Servidor SMTP do Gmail
spring.mail.host=smtp.gmail.com
spring.mail.port=587

# Seu email Gmail (quem vai ENVIAR)
spring.mail.username=seuemail@gmail.com

# Senha de App gerada no passo 1.3 (sem espaços)
spring.mail.password=abcdefghijklmnop

# Configurações de segurança
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email que vai RECEBER as notificações (pode ser o mesmo ou outro)
app.notificacao.email-responsavel=seuemail@gmail.com
```

---

### **PASSO 3: Exemplo Real de Configuração**

#### Cenário 1: Enviar e Receber no Mesmo Email

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=joao.silva@gmail.com
spring.mail.password=xpto1234abcd5678
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Recebe no mesmo email
app.notificacao.email-responsavel=joao.silva@gmail.com
```

#### Cenário 2: Enviar de um email, Receber em outro

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=sistema.casadoamor@gmail.com  # Email que envia
spring.mail.password=xpto1234abcd5678
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com

# Email do gestor que receberá os alertas
app.notificacao.email-responsavel=gestor@empresa.com
```

---

### **PASSO 4: Reiniciar o Backend**

Após salvar as alterações:

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
cd backend/CasaDoAmor
./mvnw spring-boot:run
```

Ou se estiver usando IDE, apenas reinicie a aplicação.

---

## 🧪 Teste Rápido

### Opção 1: Via API

```bash
POST http://localhost:8080/api/notificacoes/verificar-agora
```

### Opção 2: Criar Estoque Crítico

```bash
# 1. Cadastre um medicamento com estoque mínimo = 10
# 2. Adicione apenas 5 unidades
# 3. Email será enviado automaticamente!
```

---

## ❌ Troubleshooting

### Erro: "Authentication failed"

```
Causa: Senha de App incorreta ou não configurada
Solução:
  1. Verifique se a verificação em duas etapas está ativa
  2. Gere uma nova senha de app
  3. Copie sem espaços
```

### Erro: "Could not connect to SMTP host"

```
Causa: Porta ou host incorretos
Solução: Use exatamente:
  spring.mail.host=smtp.gmail.com
  spring.mail.port=587
```

### Erro: "Invalid Addresses"

```
Causa: Email de destino inválido
Solução: Verifique se o email em app.notificacao.email-responsavel está correto
```

### Email não chega

```
Possíveis causas:
  1. Verifique a pasta de SPAM
  2. Aguarde alguns minutos (pode demorar)
  3. Verifique se o email do destinatário está correto
  4. Veja os logs do console para erros
```

---

## 🔍 Verificar se Funcionou

### 1. Console do Backend

Você verá algo como:

```
✅ Email enviado com sucesso!
```

Ou em caso de erro:

```
❌ Erro ao enviar email: [detalhes do erro]
```

### 2. Gmail do Destinatário

Você receberá um email como:

```
De: seuemail@gmail.com
Para: seuemail@gmail.com
Assunto: ⚠️ Alerta: Estoque Crítico - Dipirona 500mg

O medicamento Dipirona 500mg está com estoque crítico!

Quantidade atual: 5 unidades
Estoque mínimo: 10 unidades

Por favor, providencie a reposição com urgência.
```

---

## 🔐 Segurança - Boas Práticas

### ⚠️ NUNCA comite senhas no Git!

#### Opção 1: Usar Variáveis de Ambiente

```properties
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
app.notificacao.email-responsavel=${MAIL_RESPONSAVEL}
```

Depois configure no sistema:

```bash
# Windows (PowerShell)
$env:MAIL_USERNAME="seuemail@gmail.com"
$env:MAIL_PASSWORD="suasenha"
$env:MAIL_RESPONSAVEL="destinatario@gmail.com"
```

#### Opção 2: Criar `application-local.properties`

```properties
# Adicione ao .gitignore
application-local.properties
```

Depois crie o arquivo com suas configs reais:

```properties
spring.mail.username=seuemail@gmail.com
spring.mail.password=suasenha
app.notificacao.email-responsavel=seuemail@gmail.com
```

---

## 📊 Comparação: Mailtrap vs Gmail

| Recurso           | Mailtrap (Atual) | Gmail (Produção)       |
| ----------------- | ---------------- | ---------------------- |
| **Uso**           | ✅ Testes/Dev    | ✅ Produção            |
| **Emails Reais**  | ❌ Não envia     | ✅ Envia de verdade    |
| **Custo**         | ✅ Grátis        | ✅ Grátis              |
| **Configuração**  | ✅ Fácil         | ⚠️ Requer senha de app |
| **Spam Filter**   | ✅ Não tem       | ⚠️ Pode cair no spam   |
| **Limite Diário** | 🔄 Ilimitado     | ⚠️ 500 emails/dia      |

---

## ✅ Checklist Final

-   [ ] Verificação em duas etapas ativada no Gmail
-   [ ] Senha de app gerada e copiada
-   [ ] `application.properties` atualizado
-   [ ] Backend reiniciado
-   [ ] Teste executado
-   [ ] Email recebido na caixa de entrada
-   [ ] Configurações sensíveis não commitadas no Git

---

## 💡 Dicas Extras

### Email Profissional

Para produção real, considere usar:

-   **SendGrid** (12.000 emails grátis/mês)
-   **Mailgun** (5.000 emails grátis/mês)
-   **Amazon SES** (62.000 emails grátis/mês)

### Múltiplos Destinatários

Atualmente só envia para 1 email. Para enviar para vários, você pode:

```java
// No EmailService, adicione:
public void enviarEmailParaVarios(String[] destinatarios, String assunto, String texto) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(destinatarios);
    message.setSubject(assunto);
    message.setText(texto);
    mailSender.send(message);
}
```

---

✅ **Pronto! Agora você pode usar Gmail real e receber notificações de verdade!**
