# ELO CARE - Sistema de Gestão Clínica

O ELO CARE é um Sistema de Banco de Dados não-relacional desenvolvido para otimizar a gestão de clínicas médicas. O foco central é a integração fluida entre recepção (agendamento), triagem (enfermagem), consulta (médico) e farmácia, garantindo que o histórico clínico do paciente seja centralizado e acessível em tempo real. 

**Requisitos:** 
- Controle de acesso por perfis (Admin, Médico, Enfermeiro, Recepcionista, Paciente).

- Agendamento com trava de horários por médico.

- Registro de triagem com sinais vitais e classificação de Manchester.

- Evolução clínica com suporte a CID-10 e emissão de receitas.

- Gestão de estoque de medicamentos e baixa automática na dispensa.

- **Persistência estrita via Driver Nativo MongoDB**, sem uso de ORMs.

---
<br>

## 🛠 Tecnologias Utilizadas

O projeto foi construído sobre uma stack moderna, priorizando a separação de responsabilidades (MVC + Repository) e a manipulação direta do banco de dados NoSQL.

### Backend

* **Node.js & Express:** Ambiente de execução e framework para criação da API RESTful.
* **Driver Nativo MongoDB (`mongodb`):** Utilizado exclusivamente para toda a comunicação com o SGB.
* **JWT (JSON Web Token):** Gerenciamento de autenticação e sessões seguras.
* **Bcryptjs:** Criptografia de senhas para persistência segura no banco de dados.
* **Dotenv:** Gerenciamento de variáveis de ambiente e strings de conexão.

### Frontend

* **React.js:** Construção de uma interface reativa e dinâmica (SPA).
* **Lucide React:** Conjunto de ícones para melhoria da experiência do usuário (UX).
* **Context API:** Gerenciamento de estado global da aplicação e dados de login.

---

<br>

## 🏗 Arquitetura do Banco de Dados (NoSQL)

A escolha pelo **MongoDB** justifica-se pela natureza dos dados clínicos. Prontuários e evoluções médicas são documentos semidestruturados onde a flexibilidade de campos (*schema-less*) permite que diferentes especialidades médicas armazenem informações específicas sem a necessidade de migrações complexas de esquemas relacionais.

### Principais Coleções

* `pacientes`: Dados demográficos e tipo sanguíneo.
* `agendamentos`: Vínculos entre médico, paciente e horários.
* `triagens`: Registro de sinais vitais vinculado ao agendamento.
* `evolucoes`: Histórico clínico e diagnóstico (CID).
* `medicamentos`: Controle de insumos e quantidades.

---

<br>

## 🚀 Como Rodar o Sistema

### Pré-requisitos

* Node.js instalado (v16 ou superior).
* Instância do MongoDB (Local ou Atlas).

### 1. Configuração do Backend

1. Navegue até a pasta `backend`.
2. Instale as dependências:
```bash
npm install

```


3. Crie um arquivo `.env` na raiz do backend com as seguintes chaves:
```env
CONNECTIONSTRING=sua_uri_do_mongodb
TOKEN_SECRET=uma_chave_aleatoria_segura
PORT=3001

```


4. **Povoar o Banco (Seed):** Para testar com dados prontos, execute o script de povoamento:
```bash
node src/seed.js

```


5. Inicie o servidor:
```bash
npm run start

```



### 2. Configuração do Frontend

1. Navegue até a pasta `frontend`.
2. Instale as dependências:
```bash
npm install

```


3. Inicie a aplicação:
```bash
npm run dev

```



---
<br>

## 🔑 Credenciais de Teste (Padrão Seed)

Após rodar o script `seed.js`, você pode utilizar os seguintes acessos (Senha padrão: `12345678`):

| Perfil | E-mail |
| --- | --- |
| **Admin** | `admin@clinica.com` |
| **Médico** | `carlos@clinica.com` |
| **Enfermeiro** | `mariana@clinica.com` |
| **Recepcionista** | `alice@clinica.com` |

---

## 📡 Endpoints da API (Postman Export)

> **Instruções:** Importe o arquivo JSON *(Clinica.postman_collection.json)* da coleção do Postman para visualizar todos os parâmetros de requisição, headers de autenticação e exemplos de resposta de cada rota do sistema.


<br>

## Documentação funcional e técnica do sistema, incluindo **papéis dos usuários** e **rotas da API**.



## 👥 Perfis de Usuário

<details>
  <summary><strong>🧾 Recepção (RECEPCIONISTA)</strong></summary>

  > A Recepção é o ponto inicial do atendimento do paciente e exerce um papel central no fluxo do sistema.

  ### Responsabilidades

  - Criar, listar, selecionar, editar e remover **Pacientes**
  - Criar, listar, selecionar, editar e remover **Médicos**
  - Criar, listar, selecionar, editar e remover **Enfermeiros**
  - Criar, listar, selecionar, editar e remover **Agendamentos**
  - Criar, listar, selecionar e editar **Recepcionistas**

  ### Dinâmica (exemplo)

  1. O paciente chega à clínica  
  2. A recepção confere se o paciente já possui cadastro  
  3. Caso não exista, o cadastro é criado  
  4. A recepção agenda a consulta vinculando:
     - Paciente
     - Médico
     - Data e horário

  ### Regras

  - ✅ Apenas a recepção pode criar agendamentos  
  - ❌ A recepção não acessa prontuários, não cria triagem e não prescreve

</details>

---

<details>
  <summary><strong>🩺 Enfermagem (ENFERMEIRO)</strong></summary>

  > O Enfermeiro atua na fase pré-consulta, sendo responsável pela avaliação inicial do paciente.

  ### Responsabilidades

  - Criar, listar, selecionar, editar e remover **Triagens**
  - Criar, listar, selecionar, editar e remover **Medicamentos**
  - Criar, listar e selecionar **dispensação de medicamentos**

  ### Dinâmica (exemplo)

  1. O paciente chega para o atendimento  
  2. O enfermeiro realiza a triagem  
  3. Registra sinais vitais, altura, peso e observações clínicas  
  4. Classifica o risco do paciente  
  5. O médico acessa essas informações durante a consulta

  ### Regras

  - ⚠️ O enfermeiro não cria diagnósticos e não prescreve receitas

</details>

---

<details>
  <summary><strong>🧑‍⚕️ Médico (MÉDICO)</strong></summary>

  > O Médico é responsável pelo atendimento clínico e pela gestão do prontuário do paciente.

  ### Responsabilidades

  - Listar e selecionar **Agendamentos**
  - Encerrar **Agendamentos** (atendimentos)
  - Listar, editar e selecionar **Triagens**
  - Criar, listar, selecionar, editar e remover **Evoluções médicas**
  - Criar, listar, selecionar, editar e remover **Receitas**
  - Criar, listar, selecionar, editar e remover **Exames**

  ### Dinâmica

  1. O médico acessa sua agenda  
  2. Visualiza a triagem do paciente  
  3. Realiza o atendimento clínico  
  4. Registra a evolução médica  
  5. Prescreve receitas e solicita exames, se necessário

  ### Regras

  - 🔒 O médico não cria usuários e não agenda consultas

</details>


---
<br>

## 📚 Documentação de Rotas da API


<details>
  <summary><strong>🔐 Autenticação (1)</strong></summary>

### 1. **POST** `/login`

- **Descrição:** Autentica um usuário (Admin, Médico, Paciente, etc).
- **Body:** `{ email, senha, tipo }`

</details>

---

<details>
  <summary><strong>🏥 Gestão de Usuários (19)</strong></summary>

### 👩‍💼 Recepcionistas

2. **POST** `/recepcionistas`  
   - Cria uma nova recepcionista.

3. **GET** `/recepcionistas`  
   - Lista todas as recepcionistas.

4. **GET** `/recepcionistas/buscar`  
   - Busca uma recepcionista pelo ID.

5. **DELETE** `/recepcionistas`  
   - Remove uma recepcionista.

---

### 🧑‍⚕️ Médicos

6. **POST** `/medicos`  
   - Cria um novo médico.

7. **GET** `/medicos`  
   - Lista todos os médicos.

8. **GET** `/medicos/buscar`  
   - Busca um médico pelo ID.

9. **PUT** `/medicos`  
   - Atualiza dados de um médico.

10. **DELETE** `/medicos`  
    - Remove um médico.

---

### 👤 Pacientes

11. **POST** `/pacientes`  
    - Cria um novo paciente.

12. **GET** `/pacientes`  
    - Lista todos os pacientes.

13. **GET** `/pacientes/buscar`  
    - Busca um paciente pelo ID.

14. **PUT** `/pacientes`  
    - Atualiza dados de um paciente.

15. **DELETE** `/pacientes`  
    - Remove um paciente.

---

### 🩺 Enfermeiros

16. **POST** `/enfermeiros`  
    - Cria um novo enfermeiro.

17. **GET** `/enfermeiros`  
    - Lista todos os enfermeiros.

18. **GET** `/enfermeiros/buscar`  
    - Busca um enfermeiro pelo ID.

19. **PUT** `/enfermeiros`  
    - Atualiza dados de um enfermeiro.

20. **DELETE** `/enfermeiros`  
    - Remove um enfermeiro.

</details>

---

<details>
  <summary><strong>📅 Agendamentos (8)</strong></summary>

### 🧾 Visão da Recepção

21. **POST** `/agendamento/recepcionista`  
    - Cria um agendamento.

22. **GET** `/agendamento/recepcionista`  
    - Lista todos os agendamentos.

23. **GET** `/agendamento/recepcionista/buscar`  
    - Busca um agendamento por ID.

24. **PUT** `/agendamento/recepcionista`  
    - Atualiza um agendamento.

25. **DELETE** `/agendamento/recepcionista`  
    - Cancela/Remove um agendamento.

---

### 🧑‍⚕️ Visão do Médico

26. **GET** `/agendamento/medico`  
    - Lista agendamentos pendentes do médico logado.

27. **GET** `/agendamento/medico/buscar`  
    - Busca detalhes de um agendamento.

28. **PUT** `/agendamento/medico`  
    - Finaliza o atendimento.

</details>

---

<details>
  <summary><strong>🌡️ Triagem (8)</strong></summary>

### 🩺 Visão do Enfermeiro

29. **POST** `/triagem/enfermeiro`  
    - Registra triagem.

30. **GET** `/triagem/enfermeiro`  
    - Lista todas as triagens.

31. **GET** `/triagem/enfermeiro/buscar`  
    - Busca uma triagem por ID.

32. **PUT** `/triagem/enfermeiro`  
    - Atualiza dados da triagem.

33. **DELETE** `/triagem/enfermeiro`  
    - Remove uma triagem.

---

### 🧑‍⚕️ Visão do Médico

34. **GET** `/triagem/medico`  
    - Lista triagens disponíveis.

35. **GET** `/triagem/medico/buscar`  
    - Busca a triagem do paciente.

36. **PUT** `/triagem/medico`  
    - Atualiza observações da triagem.

</details>

---

<details>
  <summary><strong>💊 Farmácia e Estoque (8)</strong></summary>

### Medicamentos

37. **POST** `/medicamentos`  
    - Cadastra medicamento.

38. **GET** `/medicamentos`  
    - Lista estoque.

39. **GET** `/medicamentos/buscar`  
    - Busca medicamento por ID.

40. **PUT** `/medicamentos`  
    - Atualiza medicamento.

41. **DELETE** `/medicamentos`  
    - Remove medicamento.

---

### Dispensação

42. **POST** `/medicamentos/dispensar`  
    - Realiza baixa no estoque.

---

### Histórico

43. **GET** `/dispensas`  
    - Lista dispensas.

44. **GET** `/dispensas/buscar`  
    - Busca dispensa por ID.

</details>

---

<details>
  <summary><strong>📝 Prontuário Eletrônico (15)</strong></summary>

### Evolução

45. **POST** `/evolucao`  
    - Cria evolução.

46. **GET** `/evolucao`  
    - Lista evoluções.

47. **GET** `/evolucao/buscar`  
    - Busca evolução por ID.

48. **PUT** `/evolucao`  
    - Atualiza evolução.

49. **DELETE** `/evolucao`  
    - Remove evolução.

---

### Receitas

50. **POST** `/receitas`  
    - Cria receita.

51. **GET** `/receitas`  
    - Lista receitas.

52. **GET** `/receitas/buscar`  
    - Busca receita por ID.

53. **PUT** `/receitas`  
    - Atualiza receita.

54. **DELETE** `/receitas`  
    - Cancela receita.

---

### Exames

55. **POST** `/exames`  
    - Solicita exame.

56. **GET** `/exames`  
    - Lista exames.

57. **GET** `/exames/buscar`  
    - Busca exame por ID.

58. **PUT** `/exames`  
    - Atualiza exame.

59. **DELETE** `/exames`  
    - Remove exame.

</details>
