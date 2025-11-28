import json
import random
from faker import Faker
import requests

# --- CONFIGURAÇÕES DA API ---
URL_GENERICO = "http://localhost:8080/denominacao-generica"
URL_MEDICAMENTO = "http://localhost:8080/medicamento"
URL_LOTE = "http://localhost:8080/estoque" # Ajustei para /estoque conforme seu erro, confirme se é essa rota ou /lote

# --- CONFIGURAÇÕES DE QUANTIDADE ---
QTD_GENERICOS = 5        
QTD_MEDICAMENTOS = 20    
LOTES_POR_MEDICAMENTO = 2 # Vamos criar 2 lotes para cada remédio

fake = Faker('pt_BR')

# Listas de apoio
formas = ["Comprimido", "Cápsula", "Xarope", "Solução Injetável", "Pomada"]
vias = ["Oral", "Intravenosa", "Tópica", "Intramuscular"]
concentracoes = ["500mg", "750mg", "10mg/mL", "20mg", "1g"]
categorias = ["Analgésico", "Antibiótico", "Anti-inflamatório", "Antiviral"]
laboratorios = ["EMS", "Medley", "Eurofarma", "Neo Química", "Aché", "Pfizer"]
status_lote = ["DISPONIVEL", "EM_QUARENTENA"] 
nomes_genericos_reais = [
    "Dipirona", "Paracetamol", "Ibuprofeno", "Amoxicilina", 
    "Simeticona", "Omeprazol", "Losartana", "Clonazepam"
]

def semear_banco_seguro():
    ids_genericos_criados = []
    # Agora esta lista vai guardar objetos: {'id': 1, 'estoqueMaximo': 500}
    dados_medicamentos_criados = [] 

    print("--- INICIANDO SEED SEGURO ---")

    # ---------------------------------------------------------
    # 1. GENÉRICOS
    # ---------------------------------------------------------
    print(f"\n1. Criando Genéricos...")
    amostra_nomes = random.sample(nomes_genericos_reais, min(len(nomes_genericos_reais), QTD_GENERICOS))

    for nome in amostra_nomes:
        try:
            resp = requests.post(URL_GENERICO, json={"nome": nome})
            if resp.status_code in [200, 201]:
                ids_genericos_criados.append(resp.json())
                print(f"   [OK] Genérico: {nome}")
        except Exception:
            pass

    if not ids_genericos_criados: return

    # ---------------------------------------------------------
    # 2. MEDICAMENTOS
    # ---------------------------------------------------------
    print(f"\n2. Criando Medicamentos...")

    for i in range(QTD_MEDICAMENTOS):
        gen_base = random.choice(ids_genericos_criados)
        nome_comercial = f"{gen_base['nome']} {fake.word().capitalize()}Max"
        
        # Geramos o estoque máximo AQUI para controlar depois
        est_max = random.randint(100, 1000) 

        payload_med = {
            "nome": nome_comercial,
            "formaFarmaceutica": random.choice(formas),
            "viaDeAdministracao": random.choice(vias),
            "concentracao": random.choice(concentracoes),
            "categoriaTerapeutica": random.choice(categorias),
            "laboratorioFabricante": random.choice(laboratorios),
            "estoqueMinimo": 10,
            "estoqueMaximo": est_max, # Usamos a variável
            "denominacaoGenericaId": gen_base['id']
        }

        try:
            resp = requests.post(URL_MEDICAMENTO, json=payload_med)
            if resp.status_code in [200, 201]:
                med_criado = resp.json()
                # O PULO DO GATO: Guardamos o ID e o limite máximo permitdo
                dados_medicamentos_criados.append({
                    "id": med_criado['id'],
                    "estoqueMaximo": est_max
                })
                print(f"   [OK] Med (Max: {est_max}): {nome_comercial}")
            else:
                print(f"   [ERRO] Criar Med: {resp.text}")
        except Exception as e:
             print(f"   [FALHA] Conexão Med: {e}")

    # ---------------------------------------------------------
    # 3. LOTES (Agora respeitando o limite)
    # ---------------------------------------------------------
    print(f"\n3. Criando Lotes (Calculados para não estourar o limite)...")

    count_lotes = 0
    
    for med_info in dados_medicamentos_criados:
        id_med = med_info['id']
        limite_total_med = med_info['estoqueMaximo']
        
        # Se vamos criar 2 lotes, cada lote não pode ter mais que (Maximo / 2)
        # Tiramos uma margem de segurança (-5) para não bater no teto exato
        limite_por_lote = int((limite_total_med / LOTES_POR_MEDICAMENTO)) - 5
        
        if limite_por_lote < 1: limite_por_lote = 1

        for _ in range(LOTES_POR_MEDICAMENTO):
            qtd_segura = random.randint(1, limite_por_lote)
            
            payload_lote = {
                "medicamentoId": id_med,
                "quantidade": qtd_segura, # Quantidade segura!
                "status": random.choice(status_lote),
                "lote": fake.bothify(text='??-####').upper(),
                "validadeAposAberto": fake.date_between(start_date='today', end_date='+2y').isoformat()
            }

            try:
                # Confirme se sua rota é /lote ou /estoque baseado no seu erro
                resp = requests.post(URL_LOTE, json=payload_lote) 
                
                if resp.status_code in [200, 201]:
                    print(f"   [OK] Lote Qtd {qtd_segura} (MaxGlobal: {limite_total_med})")
                    count_lotes += 1
                else:
                    # Mostra o erro se ainda acontecer
                    print(f"   [ERRO] Lote: {resp.text}") 
            except Exception as e:
                print(f"   [FALHA] Conexão Lote: {e}")

    print(f"\n--- FIM: {count_lotes} lotes criados ---")

if __name__ == "__main__":
    semear_banco_seguro()