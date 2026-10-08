// =====================================================
    // 1. API OPENWEATHERMAP
    // =====================================================

    const OPENWEATHER_API_KEY =
      "Colar chave aqui";


    // =====================================================
    // 2. MQTT
    // =====================================================

    const MQTT_BROKER =
      "ws://broker.hivemq.com:8000/mqtt";

    const TOPIC_TEMPERATURA =
      "esp32/clima/temperatura";

    const TOPIC_UMIDADE =
      "esp32/clima/umidade";

    const TOPIC_CIDADE_ATUAL =
      "esp32/clima/cidadeAtual";

    const TOPIC_CIDADE =
      "esp32/clima/cidade";


    // =====================================================
    // 3. CONECTAR AO MQTT
    // =====================================================

    const client = mqtt.connect(MQTT_BROKER);

    client.on("connect", () => {

      console.log("Conectado ao MQTT");

      document.getElementById("mqttStatus")
        .textContent = "Conectado";

      client.subscribe(TOPIC_TEMPERATURA);
      client.subscribe(TOPIC_UMIDADE);
      client.subscribe(TOPIC_CIDADE_ATUAL);

    });

    client.on("error", () => {

      document.getElementById("mqttStatus")
        .textContent = "Erro";

    });


    // =====================================================
    // 4. GRÁFICO
    // =====================================================

    const ctx =
      document.getElementById("chart")
        .getContext("2d");

    const chart = new Chart(ctx, {

      type: "line",

      data: {

        labels: [],

        datasets: [

          {
            label: "Temperatura (°C)",
            data: [],
            borderColor: "red",
            backgroundColor: "rgba(255,0,0,0.15)",
            fill: true,
            tension: 0.3
          },

          {
            label: "Umidade (%)",
            data: [],
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.15)",
            fill: true,
            tension: 0.3
          }

        ]

      },

      options: {

        responsive: true,

        plugins: {

          title: {
            display: true,
            text: "Temperatura e Umidade"
          },

          legend: {
            display: true
          }

        },

        scales: {

          x: {
            title: {
              display: true,
              text: "Horário"
            }
          },

          y: {
            title: {
              display: true,
              text: "Valor"
            }
          }

        }

      }

    });


    // =====================================================
    // 5. MENSAGENS
    // =====================================================

    function mostrarMensagem(texto, cor = "red") {

      const elemento =
        document.getElementById("mensagem");

      elemento.textContent = texto;
      elemento.style.color = cor;

    }


    function atualizarInformacaoClima(id, rotulo, valor, formatarValor) {

      let elemento = document.getElementById(id);
      const valorNumerico = Number(valor);

      if (!elemento) {
        elemento = document.createElement("p");
        elemento.id = id;

        const rotuloNormalizado = rotulo
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase("pt-BR");
        const cartao = Array.from(
          document.querySelectorAll("[class*='card'], [class*='Card']")
        ).find(card => {
          const texto = card.textContent
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR");
          return texto.includes(rotuloNormalizado);
        });

        const referencia = cartao || document.getElementById("cidadeAtual");

        if (referencia) {
          referencia.append(elemento);
        }
      }

      if (!Number.isFinite(valorNumerico)) {
        elemento.textContent = `${rotulo}: indisponível`;
        return;
      }

      elemento.textContent = `${rotulo}: ${formatarValor(valorNumerico)}`;

    }


    // =====================================================
    // 6. CONSULTAR CLIMA
    // =====================================================

    async function buscarClima(cidade, pais) {

      document.getElementById("carregando")
        .style.display = "block";

      mostrarMensagem("");

      try {

        const url =
          "https://api.openweathermap.org/data/2.5/weather" +
          "?q=" +
          encodeURIComponent(cidade) +
          "," +
          encodeURIComponent(pais) +
          "&appid=" +
          OPENWEATHER_API_KEY +
          "&units=metric" +
          "&lang=pt_br";


        const resposta =
          await fetch(url);


        if (!resposta.ok) {

          throw new Error(
            "Cidade não encontrada. Verifique o nome informado."
          );

        }


        const dados =
          await resposta.json();


        // =================================================
        // DADOS DA API
        // =================================================

        const temperatura =
          dados.main.temp;

        const sensacao =
          dados.main.feels_like;

        const umidade =
          dados.main.humidity;

        const maxima =
          dados.main.temp_max;

        const minima =
          dados.main.temp_min;

        const vento =
          dados.wind.speed * 3.6;

        const pressao =
          dados.main.pressure;

        const visibilidade =
          dados.visibility;

        const nomeCidade =
          dados.name;

        // =================================================
        // ATUALIZAR A TELA
        // =================================================

        document.getElementById("cidadeAtual")
          .textContent =
          `${nomeCidade}, ${pais}`;

          
        atualizarInformacaoClima(
          "pressao",
          "Pressão",
          pressao,
          valor => `${valor.toFixed(0)} hPa`
        );

        atualizarInformacaoClima(
          "visibilidade",
          "Visibilidade",
          visibilidade,
          valor => `${(valor / 1000).toFixed(1)} km`
        );

        document.getElementById("visibilidade").textContent =
          `${(visibilidade / 1000).toFixed(1)} km`;

        document.getElementById("pressao").textContent =
          `${pressao.toFixed(0)} hPa`;

        document.getElementById("temp")
          .textContent =
          `${temperatura.toFixed(1)} °C`;

        document.getElementById("sensacao")
          .textContent =
          `${sensacao.toFixed(1)} °C`;

        document.getElementById("hum")
          .textContent =
          `${umidade} %`;

        document.getElementById("max")
          .textContent =
          `${maxima.toFixed(1)} °C`;

        document.getElementById("min")
          .textContent =
          `${minima.toFixed(1)} °C`;

        document.getElementById("vento")
          .textContent =
          `${vento.toFixed(1)} km/h`;

        // =================================================
        // DATA E HORA
        // =================================================

        document.getElementById("ultimaAtualizacao")
          .textContent =
          new Date().toLocaleString("pt-BR");

        // =================================================
        // MQTT
        // =================================================

        if (client.connected) {

          client.publish(
            TOPIC_TEMPERATURA,
            temperatura.toString()
          );

          client.publish(
            TOPIC_UMIDADE,
            umidade.toString()
          );

          client.publish(
            TOPIC_CIDADE_ATUAL,
            `${nomeCidade}, ${pais}`
          );

        }

        // =================================================
        // GRÁFICO
        // =================================================

        const hora =
          new Date().toLocaleTimeString();

        chart.data.labels.push(hora);

        chart.data.datasets[0]
          .data.push(temperatura);

        chart.data.datasets[1]
          .data.push(umidade);

        // Limita o gráfico

        if (chart.data.labels.length > 30) {

          chart.data.labels.shift();

          chart.data.datasets.forEach(
            dataset => dataset.data.shift()
          );

        }

        chart.update();

        // =================================================
        // HISTÓRICO
        // =================================================

        adicionarHistorico(
          nomeCidade,
          temperatura,
          umidade
        );

        // =================================================
        // CIDADE FAVORITA
        // =================================================

        localStorage.setItem(
          "cidadeFavorita",
          `${cidade},${pais}`
        );


        mostrarMensagem(
          `Clima de ${nomeCidade} atualizado!`,
          "green"
        );


      } catch (erro) {

        mostrarMensagem(
          erro.message ||
          "Não foi possível consultar os dados."
        );

      }


      document.getElementById("carregando")
        .style.display = "none";

    }


    // =====================================================
    // 7. HISTÓRICO
    // =====================================================

    function adicionarHistorico(
      cidade,
      temperatura,
      umidade
    ) {

      const historico =
        document.getElementById("historico");


      if (
        historico.textContent ===
        "Nenhuma consulta realizada."
      ) {

        historico.innerHTML = "";

      }


      const item =
        document.createElement("div");

      item.className =
        "historico-item";


      item.textContent =
        `${cidade} - ` +
        `${temperatura.toFixed(1)} °C - ` +
        `${umidade}%`;


      historico.prepend(item);

    }


    // =====================================================
    // CIDADES FAVORITAS
    // =====================================================

    function obterFavoritas() {

      try {

        const favoritas = JSON.parse(
          localStorage.getItem("cidadesFavoritas") || "[]"
        );

        return Array.isArray(favoritas) ? favoritas : [];

      } catch (erro) {

        return [];

      }

    }


    function mostrarFavoritas() {

      const lista = document.getElementById("listaFavoritas");
      lista.replaceChildren();

      obterFavoritas().forEach((favorita, indice) => {

        const item = document.createElement("span");
        const selecionar = document.createElement("button");
        const remover = document.createElement("button");

        selecionar.type = "button";
        selecionar.textContent = `${favorita.cidade}, ${favorita.pais}`;
        selecionar.addEventListener("click", () => {
          document.getElementById("cidade").value = favorita.cidade;
          document.getElementById("pais").value = favorita.pais;
          document.getElementById("aplicar").click();
        });

        remover.type = "button";
        remover.textContent = "×";
        remover.setAttribute("aria-label", `Remover ${favorita.cidade} das favoritas`);
        remover.addEventListener("click", () => {
          const favoritas = obterFavoritas();
          favoritas.splice(indice, 1);
          localStorage.setItem("cidadesFavoritas", JSON.stringify(favoritas));
          mostrarFavoritas();
        });

        item.append(selecionar, remover);
        lista.append(item);

      });

      if (!lista.childElementCount) {
        lista.textContent = " Nenhuma cidade favorita adicionada.";
      }

    }


    document
      .getElementById("adicionarFavorita")
      .addEventListener("click", () => {

        const cidade = document.getElementById("cidade").value.trim();
        const pais = document.getElementById("pais").value;

        if (!cidade) {
          mostrarMensagem("Informe uma cidade para adicionar aos favoritos.");
          return;
        }

        const favoritas = obterFavoritas();
        const jaExiste = favoritas.some(favorita =>
          favorita.cidade.toLocaleLowerCase() === cidade.toLocaleLowerCase() &&
          favorita.pais === pais
        );

        if (jaExiste) {
          mostrarMensagem("Essa cidade já está na lista de favoritas.");
          return;
        }

        favoritas.push({ cidade, pais });
        localStorage.setItem("cidadesFavoritas", JSON.stringify(favoritas));
        mostrarFavoritas();
        mostrarMensagem(`${cidade}, ${pais} adicionada às favoritas!`, "green");

      });

    mostrarFavoritas();

    // =====================================================
    // 8. BOTÃO CONSULTAR
    // =====================================================

    document
      .getElementById("aplicar")
      .addEventListener(
        "click",
        () => {

          const cidade =
            document
              .getElementById("cidade")
              .value
              .trim();


          const pais =
            document
              .getElementById("pais")
              .value;


          if (!cidade) {

            mostrarMensagem(
              "Informe uma cidade antes de consultar."
            );

            return;

          }


          if (
            OPENWEATHER_API_KEY ===
            "COLE_SUA_CHAVE_AQUI"
          ) {

            mostrarMensagem(
              "Coloque sua API Key da OpenWeatherMap."
            );

            return;

          }

          if (client.connected) {

            client.publish(
              TOPIC_CIDADE,
              `${cidade},${pais}`
            );

          }


          buscarClima(
            cidade,
            pais
          );

        }
      );


    // =====================================================
    // 9. ENTER
    // =====================================================

    document
      .getElementById("cidade")
      .addEventListener(
        "keydown",
        (evento) => {

          if (evento.key === "Enter") {

            document
              .getElementById("aplicar")
              .click();

          }

        }
      );


    // =====================================================
    // 10. MODO ESCURO
    // =====================================================

    function aplicarTemaEscuro(escuro) {

      document.body
        .classList
        .toggle("escuro", escuro);

      document.body.style.color =
        escuro ? "white" : "";

      document
        .querySelectorAll(".card, .card *")
        .forEach((elemento) => {
          elemento.style.color =
            escuro ? "white" : "";
        });

      localStorage.setItem(
        "modoEscuro",
        escuro
      );

    }


    document
      .getElementById("tema")
      .addEventListener(
        "click",
        () => {

          const escuro =
            !document.body
              .classList
              .contains("escuro");

          aplicarTemaEscuro(escuro);

        }
      );


    // Verifica modo salvo

    if (
      localStorage.getItem("modoEscuro")
      === "true"
    ) {

      aplicarTemaEscuro(true);

    }


    // =====================================================
    // 11. RECUPERAR CIDADE FAVORITA
    // =====================================================

    const favorita =
      localStorage.getItem(
        "cidadeFavorita"
      );


    if (favorita) {

      const partes =
        favorita.split(",");


      document.getElementById("cidade")
        .value = partes[0];


      if (partes[1]) {

        document.getElementById("pais")
          .value = partes[1];

      }

    }

