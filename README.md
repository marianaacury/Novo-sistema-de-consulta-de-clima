# 🌦️ Sistema de Consulta de Clima

Projeto desenvolvido para demonstrar a integração entre **Desenvolvimento Web, API REST, MQTT, JavaScript e IoT**, utilizando a API OpenWeatherMap para consultar informações meteorológicas em tempo real e o protocolo MQTT para comunicação com dispositivos como o ESP32.

A aplicação permite pesquisar diferentes cidades, visualizar informações detalhadas sobre o clima, acompanhar um histórico das consultas, salvar cidades favoritas e visualizar os dados em um gráfico.

---

## 📌 Sobre o projeto

O sistema permite que o usuário informe uma cidade e selecione um país para realizar uma consulta meteorológica.

Os dados são obtidos através da API **OpenWeatherMap** e apresentados diretamente na interface da aplicação.

Entre as informações exibidas estão:

- 🌡️ Temperatura atual;
- 🌡️ Sensação térmica;
- 🔺 Temperatura máxima;
- 🔻 Temperatura mínima;
- 💧 Umidade relativa do ar;
- 💨 Velocidade do vento;
- 📊 Pressão atmosférica;
- 👁️ Visibilidade;
- 🌎 Cidade consultada;
- 🕐 Data e horário da última atualização.

Além disso, o sistema possui recursos adicionais para melhorar a experiência do usuário, como **histórico de consultas, cidades favoritas e modo escuro**.

---

## 🎯 Objetivo

O objetivo do projeto é demonstrar, de forma prática, como diferentes tecnologias podem ser integradas em uma aplicação.

O funcionamento principal pode ser representado por:

**Usuário → Aplicação Web → OpenWeatherMap → Dados climáticos → MQTT → ESP32**

O projeto permite trabalhar conceitos como:

- Consumo de APIs REST;
- Requisições HTTP;
- Manipulação de dados JSON;
- JavaScript;
- Programação assíncrona;
- MQTT;
- Comunicação Publish/Subscribe;
- Armazenamento local no navegador;
- Visualização de dados;
- Integração entre Web e IoT.

---

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- MQTT
- MQTT.js
- Chart.js
- OpenWeatherMap API
- HiveMQ MQTT Broker
- ESP32
- LocalStorage

---

## 🔗 Bibliotecas utilizadas

### MQTT.js

Biblioteca utilizada para estabelecer a comunicação MQTT diretamente pelo navegador.

```html
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
```

### Chart.js

Biblioteca utilizada para criar o gráfico de temperatura e umidade.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## 🌐 OpenWeatherMap

A aplicação utiliza a API do OpenWeatherMap para consultar os dados meteorológicos.

O usuário deve criar uma conta e gerar uma **API Key**.

Depois, a chave deve ser configurada no código:

```javascript
const OPENWEATHER_API_KEY = "SUA_CHAVE_AQUI";
```

🌐 OpenWeatherMap
A aplicação utiliza a API do OpenWeatherMap para consultar os dados meteorológicos.
É necessário possuir uma API Key para realizar as consultas.
No código, localize:
const OPENWEATHER_API_KEY =
  "Colar chave aqui";
Substitua "Colar chave aqui" pela sua chave da OpenWeatherMap.
⚠️ Importante
Não publique sua API Key real no GitHub.
Para projetos públicos, recomenda-se utilizar uma variável de ambiente ou outra forma de proteção da chave.
Caso uma chave seja publicada acidentalmente, ela deve ser substituída ou revogada no serviço correspondente.

📡 Comunicação MQTT
O projeto utiliza o protocolo MQTT para realizar a comunicação entre a aplicação Web e outros dispositivos conectados ao mesmo broker.
O broker utilizado é o:
broker.hivemq.com
A comunicação pelo WebSocket utiliza:
ws://broker.hivemq.com:8000/mqtt
Configuração utilizada no projeto:
const MQTT_BROKER =
  "ws://broker.hivemq.com:8000/mqtt";

📋 Tópicos MQTT
O sistema trabalha com os seguintes tópicos:
Tópico
Função
esp32/clima/temperatura
Publicação da temperatura
esp32/clima/umidade
Publicação da umidade
esp32/clima/cidadeAtual
Publicação da cidade consultada
esp32/clima/cidade
Envio da cidade selecionada

Ao realizar uma consulta, a aplicação publica a temperatura, a umidade e a cidade atual no broker MQTT.
Por exemplo:
esp32/clima/temperatura
Pode receber:
24.5
Enquanto:
esp32/clima/umidade
Pode receber:
65

🌦️ Dados meteorológicos
A aplicação consulta diferentes informações fornecidas pela API.
Temperatura
Apresentada em graus Celsius:
24.5 °C
Sensação térmica
Indica a temperatura percebida:
25.2 °C
Umidade
Apresentada em porcentagem:
65 %
Temperatura máxima e mínima
Mostra os valores máximo e mínimo informados pela API:
Máxima: 28.0 °C
Mínima: 19.0 °C
Velocidade do vento
Convertida para quilômetros por hora:
15.4 km/h
Pressão atmosférica
Apresentada em hectopascais:
1015 hPa
Visibilidade
Convertida para quilômetros:
10.0 km

📊 Gráfico
O projeto utiliza o Chart.js para apresentar os dados meteorológicos visualmente.
O gráfico apresenta:
Temperatura;
Umidade;
Horário de cada consulta.
O gráfico possui limite de 30 registros, evitando que uma quantidade muito grande de dados seja acumulada na interface.
Exemplo de informações apresentadas:
Horário
Temperatura (°C)
Umidade (%)

📝 Histórico de consultas
O sistema possui uma área de histórico que registra as consultas realizadas pelo usuário.
Cada registro apresenta:
Cidade - Temperatura - Umidade
Exemplo:
Brotas - 24.5 °C - 65%
As consultas mais recentes aparecem primeiro no histórico.

⭐ Cidades favoritas
O sistema permite que o usuário salve cidades como favoritas.
Para adicionar uma cidade:
Informe o nome da cidade;
Selecione o país;
Clique em Adicionar aos favoritos.
As cidades salvas podem ser selecionadas posteriormente para realizar uma nova consulta.
Também é possível remover uma cidade da lista de favoritas.
As informações das cidades favoritas são armazenadas utilizando o:
localStorage

🌙 Modo escuro
A aplicação possui um modo escuro para melhorar a experiência de utilização em ambientes com pouca iluminação.
Ao ativar o modo escuro, a página recebe a classe:
escuro
A preferência do usuário também é armazenada no navegador utilizando:
localStorage
Dessa forma, o sistema consegue recuperar a preferência quando a página é carregada novamente.

💾 Armazenamento local
O projeto utiliza o LocalStorage do navegador para armazenar algumas informações.
Entre elas estão:
Cidades favoritas;
Preferência pelo modo escuro;
Última cidade consultada.
Isso permite que algumas informações sejam recuperadas mesmo depois de atualizar ou fechar a página.

🔄 Funcionamento do projeto
O funcionamento geral pode ser representado pelo seguinte fluxo:
┌────────────────────────┐
│        Usuário         │
│   Informa uma cidade   │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│     Aplicação Web      │
│      HTML + CSS + JS   │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│    OpenWeatherMap      │
│        API REST        │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│    Dados climáticos    │
│ Temperatura, umidade,  │
│ vento, pressão etc.    │
└────────────┬───────────┘
             │
             ├───────────────────┐
             │                   │
             ▼                   ▼
┌─────────────────────┐   ┌─────────────────────┐
│     Interface Web   │   │    MQTT / HiveMQ    │
│                     │   │                     │
│ Dados + Histórico   │   │ Publicação dos      │
│ + Gráfico           │   │ dados climáticos    │
└─────────────────────┘   └──────────┬──────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │      ESP32      │
                            │   Sistema IoT   │
                            └─────────────────┘

💻 Interface Web
A interface permite ao usuário:
Informar uma cidade;
Selecionar um país;
Consultar o clima;
Visualizar temperatura;
Visualizar sensação térmica;
Visualizar temperatura máxima;
Visualizar temperatura mínima;
Visualizar umidade;
Visualizar velocidade do vento;
Visualizar pressão atmosférica;
Visualizar visibilidade;
Acompanhar a data e horário da atualização;
Visualizar o gráfico;
Consultar o histórico;
Adicionar cidades aos favoritos;
Remover cidades favoritas;
Ativar ou desativar o modo escuro.

🚀 Como executar
1. Baixar o projeto
Clone o repositório:
git clone https://github.com/marianaacury/Novo-sistema-de-consulta-de-clima.git
Entre na pasta:
cd Novo-sistema-de-consulta-de-clima

2. Configurar a API Key
Abra o arquivo JavaScript do projeto.
Localize:
const OPENWEATHER_API_KEY =
  "Colar chave aqui";
Substitua pelo valor da sua API Key:
const OPENWEATHER_API_KEY =
  "SUA_CHAVE_AQUI";

3. Executar o projeto
Abra o arquivo principal da aplicação em um navegador moderno.
Também pode ser utilizado um servidor local, como o Live Server do Visual Studio Code.

4. Realizar uma consulta
Digite o nome de uma cidade.
Por exemplo:
Sao Paulo
Selecione o país:
BR
Depois clique em:
Aplicar cidade
A aplicação realizará a requisição para a OpenWeatherMap e exibirá os dados meteorológicos.

📡 Integração com ESP32
O projeto foi desenvolvido considerando um cenário de Internet das Coisas no qual o ESP32 pode participar da comunicação através do MQTT.
A aplicação Web publica informações no broker HiveMQ utilizando os tópicos definidos no projeto.
O ESP32 pode se conectar ao mesmo broker para receber ou publicar informações.
Essa estrutura possibilita aplicações como:
🌡️ Estações meteorológicas;
📊 Painéis de monitoramento;
🏠 Automação residencial;
📡 Sistemas IoT;
🌐 Integração entre aplicações Web e dispositivos físicos;
🌦️ Monitoramento de condições climáticas.

📚 Conceitos trabalhados
API REST
Utilização de um serviço externo para obter informações meteorológicas através de requisições HTTP.
JSON
Os dados retornados pela API são recebidos em formato JSON e posteriormente utilizados pelo JavaScript.
MQTT
Protocolo utilizado para comunicação baseada no modelo:
Publish / Subscribe
IoT
Integração entre aplicações Web, internet e dispositivos físicos, como o ESP32.
JavaScript
O projeto utiliza recursos como:
fetch()
async/await
eventos
DOM
funções
condições
objetos
arrays
localStorage
LocalStorage
Utilizado para armazenar informações localmente no navegador, como cidades favoritas e preferências do usuário.
Chart.js
Utilizado para representar graficamente os dados de temperatura e umidade.

🎓 Aplicação educacional
O projeto pode ser utilizado como atividade prática para estudar:
Desenvolvimento Web;
JavaScript;
APIs REST;
JSON;
MQTT;
Internet das Coisas;
ESP32;
Sistemas embarcados;
Comunicação entre sistemas;
Armazenamento local;
Visualização de dados.
A atividade demonstra, na prática, como diferentes tecnologias podem trabalhar juntas em uma aplicação integrada.

📁 Estrutura geral
Novo-sistema-de-consulta-de-clima/
│
├── index.html
│
├── CSS
│   └── arquivos de estilização
│
├── JavaScript
│   └── arquivos de funcionamento
│
├── ES32_Wifi_API aula 06
│   └── arquivos relacionados ao ESP32
│
└── README.md

⚠️ Observações
É necessário possuir uma API Key válida da OpenWeatherMap.
A conexão MQTT depende da disponibilidade do broker HiveMQ.
Não publique sua API Key no GitHub.
O projeto utiliza armazenamento local do navegador para algumas funcionalidades.
O ESP32 pode ser integrado ao sistema através dos tópicos MQTT definidos no projeto.

👩‍💻 Autora
Mariana Rochiti Cury
Projeto desenvolvido para fins educacionais, com o objetivo de praticar conceitos de Desenvolvimento Web, APIs, JavaScript, MQTT, IoT e ESP32.

📄 Licença
Projeto desenvolvido para fins educacionais.
