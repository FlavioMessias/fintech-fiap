# Fintech FIAP

Aplicação web de controle financeiro desenvolvida como projeto acadêmico da FIAP.

O sistema permite que o usuário autenticado acompanhe sua vida financeira por meio do gerenciamento de entradas, saídas, investimentos e metas financeiras, além de visualizar indicadores consolidados no Dashboard e na área de Relatórios.

O projeto é dividido em duas aplicações:

- **Backend:** Java + Spring Boot
- **Frontend:** React com Next.js
- **Banco de Dados:** Oracle Database — instância FIAP

---

## Funcionalidades

O sistema possui as seguintes funcionalidades:

- Autenticação de usuário
- Dashboard financeiro
- Controle de entradas
- Controle de saídas
- Controle de investimentos
- Controle de metas financeiras
- Relatórios financeiros
- Visualização dos dados da conta
- Tema claro e escuro
- Página personalizada para erro 404

### Entidades com CRUD

Foram implementadas quatro entidades principais com operações de criação, consulta, atualização e exclusão:

1. Entrada
2. Saída
3. Investimento
4. Meta Financeira

O projeto supera, portanto, o requisito mínimo de três entidades.

---

# Estrutura do projeto

```text
fintech-fiap/
│
├── backend-spring/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── frontend-next/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

# Tecnologias utilizadas

## Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- Oracle Database
- BCrypt para proteção das senhas

## Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- Lucide React

## Banco de Dados

- Oracle Database
- Instância Oracle disponibilizada pela FIAP

---

# Pré-requisitos

Para executar o projeto, é necessário possuir:

- Java 21 ou superior compatível com o projeto
- Maven ou Maven Wrapper
- Node.js
- npm
- Acesso à instância Oracle da FIAP

---

# Configuração do banco de dados

O backend utiliza a instância Oracle disponibilizada pela FIAP.

As configurações de conexão devem estar disponíveis no arquivo de configuração do Spring Boot localizado no projeto:

```text
backend-spring/src/main/resources/
```

Certifique-se de que as credenciais de acesso ao Oracle FIAP estejam corretamente configuradas antes de iniciar a aplicação.

---

# Como executar o Backend

Abra um terminal na raiz do projeto e acesse:

```bash
cd backend-spring
```

## Utilizando Maven

Execute:

```bash
mvn spring-boot:run
```

Ou utilizando o Maven Wrapper no Windows:

```bash
mvnw.cmd spring-boot:run
```

Em sistemas Linux/macOS:

```bash
./mvnw spring-boot:run
```

Por padrão, o backend será disponibilizado em:

```text
http://localhost:8080
```

---

# Como executar o Frontend

Abra outro terminal e acesse:

```bash
cd frontend-next
```

Instale as dependências:

```bash
npm install
```

Depois inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

---

# Comunicação entre Frontend e Backend

O frontend utiliza uma variável de ambiente para definir o endereço do backend.

No ambiente local, utilize:

```env
API_URL=http://localhost:8080
```

O backend deve estar em execução antes de utilizar as funcionalidades que acessam o banco de dados.

---

# Usuário de teste

Utilize as seguintes credenciais para acessar o sistema:

```text
E-mail: frontend@fintech.com
Senha: Front123
```

Após realizar o login com sucesso, o usuário será direcionado para o Dashboard.

---

# Principais rotas do Frontend

```text
/                 Página inicial
/login            Login
/dashboard        Dashboard
/entradas         Entradas
/saidas           Saídas
/investimentos    Investimentos
/metas            Metas financeiras
/relatorios       Relatórios
/minha-conta      Dados do usuário
```

As entidades também possuem páginas específicas para criação e edição dos registros.

---

# Testes de compilação

Antes da entrega, o frontend foi validado utilizando:

```bash
npm run build
```

O backend foi validado utilizando:

```bash
mvn clean package
```

Ambos os projetos foram compilados com sucesso.

---

# Instalação limpa do Frontend

As dependências do frontend estão declaradas nos arquivos:

```text
package.json
package-lock.json
```

Por esse motivo, a pasta:

```text
node_modules
```

não é necessária para distribuição ou entrega do projeto.

Para reconstruir as dependências:

```bash
npm install
```

---

# Arquivos que não devem ser incluídos na entrega

O arquivo `.zip` final não deve conter diretórios gerados automaticamente, principalmente:

```text
frontend-next/node_modules/
frontend-next/.next/
backend-spring/target/
.git/
```

Esses arquivos podem ser reconstruídos a partir do código-fonte e dos arquivos de configuração do projeto.

---

# Fluxo básico para teste

Para testar o projeto de ponta a ponta:

1. Inicie o backend Spring Boot.
2. Confirme a conexão com o Oracle FIAP.
3. Inicie o frontend.
4. Acesse `http://localhost:3000`.
5. Realize o Login utilizando o usuário de teste.
6. Acesse o Dashboard.
7. Teste o cadastro, edição e exclusão de:
   - Entradas
   - Saídas
   - Investimentos
   - Metas financeiras
8. Consulte a página de Relatórios.
9. Teste o tema claro e escuro.
10. Finalize a sessão através da opção de logout.

---

# Entrega

A estrutura final entregue contém:

- Projeto Backend em Java / Spring Boot
- Projeto Frontend em React / Next.js
- Integração com Oracle FIAP
- Este README com instruções de inicialização
- Credenciais do usuário de teste
- Mais de três entidades com operações CRUD

O projeto foi compactado no formato `.zip` sem a pasta `node_modules`.

---

## Autor
Flavio Hilario Messias Neto
Projeto acadêmico desenvolvido para a FIAP.