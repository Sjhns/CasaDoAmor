import requests

# --- CONFIGURAÇÕES DA API ---
URL_MEDICAMENTO = "http://localhost:8080/medicamento"
URL_ESTOQUE = "http://localhost:8080/estoque"
URL_GENERICO = "http://localhost:8080/denominacao-generica"

def limpar_banco():
    """
    Remove TODOS os dados do banco de dados na ordem correta
    para respeitar constraints de chave estrangeira.
    
    Ordem de deleção:
    1. Estoques (dependem de Medicamentos)
    2. Medicamentos (dependem de Denominações Genéricas)
    3. Denominações Genéricas (não têm dependências)
    """
    
    print("=" * 60)
    print("LIMPEZA DO BANCO DE DADOS")
    print("=" * 60)
    
    total_deletados = 0
    
    # ---------------------------------------------------------
    # 1. DELETAR ESTOQUES
    # ---------------------------------------------------------
    print("\n[1/3] Deletando Estoques...")
    try:
        resp = requests.get(URL_ESTOQUE)
        if resp.status_code == 200:
            estoques = resp.json()
            count = 0
            for estoque in estoques:
                try:
                    del_resp = requests.delete(f"{URL_ESTOQUE}/{estoque['id']}")
                    if del_resp.status_code in [200, 204]:
                        count += 1
                        print(f"   ✓ Estoque {estoque['lote']} deletado")
                    else:
                        print(f"   ✗ Erro ao deletar estoque {estoque['id']}: {del_resp.status_code}")
                except Exception as e:
                    print(f"   ✗ Falha ao deletar estoque: {e}")
            
            print(f"   → {count} estoques deletados")
            total_deletados += count
        else:
            print(f"   ⚠ Não foi possível listar estoques: {resp.status_code}")
    except Exception as e:
        print(f"   ✗ Erro ao acessar estoques: {e}")
    
    # ---------------------------------------------------------
    # 2. DELETAR MEDICAMENTOS
    # ---------------------------------------------------------
    print("\n[2/3] Deletando Medicamentos...")
    try:
        # Como a listagem é paginada, vamos pegar todos usando um per_page alto
        resp = requests.get(f"{URL_MEDICAMENTO}?page=1&per_page=1000")
        if resp.status_code == 200:
            data = resp.json()
            medicamentos = data.get('itens', [])
            count = 0
            for med in medicamentos:
                try:
                    del_resp = requests.delete(f"{URL_MEDICAMENTO}/{med['idMedicamento']}")
                    if del_resp.status_code in [200, 204]:
                        count += 1
                        print(f"   ✓ Medicamento {med['nomeMedicamento']} deletado")
                    else:
                        print(f"   ✗ Erro ao deletar medicamento {med['idMedicamento']}: {del_resp.status_code}")
                except Exception as e:
                    print(f"   ✗ Falha ao deletar medicamento: {e}")
            
            print(f"   → {count} medicamentos deletados")
            total_deletados += count
        else:
            print(f"   ⚠ Não foi possível listar medicamentos: {resp.status_code}")
    except Exception as e:
        print(f"   ✗ Erro ao acessar medicamentos: {e}")
    
    # ---------------------------------------------------------
    # 3. DELETAR DENOMINAÇÕES GENÉRICAS
    # ---------------------------------------------------------
    print("\n[3/3] Deletando Denominações Genéricas...")
    try:
        resp = requests.get(URL_GENERICO)
        if resp.status_code == 200:
            genericos = resp.json()
            count = 0
            for gen in genericos:
                try:
                    del_resp = requests.delete(f"{URL_GENERICO}/{gen['id']}")
                    if del_resp.status_code in [200, 204]:
                        count += 1
                        print(f"   ✓ Genérico {gen['nome']} deletado")
                    else:
                        print(f"   ✗ Erro ao deletar genérico {gen['id']}: {del_resp.status_code}")
                except Exception as e:
                    print(f"   ✗ Falha ao deletar genérico: {e}")
            
            print(f"   → {count} genéricos deletados")
            total_deletados += count
        else:
            print(f"   ⚠ Não foi possível listar genéricos: {resp.status_code}")
    except Exception as e:
        print(f"   ✗ Erro ao acessar genéricos: {e}")
    
    # ---------------------------------------------------------
    # RESUMO
    # ---------------------------------------------------------
    print("\n" + "=" * 60)
    print(f"LIMPEZA CONCLUÍDA: {total_deletados} registros removidos")
    print("=" * 60)
    print("\n⚠ NOTA: Se alguns registros não foram deletados,")
    print("   verifique se os endpoints DELETE estão implementados")
    print("   no backend para cada recurso.\n")

if __name__ == "__main__":
    confirmacao = input("⚠️  ATENÇÃO: Isso vai APAGAR TODOS os dados do banco!\n   Digite 'SIM' para confirmar: ")
    
    if confirmacao.strip().upper() == "SIM":
        limpar_banco()
    else:
        print("\n❌ Operação cancelada.")
