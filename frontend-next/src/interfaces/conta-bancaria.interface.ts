export interface ContaBancaria {
  idConta: number;
  idUsuario: number;
  nomeBanco: string;
  agencia: string;
  numeroConta: string;
  tipoConta: string;
  dataCadastro: string;
  dataAtualizacao: string | null;
  ativo: string;
}