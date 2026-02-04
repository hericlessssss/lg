# Wiki do Projeto (Guia de Configuração)

Este documento serve como um guia passo a passo completo para preparar seu ambiente de desenvolvimento, rodar o projeto localmente e entender o processo de deploy.

**Objetivo:** Permitir que você configure o ambiente e execute a aplicação.
**Nota:** Este guia foca na infraestrutura e ferramentas. A lógica da aplicação é detalhada nas tarefas/issues específicas do projeto.

---

## 1. Visão Geral das Ferramentas

Antes de começar, é essencial entender as ferramentas utilizadas neste projeto:

### 1.1 Git (Controle de Versão)
Um sistema para rastrear alterações no código-fonte durante o desenvolvimento de software. Ele permite reverter mudanças, trabalhar em ramificações (branches) paralelas e manter um histórico do projeto.

### 1.2 GitHub (Repositório Remoto)
Uma plataforma baseada na web que hospeda o repositório Git. Facilita a colaboração, revisão de código e deploy.
**URL do Repositório:** https://github.com/hericlessssss/lg.git

### 1.3 Node.js (Ambiente de Execução)
Um ambiente de execução JavaScript construído sobre o motor V8 do Chrome. Ele permite executar JavaScript na sua máquina (lado do servidor) em vez de apenas no navegador. Ferramentas como Vite e React dependem do Node.js para funcionar durante o desenvolvimento e processos de build.

### 1.4 npm (Gerenciador de Pacotes)
Instalado automaticamente com o Node.js. Ele permite instalar bibliotecas (dependências) necessárias para o projeto.

### 1.5 Vite (Ferramenta de Build)
uma ferramenta de build moderna para frontend que fornece um servidor de desenvolvimento rápido e comandos de build otimizados para produção.

### 1.6 React (Biblioteca Frontend)
Uma biblioteca JavaScript para construir interfaces de usuário baseadas em componentes.

### 1.7 Supabase (Serviços de Backend)
Fornece autenticação, banco de dados e APIs. (Detalhes de configuração serão fornecidos em tarefas de desenvolvimento específicas).

---

## 2. Configuração do Ambiente

Siga estes passos para preparar sua estação de trabalho.

### 2.1 Criar um Diretório de Trabalho
Crie uma pasta dedicada para seus projetos de desenvolvimento para manter seu sistema organizado.
*   **Windows:** `C:\Dev`
*   **Mac/Linux:** `~/Dev`

### 2.2 Instalar o Git
1.  Baixe o instalador oficial para o seu sistema operacional.
2.  Execute o instalador. As configurações padrão geralmente são suficientes.
3.  **Verificação:**
    Abra seu terminal (PowerShell no Windows, Terminal no Mac/Linux) e execute:
    ```bash
    git --version
    ```
    *A saída deve ser semelhante a: `git version 2.x.x`*

### 2.3 Instalar o Node.js
1.  Baixe a versão **LTS (Long Term Support)** no site oficial do Node.js.
2.  Instale o pacote.
3.  **Verificação:**
    Execute os seguintes comandos no seu terminal:
    ```bash
    node -v
    npm -v
    ```
    *Ambos os comandos devem retornar números de versão.*

### 2.4 Instalar um Editor de Código (VS Code)
Recomendamos o Visual Studio Code por seu ecossistema robusto.
1.  Baixe e instale o VS Code.
2.  **Extensões Recomendadas:**
    *   **ESLint:** Verifica problemas de qualidade no código.
    *   **Prettier:** Formata o código automaticamente.
    *   **GitLens:** Visualiza o histórico do git.

### 2.5 Configurar Identidade do Git
Configure seu nome e email para identificar seus commits corretamente.
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

---

## 3. Instalação do Projeto

### 3.1 Clonar o Repositório
Navegue até seu diretório de trabalho e clone o projeto.

```bash
cd C:\Dev
git clone https://github.com/hericlessssss/lg.git
```

### 3.2 Instalar Dependências
Entre na pasta do projeto. O arquivo `package.json` lista as bibliotecas que o projeto precisa.

```bash
cd lg
npm install
```

Este comando cria um diretório `node_modules` contendo todas as bibliotecas instaladas. Este diretório não é enviado para o Git.

---

## 4. Fluxo de Trabalho de Desenvolvimento

### 4.1 Rodando o Projeto
Para iniciar o servidor de desenvolvimento local:

```bash
npm run dev
```

O terminal exibirá uma URL local, tipicamente `http://localhost:5173`. Abra esta URL no seu navegador para visualizar a aplicação.

*Para parar o servidor, pressione `CTRL + C` no terminal.*

### 4.2 Comandos Padrão
Execute estes comandos na raiz da pasta do projeto:

| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala as dependências do projeto definidas no `package.json`. |
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload. |
| `npm run build` | Compila a aplicação para produção na pasta `dist`. |
| `npm run preview` | Pré-visualiza o build de produção localmente. |

### 4.3 Visão Geral da Estrutura do Projeto
Uma estrutura típica de projeto Vite/React inclui:

*   **`src/`**: Código-fonte da aplicação.
    *   **`main.jsx`**: Ponto de entrada da aplicação React.
    *   **`App.jsx`**: O componente raiz.
    *   **`components/`**: Componentes de UI reutilizáveis.
*   **`public/`**: Ativos estáticos (imagens, fontes) que são servidos diretamente.
*   **`package.json`**: Metadados do projeto e lista de dependências.
*   **`vite.config.js`**: Configurações do Vite.

### 4.4 Melhores Práticas de Git
Faça commits pequenos e frequentes para salvar seu progresso.

1.  **Verificar status:** `git status`
2.  **Adicionar mudanças:** `git add .`
3.  **Commit:** `git commit -m "feat: descrição da funcionalidade"`
4.  **Enviar (Push):** `git push`

---

## 5. Noções Básicas de Deploy

Deploy é o processo de publicar sua aplicação em um servidor ativo.

1.  **Build:** O código é compilado usando `npm run build`. Isso gera arquivos estáticos otimizados no diretório `dist`.
2.  **Hospedagem:** Serviços como Vercel ou Netlify integram-se com o GitHub.
3.  **CI/CD:** Tipicamente, enviar (push) para o branch `main` aciona um build e deploy automáticos no serviço de hospedagem.

---

## 6. Solução de Problemas

Se você encontrar erros durante a instalação ou execução:

1.  **Leia a mensagem de erro:** Logs de erro frequentemente apontam exatamente para o arquivo ou configuração ausente.
2.  **Verifique a versão do Node:** Certifique-se de estar usando uma versão compatível do Node.js (LTS é a mais segura).
3.  **Instalação limpa:** Se erros estranhos persistirem, delete a pasta `node_modules` e o arquivo `package-lock.json`, e então rode `npm install` novamente.
