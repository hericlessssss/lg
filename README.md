# Tibia Dashboard 🛡️

Um dashboard para consulta de personagens e notícias do Tibia, integrado com Supabase para histórico de buscas.

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
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    ```

2.  **Entre na pasta do projeto:**
    ```bash
    cd SEU_NOME_DA_PASTA
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

### 🔑 Configuração das Variáveis de Ambiente

Para que o sistema funcione com o banco de dados e autenticação, você precisa configurar as chaves do Supabase:

1. Na raiz do projeto, crie um arquivo chamado `.env.local`.
2. Adicione as seguintes variáveis (você encontra esses valores no painel do seu projeto Supabase em *Settings > API*):

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase