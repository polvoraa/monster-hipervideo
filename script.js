const scenes = [
  {
    file: "capcut%20cenes/0426(1)/0426(1)-1.mp4",
    label: "Cena 01",
    title: "Vantagens",
    hotspots: [
      {
        start: 0.4,
        end: 6.8,
        x: "80%",
        y: "40%",
        align: "left",
        label: "Rotulo de energia",
        title: "Vantagens na lata",
        text: "Uma bebida feita para momentos de foco, ritmo e impacto. O card aparece como um rotulo nutricional de campanha.",
        cta: "Ver beneficios",
        nutrition: [
          ["Energia de marca", "Alta"],
          ["Cafeina", "Presente"],
          ["Taurina", "Na formula"],
          ["Vitaminas B", "B2, B3, B6 e B12"],
          ["Momento ideal", "Gelada, antes da acao"],
        ],
      },
    ],
  },
  {
    file: "capcut%20cenes/0426(1)/0426(1)-2.mp4",
    label: "Cena 02",
    title: "Preco e sabores",
    hotspots: [
      {
        start: 0.5,
        end: 5.4,
        x: "84%",
        y: "50%",
        label: "Preco e sabores",
        title: "Escolha sua Monster",
        text: "Energia intensa com o sabor icônico que você já conhece. Ideal para foco, treinos e longas jornadas.<br>Preço unidade: R$ 8,99 <br>Pack (6 un): R$ 49,90",
        cta: "Comparar sabores",
      },
      {
        start: 5.5,
        end: 8.5,
        x: "36%",
        y: "60%",
        label: "Oferta do pack",
        title: "Mais latas, melhor compra",
        text: "Use este ponto para empurrar promocao: unidade para experimentar, pack para abastecer a semana e combo gelado para consumo imediato.",
        cta: "Ver oferta",
      },
    ],
  },
  {
    file: "capcut%20cenes/0426(1)/0426(1)-3.mp4",
    label: "Cena 03",
    title: "Ritual",
    hotspots: [
      {
        start: 0.5,
        end: 6.0,
        x: "32%",
        y: "38%",
        align: "left",
        label: "Ritual gelado",
        title: "O momento certo de abrir",
        text: "Gelar, abrir, ouvir o estalo e beber antes do treino, do game, da estrada ou da noite com amigos. O ritual vende a sensacao, nao so a lata.",
        cta: "Entrar no ritual",
      },
    ],
  },
  {
    file: "capcut%20cenes/0426(1)/0426(1)-4.mp4",
    label: "Cena 04",
    title: "Prova social",
    hotspots: [
      {
        start: 0.7,
        end: 6.6,
        x: "72%",
        y: "36%",
        label: "Ja virou movimento",
        title: "Monster ja foi para pistas, palcos e games",
        text: " Presente em esportes de ação, música e eventos automotivos<br>  Conectada a criadores e à cultura gamer<br> Esse histórico fortalece a confiança na marca. <br>  E torna a escolha de compra muito mais segura",
        cta: "Quero fazer parte",
      },
    ],
  },
  {
    file: "capcut%20cenes/0426(1)/0426(1)-5.mp4",
    label: "Cena 05",
    title: "Chamada final",
    hotspots: [
      {
        start: 0.4,
        end: 7.2,
        x: "75%",
        y: "56%",
        label: "Comprar agora",
        title: "Nao deixe para depois",
        text: "Escolha seu sabor, pegue gelada e transforme a vontade em compra.",
        cta: "Comprar Monster",
      },
    ],
  },
];

const video = document.querySelector("#adVideo");
const playToggle = document.querySelector("#playToggle");
const prevScene = document.querySelector("#prevScene");
const nextScene = document.querySelector("#nextScene");
const progressFill = document.querySelector("#progressFill");
const timeLabel = document.querySelector("#timeLabel");
const sceneLabel = document.querySelector("#sceneLabel");
const hotspotLayer = document.querySelector("#hotspotLayer");
const sceneRail = document.querySelector("#sceneRail");
const stripItems = document.querySelectorAll(".strip-item");

let currentScene = 0;
let activeHotspotKeys = new Set();
let openHotspotKey = null;
let transitionTimer = null;

function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function renderSceneRail() {
  sceneRail.innerHTML = scenes
    .map(
      (scene, index) => `
        <button class="scene-button" type="button" data-scene="${index}">
          <small>${scene.label}</small>
          ${scene.title}
        </button>
      `,
    )
    .join("");
}

function syncActiveButtons() {
  document.querySelectorAll(".scene-button").forEach((button, index) => {
    button.classList.toggle("is-active", index === currentScene);
  });

  stripItems.forEach((button) => {
    const target = Number(button.dataset.jump);
    button.classList.toggle("is-active", target === currentScene);
  });
}

function syncPlaybackRate() {
  video.playbackRate = openHotspotKey ? 0.12 : 1;
}

function loadScene(index, shouldPlay = true) {
  const nextSceneIndex = (index + scenes.length) % scenes.length;

  window.clearTimeout(transitionTimer);
  video.classList.add("is-transitioning");

  transitionTimer = window.setTimeout(() => {
    currentScene = nextSceneIndex;
    const scene = scenes[currentScene];

    activeHotspotKeys = new Set();
    openHotspotKey = null;
    syncPlaybackRate();
    hotspotLayer.innerHTML = "";
    video.src = scene.file;
    sceneLabel.textContent = scene.label;
    progressFill.style.width = "0%";
    timeLabel.textContent = "00:00";
    syncActiveButtons();

    video.addEventListener(
      "loadeddata",
      () => {
        video.classList.remove("is-transitioning");

        if (shouldPlay) {
          video.play().catch(() => {
            playToggle.textContent = "Reproduzir";
          });
        }
      },
      { once: true },
    );

    video.load();
  }, 260);
}

function cardTemplate(hotspot) {
  const nutrition = hotspot.nutrition
    ? `
      <div class="nutrition-card" aria-label="Rotulo nutricional publicitario">
        <strong>Informacao de energia</strong>
        ${hotspot.nutrition
          .map(([name, value]) => `<div><span>${name}</span><b>${value}</b></div>`)
          .join("")}
      </div>
    `
    : "";

  return `
    <aside class="hotspot-card">
      <button class="hotspot-close" type="button" aria-label="Fechar popup">&times;</button>
      <small>${hotspot.label}</small>
      <h3>${hotspot.title}</h3>
      <p>${hotspot.text}</p>
      ${nutrition}
      <a href="#comprar">${hotspot.cta}</a>
    </aside>
  `;
}

function renderHotspots(force = false) {
  const scene = scenes[currentScene];
  const time = video.currentTime;
  const visible = scene.hotspots
    .map((hotspot, index) => ({ ...hotspot, key: `${currentScene}-${index}` }))
    .filter((hotspot) => time >= hotspot.start && time <= hotspot.end);

  const visibleKeys = new Set(visible.map((hotspot) => hotspot.key));
  const changed =
    force ||
    visibleKeys.size !== activeHotspotKeys.size ||
    [...visibleKeys].some((key) => !activeHotspotKeys.has(key));

  if (!changed) return;

  if (openHotspotKey && !visibleKeys.has(openHotspotKey)) {
    openHotspotKey = null;
    syncPlaybackRate();
  }

  activeHotspotKeys = visibleKeys;
  hotspotLayer.innerHTML = "";

  visible.forEach((hotspot) => {
    const item = document.createElement("div");
    item.className = `hotspot${hotspot.align === "left" ? " is-left" : ""}${
      hotspot.key === openHotspotKey ? " is-expanded" : ""
    }`;
    item.style.setProperty("--x", hotspot.x);
    item.style.setProperty("--y", hotspot.y);
    item.innerHTML = `
      <button class="hotspot-trigger" type="button">
        <span>${hotspot.label}</span>
      </button>
      ${hotspot.key === openHotspotKey ? cardTemplate(hotspot) : ""}
    `;

    item.querySelector(".hotspot-trigger").addEventListener("click", () => {
      openHotspotKey = openHotspotKey === hotspot.key ? null : hotspot.key;
      syncPlaybackRate();
      renderHotspots(true);
    });

    item.querySelector(".hotspot-close")?.addEventListener("click", (event) => {
      event.stopPropagation();
      openHotspotKey = null;
      syncPlaybackRate();
      renderHotspots(true);
    });

    hotspotLayer.appendChild(item);
  });
}

function updateProgress() {
  const duration = video.duration || 0;
  const percentage = duration ? (video.currentTime / duration) * 100 : 0;
  progressFill.style.width = `${Math.min(100, percentage)}%`;
  timeLabel.textContent = formatTime(video.currentTime);
  renderHotspots();
}

playToggle.addEventListener("click", () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
});

video.addEventListener("play", () => {
  playToggle.textContent = "Pausar";
});

video.addEventListener("pause", () => {
  playToggle.textContent = "Reproduzir";
});

video.addEventListener("timeupdate", updateProgress);

video.addEventListener("ended", () => {
  loadScene(currentScene + 1, currentScene < scenes.length - 1);
});

prevScene.addEventListener("click", () => loadScene(currentScene - 1));
nextScene.addEventListener("click", () => loadScene(currentScene + 1));

sceneRail.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scene]");
  if (!button) return;
  loadScene(Number(button.dataset.scene));
});

stripItems.forEach((button) => {
  button.addEventListener("click", () => loadScene(Number(button.dataset.jump)));
});

renderSceneRail();
syncActiveButtons();
