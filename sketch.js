// ============================================================
// TP2 — SISTEMA DE 9 INTERFACES REACTIVAS
// p5.js + MediaPipe Hands
// ============================================================


// ============================================================
// VARIABLES GENERALES
// ============================================================

let video;
let handsDetector;
let hands = [];

let yemas = [];

let experienciaActual = 0;

const duracionExperiencia = 10;

let tiempoInicio;


// ============================================================
// CONCEPTOS
// ============================================================

const conceptos = [

  ["MEMORIA", "como registro"],
  ["HERENCIA", "como legado"],
  ["CADUCIDAD", "como lo perdido en el tránsito"],

  ["IDENTIDAD", "como afirmación de sí"],
  ["EMPATÍA", "como comprensión del otro"],
  ["COLABORACIÓN", "como coexistencia de lo diverso"],

  ["INCERTIDUMBRE", "como desconocimiento del devenir"],
  ["ANSIEDAD", "como preocupación sobre el futuro"],
  ["EXPECTATIVA", "como anticipación"]

];


// ============================================================
// COLORES
// ============================================================

// FILA 1 — AZUL + AMARILLO

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


// VERDE — mezcla de azul + amarillo

const VERDE = {
  r: 100,
  g: 220,
  b: 100
};


// FILA 2 — AZUL + NARANJA

const NARANJA = {
  r: 255,
  g: 135,
  b: 45
};


// FILA 3 — FUCSIA + NARANJA

const FUCSIA = {
  r: 240,
  g: 50,
  b: 180
};


// ============================================================
// VARIABLES DE EXPERIENCIAS
// ============================================================

let estelas = [];


// HERENCIA

let herenciaEstados = {};

let herenciasNuevas = [];


// CADUCIDAD

let particulasCaducidad = [];

let posicionesAnteriores = [];

let ultimaCaida = 0;


// EMPATÍA

let empatiaEstados = [];


// INCERTIDUMBRE

let formasIncertidumbre = [];

let ultimoCambioForma = 0;


// ANSIEDAD

let ansiedadTiempo = 0;


// ============================================================
// IDENTIDAD
// ============================================================

let identidadActivadas = [];

let identidadUltimaPosicion = null;

let identidadMovimiento = 0;

let identidadPulso = 0;


// ============================================================
// DEDOS DE MEDIAPIPE
// ============================================================

const dedos = [4, 8, 12, 16, 20];


// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(
    windowWidth,
    windowHeight
  );

  pixelDensity(1);


  // ==========================================================
  // CÁMARA
  // ==========================================================

  video = createCapture(VIDEO);

  video.size(
    640,
    480
  );

  video.hide();


  // ==========================================================
  // MEDIAPIPE
  // ==========================================================

  handsDetector = new Hands({

    locateFile: function(file) {

      return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file;

    }

  });


  handsDetector.setOptions({

    maxNumHands: 2,

    modelComplexity: 0,

    minDetectionConfidence: 0.5,

    minTrackingConfidence: 0.5

  });


  handsDetector.onResults(
    recibirManos
  );


  // ==========================================================
  // CÁMARA + MEDIAPIPE
  // ==========================================================

  const camera = new Camera(

    video.elt,

    {

      onFrame: async function() {

        await handsDetector.send({

          image: video.elt

        });

      },

      width: 640,

      height: 480

    }

  );

  camera.start();


  iniciarExperiencia();

}


// ============================================================
// RECIBIR MANOS
// ============================================================

function recibirManos(resultado) {

  if (resultado.multiHandLandmarks) {

    hands =
      resultado.multiHandLandmarks;

  }

  else {

    hands = [];

  }

}


// ============================================================
// DRAW
// ============================================================

function draw() {

  background(
    12,
    12,
    15
  );


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


  dibujarTitulo();

  dibujarBarraTiempo();

  controlarTiempo();

}


// ============================================================
// ACTUALIZAR YEMAS
// ============================================================

function actualizarYemas() {

  yemas = [];


  for (
    let h = 0;
    h < hands.length && h < 2;
    h++
  ) {

    let mano = hands[h];


    for (
      let d = 0;
      d < dedos.length;
      d++
    ) {

      let punto =
        mano[dedos[d]];


      let x = map(
        punto.x,
        0,
        1,
        width,
        0
      );


      let y =
        punto.y * height;


      yemas.push({

        x: x,
        y: y,

        mano: h,
        dedo: d

      });

    }

  }

}


// ============================================================
// CENTRO DE MANO
// ============================================================

function centroMano(numero) {

  let puntos =
    yemas.filter(
      p => p.mano === numero
    );


  if (puntos.length === 0) {

    return null;

  }


  let x = 0;
  let y = 0;


  for (let p of puntos) {

    x += p.x;
    y += p.y;

  }


  return {

    x: x / puntos.length,
    y: y / puntos.length

  };

}


// ============================================================
// GUÍA — DOS MANOS
// ============================================================

function dibujarGuia() {

  let posiciones = [

    [-70, 50],
    [-35, 0],
    [0, -25],
    [35, 0],
    [70, 50]

  ];


  // MANO IZQUIERDA

  for (let p of posiciones) {

    noStroke();

    fill(

      AZUL.r,
      AZUL.g,
      AZUL.b,
      90

    );


    circle(

      width / 2 - 220 + p[0],
      height / 2 + p[1],

      28

    );

  }


  // MANO DERECHA

  for (let p of posiciones) {

    noStroke();

    fill(

      AMARILLO.r,
      AMARILLO.g,
      AMARILLO.b,
      90

    );


    circle(

      width / 2 + 220 + p[0],
      height / 2 + p[1],

      28

    );

  }

}


// ============================================================
// GUÍA HERENCIA
// ============================================================

function dibujarGuiaHerencia() {

  let posiciones = [

    [-70, 50],
    [-35, 0],
    [0, -25],
    [35, 0],
    [70, 50]

  ];


  // MANO AZUL

  for (let p of posiciones) {

    noStroke();

    fill(

      AZUL.r,
      AZUL.g,
      AZUL.b,
      100

    );


    circle(

      width / 2 - 220 + p[0],
      height / 2 + p[1],

      30

    );

  }


  // MANO AMARILLA

  for (let p of posiciones) {

    noStroke();

    fill(

      AMARILLO.r,
      AMARILLO.g,
      AMARILLO.b,
      100

    );


    circle(

      width / 2 + 220 + p[0],
      height / 2 + p[1],

      30

    );

  }

}


// ============================================================
// GUÍA — UNA MANO
// ============================================================

function dibujarGuiaUnaMano() {

  let posiciones = [

    [-55, 35],
    [-28, 0],
    [0, -20],
    [28, 0],
    [55, 35]

  ];


  for (let p of posiciones) {

    noStroke();

    fill(

      AZUL.r,
      AZUL.g,
      AZUL.b,
      90

    );


    circle(

      width / 2 + p[0],
      height / 2 + p[1],

      28

    );

  }

}


// ============================================================
// TÍTULO
// ============================================================

function dibujarTitulo() {

  textAlign(
    CENTER,
    CENTER
  );


  noStroke();

  fill(255);


  textSize(
    min(
      width * 0.035,
      32
    )
  );


  text(

    conceptos[experienciaActual][0],

    width / 2,
    40

  );

}


// ============================================================
// BARRA DE TIEMPO
// ============================================================

function dibujarBarraTiempo() {

  let transcurrido = (

    millis() -
    tiempoInicio

  ) / 1000;


  let progreso = constrain(

    transcurrido /
    duracionExperiencia,

    0,
    1

  );


  noStroke();


  fill(
    255,
    255,
    255,
    30
  );


  rect(

    60,
    height - 25,
    width - 120,
    2

  );


  fill(255);


  rect(

    60,
    height - 25,

    (width - 120) *
    progreso,

    2

  );

}


// ============================================================
// CONTROL DEL TIEMPO
// ============================================================

function controlarTiempo() {

  let transcurrido = (

    millis() -
    tiempoInicio

  ) / 1000;


  if (

    transcurrido >=
    duracionExperiencia

  ) {

    siguienteExperiencia();

  }

}


// ============================================================
// SIGUIENTE EXPERIENCIA
// ============================================================

function siguienteExperiencia() {

  experienciaActual++;


  if (
    experienciaActual >= 9
  ) {

    experienciaActual = 0;

  }


  iniciarExperiencia();

}


// ============================================================
// EXPERIENCIA ANTERIOR
// ============================================================

function experienciaAnterior() {

  experienciaActual--;


  if (
    experienciaActual < 0
  ) {

    experienciaActual = 8;

  }


  iniciarExperiencia();

}


// ============================================================
// TECLADO
// ============================================================

function keyPressed() {

  // FLECHA DERECHA

  if (keyCode === RIGHT_ARROW) {

    siguienteExperiencia();

  }


  // FLECHA IZQUIERDA

  if (keyCode === LEFT_ARROW) {

    experienciaAnterior();

  }


  // TECLAS 1 — 9

  if (
    key >= "1" &&
    key <= "9"
  ) {

    experienciaActual =
      int(key) - 1;

    iniciarExperiencia();

  }

}


// ============================================================
// INICIAR EXPERIENCIA
// ============================================================

function iniciarExperiencia() {

  tiempoInicio = millis();


  // ==========================================================
  // MEMORIA
  // ==========================================================

  estelas = [];


  for (let i = 0; i < 10; i++) {

    estelas.push([]);

  }


  // ==========================================================
  // HERENCIA
  // ==========================================================

  herenciaEstados = {};

  herenciasNuevas = [];


  // ==========================================================
  // CADUCIDAD
  // ==========================================================

  particulasCaducidad = [];

  posicionesAnteriores = [];

  ultimaCaida = millis();


  // ==========================================================
  // EMPATÍA
  // ==========================================================

  empatiaEstados = [];


  // ==========================================================
  // INCERTIDUMBRE
  // ==========================================================

  formasIncertidumbre = [];


  for (let i = 0; i < 10; i++) {

    formasIncertidumbre.push(
      "circle"
    );

  }


  ultimoCambioForma =
    millis();


  // ==========================================================
  // ANSIEDAD
  // ==========================================================

  ansiedadTiempo = 0;


  // ==========================================================
  // IDENTIDAD
  // ==========================================================

  identidadActivadas = [

    false,
    false,
    false,
    false,
    false

  ];


  identidadUltimaPosicion = null;

  identidadMovimiento = 0;

  identidadPulso = 0;

}


// ============================================================
// 1 — MEMORIA
// ============================================================

function memoria() {

  if (yemas.length === 0) {

    dibujarGuia();

    return;

  }


  // Registrar posiciones

  for (
    let i = 0;
    i < yemas.length && i < 10;
    i++
  ) {

    estelas[i].push({

      x: yemas[i].x,
      y: yemas[i].y

    });


    if (
      estelas[i].length > 400
    ) {

      estelas[i].shift();

    }

  }


  // Dibujar memoria

  for (
    let i = 0;
    i < estelas.length;
    i++
  ) {

    let color =

      i < 5
        ? AZUL
        : AMARILLO;


    let trail =
      estelas[i];


    for (
      let j = 0;
      j < trail.length;
      j += 4
    ) {

      let p = trail[j];


      let alpha = map(

        j,
        0,
        trail.length,

        5,
        60

      );


      noStroke();


      fill(

        color.r,
        color.g,
        color.b,
        alpha

      );


      circle(

        p.x,
        p.y,
        12

      );

    }

  }


  dibujarYemasNormales();

}


// ============================================================
// YEMAS NORMALES
// ============================================================

function dibujarYemasNormales() {

  for (let p of yemas) {

    let color =

      p.mano === 0
        ? AZUL
        : AMARILLO;


    noStroke();


    fill(

      color.r,
      color.g,
      color.b

    );


    circle(

      p.x,
      p.y,
      28

    );

  }

}


// ============================================================
// 2 — HERENCIA
// ============================================================

function herencia() {

  if (yemas.length < 10) {

    dibujarGuiaHerencia();

    return;

  }


  // ==========================================================
  // DETECTAR CHOQUES
  // ==========================================================

  for (let i = 0; i < yemas.length; i++) {

    let p1 = yemas[i];


    for (
      let j = i + 1;
      j < yemas.length;
      j++
    ) {

      let p2 = yemas[j];


      // Solo puede haber herencia
      // entre las dos manos

      if (
        p1.mano === p2.mano
      ) {

        continue;

      }


      let distancia = dist(

        p1.x,
        p1.y,

        p2.x,
        p2.y

      );


      let indiceEstado =
        i + "-" + j;


      // ======================================================
      // CHOQUE
      // ======================================================

      if (
        distancia < 65
      ) {


        // Si no estaban chocando
        // antes, se crea un nuevo verde

        if (
          !herenciaEstados[indiceEstado]
        ) {

          herenciaEstados[indiceEstado] = true;


          // ==================================================
          // NUEVO CÍRCULO VERDE
          // ==================================================

          herenciasNuevas.push({

            x:
              (p1.x + p2.x) / 2,

            y:
              (p1.y + p2.y) / 2,

            tamaño: 0,

            tamañoFinal: 40,

            creciendo: true

          });

        }

      }


      // ======================================================
      // SE SEPARARON
      // ======================================================

      else {

        herenciaEstados[indiceEstado] =
          false;

      }

    }

  }


  // ==========================================================
  // DIBUJAR LOS VERDES HEREDADOS
  // ==========================================================

  for (
    let i =
      0;
    i <
      herenciasNuevas.length;
    i++
  ) {

    let h =
      herenciasNuevas[i];


    // Crecimiento suave

    if (
      h.creciendo
    ) {

      h.tamaño =
        lerp(

          h.tamaño,

          h.tamañoFinal,

          0.12

        );


      if (
        abs(

          h.tamaño -
          h.tamañoFinal

        ) < 0.5
      ) {

        h.tamaño =
          h.tamañoFinal;

        h.creciendo =
          false;

      }

    }


    // ========================================================
    // HALO
    // ========================================================

    noStroke();


    fill(

      VERDE.r,
      VERDE.g,
      VERDE.b,
      20

    );


    circle(

      h.x,
      h.y,

      h.tamaño * 2

    );


    // ========================================================
    // CÍRCULO VERDE
    // ========================================================

    fill(

      VERDE.r,
      VERDE.g,
      VERDE.b

    );


    circle(

      h.x,
      h.y,

      h.tamaño

    );


    // ========================================================
    // BRILLO
    // ========================================================

    fill(

      255,
      255,
      255,
      150

    );


    circle(

      h.x -
        h.tamaño * 0.15,

      h.y -
        h.tamaño * 0.15,

      h.tamaño * 0.18

    );

  }


  // ==========================================================
  // DIBUJAR LAS YEMAS ORIGINALES
  // ==========================================================

  for (let p of yemas) {

    let color =

      p.mano === 0
        ? AZUL
        : AMARILLO;


    noStroke();


    fill(

      color.r,
      color.g,
      color.b

    );


    circle(

      p.x,
      p.y,
      40

    );

  }

}


// ============================================================
// 3 — CADUCIDAD
// ============================================================

function caducidad() {

  if (yemas.length === 0) {

    dibujarGuia();

    return;

  }


  let movimientoTotal = 0;


  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    let p = yemas[i];


    let anterior =
      posicionesAnteriores[i];


    if (anterior) {

      movimientoTotal += dist(

        p.x,
        p.y,

        anterior.x,
        anterior.y

      );

    }


    posicionesAnteriores[i] = {

      x: p.x,
      y: p.y

    };

  }


  if (

    movimientoTotal > 35 &&

    millis() -
    ultimaCaida > 90

  ) {

    ultimaCaida = millis();


    let indice =
      floor(
        random(yemas.length)
      );


    let p =
      yemas[indice];


    let color =

      p.mano === 0
        ? AZUL
        : AMARILLO;


    particulasCaducidad.push({

      x: p.x,
      y: p.y,

      vx: random(-0.8, 0.8),

      vy: random(1, 3),

      gravedad: 0.08,

      tam: random(8, 18),

      rotacion:
        random(TWO_PI),

      velocidadRotacion:
        random(-0.04, 0.04),

      vida: 255,

      color: color,

      forma: random([

        "circle",
        "triangle",
        "square"

      ])

    });

  }


  for (

    let i =
      particulasCaducidad.length - 1;

    i >= 0;

    i--

  ) {

    let p =
      particulasCaducidad[i];


    p.vy +=
      p.gravedad;


    p.x +=
      p.vx;


    p.y +=
      p.vy;


    p.rotacion +=
      p.velocidadRotacion;


    p.vida -= 1.3;


    push();


    translate(
      p.x,
      p.y
    );


    rotate(
      p.rotacion
    );


    noStroke();


    fill(

      p.color.r,
      p.color.g,
      p.color.b,
      p.vida

    );


    dibujarForma(

      p.forma,

      0,
      0,

      p.tam

    );


    pop();


    if (

      p.vida <= 0 ||

      p.y >
      height + 50

    ) {

      particulasCaducidad.splice(
        i,
        1
      );

    }

  }


  dibujarYemasNormales();

}


// ============================================================
// 4 — IDENTIDAD
// ============================================================

function identidad() {

  let manoYemas =
    yemas.filter(
      p => p.mano === 0
    );


  if (manoYemas.length === 0) {

    dibujarGuiaUnaMano();

    return;

  }


  let centro =
    centroMano(0);


  if (centro) {

    if (identidadUltimaPosicion) {

      identidadMovimiento += dist(

        centro.x,
        centro.y,

        identidadUltimaPosicion.x,
        identidadUltimaPosicion.y

      );

    }


    identidadUltimaPosicion = {

      x: centro.x,
      y: centro.y

    };

  }


  if (
    identidadMovimiento > 45
  ) {

    for (let i = 0; i < 5; i++) {

      if (
        !identidadActivadas[i]
      ) {

        identidadActivadas[i] =
          true;

        identidadMovimiento = 0;

        break;

      }

    }

  }


  let todasActivas =

    identidadActivadas[0] &&
    identidadActivadas[1] &&
    identidadActivadas[2] &&
    identidadActivadas[3] &&
    identidadActivadas[4];


  if (
    todasActivas
  ) {

    identidadPulso +=
      0.045;

  }


  for (
    let i = 0;
    i < manoYemas.length;
    i++
  ) {

    let p =
      manoYemas[i];


    let activa =
      identidadActivadas[p.dedo];


    if (!activa) {

      noStroke();


      fill(

        AZUL.r,
        AZUL.g,
        AZUL.b,
        35

      );


      circle(

        p.x,
        p.y,
        28

      );


      continue;

    }


    let escala = 1;


    if (
      todasActivas
    ) {

      escala = map(

        sin(identidadPulso),

        -1,
        1,

        0.75,
        1.35

      );

    }


    let tam =
      32 * escala;


    noStroke();


    fill(

      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      25

    );


    circle(

      p.x,
      p.y,

      tam * 2.4

    );


    fill(

      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      55

    );


    circle(

      p.x,
      p.y,

      tam * 1.5

    );


    fill(

      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      255

    );


    circle(

      p.x,
      p.y,
      tam

    );


    fill(

      255,
      255,
      255,
      190

    );


    circle(

      p.x,
      p.y,

      tam * 0.22

    );

  }

}


// ============================================================
// 5 — EMPATÍA
// ============================================================

function empatia() {

  if (yemas.length < 10) {

    dibujarGuia();

    return;

  }


  if (
    empatiaEstados.length !== yemas.length
  ) {

    empatiaEstados = [];


    for (
      let i = 0;
      i < yemas.length;
      i++
    ) {

      empatiaEstados.push(
        i % 2 === 0
      );

    }

  }


  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    if (
      !empatiaEstados[i]
    ) {

      continue;

    }


    for (
      let j = 0;
      j < yemas.length;
      j++
    ) {

      if (i === j) {

        continue;

      }


      if (
        empatiaEstados[j]
      ) {

        continue;

      }


      let distancia =
        dist(

          yemas[i].x,
          yemas[i].y,

          yemas[j].x,
          yemas[j].y

        );


      if (
        distancia < 55
      ) {

        empatiaEstados[j] =
          true;

      }

    }

  }


  for (
    let i = 0;
    i < yemas.length;
    i++
  ) {

    let p =
      yemas[i];


    let color =

      p.mano === 0
        ? AZUL
        : NARANJA;


    let iluminada =
      empatiaEstados[i];


    if (!iluminada) {

      noStroke();


      fill(

        color.r,
        color.g,
        color.b,
        45

      );


      circle(

        p.x,
        p.y,
        32

      );

    }


    else {

      noStroke();


      fill(

        color.r,
        color.g,
        color.b,
        20

      );


      circle(

        p.x,
        p.y,
        85

      );


      fill(

        color.r,
        color.g,
        color.b,
        45

      );


      circle(

        p.x,
        p.y,
        58

      );


      fill(

        color.r,
        color.g,
        color.b,
        255

      );


      circle(

        p.x,
        p.y,
        32

      );


      fill(

        255,
        255,
        255,
        180

      );


      circle(

        p.x,
        p.y,
        7

      );

    }

  }

}


// ============================================================
// 6 — COLABORACIÓN
// ============================================================

function colaboracion() {

  if (yemas.length < 10) {

    dibujarGuia();

    return;

  }


  let a =
    centroMano(0);


  let b =
    centroMano(1);


  if (!a || !b) {

    return;

  }


  let distancia = dist(

    a.x,
    a.y,

    b.x,
    b.y

  );


  let fuerza = map(

    distancia,

    320,
    80,

    0,
    1

  );


  fuerza =
    constrain(
      fuerza,
      0,
      1
    );


  for (let p of yemas) {

    let color =

      p.mano === 0
        ? FUCSIA
        : NARANJA;


    noStroke();


    fill(

      color.r,
      color.g,
      color.b,

      fuerza * 40

    );


    circle(

      p.x,
      p.y,
      70

    );


    fill(

      color.r,
      color.g,
      color.b,

      35 +
      fuerza * 220

    );


    circle(

      p.x,
      p.y,
      30

    );

  }


  if (
    fuerza > 0.15
  ) {

    stroke(

      255,
      255,
      255,

      fuerza * 100

    );


    strokeWeight(

      1 +
      fuerza * 2

    );


    for (let i = 0; i < 5; i++) {

      let izquierda =
        yemas.find(

          p =>
            p.mano === 0 &&
            p.dedo === i

        );


      let derecha =
        yemas.find(

          p =>
            p.mano === 1 &&
            p.dedo === i

        );


      if (
        izquierda &&
        derecha
      ) {

        line(

          izquierda.x,
          izquierda.y,

          derecha.x,
          derecha.y

        );

      }

    }

  }

}


// ============================================================
// 7 — INCERTIDUMBRE
// ============================================================

function incertidumbre() {

  if (yemas.length === 0) {

    dibujarGuia();

    return;

  }


  if (

    millis() -
    ultimoCambioForma >
    300

  ) {

    let cantidad =
      floor(
        random(1, 4)
      );


    for (

      let n = 0;
      n < cantidad;
      n++

    ) {

      let i =
        floor(
          random(yemas.length)
        );


      formasIncertidumbre[i] =
        random([

          "circle",
          "triangle",
          "square"

        ]);

    }


    ultimoCambioForma =
      millis();

  }


  for (

    let i = 0;
    i < yemas.length;
    i++

  ) {

    let p =
      yemas[i];


    let color =

      p.mano === 0
        ? FUCSIA
        : NARANJA;


    noStroke();


    fill(

      color.r,
      color.g,
      color.b

    );


    dibujarForma(

      formasIncertidumbre[i],

      p.x,
      p.y,

      30

    );

  }

}


// ============================================================
// 8 — ANSIEDAD
// ============================================================

function ansiedad() {

  if (yemas.length === 0) {

    dibujarGuia();

    return;

  }


  ansiedadTiempo +=
    0.08;


  for (

    let i = 0;
    i < yemas.length;
    i++

  ) {

    let p =
      yemas[i];


    let color =

      p.mano === 0
        ? FUCSIA
        : NARANJA;


    let pulso =
      sin(

        ansiedadTiempo * 3 +
        i * 0.7

      );


    let tam = map(

      pulso,

      -1,
      1,

      12,
      75

    );


    noStroke();


    fill(

      color.r,
      color.g,
      color.b,

      25

    );


    circle(

      p.x,
      p.y,

      tam * 1.8

    );


    fill(

      color.r,
      color.g,
      color.b

    );


    circle(

      p.x,
      p.y,

      tam

    );

  }

}


// ============================================================
// 9 — EXPECTATIVA
// ============================================================

function expectativa() {

  if (yemas.length === 0) {

    dibujarGuia();

    return;

  }


  let respiracion =

    (
      sin(
        millis() * 0.003
      ) + 1
    ) / 2;


  let pulso =
    easeInOut(
      respiracion
    );


  for (

    let i = 0;
    i < yemas.length;
    i++

  ) {

    let p =
      yemas[i];


    let color =

      p.mano === 0
        ? FUCSIA
        : NARANJA;


    let diferencia =

      sin(

        millis() * 0.003 +
        i * 0.45

      ) * 0.15;


    let escala =
      constrain(

        pulso +
        diferencia,

        0,
        1

      );


    let tam = map(

      escala,

      0,
      1,

      18,
      52

    );


    noStroke();


    fill(

      color.r,
      color.g,
      color.b,

      20

    );


    circle(

      p.x,
      p.y,

      tam * 2

    );


    fill(

      color.r,
      color.g,
      color.b,

      45

    );


    circle(

      p.x,
      p.y,

      tam * 1.35

    );


    fill(

      color.r,
      color.g,
      color.b

    );


    circle(

      p.x,
      p.y,

      tam

    );


    let brillo = map(

      escala,

      0,
      1,

      20,
      150

    );


    fill(

      255,
      255,
      255,

      brillo

    );


    circle(

      p.x,
      p.y,

      tam * 0.22

    );

  }

}


// ============================================================
// DIBUJAR FORMAS
// ============================================================

function dibujarForma(

  forma,
  x,
  y,
  tam

) {

  if (
    forma === "circle"
  ) {

    circle(

      x,
      y,
      tam

    );

  }


  else if (
    forma === "square"
  ) {

    rectMode(CENTER);


    square(

      x,
      y,
      tam

    );

  }


  else {

    triangle(

      x,
      y - tam / 2,

      x - tam / 2,
      y + tam / 2,

      x + tam / 2,
      y + tam / 2

    );

  }

}


// ============================================================
// EASING
// ============================================================

function easeInOut(t) {

  return t * t * (3 - 2 * t);

}


// ============================================================
// CAMBIO DE TAMAÑO
// ============================================================

function windowResized() {

  resizeCanvas(

    windowWidth,
    windowHeight

  );

}