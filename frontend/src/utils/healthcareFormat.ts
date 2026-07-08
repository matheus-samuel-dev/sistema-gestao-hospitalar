export function toLocalIsoDate(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function dateFromIsoDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`);
}

export function formatDate(isoDate: string, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) {
  return new Intl.DateTimeFormat('pt-BR', options).format(dateFromIsoDate(isoDate)).replace('.', '');
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export const statusLabels: Record<string, string> = {
  AGENDADA: 'Agendada',
  CONFIRMADA: 'Confirmada',
  EM_ANDAMENTO: 'Em atendimento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  CANCELADO: 'Cancelado',
  FALTOU: 'Não compareceu',
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  PENDENTE: 'Pendente',
  PAGO: 'Pago',
  ATRASADO: 'Atrasado',
  SOLICITADO: 'Solicitado',
  AGENDADO: 'Agendado',
  EM_ANALISE: 'Em análise',
  CONCLUIDO: 'Concluído',
  ATIVA: 'Ativa',
  ALTA_MEDICA: 'Alta médica',
  TRANSFERIDA: 'Transferida',
  DISPONIVEL: 'Disponível',
  ESTOQUE_BAIXO: 'Estoque baixo',
  VENCIMENTO_PROXIMO: 'Vencimento próximo',
  ESGOTADO: 'Esgotado',
  CONSULTA: 'Consulta',
  EXAME: 'Exame',
  INTERNACAO: 'Internação',
  PROCEDIMENTO: 'Procedimento',
  FARMACIA: 'Farmácia',
  DINHEIRO: 'Dinheiro',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
  PIX: 'PIX',
  CONVENIO: 'Convênio'
};

export function displayLabel(value: string) {
  return statusLabels[value] ?? value.replaceAll('_', ' ').toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase('pt-BR'));
}
