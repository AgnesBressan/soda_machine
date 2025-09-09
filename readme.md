# Máquina de Refrigerante 🍹

Este projeto implementa uma **máquina de refrigerante virtual** utilizando **HTML, CSS e JavaScript**.  
O usuário pode escolher diferentes bebidas, inserir moedas (via drag & drop no desktop ou toque no mobile) e liberar a bebida quando o valor total chega a R$ 2,50. Caso o valor exceda, a máquina devolve o troco.  

## ✨ Funcionalidades
- Lista de refrigerantes e sabores carregados de um **Web Service (AJAX)**.  
- Interface gráfica com prateleira de bebidas e console interativo.  
- Inserção de moedas:  
  - **Desktop**: arrastar e soltar as moedas no slot.  
  - **Mobile**: toque nas moedas para inserir.  
- Visor que mostra o valor inserido em tempo real.  
- Exibição de mensagens de status (bebida liberada, falta de crédito, troco).  
- Layout estilizado e responsivo.

## 🚀 Tecnologias
- **HTML5**  
- **CSS3** (layout responsivo, grid e flexbox)  
- **JavaScript** (DOM, eventos, drag & drop, AJAX)  

## ▶️ Como rodar o projeto

1. **Clone ou baixe** este repositório.  
2. Abra a pasta do projeto no seu computador.  
3. Existem algumas formas de rodar:

### Opção 1 — Live Server (VS Code)
- Instale a extensão **Live Server** no VS Code.  
- Clique com o botão direito no arquivo `index.html` → **Open with Live Server**.  
- O navegador abrirá em `http://127.0.0.1:5500/` (ou similar).  

### Opção 2 — Servidor Python
- No terminal, dentro da pasta do projeto, rode:
  ```bash
  python3 -m http.server 8000 --bind 0.0.0.0
  ```
- Abra o navegador em:
  ```
  http://localhost:8000
  ```
- Se quiser acessar de outro dispositivo na mesma rede (ex.: celular), use o IP da sua máquina:
  ```
  http://SEU_IP:8000
  ```

### Opção 3 — Abrir direto
- Basta abrir o arquivo `index.html` no navegador.  
  ⚠️ Porém, o carregamento do **Web Service (AJAX)** pode não funcionar em alguns navegadores por restrição de CORS.

## 👩‍💻 Autoria
Projeto desenvolvido por **Agnes Bressan de Almeida** para a disciplina  
**Introdução a Desenvolvimento Web**, ministrada pela professora  
**Bruna Carolina Rodrigues da Cunha**.

---
📚 *Este repositório é parte dos estudos práticos da disciplina, com foco em interatividade e manipulação do DOM.*
