# Tibia Scout 🛡️

Um dashboard moderno para consulta de personagens e notícias do Tibia, integrado com Supabase para histórico de buscas em tempo real.

## 🚀 Demonstração Online
Acesse o projeto rodando em tempo real:
**[https://tibia-scout-luizgustavolabs-projects.vercel.app](https://tibia-scout-luizgustavolabs-projects.vercel.app)**

## 🚀 Como começar

Siga estas instruções para configurar o projeto na sua máquina local.

### Pré-requisitos

Você vai precisar de:
* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* Um gerenciador de pacotes (NPM ou PNPM)

### 🔧 Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/hericlessssss/lg.git](https://github.com/hericlessssss/lg.git)
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd lg
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

### 🔑 Configuração das Variáveis de Ambiente

Para que o sistema funcione com o banco de dados e autenticação, você precisa configurar as chaves do Supabase:

1. Na raiz do projeto, crie um arquivo chamado `.env.local`.
2. Adicione as seguintes variáveis (você encontra esses valores no painel do seu projeto Supabase em *Settings > API*):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

---

## 🛠️ Padrão de Commits

Este projeto utiliza o [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) para manter o histórico organizado.

### Formato do Commit:
`<tipo>: <descrição curta>`

### Tipos Comuns:
* `feat`: Adição de uma nova funcionalidade.
* `fix`: Correção de um erro/bug.
* `docs`: Alterações na documentação (ex: README).
* `style`: Alterações de estilo ou formatação que não afetam o código.
* `refactor`: Mudança no código que não corrige erro nem adiciona funcionalidade.
* `chore`: Atualização de tarefas de build, pacotes ou ferramentas (ex: .gitignore).

### Exemplos:
* `feat: add character search filters`
* `fix: resolve iframe white screen flickering`
* `docs: update setup instructions`