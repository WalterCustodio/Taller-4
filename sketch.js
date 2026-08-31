// =====================================================
// TP2 — SISTEMA DE 9 INTERFACES REACTIVAS
// p5.js + MediaPipe Hands
// HOME + 9 EXPERIENCIAS
// =====================================================


// =====================================================
// CONFIGURACIÓN GENERAL
// =====================================================

let video;
let handsDetector;
let cameraMediaPipe;

let hands = [];
let yemas = [];

let experienciaActual = 0;

const duracionExperiencia = 10;
let tiempoInicio = 0;

let enHome = true;
let guiaMostradaInteraccion = true;


// =====================================================
// CONCEPTOS
// =====================================================

const conceptos = [
  "Memoria",
  "Herencia",
  "Caducidad",

  "Identidad",
  "Empatía",
  "Colaboración",

  "Incertidumbre",
  "Ansiedad",
  "Expectativa"
];

const subtitulos = [
  "como registro",
  "como legado",
  "como lo perdido en el tránsito",

  "como afirmación de sí",
  "como comprensión del otro",
  "como coexistencia de lo diverso",

  "como desconocimiento del devenir",
  "como pre-ocupación sobre el futuro",
  "como anticipación"
];


// =====================================================
// COLORES
// =====================================================

const AZUL = {
  r: 40,
  g: 150,
  b: 255
};

const AMARILLO = {
  r: 255,
  g: 210,
  b: 40
};

const NARANJA = {
  r: 255,
  g: 135,
  b: 45
};

const FUCSIA = {
  r: 240,
  g: 50,
  b: 180
};

const VERDE = {
  r: 100,
  g: 220,
  b: 100
};


// =====================================================
// TAMAÑOS
// =====================================================

const TAM_CIRCULO = 48;

const MAX_IDENTIDAD =
  TAM_CIRCULO * 5;


// =====================================================
// DEDOS MEDIAPIPE
// =====================================================

const dedos = [
  4,
  8,
  12,
  16,
  20
];


// =====================================================
// GUÍA DE LAS MANOS
// =====================================================

const guiaMano = [

  // meñique
  {
    x: -130,
    y: 65
  },

  // índice
  {
    x: -65,
    y: -55
  },

  // medio
  {
    x: 0,
    y: -100
  },

  // anular
  {
    x: 65,
    y: -55
  },

  // pulgar
  {
    x: 145,
    y: 15
  }

];


// =====================================================
// ESTADOS
// =====================================================

// MEMORIA
let estelas = [];


// HERENCIA
let herencias = [];
let contactosHerencia = {};


// CADUCIDAD
let circulosCaducidad = [];
let prevYemasCaducidad = {};


// IDENTIDAD
let identidades = [];
let identidadEstado = [];
let contactosIdentidad = {};


// EMPATÍA
let empatiaIluminacion = [true, false];
let ultimoContactoEmpatia = 0;

const TIEMPO_APAGADO_EMPATIА = 2000;


// COLABORACIÓN
let colaboracionBrillo = 0;


// INCERTIDUMBRE
let coloresIncertidumbre = [];
let contactosIncertidumbre = {};


// ANSIEDAD
let ansiedadFases = [];
let ansiedadColisionIniciada = false;
let tiempoInicioAnsiedadColision = 0;


// EXPECTATIVA
let patronExpectativa = [];


// =====================================================
// SETUP
// =====================================================

function setup() {

  createCanvas(
    windowWidth,
    windowHeight
  );

  pixelDensity(1);


  // ---------------------------------------------
  // CÁMARA
  // ---------------------------------------------

  video = createCapture(VIDEO);

  video.size(
    640,
    480
  );

  video.hide();


  // ---------------------------------------------
  // MEDIAPIPE
  // ---------------------------------------------

  handsDetector = new Hands({

    locateFile: (file) => {

      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }

  });


  handsDetector.setOptions({

    maxNumHands: 2,

    modelComplexity: 1,

    minDetectionConfidence: 0.6,

    minTrackingConfidence: 0.6

  });


  handsDetector.onResults(
    recibirResultados
  );


  // ---------------------------------------------
  // CÁMARA MEDIAPIPE
  // ---------------------------------------------

  cameraMediaPipe = new Camera(
    video.elt,
    {

      onFrame: async () => {

        if (video && video.elt && video.elt.readyState >= 2) {

          try {

            await handsDetector.send({
              image: video.elt
            });

          } catch (err) {

            console.warn("Error en frame MediaPipe:", err);

          }

        }

      },

      width: 640,
      height: 480

    }
  );


  cameraMediaPipe.start();


  iniciarExperiencia();

}


// =====================================================
// RESULTADOS MEDIAPIPE
// =====================================================

function recibirResultados(resultados) {

  hands =
    resultados.multiHandLandmarks || [];

}


// =====================================================
// DRAW
// =====================================================

function draw() {

  background(5);


  if (enHome) {

    dibujarHome();

    return;

  }


  actualizarYemas();


  switch (experienciaActual) {

    case 0:
      memoria();
      break;

    case 1:
      herencia();
      break;

    case 2:
      caducidad();
      break;

    case 3:
      identidad();
      break;

    case 4:
      empatia();
      break;

    case 5:
      colaboracion();
      break;

    case 6:
      incertidumbre();
      break;

    case 7:
      ansiedad();
      break;

    case 8:
      expectativa();
      break;

  }


  dibujarTituloExperiencia();

  dibujarBotonVolver();

  dibujarBotonSiguiente();

  dibujarBarraTiempo();

  controlarCambioAutomatico();

}


// =====================================================
// HOME
// =====================================================

function dibujarHome() {

  // ---------------------------------------------
  // CONFIGURACIÓN DE LA GRILLA
  // ---------------------------------------------

  const columnas = 3;
  const filas = 3;

  const anchoCelda =
    width / columnas;

  const altoCelda =
    height / filas;


  // ---------------------------------------------
  // CADA EXPERIENCIA
  // ---------------------------------------------

  for (
    let i = 0;
    i < 9;
    i++
  ) {

    const columna =
      i % 3;

    const fila =
      floor(i / 3);


    const centroX =
      columna * anchoCelda +
      anchoCelda / 2;


    const centroY =
      fila * altoCelda +
      altoCelda / 2;


    const colorTitulo =
      colorTituloConcepto(i);


    // -------------------------------------------
    // HOVER
    // -------------------------------------------

    const hover =
      mouseX >=
      columna * anchoCelda &&

      mouseX <
      (columna + 1) *
      anchoCelda &&

      mouseY >=
      fila * altoCelda &&

      mouseY <
      (fila + 1) *
      altoCelda;


    // -------------------------------------------
    // CÍRCULOS DE FONDO
    // -------------------------------------------

    dibujarCirculosHome(
      i,
      centroX,
      centroY,
      hover
    );


    // -------------------------------------------
    // TÍTULO
    // -------------------------------------------

    noStroke();


    if (hover) {

      fill(
        colorTitulo.r,
        colorTitulo.g,
        colorTitulo.b
      );

    } else {

      fill(
        colorTitulo.r,
        colorTitulo.g,
        colorTitulo.b,
        210
      );

    }


    textAlign(
      CENTER,
      CENTER
    );


    textSize(
      min(
        width * 0.027,
        30
      )
    );


    textStyle(BOLD);


    text(
      conceptos[i],
      centroX,
      centroY - 8
    );


    // -------------------------------------------
    // SUBTÍTULO
    // -------------------------------------------

    fill(
      255,
      hover ? 190 : 110
    );


    textSize(
      min(
        width * 0.012,
        14
      )
    );


    textStyle(NORMAL);


    text(
      `(${subtitulos[i]})`,
      centroX,
      centroY + 28
    );

  }

}


// =====================================================
// COLOR DEL TÍTULO SEGÚN BLOQUE
// =====================================================

function colorTituloConcepto(indice) {

  // PASADO
  if (indice <= 2) {

    return AZUL;

  }


  // PRESENTE
  if (indice <= 5) {

    return NARANJA;

  }


  // FUTURO
  return FUCSIA;

}


// =====================================================
// CÍRCULOS DE FONDO DE LA HOME
// =====================================================

function dibujarCirculosHome(
  indice,
  centroX,
  centroY,
  hover
) {

  let colores;


  // ---------------------------------------------
  // PASADO
  // ---------------------------------------------

  if (indice <= 2) {

    colores = [
      AZUL,
      AMARILLO
    ];

  }


  // ---------------------------------------------
  // PRESENTE
  // ---------------------------------------------

  else if (indice <= 5) {

    colores = [
      AZUL,
      NARANJA
    ];

  }


  // ---------------------------------------------
  // FUTURO
  // ---------------------------------------------

  else {

    colores = [
      NARANJA,
      FUCSIA
    ];

  }


  // ---------------------------------------------
  // POSICIONES
  // ---------------------------------------------
  // SE MANTIENE UNA DISPOSICIÓN
  // TIPO MANO DETRÁS DEL TEXTO
  // ---------------------------------------------

  const posiciones = [

    {
      x: -65,
      y: 42
    },

    {
      x: -32,
      y: -28
    },

    {
      x: 0,
      y: -48
    },

    {
      x: 32,
      y: -28
    },

    {
      x: 65,
      y: 20
    }

  ];


  // ---------------------------------------------
  // SEGUNDA MANO
  // ---------------------------------------------

  const posicionesDerecha = [

    {
      x: -65,
      y: 42
    },

    {
      x: -32,
      y: -28
    },

    {
      x: 0,
      y: -48
    },

    {
      x: 32,
      y: -28
    },

    {
      x: 65,
      y: 20
    }

  ];


  // ---------------------------------------------
  // ESCALA
  // ---------------------------------------------

  const escala =
    min(
      anchoSeguroHome(),
      1
    );


  // ---------------------------------------------
  // CÍRCULOS
  // ---------------------------------------------

  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const p =
      posiciones[i];


    const color =
      colores[0];


    dibujarCirculoHome(

      centroX +
      p.x *
      escala -
      50,

      centroY +
      p.y *
      escala,

      TAM_CIRCULO * 0.72,

      color,

      hover

    );

  }


  for (
    let i = 0;
    i < 5;
    i++
  ) {

    const p =
      posicionesDerecha[i];


    const color =
      colores[1];


    dibujarCirculoHome(

      centroX +
      p.x *
      escala +
      50,

      centroY +
      p.y *
      escala,

      TAM_CIRCULO * 0.72,

      color,

      hover

    );

  }

}


// =====================================================
// CÍRCULO INDIVIDUAL HOME
// =====================================================

function dibujarCirculoHome(
  x,
  y,
  tam,
  color,
  hover
) {

  noStroke();


  // brillo muy suave detrás
  if (hover) {

    fill(
      color.r,
      color.g,
      color.b,
      20
    );


    circle(
      x,
      y,
      tam * 1.7
    );

  }


  fill(
    color.r,
    color.g,
    color.b,
    hover
      ? 120
      : 55
  );


  circle(
    x,
    y,
    tam
  );

}


// =====================================================
// ESCALA SEGURA HOME
// =====================================================

function anchoSeguroHome() {

  return constrain(
    width / 1000,
    0.7,
    1
  );

}


// =====================================================
// CLICK HOME
// =====================================================

// =====================================================
// CLICK HOME (CONSOLIDADO EN MOUSECLICKED)
// =====================================================

function mousePressed() {

  // La gestión de clics completa se realiza en mouseClicked()
  // para evitar conflictos de eventos entre funciones de p5.

}


// =====================================================
// ACTUALIZAR YEMAS
// =====================================================

function actualizarYemas() {

  yemas = [];


  for (
    let h = 0;
    h < hands.length;
    h++
  ) {

    const mano =
      hands[h];


    for (
      let d = 0;
      d < dedos.length;
      d++
    ) {

      const punto =
        mano[dedos[d]];


      const x = map(
        punto.x,
        0,
        1,
        width,
        0
      );


      const y =
        punto.y *
        height;


      yemas.push({

        x: x,
        y: y,

        mano: h,
        dedo: d

      });

    }

  }


  if (yemas.length > 0) {

    guiaMostradaInteraccion = false;

  }

}


// =====================================================
// GUÍA
// =====================================================

function dibujarGuiaManos() {

  const centroY =
    height * 0.53;


  const centroIzquierda =
    width * 0.30;


  const centroDerecha =
    width * 0.70;


  for (
    let i = 0;
    i < guiaMano.length;
    i++
  ) {

    const p =
      guiaMano[i];


    noStroke();


    fill(
      AZUL.r,
      AZUL.g,
      AZUL.b,
      160
    );


    circle(
      centroIzquierda - p.x,
      centroY + p.y,
      TAM_CIRCULO
    );

  }


  for (
    let i = 0;
    i < guiaMano.length;
    i++
  ) {

    const p =
      guiaMano[i];


    noStroke();


    fill(
      AMARILLO.r,
      AMARILLO.g,
      AMARILLO.b,
      160
    );


    circle(
      centroDerecha + p.x,
      centroY + p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// TÍTULO EXPERIENCIA
// =====================================================

function dibujarTituloExperiencia() {

  textAlign(
    CENTER,
    CENTER
  );


  noStroke();


  const color =
    colorTituloConcepto(
      experienciaActual
    );


  fill(
    color.r,
    color.g,
    color.b
  );


  textSize(
    min(
      width * 0.025,
      28
    )
  );


  textStyle(BOLD);


  text(
    conceptos[experienciaActual],
    width / 2,
    45
  );


  textStyle(NORMAL);

}


// =====================================================
// BOTÓN VOLVER
// =====================================================

function dibujarBotonVolver() {

  const x = 35;
  const y = 35;

  const hovering = dist(mouseX, mouseY, x, y) < 25;

  noStroke();

  if (hovering) {
    fill(255, 50);
    circle(x, y, 36);
    fill(255);
  } else {
    fill(255, 130);
  }

  textAlign(
    CENTER,
    CENTER
  );

  textSize(24);

  text(
    "×",
    x,
    y
  );

}


// =====================================================
// BOTÓN SIGUIENTE
// =====================================================

function dibujarBotonSiguiente() {

  const x = width - 65;
  const y = 35;

  const hovering = dist(mouseX, mouseY, x, y) < 40;

  noStroke();

  fill(255, hovering ? 60 : 30);
  rectMode(CENTER);
  rect(x, y, 100, 32, 16);
  rectMode(CORNER);

  fill(255, hovering ? 255 : 190);
  textAlign(CENTER, CENTER);
  textSize(13);
  textStyle(BOLD);
  text("Siguiente ›", x, y);
  textStyle(NORMAL);

}


// =====================================================
// TECLADO
// =====================================================

function keyPressed() {

  // ---------------------------------------------
  // VOLVER A HOME
  // ---------------------------------------------

  if (
    key === "x" ||
    key === "X" ||
    keyCode === ESCAPE
  ) {

    enHome = true;

    return;

  }


  if (enHome) {

    return;

  }


  // ---------------------------------------------
  // SIGUIENTE
  // ---------------------------------------------

  if (
    keyCode === RIGHT_ARROW
  ) {

    siguienteExperiencia();

  }


  // ---------------------------------------------
  // ANTERIOR
  // ---------------------------------------------

  if (
    keyCode === LEFT_ARROW
  ) {

    experienciaAnterior();

  }


  // ---------------------------------------------
  // NÚMEROS
  // ---------------------------------------------

  if (
    key >= "1" &&
    key <= "9"
  ) {

    experienciaActual =
      Number(key) - 1;


    iniciarExperiencia();

  }

}


// =====================================================
// CLICK EN BOTONES
// =====================================================

// =====================================================
// CLICK EN BOTONES Y HOME
// =====================================================

function mouseClicked() {

  // ---------------------------------------------
  // SI ESTÁ EN HOME: SELECCIÓN DE EXPERIENCIA
  // ---------------------------------------------

  if (enHome) {

    const columnas = 3;
    const filas = 3;

    const anchoCelda = width / columnas;
    const altoCelda = height / filas;

    const columna = floor(mouseX / anchoCelda);
    const fila = floor(mouseY / altoCelda);

    if (
      columna >= 0 &&
      columna <= 2 &&
      fila >= 0 &&
      fila <= 2
    ) {

      experienciaActual = fila * 3 + columna;
      enHome = false;
      iniciarExperiencia();

    }

    return;

  }


  // ---------------------------------------------
  // SI ESTÁ EN EXPERIENCIA: BOTONES DE NAVEGACIÓN
  // ---------------------------------------------

  // Botón Volver (X)
  if (
    dist(
      mouseX,
      mouseY,
      35,
      35
    ) < 35
  ) {

    enHome = true;

    return;

  }


  // Botón Siguiente
  if (
    dist(
      mouseX,
      mouseY,
      width - 65,
      35
    ) < 45
  ) {

    siguienteExperiencia();

    return;

  }

}


// =====================================================
// SIGUIENTE
// =====================================================

function siguienteExperiencia() {

  experienciaActual++;


  if (
    experienciaActual > 8
  ) {

    experienciaActual = 0;

  }


  iniciarExperiencia();

}


// =====================================================
// ANTERIOR
// =====================================================

function experienciaAnterior() {

  experienciaActual--;


  if (
    experienciaActual < 0
  ) {

    experienciaActual = 8;

  }


  iniciarExperiencia();

}


// =====================================================
// INICIAR EXPERIENCIA
// =====================================================

function iniciarExperiencia() {

  tiempoInicio =
    millis();


  // MEMORIA
  estelas =
    Array(10)
      .fill()
      .map(() => []);


  // HERENCIA
  herencias = [];

  contactosHerencia = {};


  // CADUCIDAD
  circulosCaducidad = [];
  prevYemasCaducidad = {};


  // IDENTIDAD
  inicializarIdentidades();


  // EMPATÍA
  empatiaIluminacion =
    [true, false];

  ultimoContactoEmpatia =
    millis();


  // COLABORACIÓN
  colaboracionBrillo = 0;


  // INCERTIDUMBRE
  contactosIncertidumbre = {};


  coloresIncertidumbre =
    Array(10)
      .fill()
      .map(() => null);


  // ANSIEDAD
  ansiedadFases =
    Array(10)
      .fill()
      .map(() =>
        random(TWO_PI)
      );

  ansiedadColisionIniciada = false;
  tiempoInicioAnsiedadColision = 0;


  // GUÍA INTERACTIVA RESET
  guiaMostradaInteraccion = true;


  // EXPECTATIVA
  crearPatronExpectativa();

}


// =====================================================
// COLOR POR MANO
// =====================================================

function colorPorMano(
  mano,
  colorA,
  colorB
) {

  if (
    mano === 0
  ) {

    return colorA;

  }


  return colorB;

}


// =====================================================
// DIBUJAR YEMAS
// =====================================================

function dibujarYemas(
  colorA,
  colorB
) {

  for (
    let p of yemas
  ) {

    const color =
      colorPorMano(
        p.mano,
        colorA,
        colorB
      );


    noStroke();


    fill(
      color.r,
      color.g,
      color.b
    );


    circle(
      p.x,
      p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// CENTRO MANO
// =====================================================

function obtenerCentroMano(
  numeroMano
) {

  const puntos =
    yemas.filter(
      p =>
        p.mano ===
        numeroMano
    );


  if (
    puntos.length === 0
  ) {

    return null;

  }


  let sumaX = 0;
  let sumaY = 0;


  for (
    let p of puntos
  ) {

    sumaX += p.x;
    sumaY += p.y;

  }


  return {

    x:
      sumaX /
      puntos.length,

    y:
      sumaY /
      puntos.length

  };

}


// =====================================================
// CONTACTO ENTRE MANOS
// =====================================================

function manosEnContacto() {

  const centroA =
    obtenerCentroMano(0);


  const centroB =
    obtenerCentroMano(1);


  if (
    !centroA ||
    !centroB
  ) {

    return false;

  }


  const distancia =
    dist(
      centroA.x,
      centroA.y,
      centroB.x,
      centroB.y
    );


  return distancia < 180;

}


// =====================================================
// 1 — MEMORIA
// =====================================================

function memoria() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  const ahora = millis();


  if (frameCount % 2 === 0) {

    for (
      let p of yemas
    ) {

      const indice =
        p.mano * 5 +
        p.dedo;


      estelas[indice].push({

        x: p.x,
        y: p.y,
        tiempo: ahora

      });

    }

  }


  // ---------------------------------------------
  // DESVANECIMIENTO Y VIDA DE 25 SEGUNDOS
  // ---------------------------------------------

  for (let i = 0; i < estelas.length; i++) {
    estelas[i] = estelas[i].filter(punto => (ahora - punto.tiempo) < 25000);
  }


  // ---------------------------------------------
  // LÍMITE TOTAL DE 200 CÍRCULOS EN PANTALLA
  // ---------------------------------------------

  let totalCirculos = estelas.reduce((acc, e) => acc + e.length, 0);

  while (totalCirculos > 200) {

    let indiceMasAntiguo = -1;
    let tiempoMasAntiguo = Infinity;

    for (let i = 0; i < estelas.length; i++) {
      if (estelas[i].length > 0 && estelas[i][0].tiempo < tiempoMasAntiguo) {
        tiempoMasAntiguo = estelas[i][0].tiempo;
        indiceMasAntiguo = i;
      }
    }

    if (indiceMasAntiguo !== -1) {
      estelas[indiceMasAntiguo].shift();
      totalCirculos--;
    } else {
      break;
    }

  }


  for (
    let i = 0;
    i < estelas.length;
    i++
  ) {

    const color =
      i < 5
        ? AZUL
        : AMARILLO;


    for (
      let punto of
      estelas[i]
    ) {

      const edad = ahora - punto.tiempo;
      const alpha = map(edad, 0, 25000, 35, 0);

      noStroke();


      fill(
        color.r,
        color.g,
        color.b,
        alpha
      );


      circle(
        punto.x,
        punto.y,
        TAM_CIRCULO * 0.55
      );

    }

  }


  dibujarYemas(
    AZUL,
    AMARILLO
  );

}


// =====================================================
// 2 — HERENCIA
// =====================================================

function herencia() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < yemas.length;
      j++
    ) {

      const a =
        yemas[i];

      const b =
        yemas[j];


      if (
        a.mano === b.mano
      ) {

        continue;

      }


      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );


      const clave =
        `${i}-${j}`;


      if (
        distancia <
        TAM_CIRCULO
      ) {

        if (
          !contactosHerencia[clave]
        ) {

          contactosHerencia[clave] =
            true;

          const cx = (a.x + b.x) / 2;
          const cy = (a.y + b.y) / 2;

          const radioMinimoExclusion = TAM_CIRCULO * 0.3;
          let demasiadoCerca = herencias.some(h => dist(cx, cy, h.x, h.y) < radioMinimoExclusion);

          if (!demasiadoCerca) {

            herencias.push({

              x: cx,

              y: cy,

              tam: 0,

              tamFinal:
                TAM_CIRCULO * 0.8

            });

          }

        }

      } else {

        contactosHerencia[clave] =
          false;

      }

    }

  }


  for (
    let h of herencias
  ) {

    h.tam =
      lerp(
        h.tam,
        h.tamFinal,
        0.1
      );


    noStroke();


    fill(
      VERDE.r,
      VERDE.g,
      VERDE.b,
      40
    );


    circle(
      h.x,
      h.y,
      h.tam * 1.8
    );


    fill(
      VERDE.r,
      VERDE.g,
      VERDE.b
    );


    circle(
      h.x,
      h.y,
      h.tam
    );

  }


  dibujarYemas(
    AZUL,
    AMARILLO
  );

}


// =====================================================
// 3 — CADUCIDAD
// =====================================================

function caducidad() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  let manoEnMovimiento = false;

  for (let p of yemas) {
    const clave = `${p.mano}-${p.dedo}`;
    const prev = prevYemasCaducidad[clave];

    if (prev) {
      const d = dist(p.x, p.y, prev.x, prev.y);
      if (d > 2.2) {
        manoEnMovimiento = true;
      }
    }

    prevYemasCaducidad[clave] = { x: p.x, y: p.y };
  }


  if (
    yemas.length > 0 &&
    manoEnMovimiento &&
    frameCount % 6 === 0
  ) {

    const origen =
      random(yemas);


    const color =
      origen.mano === 0
        ? AZUL
        : AMARILLO;


    circulosCaducidad.push({

      x: origen.x,

      y: origen.y,

      vx: random(
        -1.2,
        1.2
      ),

      vy: random(
        0.5,
        1.8
      ),

      gravedad: random(
        0.05,
        0.12
      ),

      tam: random(
        TAM_CIRCULO * 0.22,
        TAM_CIRCULO * 0.45
      ) * 1.3,

      vida: random(
        100,
        220
      ),

      color: color

    });

  }


  for (
    let i =
      circulosCaducidad.length - 1;
    i >= 0;
    i--
  ) {

    const c =
      circulosCaducidad[i];


    c.x += c.vx;
    c.y += c.vy;

    c.vy +=
      c.gravedad;


    c.vida -=
      0.8;


    noStroke();


    fill(
      c.color.r,
      c.color.g,
      c.color.b,
      c.vida
    );


    circle(
      c.x,
      c.y,
      c.tam
    );


    if (
      c.y > height ||
      c.vida <= 0
    ) {

      circulosCaducidad.splice(
        i,
        1
      );

    }

  }


  dibujarYemas(
    AZUL,
    AMARILLO
  );

}


// =====================================================
// INICIALIZAR IDENTIDADES
// =====================================================

function inicializarIdentidades() {

  identidades = [];
  identidadEstado = [];
  contactosIdentidad = {};


  // Mano 0 (Tonos de Azul)
  const tonosAzul = [
    { r: 30, g: 120, b: 255 },  // Meñique
    { r: 60, g: 160, b: 255 },  // Índice
    { r: 80, g: 190, b: 255 },  // Medio
    { r: 20, g: 140, b: 230 },  // Anular
    { r: 100, g: 200, b: 255 }  // Pulgar
  ];


  // Mano 1 (Tonos de Naranja)
  const tonosNaranja = [
    { r: 255, g: 90, b: 30 },   // Meñique
    { r: 255, g: 135, b: 45 },  // Índice
    { r: 255, g: 165, b: 50 },  // Medio
    { r: 240, g: 110, b: 20 },  // Anular
    { r: 255, g: 185, b: 70 }   // Pulgar
  ];


  for (let idx = 0; idx < 10; idx++) {

    const mano = floor(idx / 5);
    const dedo = idx % 5;

    const colBase = (mano === 0) ? tonosAzul[dedo] : tonosNaranja[dedo];


    identidades.push({

      color: colBase,

      tamano: TAM_CIRCULO * random(1.0, 1.5),

      opacidad: random(178, 255)

    });


    identidadEstado.push({

      animando: false,

      tiempoInicioAnim: 0,

      brilloExtra: false,

      tiempoInicioBrillo: 0

    });

  }

}


// =====================================================
// 4 — IDENTIDAD
// =====================================================

function identidad() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  if (identidades.length === 0) {

    inicializarIdentidades();

  }


  // ---------------------------------------------
  // DETECCIÓN DE COLISIÓN ENTRE DEDOS
  // ---------------------------------------------

  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < yemas.length;
      j++
    ) {

      const a = yemas[i];
      const b = yemas[j];

      // Ignorar colisiones entre dedos de la misma mano
      if (a.mano === b.mano) {
        continue;
      }

      const idxA = a.mano * 5 + a.dedo;
      const idxB = b.mano * 5 + b.dedo;

      const distancia = dist(a.x, a.y, b.x, b.y);
      const clave = `${idxA}-${idxB}`;

      const tamA = identidades[idxA] ? identidades[idxA].tamano : TAM_CIRCULO;
      const tamB = identidades[idxB] ? identidades[idxB].tamano : TAM_CIRCULO;

      // Hitbox reducida al 70% del tamaño (x * 0.7)
      const umbralColision = (tamA + tamB) * 0.5 * 0.7;


      if (distancia < umbralColision) {

        if (!contactosIdentidad[clave]) {

          contactosIdentidad[clave] = true;

          const ahora = millis();

          identidadEstado[idxA].animando = true;
          identidadEstado[idxA].tiempoInicioAnim = ahora;

          identidadEstado[idxB].animando = true;
          identidadEstado[idxB].tiempoInicioAnim = ahora;

        }

      } else {

        contactosIdentidad[clave] = false;

      }

    }

  }


  // ---------------------------------------------
  // DIBUJO DE CADA IDENTIDAD
  // ---------------------------------------------

  for (let p of yemas) {

    const idx = p.mano * 5 + p.dedo;
    const est = identidadEstado[idx] || { animando: false, brilloExtra: false };
    const idOriginal = identidades[idx] || { color: AZUL, tamano: TAM_CIRCULO, opacidad: 255 };

    let idVisual = idOriginal;


    // ---------------------------------------------
    // TRANSICIÓN DE 1 SEGUNDO AL COLISIONAR
    // PASA POR TODAS LAS OTRAS IDENTIDADES
    // ---------------------------------------------

    if (est.animando) {

      const transcurrido = (millis() - est.tiempoInicioAnim) / 1000;

      if (transcurrido < 1.0) {

        const paso = floor(transcurrido * 15) % identidades.length;
        idVisual = identidades[paso];

      } else {

        est.animando = false;
        est.brilloExtra = true;
        est.tiempoInicioBrillo = millis();

      }

    }


    const col = idVisual.color;
    const tam = idVisual.tamano;
    const opa = idVisual.opacidad;


    // ---------------------------------------------
    // BRILLO SUTIL POR DETRÁS DEL CÍRCULO (3 SEGUNDOS)
    // ---------------------------------------------

    if (est.brilloExtra) {

      const tiempoBrillo = (millis() - (est.tiempoInicioBrillo || 0)) / 1000;

      if (tiempoBrillo < 3.0) {

        // Desvanecimiento suave en el último segundo
        const factorFade = constrain(1.0 - (tiempoBrillo - 2.0), 0.0, 1.0);

        noStroke();

        const pulsoGlow = sin(frameCount * 0.08) * 3;

        // Halo exterior suave
        fill(
          col.r,
          col.g,
          col.b,
          25 * factorFade
        );

        circle(
          p.x,
          p.y,
          tam * 1.5 + pulsoGlow
        );


        // Halo intermedio sutil
        fill(
          col.r,
          col.g,
          col.b,
          45 * factorFade
        );

        circle(
          p.x,
          p.y,
          tam * 1.25 + pulsoGlow * 0.5
        );

      } else {

        est.brilloExtra = false;

      }

    }


    // ---------------------------------------------
    // CÍRCULO BASE DE LA IDENTIDAD
    // ---------------------------------------------

    noStroke();

    fill(
      col.r,
      col.g,
      col.b,
      opa
    );

    circle(
      p.x,
      p.y,
      tam
    );

  }

}


// =====================================================
// 5 — EMPATÍA
// =====================================================

function empatia() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  const contacto =
    manosEnContacto();


  if (contacto) {

    empatiaIluminacion[0] =
      true;

    empatiaIluminacion[1] =
      true;


    ultimoContactoEmpatia =
      millis();

  }


  if (
    !contacto &&
    millis() -
    ultimoContactoEmpatia >
    TIEMPO_APAGADO_EMPATIА
  ) {

    empatiaIluminacion[1] =
      false;

  }


  for (
    let p of yemas
  ) {

    const color =
      p.mano === 0
        ? AZUL
        : NARANJA;


    const iluminada =
      empatiaIluminacion[p.mano];


    if (iluminada) {

      noStroke();


      fill(
        color.r,
        color.g,
        color.b,
        35
      );


      circle(
        p.x,
        p.y,
        TAM_CIRCULO * 2.2
      );

    }


    noStroke();


    fill(
      color.r,
      color.g,
      color.b,
      iluminada
        ? 255
        : 80
    );


    circle(
      p.x,
      p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// 6 — COLABORACIÓN
// =====================================================

function colaboracion() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  // ---------------------------------------------
  // DETECTAR SI LAS DOS MANOS SE UNEN
  // ---------------------------------------------

  const contacto =
    manosEnContacto();


  // ---------------------------------------------
  // BRILLO
  // ---------------------------------------------

  if (contacto) {

    colaboracionBrillo =
      lerp(
        colaboracionBrillo,
        1,
        0.12
      );

  } else {

    colaboracionBrillo =
      lerp(
        colaboracionBrillo,
        0,
        0.08
      );

  }


  // ---------------------------------------------
  // DIBUJAR CADA YEMA
  // ---------------------------------------------

  for (
    let p of yemas
  ) {

    const color =
      p.mano === 0
        ? AZUL
        : NARANJA;


    // -------------------------------------------
    // AURA DE COLABORACIÓN
    // APARECE SOLO AL UNIRSE
    // -------------------------------------------

    if (
      colaboracionBrillo > 0.01
    ) {

      noStroke();


      fill(
        color.r,
        color.g,
        color.b,
        45 * colaboracionBrillo
      );


      circle(
        p.x,
        p.y,
        TAM_CIRCULO *
        (1.5 + 0.9 * colaboracionBrillo)
      );

    }


    // -------------------------------------------
    // CÍRCULO PRINCIPAL
    // OPACO → BRILLANTE
    // -------------------------------------------

    noStroke();


    const alpha =
      lerp(
        45,
        255,
        colaboracionBrillo
      );


    fill(
      color.r,
      color.g,
      color.b,
      alpha
    );


    circle(
      p.x,
      p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// 7 — INCERTIDUMBRE
// =====================================================

function incertidumbre() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  const coloresRandom = [

    NARANJA,
    FUCSIA,
    AZUL,
    AMARILLO,
    VERDE

  ];


  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < yemas.length;
      j++
    ) {

      const a =
        yemas[i];

      const b =
        yemas[j];


      if (
        a.mano === b.mano
      ) {

        continue;

      }


      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );


      const clave =
        `${i}-${j}`;


      if (
        distancia <
        TAM_CIRCULO * 1.15
      ) {

        if (
          !contactosIncertidumbre[clave]
        ) {

          contactosIncertidumbre[clave] =
            true;


          const indiceA =
            a.mano * 5 +
            a.dedo;


          const indiceB =
            b.mano * 5 +
            b.dedo;


          coloresIncertidumbre[indiceA] =
            random(coloresRandom);


          coloresIncertidumbre[indiceB] =
            random(coloresRandom);

        }

      } else {

        contactosIncertidumbre[clave] =
          false;

      }

    }

  }


  for (
    let p of yemas
  ) {

    const indice =
      p.mano * 5 +
      p.dedo;


    let color =
      coloresIncertidumbre[indice];


    if (!color) {

      color =
        p.mano === 0
          ? NARANJA
          : FUCSIA;

    }


    noStroke();


    fill(
      color.r,
      color.g,
      color.b
    );


    circle(
      p.x,
      p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// 8 — ANSIEDAD
// =====================================================

function ansiedad() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  // ---------------------------------------------
  // DETECCIÓN DE COLISIÓN PARA INICIAR EL TEMBLOR
  // ---------------------------------------------

  if (!ansiedadColisionIniciada) {

    if (manosEnContacto()) {

      ansiedadColisionIniciada = true;
      tiempoInicioAnsiedadColision = millis();

    } else {

      for (let i = 0; i < yemas.length; i++) {
        for (let j = i + 1; j < yemas.length; j++) {
          if (dist(yemas[i].x, yemas[i].y, yemas[j].x, yemas[j].y) < TAM_CIRCULO * 1.2) {
            ansiedadColisionIniciada = true;
            tiempoInicioAnsiedadColision = millis();
            break;
          }
        }
        if (ansiedadColisionIniciada) break;
      }

    }

  }


  // ---------------------------------------------
  // INTENSIDAD Y TENSIÓN EXPLÍCITA SEGÚN EL TIEMPO
  // ---------------------------------------------

  let intensidad = 0;
  let velFase = 0.2;

  if (ansiedadColisionIniciada) {

    const segColision = (millis() - tiempoInicioAnsiedadColision) / 1000;

    // Empeoramiento explícito con el tiempo
    const factorTension = 1.0 + segColision * 1.1;

    intensidad = 8 * factorTension;
    velFase = 0.2 * (1.0 + segColision * 0.15);

  }


  for (
    let p of yemas
  ) {

    const indice =
      p.mano * 5 +
      p.dedo;


    if (
      ansiedadFases[indice] ===
      undefined
    ) {

      ansiedadFases[indice] =
        random(TWO_PI);

    }


    ansiedadFases[indice] +=
      random(
        0.15,
        0.4
      ) * velFase;


    let movimientoX = 0;
    let movimientoY = 0;

    if (ansiedadColisionIniciada) {

      movimientoX =
        random(
          -intensidad,
          intensidad
        ) *
        sin(
          ansiedadFases[indice]
        );

      movimientoY =
        random(
          -intensidad,
          intensidad
        ) *
        cos(
          ansiedadFases[indice] *
          1.4
        );

    }


    const color =
      p.mano === 0
        ? NARANJA
        : FUCSIA;


    noStroke();


    fill(
      color.r,
      color.g,
      color.b,
      30
    );


    circle(
      p.x +
      movimientoX,
      p.y +
      movimientoY,
      TAM_CIRCULO * 1.8
    );


    fill(
      color.r,
      color.g,
      color.b
    );


    circle(
      p.x +
      movimientoX,
      p.y +
      movimientoY,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// 9 — EXPECTATIVA
// =====================================================

const HORIZONTE_ANTICIPACION = 14;
const SUAVIZADO_PROYECCION = 0.12;


function crearPatronExpectativa() {

  patronExpectativa =
    Array(10)
      .fill()
      .map(() => ({

        prevX: null,
        prevY: null,

        projX: null,
        projY: null

      }));

}


function expectativa() {

  if (guiaMostradaInteraccion) {

    dibujarGuiaManos();

    return;

  }


  for (
    let p of yemas
  ) {

    const indice =
      p.mano * 5 +
      p.dedo;


    const estado =
      patronExpectativa[indice];


    // ---------------------------------------------
    // PRIMER FRAME DE ESTE DEDO
    // ---------------------------------------------

    if (
      estado.prevX === null
    ) {

      estado.prevX = p.x;
      estado.prevY = p.y;

      estado.projX = p.x;
      estado.projY = p.y;

    }


    // ---------------------------------------------
    // VELOCIDAD ACTUAL DEL DEDO
    // ---------------------------------------------

    const vx =
      p.x - estado.prevX;

    const vy =
      p.y - estado.prevY;


    // ---------------------------------------------
    // PUNTO ANTICIPADO
    // HACIA DÓNDE VA, NO DÓNDE ESTÁ
    // ---------------------------------------------

    const objetivoX =
      p.x +
      vx * HORIZONTE_ANTICIPACION;

    const objetivoY =
      p.y +
      vy * HORIZONTE_ANTICIPACION;


    estado.projX =
      lerp(
        estado.projX,
        objetivoX,
        SUAVIZADO_PROYECCION
      );

    estado.projY =
      lerp(
        estado.projY,
        objetivoY,
        SUAVIZADO_PROYECCION
      );


    estado.prevX = p.x;
    estado.prevY = p.y;


    const color =
      p.mano === 0
        ? NARANJA
        : FUCSIA;


    const velocidad =
      dist(
        0,
        0,
        vx,
        vy
      );


    // ---------------------------------------------
    // HILO ENTRE EL PRESENTE Y LO ANTICIPADO
    // ---------------------------------------------

    stroke(
      color.r,
      color.g,
      color.b,
      90
    );

    strokeWeight(1.2);

    line(
      p.x,
      p.y,
      estado.projX,
      estado.projY
    );

    noStroke();


    // ---------------------------------------------
    // SIGNO ANTICIPADO
    // RESPIRA MÁS RÁPIDO CUANTO MÁS RÁPIDO SE MUEVE
    // ---------------------------------------------

    const pulso =
      1 +
      0.15 *
      sin(
        frameCount *
        (0.1 + velocidad * 0.02)
      );


    noFill();

    stroke(
      color.r,
      color.g,
      color.b,
      140
    );

    strokeWeight(2);

    circle(
      estado.projX,
      estado.projY,
      TAM_CIRCULO * 0.9 * pulso
    );

    noStroke();


    // ---------------------------------------------
    // PUNTO REAL, EN EL PRESENTE
    // ---------------------------------------------

    fill(
      color.r,
      color.g,
      color.b
    );

    circle(
      p.x,
      p.y,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// INDICADOR DE EXPERIENCIA (NUEVA BARRA DE TIEMPO)
// =====================================================

function dibujarBarraTiempo() {

  const total = 9;
  const diametro = 6;
  const espaciado = 16;
  const anchoTotal = (total - 1) * espaciado;
  const inicioX = (width - anchoTotal) / 2;
  const y = height - 25;

  noStroke();
  for (let i = 0; i < total; i++) {
    if (i === experienciaActual) {
      fill(255, 230);
      circle(inicioX + i * espaciado, y, diametro * 1.4);
    } else {
      fill(255, 60);
      circle(inicioX + i * espaciado, y, diametro);
    }
  }

}


// =====================================================
// CAMBIO AUTOMÁTICO (DESACTIVADO)
// =====================================================

function controlarCambioAutomatico() {

  // El cambio automático fue desactivado.
  // Ahora el avance entre interfaces se realiza mediante el botón "Siguiente".

}


// =====================================================
// REDIMENSIONAR
// =====================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}