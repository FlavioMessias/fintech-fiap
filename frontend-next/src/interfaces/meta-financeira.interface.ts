export interface MetaFinanceira {
  idMeta: number;
  idUsuario: number;
  idTipoMeta: number;
  nome: string;
  valorObjetivo: number;
  valorAtual: number;
  dataInicio: string;
  dataPrazo: string | null;
  status: string;
  icone: string | null;
  dataAtualizacao: string | null;
}