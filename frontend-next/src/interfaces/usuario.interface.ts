export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  ativo: string;
  dataCadastro: string;
  dataAtualizacao: string | null;
}