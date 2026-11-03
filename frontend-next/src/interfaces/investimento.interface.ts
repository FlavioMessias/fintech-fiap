export interface Investimento {
  idInvestimento: number;
  idUsuario: number;
  idContaBancaria: number;
  nome: string;
  tipo: string;
  valorAplicado: number;
  dataInvestimento: string;
  descricao: string | null;
  status: string;
  dataAtualizacao: string | null;
  ativo: string;
}