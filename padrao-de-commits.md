# Padrão de Commits (Git) — Guia Prático

Este documento define **o que são commits**, **por que eles são essenciais**, e como utilizar o Git na prática seguindo um padrão profissional de mensagens (Conventional Commits).

**Objetivo:** Garantir que cada alteração no projeto seja registrada como um commit pequeno, atômico e bem descrito.

---

## 1. O que é um Commit?

Um **commit** representa um ponto na história do seu projeto. É como salvar um "snapshot" do estado atual dos arquivos, acompanhado de uma mensagem que explica o que foi alterado.

### Por que commits são importantes?
*   **Histórico e Reversão:** Permite voltar a qualquer ponto anterior caso algo quebre.
*   **Rastreabilidade:** É possível saber **quem**, **quando** e **por que** uma alteração foi feita.
*   **Trabalho em Equipe:** Facilita a revisão de código e o entendimento da evolução do projeto por outros desenvolvedores.
*   **Organização:** Ajuda na gestão de deploys e releases.

**Nota:** Bons commits são fundamentais para a saúde de um projeto a longo prazo.

---

## 2. Quando fazer um Commit?

A regra de ouro é: **faça commit sempre que concluir uma pequena unidade lógica de trabalho.**

### Bons momentos para commitar:
*   Criação da estrutura inicial do projeto.
*   Configuração de ferramentas (ESLint, Prettier).
*   Implementação de uma funcionalidade específica (ex: Tela de Login).
*   Correção de um bug isolado.

### O que evitar:
*   Fazer um único commit gigante no final do dia.
*   Misturar alterações de contextos diferentes (ex: criar login, mudar CSS da home e atualizar dependências no mesmo commit).

> **Regra Prática:** Se você não consegue descrever a mudança em uma única frase simples, provavelmente o commit está grande demais.

---

## 3. Padrão de Mensagem (Conventional Commits)

Adotaremos o padrão **Conventional Commits**, que utiliza prefixos semânticos para categorizar as mudanças.

### Tipos Principais
*   `feat:` **Nova funcionalidade** (feature).
*   `fix:` **Correção de bug**.
*   `chore:` **Tarefas técnicas** que não alteram código de produção (configurações, build).
*   `docs:` **Documentação** (README, Wiki).
*   `style:` **Formatação** (espaços, ponto e vírgula, lint) sem alterar lógica.
*   `refactor:` **Refatoração** de código (melhoria interna sem mudar comportamento).
*   `test:` **Testes** (criação ou correção).
*   `perf:` **Performance** (otimizações).

### Estrutura
```text
tipo: descrição curta no imperativo
```

**O que é o imperativo?**
Escreva como se estivesse dando uma ordem ou comando.
*   *Correto:* "adiciona tela de login"
*   *Errado:* "adicionando tela de login" ou "tela de login adicionada"

---

## 4. Exemplos Práticos

Abaixo estão exemplos de como escrever (e como não escrever) suas mensagens.

### `feat:` (Funcionalidades)
*   ✅ `feat: create login page`
*   ✅ `feat: add protected dashboard route`
*   ✅ `feat: save search history on submit`

### `fix:` (Correções)
*   ✅ `fix: handle invalid credentials message`
*   ✅ `fix: prevent submit when input is empty`
*   ❌ `fix: arrumei o bug` (Vago demais)

### `chore:` (Manutenção)
*   ✅ `chore: update dependencies`
*   ✅ `chore: configure editor settings`

### `docs:` (Documentação)
*   ✅ `docs: add setup guide to README`
*   ❌ `docs: atualizando doc` (Gerúndio)

---

## 5. Tamanho Ideal do Commit

Mantenha o foco na atomicidade.

### ✅ Aceitável
*   "criei a página de login"
*   "configurei o supabase client"
*   "protegi a rota do dashboard"

### ❌ Inaceitável
*   "fiz tudo do projeto"
*   "várias mudanças"
*   "ajustes gerais"

---

## 6. Guia Passo a Passo (Terminal)

### 6.1 Verificar Mudanças
Veja quais arquivos foram modificados.
```bash
git status
```

### 6.2 Visualizar Diferenças (Opcional)
Veja linha a linha o que mudou.
```bash
git diff
```

### 6.3 Adicionar Arquivos (Staging)
Prepare os arquivos para o commit.
```bash
# Adicionar tudo
git add .

# Ou adicionar arquivo específico
git add src/App.jsx
```

### 6.4 Criar o Commit
Gere o snapshot com a mensagem no padrão.
```bash
git commit -m "feat: create login page"
```

### 6.5 Enviar para o GitHub
Envie suas alterações para o repositório remoto.
```bash
git push
```

---

## 7. Fluxo de Trabalho Recomendado

Para manter um ritmo saudável e seguro:

1.  **Trabalhe** em uma pequena tarefa.
2.  **Teste** localmente (`npm run dev`) para garantir que nada quebrou.
3.  **Verifique** o status (`git status`).
4.  **Adicione** os arquivos (`git add .`).
5.  **Commit** (`git commit -m "..."`).
6.  **Push** (`git push`).

---

## 8. Checklist de Qualidade

Antes de confirmar um commit, pergunte-se:

*   [ ] Consigo explicar o que fiz em uma frase curta?
*   [ ] O projeto continua rodando sem erros?
*   [ ] O commit contém apenas alterações relacionadas ao objetivo?
*   [ ] A mensagem segue o padrão (`tipo: descrição`)?
