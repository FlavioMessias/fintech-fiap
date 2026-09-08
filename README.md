# Fintech FIAP

Projeto acadêmico desenvolvido para a FIAP com foco em um sistema de controle financeiro pessoal.

## Estrutura do Projeto

```text
fintech-fiap
├── frontend
│   ├── css
│   ├── js
│   └── page
│
├── backend
│   └── src
│       └── br
│           └── com
│               └── fintech
│                   ├── Main.java
│                   └── model
│                       ├── Usuario.java
│                       ├── Categoria.java
│                       ├── FormaPagamento.java
│                       ├── Transacao.java
│                       ├── Entrada.java
│                       ├── Saida.java
│                       └── MetaFinanceira.java
│
└── .gitignore

Front-end

A pasta frontend contém as telas do sistema Fintech desenvolvidas com HTML, CSS e JavaScript.

Backend Java

A pasta backend contém o projeto Java desenvolvido para a atividade de Programação Orientada a Objetos.

Foram aplicados os seguintes conceitos:

Encapsulamento;
Construtores;
Herança;
Polimorfismo;
Métodos com lógica real;
Classe Main para execução do projeto.
Herança

A classe Transacao funciona como superclasse para as classes Entrada e Saida.

public class Entrada extends Transacao
public class Saida extends Transacao
Polimorfismo

O polimorfismo é demonstrado na classe Main, utilizando uma lista de transações:

List<Transacao> transacoes = new ArrayList<>();
transacoes.add(entrada);
transacoes.add(saida);

Cada objeto executa sua própria implementação dos métodos sobrescritos.

Como executar o backend

Abra o projeto no IntelliJ IDEA e execute a classe:

Main.java

Caminho:

backend/src/br/com/fintech/Main.java

Autor

Flavio Hilario Messias Neto