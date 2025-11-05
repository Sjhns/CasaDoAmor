// Função para determinar o status baseado na data de vencimento
export const getStatusByDate = (
  validade: string
): "normal" | "atencao" | "vencido" => {
  const dataVencimento = new Date(validade);
  const hoje = new Date();

  // Zerar as horas para comparar apenas as datas
  dataVencimento.setHours(0, 0, 0, 0);
  dataVencimento.setDate(dataVencimento.getDate() + 1); // Correção da data
  hoje.setHours(0, 0, 0, 0);

  const diasParaVencer = Math.ceil(
    (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasParaVencer < 0) {
    return "vencido";
  } else if (diasParaVencer <= 30) {
    return "atencao";
  } else {
    return "normal";
  }
};
