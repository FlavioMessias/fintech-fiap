export interface Saida {
  idSaida: number;
  idUsuario: number;
  idCategoria: number;
  idFormaMovimentacao: number;
  valor: number;
  dataSaida: string;
  descricao: string;
  status: string;
  dataAtualizacao: string | null;
  ativo: string;
}