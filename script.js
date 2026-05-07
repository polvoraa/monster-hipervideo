// Cada item deste array representa uma cena do hipervideo.
// Para alterar o conteúdo do projeto, normalmente basta editar estes dados.
const cenas = [
  {
    arquivo: "capcut cenes/0426(1)/0426(1)-1.mp4",
    nome: "Cena 01",
    titulo: "Vantagens",
    pontos: [
      {
        inicio: 0.4,
        fim: 6.8,
        x: "80%",
        y: "40%",
        lado: "esquerda",
        chamada: "Rótulo de energia",
        titulo: "Vantagens na lata",
        texto: "Uma bebida feita para momentos de foco, ritmo e impacto. O card aparece como um rótulo nutricional de campanha.",
        botao: "Ver benefícios",
        rotulo: [
          ["Energia de marca", "Alta"],
          ["Cafeína", "Presente"],
          ["Taurina", "Na fórmula"],
          ["Vitaminas B", "B2, B3, B6 e B12"],
          ["Momento ideal", "Gelada, antes da ação"],
        ],
      },
    ],
  },
  {
    arquivo: "capcut cenes/0426(1)/0426(1)-2.mp4",
    nome: "Cena 02",
    titulo: "Preço e sabores",
    pontos: [
      {
        inicio: 0.5,
        fim: 5.4,
        x: "84%",
        y: "50%",
        chamada: "Preço e sabores",
        titulo: "Escolha sua Monster",
        texto: "Energia intensa com o sabor icônico que você já conhece. Ideal para foco, treinos e longas jornadas.<br>Preço unidade: R$ 8,99<br>Pack (6 un): R$ 49,90",
        botao: "Comparar sabores",
      },
      {
        inicio: 5.5,
        fim: 8.5,
        x: "36%",
        y: "60%",
        chamada: "Oferta do pack",
        titulo: "Mais latas, melhor compra",
        texto: "Use este ponto para apresentar a promoção: unidade para experimentar, pack para abastecer a semana e combo gelado para consumo imediato.",
        botao: "Ver oferta",
      },
    ],
  },
  {
    arquivo: "capcut cenes/0426(1)/0426(1)-3.mp4",
    nome: "Cena 03",
    titulo: "Ritual",
    pontos: [
      {
        inicio: 0.5,
        fim: 6,
        x: "32%",
        y: "38%",
        lado: "esquerda",
        chamada: "Ritual gelado",
        titulo: "O momento certo de abrir",
        texto: "Gelar, abrir, ouvir o estalo e beber antes do treino, do game, da estrada ou da noite com amigos. O ritual vende a sensação, não só a lata.",
        botao: "Entrar no ritual",
      },
    ],
  },
  {
    arquivo: "capcut cenes/0426(1)/0426(1)-4.mp4",
    nome: "Cena 04",
    titulo: "Prova social",
    pontos: [
      {
        inicio: 0.7,
        fim: 6.6,
        x: "72%",
        y: "36%",
        chamada: "Já virou movimento",
        titulo: "Monster já foi para pistas, palcos e games",
        texto: "Presente em esportes de ação, música e eventos automotivos.<br>Conectada a criadores e à cultura gamer.<br>Esse histórico fortalece a confiança na marca e torna a escolha de compra mais segura.",
        botao: "Quero fazer parte",
      },
    ],
  },
  {
    arquivo: "capcut cenes/0426(1)/0426(1)-5.mp4",
    nome: "Cena 05",
    titulo: "Chamada final",
    pontos: [
      {
        inicio: 0.4,
        fim: 7.2,
        x: "75%",
        y: "56%",
        chamada: "Comprar agora",
        titulo: "Não deixe para depois",
        texto: "Escolha seu sabor, pegue gelada e transforme a vontade em compra.",
        botao: "Comprar Monster",
      },
    ],
  },
];

const video = document.querySelector("#video");
const botaoPlay = document.querySelector("#botaoPlay");
const botaoCenaAnterior = document.querySelector("#cenaAnterior");
const botaoProximaCena = document.querySelector("#proximaCena");
const barraPreenchida = document.querySelector("#barraPreenchida");
const textoTempo = document.querySelector("#textoTempo");
const textoCena = document.querySelector("#textoCena");
const camadaPontos = document.querySelector("#camadaPontos");
const listaCenasBaixo = document.querySelector("#listaCenasBaixo");
const botoesCenasLaterais = document.querySelectorAll(".botao-cena");

let cenaAtual = 0;
let pontosVisiveis = new Set();
let pontoAberto = null;
let tempoDeTransicao = null;

function formatarTempo(segundos) {
  const segundosValidos = Number.isFinite(segundos) ? segundos : 0;
  const minutos = Math.floor(segundosValidos / 60).toString().padStart(2, "0");
  const segundosRestantes = Math.floor(segundosValidos % 60).toString().padStart(2, "0");

  return `${minutos}:${segundosRestantes}`;
}

function montarListaCenas() {
  listaCenasBaixo.innerHTML = cenas
    .map(
      (cena, indice) => `
        <button class="botao-cena-baixo" type="button" data-cena="${indice}">
          <small>${cena.nome}</small>
          ${cena.titulo}
        </button>
      `,
    )
    .join("");
}

function atualizarBotoesAtivos() {
  document.querySelectorAll(".botao-cena-baixo").forEach((botao, indice) => {
    botao.classList.toggle("ativo", indice === cenaAtual);
  });

  botoesCenasLaterais.forEach((botao) => {
    const cenaDoBotao = Number(botao.dataset.cena);
    botao.classList.toggle("ativo", cenaDoBotao === cenaAtual);
  });
}

function atualizarVelocidadeVideo() {
  // Quando um card está aberto, o vídeo fica mais lento para o usuário ler.
  video.playbackRate = pontoAberto ? 0.12 : 1;
}

function carregarCena(indiceCena, deveTocar = true) {
  const novoIndice = (indiceCena + cenas.length) % cenas.length;

  window.clearTimeout(tempoDeTransicao);
  video.classList.add("trocando");

  tempoDeTransicao = window.setTimeout(() => {
    cenaAtual = novoIndice;
    const cena = cenas[cenaAtual];

    pontosVisiveis = new Set();
    pontoAberto = null;
    atualizarVelocidadeVideo();
    camadaPontos.innerHTML = "";
    video.src = cena.arquivo;
    textoCena.textContent = cena.nome;
    barraPreenchida.style.width = "0%";
    textoTempo.textContent = "00:00";
    atualizarBotoesAtivos();

    video.addEventListener(
      "loadeddata",
      () => {
        video.classList.remove("trocando");

        if (deveTocar) {
          video.play().catch(() => {
            botaoPlay.textContent = "Reproduzir";
          });
        }
      },
      { once: true },
    );

    video.load();
  }, 260);
}

function montarRotulo(ponto) {
  if (!ponto.rotulo) return "";

  const linhas = ponto.rotulo
    .map(([nome, valor]) => `<div><span>${nome}</span><b>${valor}</b></div>`)
    .join("");

  return `
    <div class="rotulo" aria-label="Rótulo nutricional publicitário">
      <strong>Informação de energia</strong>
      ${linhas}
    </div>
  `;
}

function montarCardPonto(ponto) {
  return `
    <aside class="card-ponto">
      <button class="fechar-ponto" type="button" aria-label="Fechar popup">&times;</button>
      <small>${ponto.chamada}</small>
      <h3>${ponto.titulo}</h3>
      <p>${ponto.texto}</p>
      ${montarRotulo(ponto)}
      <a href="#comprar">${ponto.botao}</a>
    </aside>
  `;
}

function pegarPontosVisiveis() {
  const cena = cenas[cenaAtual];
  const tempoAtual = video.currentTime;

  return cena.pontos
    .map((ponto, indice) => ({
      ...ponto,
      chave: `${cenaAtual}-${indice}`,
    }))
    .filter((ponto) => tempoAtual >= ponto.inicio && tempoAtual <= ponto.fim);
}

function mostrarPontos(forcarAtualizacao = false) {
  const pontos = pegarPontosVisiveis();
  const proximasChaves = new Set(pontos.map((ponto) => ponto.chave));
  const mudou =
    forcarAtualizacao ||
    proximasChaves.size !== pontosVisiveis.size ||
    [...proximasChaves].some((chave) => !pontosVisiveis.has(chave));

  if (!mudou) return;

  if (pontoAberto && !proximasChaves.has(pontoAberto)) {
    pontoAberto = null;
    atualizarVelocidadeVideo();
  }

  pontosVisiveis = proximasChaves;
  camadaPontos.innerHTML = "";

  pontos.forEach((ponto) => {
    const elemento = document.createElement("div");
    const abreParaEsquerda = ponto.lado === "esquerda";
    const estaAberto = ponto.chave === pontoAberto;

    elemento.className = `ponto${abreParaEsquerda ? " esquerda" : ""}${estaAberto ? " aberto" : ""}`;
    elemento.style.setProperty("--x", ponto.x);
    elemento.style.setProperty("--y", ponto.y);
    elemento.innerHTML = `
      <button class="botao-ponto" type="button">
        <span>${ponto.chamada}</span>
      </button>
      ${estaAberto ? montarCardPonto(ponto) : ""}
    `;

    elemento.querySelector(".botao-ponto").addEventListener("click", () => {
      pontoAberto = estaAberto ? null : ponto.chave;
      atualizarVelocidadeVideo();
      mostrarPontos(true);
    });

    elemento.querySelector(".fechar-ponto")?.addEventListener("click", (event) => {
      event.stopPropagation();
      pontoAberto = null;
      atualizarVelocidadeVideo();
      mostrarPontos(true);
    });

    camadaPontos.appendChild(elemento);
  });
}

function atualizarProgresso() {
  const duracao = video.duration || 0;
  const porcentagem = duracao ? (video.currentTime / duracao) * 100 : 0;

  barraPreenchida.style.width = `${Math.min(100, porcentagem)}%`;
  textoTempo.textContent = formatarTempo(video.currentTime);
  mostrarPontos();
}

botaoPlay.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

video.addEventListener("play", () => {
  botaoPlay.textContent = "Pausar";
});

video.addEventListener("pause", () => {
  botaoPlay.textContent = "Reproduzir";
});

video.addEventListener("timeupdate", atualizarProgresso);

video.addEventListener("ended", () => {
  const deveContinuarTocando = cenaAtual < cenas.length - 1;
  carregarCena(cenaAtual + 1, deveContinuarTocando);
});

botaoCenaAnterior.addEventListener("click", () => carregarCena(cenaAtual - 1));
botaoProximaCena.addEventListener("click", () => carregarCena(cenaAtual + 1));

listaCenasBaixo.addEventListener("click", (event) => {
  const botao = event.target.closest("[data-cena]");
  if (!botao) return;

  carregarCena(Number(botao.dataset.cena));
});

botoesCenasLaterais.forEach((botao) => {
  botao.addEventListener("click", () => carregarCena(Number(botao.dataset.cena)));
});

montarListaCenas();
atualizarBotoesAtivos();
