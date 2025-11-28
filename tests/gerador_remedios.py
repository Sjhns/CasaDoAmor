import json
import random
from faker import Faker
import requests

# --- CONFIGURAÇÕES ---
URL_GENERICO = "http://localhost:8080/denominacao-generica"
URL_MEDICAMENTO = "http://localhost:8080/medicamento"

QTD_GENERICOS = 10      # Quantas denominações genéricas criar
QTD_MEDICAMENTOS = 50   # Quantos remédios criar no total

# Configura o Faker
fake = Faker('pt_BR')

# Listas de apoio
formas = ["Comprimido", "Cápsula", "Xarope", "Solução Injetável", "Pomada", "Gotas"]
vias = ["Oral", "Intravenosa", "Tópica", "Intramuscular", "Sublingual"]
concentracoes = ["500mg", "750mg", "10mg/mL", "20mg", "1g", "50mg"]
categorias = ["Analgésico", "Antibiótico", "Anti-inflamatório", "Antidepressivo", "Anti-hipertensivo"]
laboratorios = ["EMS", "Medley", "Eurofarma", "Neo Química", "Aché", "Pfizer", "Novartis"]
nomes_genericos_reais = [
    "Dipirona", "Paracetamol", "Ibuprofeno", "Amoxicilina", 
    "Simeticona", "Omeprazol", "Losartana", "Clonazepam", "Diazepam"
]

def semear_banco():
    # Listas para guardar o que foi gerado (caso queira salvar o JSON de log no final)
    log_genericos = []
    log_medicamentos = []
    
    # Lista para guardar APENAS os IDs que o banco de dados retornou
    ids_reais_do_banco = []

    print("--- INICIANDO O PROCESSO DE SEED ---")

    # ---------------------------------------------------------
    # 1. Enviar Denominações Genéricas e capturar os IDs reais
    # ---------------------------------------------------------
    print(f"\n1. Enviando {QTD_GENERICOS} genéricos para a API...")
    
    lista_nomes_usados = random.sample(nomes_genericos_reais, min(len(nomes_genericos_reais), QTD_GENERICOS))

    for nome_gen in lista_nomes_usados:
        payload = { "nome": nome_gen }
        
        try:
            # Envia para a API
            response = requests.post(URL_GENERICO, json=payload)
            
            if response.status_code == 201 or response.status_code == 200:
                # O PULO DO GATO: Pegar o ID que a API retornou!
                dado_retornado = response.json()
                id_real = dado_retornado['id'] # Certifique-se que sua API retorna o campo 'id'
                
                # Guarda o ID real e o nome para usar nos medicamentos
                ids_reais_do_banco.append({"id": id_real, "nome": nome_gen})
                log_genericos.append(dado_retornado)
                print(f"   [OK] {nome_gen} criado com ID: {id_real}")
            else:
                print(f"   [ERRO] Falha ao criar {nome_gen}: {response.text}")
                
        except Exception as e:
            print(f"   [CRÍTICO] Erro de conexão: {e}")

    # Se não conseguiu criar nenhum genérico, para tudo.
    if not ids_reais_do_banco:
        print("Nenhum genérico foi criado. Abortando criação de medicamentos.")
        return

    # ---------------------------------------------------------
    # 2. Gerar Medicamentos usando os IDs reais
    # ---------------------------------------------------------
    print(f"\n2. Enviando {QTD_MEDICAMENTOS} medicamentos vinculados...")

    for i in range(QTD_MEDICAMENTOS):
        # Escolhe um genérico REAL que já está no banco
        generico_base = random.choice(ids_reais_do_banco)
        id_vinculo = generico_base['id']
        nome_vinculo = generico_base['nome']

        nome_comercial = f"{nome_vinculo} {fake.word().capitalize()}Flex"

        payload_remedio = {
            "nome": nome_comercial,
            "formaFarmaceutica": random.choice(formas),
            "viaDeAdministracao": random.choice(vias),
            "concentracao": random.choice(concentracoes),
            "categoriaTerapeutica": random.choice(categorias),
            "laboratorioFabricante": random.choice(laboratorios),
            "estoqueMinimo": random.randint(10, 50),
            "estoqueMaximo": random.randint(100, 500),
            "denominacaoGenericaId": id_vinculo # Aqui vai o ID real!
        }

        try:
            response = requests.post(URL_MEDICAMENTO, json=payload_remedio)
            if response.status_code == 201 or response.status_code == 200:
                log_medicamentos.append(payload_remedio)
                print(f"   [OK] Medicamento {i+1}/{QTD_MEDICAMENTOS} inserido.")
            else:
                print(f"   [ERRO] Falha no medicamento {i+1}: {response.text}")
        except Exception as e:
            print(f"   [CRÍTICO] Erro ao enviar medicamento: {e}")


    # ---------------------------------------------------------
    # 3. (Opcional) Salvar Log em JSON
    # ---------------------------------------------------------
    with open('log_seed.json', 'w', encoding='utf-8') as f:
        json.dump({"genericos": log_genericos, "medicamentos": log_medicamentos}, f, indent=2, ensure_ascii=False)
    print("\nProcesso finalizado! Log salvo em 'log_seed.json'.")

if __name__ == "__main__":
    semear_banco()