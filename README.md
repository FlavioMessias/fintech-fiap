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
```

## Front-end

A pasta `frontend` contém as telas do sistema Fintech desenvolvidas com:

- HTML;
- CSS;
- JavaScript.

## Backend Java

A pasta `backend` contém o projeto Java desenvolvido para a atividade de Programação Orientada a Objetos.

Foram aplicados os seguintes conceitos:

- Encapsulamento;
- Construtores;
- Herança;
- Polimorfismo;
- Métodos com lógica real;
- Classe `Main` para execução do projeto.

## Classes do Backend

O projeto Java possui as seguintes classes:

- `Usuario`;
- `Categoria`;
- `FormaPagamento`;
- `Transacao`;
- `Entrada`;
- `Saida`;
- `MetaFinanceira`;
- `Main`.

## Herança

A classe `Transacao` funciona como superclasse para as classes `Entrada` e `Saida`.

```java
public class Entrada extends Transacao
```

```java
public class Saida extends Transacao
```

## Polimorfismo

O polimorfismo é demonstrado na classe `Main`, utilizando uma lista de transações:

```java
List<Transacao> transacoes = new ArrayList<>();
transacoes.add(entrada);
transacoes.add(saida);
```

Mesmo a lista sendo do tipo `Transacao`, cada objeto executa sua própria implementação dos métodos sobrescritos.

## Como executar o backend

Abra o projeto no IntelliJ IDEA e execute a classe:

```text
Main.java
```

Caminho da classe principal:

```text
backend/src/br/com/fintech/Main.java
```

## Autor

Flavio Hilario Messias Neto