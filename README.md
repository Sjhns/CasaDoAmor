# 🏠 Casa do Amor - Sistema de Gestão

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma aplicação web full-stack completa e funcional para a gestão da **Casa do Amor**. Construído com Java (Spring Boot) no backend e React (Vite) no frontend, o sistema permite o controle eficiente de estoque, gerenciamento de medicamentos, cadastro de doadores e monitoramento de históricos de movimentações.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Available Scripts](#-available-scripts)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)

## ✨ Features

- **Gestão de Medicamentos**: Cadastro detalhado de remédios, incluindo dosagem e tipos.
- **Controle de Estoque**: Monitoramento de entradas e saídas de itens e medicamentos.
- **Gerenciamento de Doadores**: Registro e acompanhamento de quem contribui para a instituição.
- **Histórico de Movimentações**: Rastreamento completo de todas as ações realizadas no estoque.
- **Notificações**: Alertas sobre níveis de estoque ou validades (baseado na estrutura do código).
- **Interface Responsiva**: Design moderno construído com Tailwind CSS para facilitar o uso em diferentes dispositivos.
- **API RESTful**: Backend robusto em Spring Boot documentado via Swagger.

## 🛠️ Tech Stack

- **Frontend**:
    - **React**: Biblioteca principal para construção da interface.
    - **TypeScript**: Superset do JavaScript que adiciona tipagem estática e segurança ao código.
    - **Vite**: Build tool rápida para desenvolvimento moderno.
    - **Tailwind CSS**: Framework de utilitários para estilização ágil.
- **Backend**:
    - **Java 17+**: Linguagem principal para a lógica do servidor.
    - **Spring Boot**: Framework para facilitar a criação de aplicações Java robustas.
    - **MySQL**: Banco de dados relacional para armazenamento seguro das informações.
    - **Maven**: Gerenciador de dependências e build do projeto Java.

## 🚀 Getting Started

Este projeto é dividido em duas partes: o **backend** (o escritório administrativo) e o **frontend** (o balcão de atendimento). Você precisará configurar e rodar ambos.

### Prerequisites

- [**Node.js**](https://nodejs.org/en/) (versão 18 ou superior) para o frontend.
- [**Java JDK**](https://www.oracle.com/java/technologies/downloads/) (versão 17 ou superior) para o backend.
- [**MySQL**](https://www.mysql.com/downloads/) instalado e rodando.

### Installation

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SeuUsuario/CasaDoAmor.git](https://github.com/SeuUsuario/CasaDoAmor.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd CasaDoAmor
    ```

3.  **Configurando o Backend (O Escritório):**
    - Certifique-se de criar um banco de dados MySQL chamado `casadoamor` (ou configure no `application.properties`).
    ```bash
    # Navegue até a pasta do backend
    cd backend/CasaDoAmor

    # O Maven Wrapper (mvnw) já está incluso, então basta instalar as dependências
    # No Windows:
    .\mvnw clean install
    # No Linux/Mac:
    ./mvnw clean install
    ```

4.  **Configurando o Frontend (O Balcão):**
    - Abra um **novo terminal**.
    - Navegue novamente até a pasta raiz e entre no diretório do frontend.
    ```bash
    # Navegue até a pasta do frontend
    cd ../frontend # ajuste o caminho conforme necessário

    # Instale as dependências do Node.js
    npm install
    ```

## 📜 Available Scripts

Você precisará de dois terminais abertos para rodar a aplicação completa.

#### No terminal do **Backend** (dentro de `backend/CasaDoAmor`):

```bash
# Inicia o servidor Spring Boot (geralmente na porta 8080)
# Windows:
.\mvnw spring-boot:run
# Linux/Mac:
./mvnw spring-boot:run
