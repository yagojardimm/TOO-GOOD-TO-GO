# SaveFood 🥗

Aplicativo mobile híbrido desenvolvido com **React Native** e **Expo**, inspirado no modelo internacional do *Too Good To Go*. O objetivo é combater o desperdício alimentar conectando padarias, restaurantes, mercados e confeitarias a consumidores para o resgate de **Sacolas Surpresa** com até 70% de desconto.

---

## 👥 Integrantes da Dupla
* **Yago Jardim**
* **Caio**

---

## 📱 Funcionalidades Desenvolvidas

### 🟢 Módulo 1 (Exploração, Reserva e Pedidos - Yago):
1. **Feed de Oportunidades:**
   * Listagem de sacolas surpresa disponíveis no dia com fotos de alta qualidade.
   * Badges de desconto (-65%), contador de itens restantes e notas de avaliação.
   * Barra de busca em tempo real por nome do estabelecimento ou produto.
   * Carrossel de filtros por categoria (Todos, Padarias, Refeições, Mercados, Doces & Bolos, Vegano).
2. **Visualização em Mapa Interativo:**
   * Alternador rápido entre Lista e Mapa no cabeçalho.
   * Radar de distância com pins dos estabelecimentos geolocalizados exibindo os preços.
   * Card flutuante de prévia ao tocar nos pins para navegação rápida.
3. **Detalhes da Sacola Surpresa:**
   * Galeria e foto de capa com favoritos e botão de retorno.
   * Informações completas do estabelecimento e janelas de horário de retirada.
   * Explicação didática do conceito da Sacola Surpresa.
   * Endereço da loja e regras de resgate no balcão.
4. **Checkout e Revisão da Reserva:**
   * Seletor interativo de quantidade de sacolas com atualização em tempo real.
   * Cálculo de impacto ecológico positivo (refeições salvas e kg de CO₂e evitados).
   * Opções de pagamento simulado (Pix Instantâneo e Cartão de Crédito).
   * Detalhamento de valores, descontos e total a pagar.
5. **Confirmação e Recibo Digital:**
   * Tela de sucesso com código do pedido (#SF-XXXX).
   * Orientações de coleta e botão de direcionamento para acompanhamento de vouchers.

### 🔵 Módulo 2 (Gestão, Perfil e Parceiros - Caio):
* Histórico de pedidos e vouchers digitais ativos.
* Painel de perfil do usuário e métricas acumuladas de sustentabilidade.
* Painel de controle do lojista parceiro para cadastro de novas sacolas do dia.

---

## 🛠️ Tecnologias Utilizadas
* **React Native** (v0.86)
* **Expo** (SDK 57)
* **Expo Vector Icons** (Feather)
* **JavaScript / JSX Moderno**

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
```bash
git clone https://github.com/yagojardimm/TOO-GOOD-TO-GO.git
cd TOO-GOOD-TO-GO
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npx expo start
```

* **No celular:** Abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.
* **No navegador web:** Pressione `w` no terminal para executar a versão web.
