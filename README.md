# API de Gerenciamento de Estudantes

API REST desenvolvida para gerenciar estudantes, turmas e matrículas.

## 🚀 Tecnologias

- Node.js
- Express
- Sequelize (MySQL)
- JWT para autenticação
- Jest para testes

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
   ## ⚙️ Configuração das Variáveis de Ambiente

   Após instalar as dependências, você precisa configurar as variáveis de ambiente:

   1. Copie o arquivo `.env.exemple` para criar seu arquivo de ambiente:
      ```bash
      cp .env.exemple .env.development
        ```
   2. Configure as seguintes variáveis no arquivo `.env.development`:
   ### Banco de Dados
    ```bash
    DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   DB_DIALECT=mysql
   ```
   ### JWT
```bash
   JWT_SECRET=seu_segredo
   JWT_EXPIRATION=1h
   ```
### Servidor
```bash
   PORT=3000
```
## Cliente
```bash
   CLIENT_URL=url_do_cliente
```
## 🛠️ Configuração e Inicialização


1. Configure o banco de dados MySQL e crie um banco vazio chamado `studentDB`.

2. Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   npm run migrate
   ```
   Popule o banco de dados com os dados iniciais utilizando os seeds:
   ```bash
   npm run seed
   ```
   Nota: O seed incluirá um usuário administrador com as seguintes credenciais:
    ```bash
      Email: admin@example.com
      Senha: @123456
      Função: admin
   ```
## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI no seguinte endereço:

[https://student-management-api-production-8612.up.railway.app/api-docs/#/](https://student-management-api-production-8612.up.railway.app/api-docs/#/)

Através desta interface você pode:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pelo navegador
- Consultar os modelos de payload e respostas
- Ver os diferentes códigos de status e mensagens de erro
