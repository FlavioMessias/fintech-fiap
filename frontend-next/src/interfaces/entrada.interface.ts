export interface Entrada {
  idEntrada: number;
  idUsuario: number;
  idCategoria: number;
  idFormaMovimentacao: number;
  valor: number;
  dataEntrada: string;
  descricao: string;
  dataAtualizacao: string | null;
  ativo: string;
}