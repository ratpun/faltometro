# Faltômetro 🎓

Seu assistente de frequência universitária para nunca mais ser reprovado por faltas.

Um PWA (Progressive Web App) simples e moderno, projetado para ajudar estudantes universitários a controlar suas faltas em cada disciplina. Com uma interface escura e minimalista, o Faltômetro oferece uma experiência de usuário limpa e focada.

Ele salva todos os seus dados localmente no seu navegador, então você não perde suas informações ao fechar a página e pode usá-lo offline.

## ✨ Funcionalidades

- **Adicionar e Remover Disciplinas:** Gerencie facilmente sua grade horária.
- **Contador de Faltas:** Adicione ou remova faltas com um clique.
- **Persistência de Dados:** Suas disciplinas e faltas são salvas no `localStorage` do navegador.
- **Status Dinâmico:** A interface de cada disciplina muda de cor e exibe mensagens e imagens diferentes conforme o número de faltas aumenta.
- **Ordenação Automática:** As disciplinas com mais faltas são movidas automaticamente para o topo da lista.
- **Histórico de Faltas:** Registra a data de cada falta adicionada.
- **Tela de Reprovação:** Uma "celebração" especial com fogos de artifício e um vídeo quando o limite de faltas é atingido.
- **PWA (Progressive Web App):** Instale o Faltômetro no seu celular ou desktop para acesso rápido e funcionalidade offline.
- **Design Moderno e Responsivo:** Tema escuro e totalmente funcional em dispositivos móveis.

## 🚀 Tecnologias Utilizadas

- **HTML5**
- **CSS3** (Puro, sem frameworks)
- **JavaScript** (Vanilla JS)
- **Feather Icons** para a iconografia.
- **Service Workers** para funcionalidades PWA.

## 🛠️ Como Executar

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    ```

2.  **Abra o `index.html`:**
    Você pode simplesmente abrir o arquivo `index.html` no seu navegador.

    > **Nota:** Para que as funcionalidades do PWA (como a instalação e o cache offline) funcionem corretamente, é recomendado servir os arquivos a partir de um servidor local. Uma maneira fácil de fazer isso é usando a extensão **Live Server** no Visual Studio Code ou rodando um servidor Python:
    > ```bash
    > # Se você tem Python 3
    > python -m http.server
    > ```
    > Depois, acesse `http://localhost:8000` no seu navegador.

## 📂 Estrutura de Arquivos

```
/
├── icons/              # Ícones do PWA
├── images/             # Imagens de status
├── video.mp4           # Vídeo da tela de reprovação
├── index.html          # Estrutura principal
├── style.css           # Estilização
├── script.js           # Lógica da aplicação
├── manifest.json       # Manifesto do PWA
└── service-worker.js   # Script para funcionalidades offline
```

---

Feito com 💜 por Allaska.
