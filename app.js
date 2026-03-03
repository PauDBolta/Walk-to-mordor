/* Epic Quest Walk — PWA PRO (manual steps/km) */

const $ = (id) => document.getElementById(id);
const KEY = "questwalk_state_v1";

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const fmt1 = (n) => Number(n).toFixed(1);
const fmt2 = (n) => Number(n).toFixed(2);

function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function parseNum(x){
  if (x === null || x === undefined) return NaN;
  return Number(String(x).replace(",", "."));
}

const WORLD = {
  title: "El Camino de la Brasa Esmeralda",
  // totalDistanceKm will be configurable, but these are relative story nodes
  zones: [
    {
      id:"haven",
      name:"Puerto del Alba",
      startKm:0,
      endKm:180,
      palette:["#5af0b1","#7aa2ff"],
      chapters: [
        { at: 0,  title:"Juramento al amanecer", badge:"Sello del Alba",
          text:"El puerto despierta con un brillo verde sobre el agua. Una carta lacrada te nombra caminante del Sendero. No hay trompetas: solo el rumor del mar y la certeza de que tus pasos serán moneda de futuro." },
        { at: 60, title:"La brújula de cristal", badge:"Brújula",
          text:"En un puesto de redes viejas encuentras una brújula sin aguja. En su centro flota una chispa que gira cuando dudas. No señala el norte: señala la decisión." },
        { at: 140, title:"Sombras en el muelle", badge:"Vigilante",
          text:"Al anochecer, figuras sin rostro observan desde los tablones. No atacan. Solo cuentan. Te vas con la sensación de que alguien registra cada kilómetro como si fuera un secreto." }
      ]
    },
    {
      id:"whisperwood",
      name:"Bosque de los Susurros",
      startKm:180,
      endKm:420,
      palette:["#7aa2ff","#5af0b1"],
      chapters: [
        { at: 220, title:"Hojas que hablan", badge:"Escucha",
          text:"El bosque no guarda silencio: lo negocia. Entre ramas, un idioma de hojas te advierte de caminos fáciles que terminan en círculos. Aprendes a seguir el sendero que incomoda." },
        { at: 310, title:"La luz entre pinos", badge:"Lámpara",
          text:"Una lámpara de aceite arde sin consumirse, escondida en una cavidad del tronco. Su luz no ilumina más; ilumina mejor. Ves huellas antiguas y eliges no pisarlas." },
        { at: 395, title:"El claro del pacto", badge:"Pacto",
          text:"En un claro, piedras en forma de media luna marcan un acuerdo olvidado. Pones tu palma sobre la roca: no pasa nada… salvo que vuelves a confiar en tu propia promesa." }
      ]
    },
    {
      id:"riverglass",
      name:"Río de Vidrio",
      startKm:420,
      endKm:650,
      palette:["#5af0b1","#ffce3a"],
      chapters: [
        { at: 460, title:"Puente de cuerda", badge:"Equilibrio",
          text:"Cruzas un puente que cruje con cada respiración. No existe el paso perfecto, solo el siguiente. Al otro lado, te ríes: no de miedo, sino de estar vivo." },
        { at: 540, title:"Agua que recuerda", badge:"Memoria",
          text:"El río refleja escenas que no son tuyas. Caminantes anteriores, noches de tormenta, victorias discretas. Entiendes que el camino es una biblioteca sin estanterías." },
        { at: 630, title:"La marca en la piedra", badge:"Marca",
          text:"Encuentras una runa simple: una línea y un punto. No significa ‘destino’. Significa ‘continúa’. A veces, el mejor consejo cabe en dos trazos." }
      ]
    },
    {
      id:"ashenpass",
      name:"Paso de Ceniza",
      startKm:650,
      endKm:900,
      palette:["#ffce3a","#ff4d6d"],
      chapters: [
        { at: 690, title:"Viento de carbón", badge:"Resistencia",
          text:"La pendiente parece interminable y el aire sabe a piedra caliente. No hay gloria aquí: solo técnica. Respirar, apoyar, repetir. Tu progreso se vuelve disciplina." },
        { at: 780, title:"Campamento de hierro", badge:"Fogón",
          text:"Un campamento abandonado conserva un fogón con brasas dormidas. Las reavivas con cuidado. La chispa te recuerda que la energía no se encuentra: se fabrica." },
        { at: 880, title:"La grieta roja", badge:"Coraje",
          text:"Una grieta escarlata corta el sendero. Podrías rodearla, pero sería mentirte. Saltas. Al caer, no sientes grandeza. Sientes precisión." }
      ]
    },
    {
      id:"ruinscrown",
      name:"Ruinas de la Corona",
      startKm:900,
      endKm:1150,
      palette:["#7aa2ff","#ffce3a"],
      chapters: [
        { at: 960, title:"Arcos sin rey", badge:"Historia",
          text:"Las ruinas guardan arcos gigantescos que no sostienen nada. Te das cuenta: el poder se derrumba cuando deja de servir. Tomas notas mentales. Esto también es entrenamiento." },
        { at: 1040, title:"La sala del eco", badge:"Eco",
          text:"Tus pasos se duplican en la piedra y parecen los de alguien más. Por un momento caminas acompañado. No por fantasmas: por tu versión de mañana." },
        { at: 1130, title:"Coronación del polvo", badge:"Humildad",
          text:"Una corona oxidada yace en el suelo. La levantas y pesa demasiado para ser símbolo. La dejas donde estaba. No necesitas adornos para avanzar." }
      ]
    },
    {
      id:"moonmarsh",
      name:"Pantano de la Luna",
      startKm:1150,
      endKm:1400,
      palette:["#5af0b1","#7aa2ff"],
      chapters: [
        { at: 1190, title:"Luces errantes", badge:"Prudencia",
          text:"Luces pequeñas flotan sobre el agua y te invitan a cortar camino. No lo haces. Aprendes que lo bonito no siempre es guía; a veces es trampa." },
        { at: 1280, title:"Sendero invisible", badge:"Foco",
          text:"Un sendero de piedra está justo bajo la superficie. Solo se ve si miras en ángulo. Igual que el progreso: existe, aunque no lo notes cada día." },
        { at: 1390, title:"Silencio lleno", badge:"Calma",
          text:"El pantano se vuelve quieto, y en esa quietud se oye el corazón. Descubres una fuerza que no empuja: sostiene." }
      ]
    },
    {
      id:"windplain",
      name:"Llanura del Viento",
      startKm:1400,
      endKm:1620,
      palette:["#ffce3a","#7aa2ff"],
      chapters: [
        { at: 1440, title:"Carrera con el horizonte", badge:"Velocidad",
          text:"Aquí el paisaje no cambia, pero tú sí. Empiezas a medir la constancia como si fuera un músculo: hoy pesa menos que ayer." },
        { at: 1530, title:"Torres lejanas", badge:"Dirección",
          text:"Ves torres recortadas en la distancia. No sabes si son refugio o amenaza. Aprendes a caminar hacia algo sin necesitar garantías." },
        { at: 1610, title:"La cuerda del cielo", badge:"Confianza",
          text:"Una nube alargada parece una cuerda tendida. La tomas como señal: no de destino, sino de continuidad. A veces el mundo te guiña un ojo." }
      ]
    },
    {
      id:"stormridge",
      name:"Cresta de Tormenta",
      startKm:1620,
      endKm:1840,
      palette:["#7aa2ff","#ff4d6d"],
      chapters: [
        { at: 1660, title:"Rayo quieto", badge:"Decisión",
          text:"La tormenta ruge pero no cae lluvia. Es un ruido que prueba tu paciencia. Sigues. Descubres que la decisión es el paraguas más fiable." },
        { at: 1750, title:"Piedra cantarina", badge:"Ritmo",
          text:"Una piedra vibra al contacto, como si recordara un tambor antiguo. Marcas el paso con ese ritmo y el cuerpo lo agradece. La épica también es cadencia." },
        { at: 1830, title:"El borde del mundo", badge:"Templanza",
          text:"Desde la cresta ves el valle final. Te pesa la emoción. Respiras y la vuelves útil: la conviertes en un plan para mañana." }
      ]
    },
    {
      id:"blackgate",
      name:"Puerta de Obsidiana",
      startKm:1840,
      endKm:1980,
      palette:["#ff4d6d","#ffce3a"],
      chapters: [
        { at: 1870, title:"Guardias sin ojos", badge:"Sigilo",
          text:"Estatuas negras flanquean un arco. No miran, pero sientes su juicio. No te encoges: te alineas. Postura recta. Mentón firme. Paso claro." },
        { at: 1930, title:"El precio de entrar", badge:"Sacrificio",
          text:"Una inscripción simple: ‘solo entra quien deja algo’. Dejas una excusa. Dejas una duda. Entras más ligero." },
        { at: 1975, title:"La antesala", badge:"Umbral",
          text:"El aire cambia, como si el mundo respirara distinto. Ya no imaginas la meta: la negocias con el siguiente kilómetro." }
      ]
    },
    {
      id:"embercitadel",
      name:"Ciudadela de Brasa",
      startKm:1980,
      endKm:999999, // will be clamped to total distance
      palette:["#ffce3a","#5af0b1"],
      chapters: [
        { at: 1990, title:"Paredes vivas", badge:"Victoria",
          text:"Las paredes parecen latir con calor. No es magia: es consecuencia. Tu viaje se vuelve tangible. Son tus días apilados, uno sobre otro, formando una ciudad." },
        { at: 2000, title:"El sello final", badge:"Leyenda",
          text:"Llegas. No hay fuegos artificiales, solo un silencio preciso. Tomas el sello final y entiendes la lección: la meta es una excusa elegante para volverte constante." }
      ]
    }
  ]
};

const EVENT_POOL = [
  { t:"Niebla en la ruta", w:"La niebla aprieta y el mundo se reduce a lo próximo. Perfecto: hoy solo necesitas el siguiente paso." , tag:"clima" },
  { t:"Mensajero sin nombre", w:"Un mensajero te ofrece un papel en blanco. ‘Escribe lo que vas a hacer cuando te canses’, dice. Te lo guardas." , tag:"encuentro" },
  { t:"Rastro de hierro", w:"Huellas metálicas cruzan el camino. No las sigues. Aprendes a no confundir velocidad ajena con dirección propia." , tag:"prudencia" },
  { t:"Ración extra", w:"Encuentras provisiones selladas. No son un premio: son un recordatorio. La energía se planifica." , tag:"recursos" },
  { t:"Puente fracturado", w:"Un puente está roto. No dramatizas: improvisas. Hoy entrenas tu capacidad de adaptar el plan." , tag:"obstáculo" },
  { t:"Viento a favor", w:"El viento empuja y te vuelves más ligero. Lo tomas con calma: incluso las facilidades hay que administrarlas." , tag:"ritmo" },
  { t:"Luz inesperada", w:"Una luz corta la oscuridad. No te salva: te enfoca. La claridad no hace el camino, hace el paso." , tag:"foco" },
  { t:"Piedra de juramento", w:"Tocas una piedra tallada con una sola palabra: ‘Sigue’. A veces el mundo habla corto." , tag:"señal" }
];

const DEFAULT_STATE = {
  totalChallengeKm: 2000,
  strideLengthMeters: 0.70,
  inputMode: "steps", // "steps" | "km"
  daily: {
    // "YYYY-MM-DD": { steps: n, km: n, event: {t,w,tag,zoneId} }
  }
};

function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return structuredClone(DEFAULT_STATE);
    const obj = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STATE),
      ...obj,
      daily: { ...(structuredClone(DEFAULT_STATE).daily), ...(obj.daily || {}) }
    };
  }catch{
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState(s){
  localStorage.setItem(KEY, JSON.stringify(s));
}

function kmFromSteps(steps, strideMeters){
  return (Number(steps) * Number(strideMeters)) / 1000;
}

function computeTotals(state){
  const days = Object.keys(state.daily);
  let totalSteps = 0;
  let totalKm = 0;

  for(const d of days){
    const rec = state.daily[d] || {};
    totalSteps += Number(rec.steps || 0);
    totalKm += Number(rec.km || 0);
  }
  return { totalSteps, totalKm, daysLogged: days.length };
}

function sortDatesDesc(keys){
  return [...keys].sort((a,b)=> a < b ? 1 : -1);
}

function computeStreak(state){
  const keys = Object.keys(state.daily);
  if(keys.length === 0) return 0;

  // streak: consecutive days up to today with steps>0 or km>0
  const set = new Set(keys);
  let streak = 0;
  let cur = new Date();
  for(;;){
    const y = cur.getFullYear();
    const m = String(cur.getMonth()+1).padStart(2,"0");
    const d = String(cur.getDate()).padStart(2,"0");
    const k = `${y}-${m}-${d}`;
    if(!set.has(k)) break;

    const rec = state.daily[k] || {};
    const active = (Number(rec.steps||0) > 0) || (Number(rec.km||0) > 0);
    if(!active) break;

    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function zoneForKm(km, totalKm){
  // adjust endKm of last zone to totalKm
  const zones = WORLD.zones.map(z => {
    if(z.id === "embercitadel"){
      return { ...z, endKm: totalKm };
    }
    return z;
  });

  const k = clamp(km, 0, totalKm);
  for(const z of zones){
    if(k >= z.startKm && k < z.endKm) return z;
  }
  return zones[zones.length - 1];
}

function nextZoneAfter(currentZone, totalKm){
  const zones = WORLD.zones.map(z => z.id === "embercitadel" ? ({...z, endKm: totalKm}) : z);
  const idx = zones.findIndex(z => z.id === currentZone.id);
  if(idx < 0) return null;
  return zones[idx+1] || null;
}

function unlockedChaptersForZone(zone, doneKm){
  const zEnd = zone.endKm;
  const available = zone.chapters.map(ch => ({
    ...ch,
    zoneId: zone.id,
    // if chapter at >= totalDistance, keep it but lock until reached
    unlocked: doneKm >= ch.at
  }));
  // Keep order by "at"
  available.sort((a,b)=> a.at - b.at);
  return { chapters: available, zoneEndKm: zEnd };
}

function pickDailyEvent(state, doneKm){
  // deterministic-ish per day: use date hash + doneKm band
  const day = todayKey();
  const seed = hash(`${day}|${Math.floor(doneKm/10)}`);
  const idx = seed % EVENT_POOL.length;
  return EVENT_POOL[idx];
}

function hash(str){
  // simple deterministic hash
  let h = 2166136261;
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* ---------- UI: Tabs ---------- */
function setTab(name){
  document.querySelectorAll(".tab").forEach(b=>{
    const active = b.dataset.tab === name;
    b.classList.toggle("active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll(".panel").forEach(p=>{
    p.classList.toggle("active", p.id === `tab-${name}`);
  });
}

/* ---------- UI: Map SVG (original) ---------- */
function mapSVG(doneKm, totalKm){
  const zones = WORLD.zones.map(z => z.id === "embercitadel" ? ({...z, endKm: totalKm}) : z);

  // track path points
  const width = 1560, height = 380;
  const padding = 30;

  // create a smooth-ish path (handcrafted points)
  const pts = [
    [60, 290],
    [190, 240],
    [330, 270],
    [470, 210],
    [610, 260],
    [740, 190],
    [900, 210],
    [1040, 160],
    [1210, 210],
    [1390, 140],
    [1510, 170]
  ];

  const pathD = `M ${pts[0][0]} ${pts[0][1]} ` +
    pts.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(" ");

  // position each zone marker along x proportional to startKm
  function xForKm(km){
    const t = clamp(km / totalKm, 0, 1);
    return padding + t * (width - 2*padding);
  }
  function yForT(t){
    // sample polyline by x proximity (simple)
    const x = padding + t * (width - 2*padding);
    // find nearest point segment
    let best = pts[0];
    let bestDist = 1e9;
    for(const p of pts){
      const d = Math.abs(p[0] - x);
      if(d < bestDist){ bestDist = d; best = p; }
    }
    return best[1];
  }

  const markers = zones.map(z=>{
    const t = clamp(z.startKm / totalKm, 0, 1);
    const x = xForKm(z.startKm);
    const y = yForT(t);
    const status = doneKm >= z.startKm ? (doneKm < z.endKm ? "now" : "done") : "lock";
    return { ...z, x, y, status };
  });

  // current cursor
  const tNow = clamp(doneKm / totalKm, 0, 1);
  const xNow = xForKm(doneKm);
  const yNow = yForT(tNow);

  // background scenery (original, stylized)
  return `
  <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Mapa">
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(122,162,255,.20)"/>
        <stop offset="1" stop-color="rgba(0,0,0,.00)"/>
      </linearGradient>

      <linearGradient id="gRoad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="rgba(90,240,177,.85)"/>
        <stop offset="1" stop-color="rgba(122,162,255,.85)"/>
      </linearGradient>

      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feColorMatrix in="b" type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 .9 0" result="c"/>
        <feMerge>
          <feMergeNode in="c"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- sky tint -->
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#gSky)"/>

    <!-- mountains -->
    <path d="M0 310 L120 250 L220 290 L320 240 L420 300 L520 235 L640 310 L780 260 L900 310 L1040 245 L1160 305 L1320 250 L1480 290 L1560 270 L1560 380 L0 380 Z"
          fill="rgba(255,255,255,.04)"/>
    <path d="M0 330 L140 280 L260 330 L380 275 L520 335 L680 290 L820 335 L980 280 L1120 340 L1280 300 L1420 338 L1560 310 L1560 380 L0 380 Z"
          fill="rgba(0,0,0,.18)"/>

    <!-- road -->
    <path d="${pathD}" stroke="rgba(255,255,255,.10)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="${pathD}" stroke="url(#gRoad)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#softGlow)"/>

    <!-- zone markers -->
    ${markers.map(m=>{
      const fill = m.status === "done" ? "rgba(90,240,177,.95)" :
                   m.status === "now"  ? "rgba(122,162,255,.95)" :
                                         "rgba(255,255,255,.18)";
      const stroke = m.status === "lock" ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.25)";
      const r = m.status === "now" ? 10 : 8;
      return `
      <g data-zone="${m.id}">
        <circle cx="${m.x}" cy="${m.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="${m.x}" cy="${m.y}" r="${r+8}" fill="transparent" stroke="rgba(255,255,255,.06)" stroke-width="8"/>
        <text x="${m.x}" y="${m.y - 16}" text-anchor="middle"
              fill="rgba(242,245,255,.78)" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">${m.name}</text>
      </g>`;
    }).join("")}

    <!-- current cursor -->
    <g>
      <circle cx="${xNow}" cy="${yNow}" r="14" fill="rgba(255,206,58,.18)" stroke="rgba(255,206,58,.45)" stroke-width="2"/>
      <circle cx="${xNow}" cy="${yNow}" r="5" fill="rgba(255,206,58,.95)"/>
    </g>
  </svg>`;
}

function miniMapSVG(doneKm, totalKm){
  // reuse big SVG but smaller viewbox via CSS container
  return mapSVG(doneKm, totalKm).replace(`width="1560" height="380"`, `width="100%" height="100%"`);
}

/* ---------- UI: Story illustration per zone (original) ---------- */
function zoneIllustrationSVG(zone, doneKm, totalKm){
  const [a,b] = zone.palette;
  const progressInZone = clamp((doneKm - zone.startKm) / Math.max(1,(zone.endKm - zone.startKm)), 0, 1);

  // simple parallax-ish layered SVG, fully original
  return `
  <svg viewBox="0 0 1200 420" width="1200" height="420" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="zg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${a}" stop-opacity=".22"/>
        <stop offset="1" stop-color="${b}" stop-opacity=".18"/>
      </linearGradient>
      <filter id="zblur">
        <feGaussianBlur stdDeviation="1.8"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1200" height="420" fill="rgba(0,0,0,.12)"/>
    <rect x="0" y="0" width="1200" height="420" fill="url(#zg)"/>

    <!-- distant shapes -->
    <path d="M0 280 C180 220, 320 300, 520 250 C700 205, 820 290, 1020 240 C1120 212, 1160 230, 1200 220 L1200 420 L0 420 Z"
      fill="rgba(255,255,255,.06)"/>
    <path d="M0 310 C220 260, 320 345, 520 300 C720 252, 880 360, 1200 300 L1200 420 L0 420 Z"
      fill="rgba(0,0,0,.18)"/>

    <!-- mid ridges -->
    <path d="M0 340 C220 300, 350 380, 560 340 C760 302, 920 395, 1200 340 L1200 420 L0 420 Z"
      fill="rgba(0,0,0,.20)"/>

    <!-- glow trail -->
    <path d="M120 ${320 - progressInZone*35} C 340 ${300 - progressInZone*55}, 520 ${360 - progressInZone*45}, 740 ${310 - progressInZone*65}
             C 880 ${280 - progressInZone*60}, 1020 ${330 - progressInZone*40}, 1100 ${300 - progressInZone*50}"
      stroke="rgba(255,255,255,.10)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M120 ${320 - progressInZone*35} C 340 ${300 - progressInZone*55}, 520 ${360 - progressInZone*45}, 740 ${310 - progressInZone*65}
             C 880 ${280 - progressInZone*60}, 1020 ${330 - progressInZone*40}, 1100 ${300 - progressInZone*50}"
      stroke="rgba(255,206,58,.70)" stroke-width="5" fill="none" stroke-linecap="round" filter="url(#zblur)"/>

    <!-- traveller -->
    <g transform="translate(${140 + progressInZone*820}, ${300 - progressInZone*55})">
      <circle cx="0" cy="0" r="8" fill="rgba(242,245,255,.92)"/>
      <path d="M0 8 L0 34" stroke="rgba(242,245,255,.85)" stroke-width="4" stroke-linecap="round"/>
      <path d="M0 18 L-12 30" stroke="rgba(242,245,255,.70)" stroke-width="4" stroke-linecap="round"/>
      <path d="M0 18 L12 30" stroke="rgba(242,245,255,.70)" stroke-width="4" stroke-linecap="round"/>
      <path d="M0 34 L-10 54" stroke="rgba(242,245,255,.70)" stroke-width="4" stroke-linecap="round"/>
      <path d="M0 34 L10 54" stroke="rgba(242,245,255,.70)" stroke-width="4" stroke-linecap="round"/>
      <path d="M10 22 L22 18" stroke="rgba(255,206,58,.75)" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- title -->
    <text x="40" y="80" fill="rgba(242,245,255,.92)" font-size="34" font-weight="800" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,Arial">
      ${zone.name}
    </text>
    <text x="40" y="115" fill="rgba(242,245,255,.62)" font-size="16" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">
      Progreso en la zona: ${(progressInZone*100).toFixed(0)}%
    </text>
  </svg>`;
}

/* ---------- State update helpers ---------- */
function ensureTodayRecord(state){
  const k = todayKey();
  if(!state.daily[k]) state.daily[k] = { steps:0, km:0, event:null };
  return k;
}

function setTodayBySteps(state, steps){
  const k = ensureTodayRecord(state);
  const s = Math.max(0, Math.floor(Number(steps)));
  state.daily[k].steps = s;
  state.daily[k].km = kmFromSteps(s, state.strideLengthMeters);
}

function setTodayByKm(state, km){
  const k = ensureTodayRecord(state);
  const v = Math.max(0, Number(km));
  state.daily[k].km = v;
  // keep steps estimate if possible
  state.daily[k].steps = Math.floor((v * 1000) / Math.max(0.2, state.strideLengthMeters));
}

/* ---------- Render ---------- */
function renderAll(){
  const state = loadState();
  const totals = computeTotals(state);
  const doneKm = totals.totalKm;
  const totalKm = Math.max(1, Number(state.totalChallengeKm));
  const pct = clamp(doneKm / totalKm, 0, 1);
  const left = Math.max(totalKm - doneKm, 0);

  // Zone & next
  const z = zoneForKm(doneKm, totalKm);
  const nz = nextZoneAfter(z, totalKm);

  // HOME metrics
  $("doneKm").textContent = fmt1(doneKm);
  $("totalKm").textContent = String(Math.round(totalKm));
  $("pct").textContent = (pct*100).toFixed(1) + "%";
  $("leftKm").textContent = `Te faltan ${fmt1(left)} km`;
  $("progressBar").style.width = (pct*100).toFixed(2) + "%";
  $("currentZone").textContent = z?.name || "—";
  $("nextZone").textContent = nz ? nz.name : "Meta";

  // Today stats
  const tk = todayKey();
  const rec = state.daily[tk] || { steps:0, km:0 };
  $("todaySteps").textContent = Number(rec.steps||0).toLocaleString("es-ES");
  $("todayKm").textContent = fmt2(Number(rec.km||0));

  // mini map
  $("miniMapCanvas").innerHTML = miniMapSVG(doneKm, totalKm);

  // Log stats
  $("totalSteps").textContent = totals.totalSteps.toLocaleString("es-ES");
  $("daysLogged").textContent = String(totals.daysLogged);
  const streak = computeStreak(state);
  $("streak").textContent = String(streak);
  $("streakInfo").textContent = `Racha: ${streak} día${streak===1?"":"s"}`;

  // Daily event
  renderDailyEvent(state, doneKm, totalKm);

  // MAP
  $("mapStage").innerHTML = mapSVG(doneKm, totalKm);

  // STORY
  renderStory(state, doneKm, totalKm);

  // HISTORY list
  renderHistory(state);

  // Settings inputs
  $("totalKmInput").value = state.totalChallengeKm;
  $("strideInput").value = Number(state.strideLengthMeters).toFixed(2);

  // Input mode UI
  document.querySelectorAll(".segbtn").forEach(b=>{
    b.classList.toggle("active", b.dataset.mode === state.inputMode);
  });

  // Modal labels reflect mode
  updateModalMode(state.inputMode);
}

function renderDailyEvent(state, doneKm, totalKm){
  const day = todayKey();
  ensureTodayRecord(state);

  // If no event saved for today, create one deterministically
  if(!state.daily[day].event){
    const base = pickDailyEvent(state, doneKm);
    const zone = zoneForKm(doneKm, totalKm);
    state.daily[day].event = { ...base, zoneId: zone.id, createdAt: Date.now() };
    saveState(state);
  }

  const ev = state.daily[day].event;
  $("dailyEventTitle").textContent = ev.t;
  $("dailyEventText").textContent = ev.w;
  const zoneName = WORLD.zones.find(z=>z.id===ev.zoneId)?.name || "Ruta";
  $("dailyEventMeta").textContent = `${day} • ${zoneName} • ${ev.tag}`;
}

function renderStory(state, doneKm, totalKm){
  const z = zoneForKm(doneKm, totalKm);
  const zoneEnd = (z.id === "embercitadel") ? totalKm : z.endKm;
  const distanceToZoneEnd = Math.max(zoneEnd - doneKm, 0);

  $("storyZoneBadge").textContent = z.name;
  $("storyZoneMeta").textContent = `${fmt1(doneKm)} km recorridos • Te faltan ${fmt1(distanceToZoneEnd)} km para salir de esta zona`;

  $("storyIllustration").innerHTML = zoneIllustrationSVG({ ...z, endKm: zoneEnd }, doneKm, totalKm);

  const info = unlockedChaptersForZone({ ...z, endKm: zoneEnd }, doneKm);
  const chapters = info.chapters;

  const list = $("chaptersList");
  list.innerHTML = "";

  for(const ch of chapters){
    const locked = !ch.unlocked;
    const el = document.createElement("div");
    el.className = "chapter" + (locked ? " locked" : "");
    el.innerHTML = `
      <div class="chapter-head">
        <div class="chapter-title">${locked ? "Capítulo bloqueado" : ch.title}</div>
        <div class="chapter-km">${Math.round(ch.at)} km</div>
      </div>
      <div class="chapter-text">${locked ? "Alcanza este km para desbloquear la escena." : ch.text}</div>
      <div class="badges">
        <span class="badge">Insignia: ${locked ? "???" : ch.badge}</span>
        <span class="badge">Zona: ${z.name}</span>
      </div>
    `;
    list.appendChild(el);
  }
}

function renderHistory(state){
  const keys = sortDatesDesc(Object.keys(state.daily));
  const list = $("historyList");
  list.innerHTML = "";

  if(keys.length === 0){
    list.innerHTML = `<div class="hint">Aún no has guardado ningún día.</div>`;
    return;
  }

  for(const k of keys){
    const rec = state.daily[k] || {};
    const steps = Number(rec.steps||0);
    const km = Number(rec.km||0);
    const ev = rec.event;
    const evTitle = ev ? ev.t : "—";

    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div>
        <div class="d">${k}</div>
        <div class="k">${steps.toLocaleString("es-ES")} pasos • ${fmt2(km)} km</div>
        <div class="d">Evento: ${evTitle}</div>
      </div>
      <div class="right">
        <div class="d">Acciones</div>
        <div class="row-actions" style="margin-top:6px">
          <button class="btn ghost small" data-act="edit" data-day="${k}">Editar</button>
          <button class="btn danger small" data-act="del" data-day="${k}">Borrar</button>
        </div>
      </div>
    `;
    list.appendChild(item);
  }

  // actions
  list.querySelectorAll("button[data-act]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const act = btn.dataset.act;
      const day = btn.dataset.day;
      if(act === "del") return deleteDay(day);
      if(act === "edit") return editDay(day);
    });
  });
}

/* ---------- Actions ---------- */
function deleteDay(day){
  const state = loadState();
  if(!confirm(`¿Borrar el día ${day}?`)) return;
  delete state.daily[day];
  saveState(state);
  renderAll();
}

function editDay(day){
  const state = loadState();
  const rec = state.daily[day] || {steps:0, km:0};
  openModal(`Editar ${day}`, state.inputMode, (value)=>{
    if(state.inputMode === "km"){
      const v = parseNum(value);
      if(!Number.isFinite(v) || v < 0) return;
      state.daily[day] = state.daily[day] || {};
      state.daily[day].km = v;
      state.daily[day].steps = Math.floor((v*1000)/Math.max(0.2,state.strideLengthMeters));
    } else {
      const v = Math.floor(parseNum(value));
      if(!Number.isFinite(v) || v < 0) return;
      state.daily[day] = state.daily[day] || {};
      state.daily[day].steps = v;
      state.daily[day].km = kmFromSteps(v, state.strideLengthMeters);
    }
    // keep existing event
    saveState(state);
    renderAll();
  }, state.inputMode === "km" ? rec.km : rec.steps);
}

/* ---------- Modal ---------- */
function updateModalMode(mode){
  if(mode === "km"){
    $("modalLabel").textContent = "Km de hoy";
    $("modalInput").setAttribute("inputmode","decimal");
    $("modalInput").setAttribute("step","0.01");
    $("modalInput").placeholder = "Ej: 6.20";
    $("modalHint").textContent = "Introduce km del día (si prefieres no usar pasos).";
  } else {
    $("modalLabel").textContent = "Pasos de hoy";
    $("modalInput").setAttribute("inputmode","numeric");
    $("modalInput").removeAttribute("step");
    $("modalInput").placeholder = "Ej: 8420";
    $("modalHint").textContent = "Consejo: mira tus pasos en Salud y pégalos aquí.";
  }
}

let modalOnSave = null;
function openModal(title, mode, onSave, presetValue=null){
  $("modalTitle").textContent = title;
  updateModalMode(mode);
  $("modal").classList.add("show");
  $("modalInput").value = presetValue !== null ? String(presetValue).replace(".", ",") : "";
  setTimeout(()=> $("modalInput").focus(), 50);
  modalOnSave = onSave;
}
function closeModal(){
  $("modal").classList.remove("show");
  modalOnSave = null;
}

/* ---------- Export/Import ---------- */
function exportState(){
  const state = loadState();
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `questwalk-backup-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importState(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(reader.result);
      if(!obj || typeof obj !== "object") throw new Error("Formato inválido");
      const merged = {
        ...structuredClone(DEFAULT_STATE),
        ...obj,
        daily: obj.daily || {}
      };
      localStorage.setItem(KEY, JSON.stringify(merged));
      renderAll();
      alert("Importación correcta.");
    }catch(e){
      alert("No se pudo importar: archivo inválido.");
    }
  };
  reader.readAsText(file);
}

/* ---------- Install prompt (limited in iOS) ---------- */
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  $("btnInstall").style.display = "grid";
});
$("btnInstall").addEventListener("click", async ()=>{
  if(!deferredPrompt){
    alert("En iPhone: Safari → Compartir → Añadir a pantalla de inicio.");
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt = null;
});

/* ---------- Bind UI ---------- */
function bind(){
  // tabs
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      setTab(btn.dataset.tab);
      if(btn.dataset.tab === "map") setTimeout(()=> centerMapOnNow(), 30);
    });
  });

  // Home: add steps
  $("btnAddSteps").addEventListener("click", ()=>{
    const state = loadState();
    openModal("Añadir progreso de hoy", state.inputMode, (value)=>{
      const s = loadState();
      if(s.inputMode === "km"){
        const km = parseNum(value);
        if(!Number.isFinite(km) || km < 0) return;
        setTodayByKm(s, km);
      } else {
        const steps = Math.floor(parseNum(value));
        if(!Number.isFinite(steps) || steps < 0) return;
        setTodayBySteps(s, steps);
      }
      // set or refresh event
      const totals = computeTotals(s);
      const zone = zoneForKm(totals.totalKm, s.totalChallengeKm);
      const base = pickDailyEvent(s, totals.totalKm);
      const day = todayKey();
      s.daily[day].event = { ...base, zoneId: zone.id, createdAt: Date.now() };
      saveState(s);
      closeModal();
      renderAll();
    });
  });

  // Home: quick story
  $("btnQuickStory").addEventListener("click", ()=>{
    setTab("story");
  });

  // Inline today save/undo
  $("btnSaveToday").addEventListener("click", ()=>{
    const state = loadState();
    const v = parseNum($("stepsInput").value);
    if(!Number.isFinite(v) || v < 0) return;
    // this input is always steps field; if user wants KM, use modal or settings mode
    setTodayBySteps(state, Math.floor(v));
    // event refresh
    const totals = computeTotals(state);
    const zone = zoneForKm(totals.totalKm, state.totalChallengeKm);
    const base = pickDailyEvent(state, totals.totalKm);
    const day = todayKey();
    state.daily[day].event = { ...base, zoneId: zone.id, createdAt: Date.now() };
    saveState(state);
    $("stepsInput").value = "";
    renderAll();
  });

  $("btnUndoToday").addEventListener("click", ()=>{
    const state = loadState();
    const day = todayKey();
    if(state.daily[day]) delete state.daily[day];
    saveState(state);
    renderAll();
  });

  $("btnResetAll").addEventListener("click", ()=>{
    if(!confirm("¿Reiniciar todo el viaje y borrar datos?")) return;
    saveState(structuredClone(DEFAULT_STATE));
    renderAll();
  });

  // Daily event regen
  $("btnNewEvent").addEventListener("click", ()=>{
    const state = loadState();
    const totals = computeTotals(state);
    const day = todayKey();
    ensureTodayRecord(state);
    const zone = zoneForKm(totals.totalKm, state.totalChallengeKm);
    // change seed by timestamp to allow new event
    const idx = Math.floor(Math.random()*EVENT_POOL.length);
    const base = EVENT_POOL[idx];
    state.daily[day].event = { ...base, zoneId: zone.id, createdAt: Date.now() };
    saveState(state);
    renderAll();
  });

  // Map jump
  $("btnJumpNow").addEventListener("click", centerMapOnNow);

  // Settings save
  $("btnSaveSettings").addEventListener("click", ()=>{
    const state = loadState();
    const total = parseNum($("totalKmInput").value);
    const stride = parseNum($("strideInput").value);
    if(Number.isFinite(total) && total > 0) state.totalChallengeKm = total;
    if(Number.isFinite(stride) && stride >= 0.2 && stride <= 2.0) state.strideLengthMeters = stride;
    saveState(state);
    renderAll();
    alert("Ajustes guardados.");
  });

  // input mode seg
  document.querySelectorAll(".segbtn").forEach(b=>{
    b.addEventListener("click", ()=>{
      const state = loadState();
      state.inputMode = b.dataset.mode;
      saveState(state);
      renderAll();
    });
  });

  // Modal controls
  $("btnCloseModal").addEventListener("click", closeModal);
  $("btnModalCancel").addEventListener("click", closeModal);
  $("modal").addEventListener("click", (e)=>{ if(e.target.id === "modal") closeModal(); });
  $("btnModalSave").addEventListener("click", ()=>{
    if(!modalOnSave) return closeModal();
    modalOnSave($("modalInput").value);
  });
  $("modalInput").addEventListener("keydown", (e)=>{
    if(e.key === "Enter"){
      e.preventDefault();
      $("btnModalSave").click();
    }
  });

  // Export/Import
  $("btnExport").addEventListener("click", exportState);
  $("importFile").addEventListener("change", (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) importState(f);
    e.target.value = "";
  });
}

function centerMapOnNow(){
  const state = loadState();
  const totals = computeTotals(state);
  const totalKm = Math.max(1, Number(state.totalChallengeKm));
  const doneKm = totals.totalKm;
  const wrap = $("mapWrap");

  // position along width 1600
  const stageW = 1600;
  const t = clamp(doneKm / totalKm, 0, 1);
  const x = 30 + t * (1560 - 60);
  const target = x - wrap.clientWidth/2;
  wrap.scrollTo({ left: clamp(target, 0, stageW), behavior:"smooth" });
}

/* ---------- Service worker ---------- */
async function registerSW(){
  if("serviceWorker" in navigator){
    try{
      await navigator.serviceWorker.register("./sw.js");
    }catch{
      // ignore
    }
  }
}

/* ---------- Boot ---------- */
(function boot(){
  // Hide install button by default (iOS won’t fire beforeinstallprompt)
  $("btnInstall").style.display = "none";

  bind();
  registerSW();
  renderAll();

  // Default to Home tab
  setTab("home");
})();