O finance-app é um Single-spa Parcel que representa a aplicação contendo Landing Page, Autenticação, Trasações e Análises. O site em produção pode ser acessado em: https://d1vqzf4765g06r.cloudfront.net/

---

### 🧑‍💻 Usuário que usei para os testes:
- user: a@b.com
- senha: 123456

--- 

#### 🐳 Para executar localmente com docker, siga esses passos: [Docker Compose](https://github.com/grupo21-tech-challange-02/docker-compose)

---

### Primeiramente

Crie um diretório chamado tc2;

Dentro desse diretório, clone cada um dos três projetos:
- ``` git clone https://github.com/grupo21-tech-challange-02/docker-compose.git ```
- ``` git clone https://github.com/grupo21-tech-challange-02/root-config.git ```
- ``` git clone https://github.com/grupo21-tech-challange-02/finance-app.git ```

#### 🚨 Importante: O funcionamento desse repositório depende da pré execução do projeto [root-config](https://github.com/fiap-grupo-21-tech-challenge/root-config);

---

### 🏃‍♂️ Passo a passo para executar finance-app localmente:

Acesse o repositório diretório finance-app;

Instalar dependências:
- ```npm install```

Dentro do repositório root-config:
- ```npm run start --port 8080```

No navegador:
- ```http://localhost:9000/```

Você deverá criar um novo usuário clicando em **Criar Conta** na Landing Page ou acessando **http://localhost:9000/cadastro**:


<img width="1094" height="655" alt="Captura de Tela 2026-01-19 às 22 58 40" src="https://github.com/user-attachments/assets/69a90441-8c9a-45dc-80f6-59dc2417c25f" />
<br />
<br />
Após a criação do usuário, o app redireciona para a home do dashboard, onde é possível listar, criar, alterar e deletar novas transações, assim como obter insights significativos e filtrar ou procurar transações na listagem.

---

<br />
Home: 
<br /><br />
<img width="1094" height="852" alt="Captura de Tela 2026-01-19 às 22 58 56" src="https://github.com/user-attachments/assets/76142928-9695-40b3-b588-ded08ea42fbb" />
<br /><br />
Transações:
<br /><br />
<img width="1094" height="852" alt="Captura de Tela 2026-01-20 às 19 47 47" src="https://github.com/user-attachments/assets/5601a355-0fca-41c7-bd89-f42018726a7f" />
<br /><br />
Analises:
<br /><br />
<img width="1094" height="852" alt="Captura de Tela 2026-01-20 às 19 48 50" src="https://github.com/user-attachments/assets/3eed2d9c-6b2e-494e-b743-8e822d845cde" />
<br />

---

### 🚀 Instruções deploy:

- Fazer o push de alguma alteração na branch main, diretamente ou via pull request;
- O workflow de deploy deve ser iniciado na aba actions;
- O workflow instala dependências, gera um novo arquivo .dist e faz upload no servidor;
- Após alguns segundos do término, o cache é invalidado e as alterações estão disponíveis;
