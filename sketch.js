// =====================================================
// TP2 — SISTEMA DE 9 INTERFACES REACTIVAS
// p5.js + MediaPipe Hands
// =====================================================

// =====================================================
// VARIABLES GENERALES
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
// SUAVIZADO DE YEMAS
// =====================================================

let yemasSuavizadas = {};
const SUAVIZADO_YEMAS = 0.35;

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
  r:40,
  g:150,
  b:255
};

const AMARILLO = {
  r:255,
  g:210,
  b:40
};

const NARANJA = {
  r:255,
  g:135,
  b:45
};

const FUCSIA = {
  r:240,
  g:50,
  b:180
};

const VERDE = {
  r:100,
  g:220,
  b:100
};

// =====================================================
// CONFIGURACIÓN
// =====================================================

const TAM_CIRCULO = 48;

const MAX_IDENTIDAD =
  TAM_CIRCULO * 5;

const dedos = [
  4,
  8,
  12,
  16,
  20
];

// =====================================================
// GUÍA
// =====================================================

const guiaMano = [

  {x:-130,y:65},
  {x:-65,y:-55},
  {x:0,y:-100},
  {x:65,y:-55},
  {x:145,y:15}

];

// =====================================================
// MEMORIA
// =====================================================

let estelas = [];

// =====================================================
// HERENCIA
// =====================================================

let herencias = [];
let contactosHerencia = {};

// =====================================================
// CADUCIDAD
// =====================================================

let circulosCaducidad = [];
let prevYemasCaducidad = {};

// NUEVO:
// La caducidad permanece apagada hasta que
// dos yemas de manos diferentes chocan.
let caducidadActivada = false;

// =====================================================
// IDENTIDAD
// =====================================================

let identidades = [];
let identidadEstado = [];
let contactosIdentidad = {};

// =====================================================
// EMPATÍA
// =====================================================

let empatiaIluminacion = [
  true,
  false
];

let ultimoContactoEmpatia = 0;

const TIEMPO_APAGADO_EMPATIA = 2000;

// =====================================================
// COLABORACIÓN
// =====================================================

let colaboracionHijitos = [];

let contactosColaboracion = {};

let colaboracionCentroTorre = null;

let colaboracionObjetivoAlcanzado =
  false;

let colaboracionTiempoObjetivo = 0;

let colaboracionBrillando =
  false;

let colaboracionContactosInicializados =
  false;

let colaboracionPuedeCrear =
  true;

const DURACION_BRILLO_COLABORACION =
  850;

const UMBRAL_CONTACTO_COLABORACION =
  TAM_CIRCULO * 0.9;

// =====================================================
// INCERTIDUMBRE
// =====================================================

let coloresIncertidumbre = [];
let contactosIncertidumbre = {};

// =====================================================
// ANSIEDAD
// =====================================================

let ansiedadFases = [];

let ansiedadColisionIniciada =
  false;

let tiempoInicioAnsiedadColision =
  0;

// =====================================================
// EXPECTATIVA
// =====================================================

let patronExpectativa = [];

const HORIZONTE_ANTICIPACION = 14;
const SUAVIZADO_PROYECCION = 0.12;


// =====================================================
// SETUP
// =====================================================

function setup(){

  createCanvas(
    windowWidth,
    windowHeight
  );

  pixelDensity(1);

  // ---------------------------------------------------
  // CÁMARA
  // ---------------------------------------------------

  video =
    createCapture(VIDEO);

  video.size(
    640,
    480
  );

  video.hide();

  // ---------------------------------------------------
  // MEDIAPIPE
  // ---------------------------------------------------

  handsDetector =
    new Hands({

      locateFile:
        function(file){

          return (
            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/"
            + file
          );

        }

    });

  handsDetector.setOptions({

    maxNumHands:2,

    modelComplexity:1,

    minDetectionConfidence:0.6,

    minTrackingConfidence:0.6

  });

  handsDetector.onResults(
    recibirResultados
  );

  // ---------------------------------------------------
  // CAMERA MEDIAPIPE
  // ---------------------------------------------------

  cameraMediaPipe =
    new Camera(
      video.elt,
      {

        onFrame:
          async()=>{

            if(
              video &&
              video.elt &&
              video.elt.readyState >= 2
            ){

              try{

                await handsDetector.send({
                  image:video.elt
                });

              }catch(err){

                console.warn(
                  "Error en frame MediaPipe:",
                  err
                );

              }

            }

          },

        width:640,
        height:480

      }
    );

  cameraMediaPipe.start();

  iniciarExperiencia();
}


// =====================================================
// RESULTADOS MEDIAPIPE
// =====================================================

function recibirResultados(
  resultados
){

  hands =
    resultados.multiHandLandmarks ||
    [];

}


// =====================================================
// DRAW
// =====================================================

function draw(){

  background(5);

  if(enHome){

    dibujarHome();

    return;
  }

  actualizarYemas();

  switch(
    experienciaActual
  ){

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

function dibujarHome(){

  const columnas = 3;
  const filas = 3;

  const anchoCelda =
    width / columnas;

  const altoCelda =
    height / filas;

  for(
    let i=0;
    i<9;
    i++
  ){

    const columna =
      i % 3;

    const fila =
      floor(i / 3);

    const centroX =
      columna *
      anchoCelda +
      anchoCelda / 2;

    const centroY =
      fila *
      altoCelda +
      altoCelda / 2;

    const colorTitulo =
      colorTituloConcepto(i);

    const hover =
      mouseX >=
      columna * anchoCelda &&

      mouseX <
      (columna+1) *
      anchoCelda &&

      mouseY >=
      fila * altoCelda &&

      mouseY <
      (fila+1) *
      altoCelda;

    dibujarCirculosHome(
      i,
      centroX,
      centroY,
      hover
    );

    noStroke();

    if(hover){

      fill(
        colorTitulo.r,
        colorTitulo.g,
        colorTitulo.b
      );

    }else{

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
// COLOR DE TÍTULOS
// =====================================================

function colorTituloConcepto(
  indice
){

  if(indice <= 2){

    return AZUL;

  }

  if(indice <= 5){

    return NARANJA;

  }

  return FUCSIA;
}


// =====================================================
// CÍRCULOS HOME
// =====================================================

function dibujarCirculosHome(
  indice,
  centroX,
  centroY,
  hover
){

  let colores;

  if(indice <= 2){

    colores = [
      AZUL,
      AMARILLO
    ];

  }else if(indice <= 5){

    colores = [
      AZUL,
      NARANJA
    ];

  }else{

    colores = [
      NARANJA,
      FUCSIA
    ];

  }

  const posiciones = [

    {x:-65,y:42},
    {x:-32,y:-28},
    {x:0,y:-48},
    {x:32,y:-28},
    {x:65,y:20}

  ];

  const escala =
    min(
      anchoSeguroHome(),
      1
    );

  for(
    let i=0;
    i<5;
    i++
  ){

    const p =
      posiciones[i];

    dibujarCirculoHome(

      centroX +
      p.x * escala -
      50,

      centroY +
      p.y * escala,

      TAM_CIRCULO * 0.72,

      colores[0],

      hover

    );

  }

  for(
    let i=0;
    i<5;
    i++
  ){

    const p =
      posiciones[i];

    dibujarCirculoHome(

      centroX +
      p.x * escala +
      50,

      centroY +
      p.y * escala,

      TAM_CIRCULO * 0.72,

      colores[1],

      hover

    );

  }

}


// =====================================================
// CÍRCULO HOME INDIVIDUAL
// =====================================================

function dibujarCirculoHome(
  x,
  y,
  tam,
  color,
  hover
){

  noStroke();

  if(hover){

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
    hover ? 120 : 55
  );

  circle(
    x,
    y,
    tam
  );

}


// =====================================================
// ANCHO HOME
// =====================================================

function anchoSeguroHome(){

  return constrain(
    width / 1000,
    0.7,
    1
  );

}


// =====================================================
// MOUSE PRESSED
// =====================================================

function mousePressed(){}


// =====================================================
// ACTUALIZAR YEMAS
// =====================================================

function actualizarYemas(){

  const nuevasYemas = [];

  const clavesActuales = {};

  for(
    let h=0;
    h<hands.length;
    h++
  ){

    const mano =
      hands[h];

    for(
      let d=0;
      d<dedos.length;
      d++
    ){

      const punto =
        mano[dedos[d]];

      if(!punto){

        continue;

      }

      const clave =
        `${h}-${d}`;

      const x =
        map(
          punto.x,
          0,
          1,
          width,
          0
        );

      const y =
        punto.y *
        height;

      clavesActuales[clave] =
        true;

      if(
        !yemasSuavizadas[clave]
      ){

        yemasSuavizadas[clave] = {

          x:x,
          y:y

        };

      }else{

        yemasSuavizadas[clave].x =
          lerp(
            yemasSuavizadas[clave].x,
            x,
            SUAVIZADO_YEMAS
          );

        yemasSuavizadas[clave].y =
          lerp(
            yemasSuavizadas[clave].y,
            y,
            SUAVIZADO_YEMAS
          );

      }

      nuevasYemas.push({

        x:
          yemasSuavizadas[clave].x,

        y:
          yemasSuavizadas[clave].y,

        mano:h,

        dedo:d

      });

    }

  }

  for(
    const clave in
    yemasSuavizadas
  ){

    if(
      !clavesActuales[clave]
    ){

      delete yemasSuavizadas[clave];

    }

  }

  yemas =
    nuevasYemas;

  if(
    yemas.length > 0
  ){

    guiaMostradaInteraccion =
      false;

  }

}


// =====================================================
// GUÍA DE MANOS
// =====================================================

function dibujarGuiaManos(){

  const centroY =
    height * 0.53;

  const centroIzquierda =
    width * 0.30;

  const centroDerecha =
    width * 0.70;

  for(
    let i=0;
    i<guiaMano.length;
    i++
  ){

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
      centroIzquierda -
      p.x,

      centroY +
      p.y,

      TAM_CIRCULO
    );

  }

  for(
    let i=0;
    i<guiaMano.length;
    i++
  ){

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
      centroDerecha +
      p.x,

      centroY +
      p.y,

      TAM_CIRCULO
    );

  }

}


// =====================================================
// TÍTULO EXPERIENCIA
// =====================================================

function dibujarTituloExperiencia(){

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

function dibujarBotonVolver(){

  const x = 35;
  const y = 35;

  const hovering =
    dist(
      mouseX,
      mouseY,
      x,
      y
    ) < 25;

  noStroke();

  if(hovering){

    fill(
      255,
      50
    );

    circle(
      x,
      y,
      36
    );

    fill(255);

  }else{

    fill(
      255,
      130
    );

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

function dibujarBotonSiguiente(){

  const x =
    width - 65;

  const y = 35;

  const hovering =
    dist(
      mouseX,
      mouseY,
      x,
      y
    ) < 40;

  noStroke();

  fill(
    255,
    hovering ? 60 : 30
  );

  rectMode(CENTER);

  rect(
    x,
    y,
    100,
    32,
    16
  );

  rectMode(CORNER);

  fill(
    255,
    hovering ? 255 : 190
  );

  textAlign(
    CENTER,
    CENTER
  );

  textSize(13);

  textStyle(BOLD);

  text(
    "Siguiente ›",
    x,
    y
  );

  textStyle(NORMAL);

}


// =====================================================
// TECLADO
// =====================================================

function keyPressed(){

  if(
    key === "x" ||
    key === "X" ||
    keyCode === ESCAPE
  ){

    enHome = true;

    return;

  }

  if(enHome){

    return;

  }

  if(
    keyCode === RIGHT_ARROW
  ){

    siguienteExperiencia();

  }

  if(
    keyCode === LEFT_ARROW
  ){

    experienciaAnterior();

  }

  if(
    key >= "1" &&
    key <= "9"
  ){

    experienciaActual =
      Number(key) - 1;

    iniciarExperiencia();

  }

}


// =====================================================
// CLICK
// =====================================================

function mouseClicked(){

  if(enHome){

    const columnas = 3;
    const filas = 3;

    const anchoCelda =
      width / columnas;

    const altoCelda =
      height / filas;

    const columna =
      floor(
        mouseX /
        anchoCelda
      );

    const fila =
      floor(
        mouseY /
        altoCelda
      );

    if(
      columna >= 0 &&
      columna <= 2 &&
      fila >= 0 &&
      fila <= 2
    ){

      experienciaActual =
        fila * 3 +
        columna;

      enHome = false;

      iniciarExperiencia();

    }

    return;

  }

  if(
    dist(
      mouseX,
      mouseY,
      35,
      35
    ) < 35
  ){

    enHome = true;

    return;

  }

  if(
    dist(
      mouseX,
      mouseY,
      width - 65,
      35
    ) < 45
  ){

    siguienteExperiencia();

    return;

  }

}


// =====================================================
// SIGUIENTE EXPERIENCIA
// =====================================================

function siguienteExperiencia(){

  experienciaActual++;

  if(
    experienciaActual > 8
  ){

    experienciaActual = 0;

  }

  iniciarExperiencia();

}


// =====================================================
// EXPERIENCIA ANTERIOR
// =====================================================

function experienciaAnterior(){

  experienciaActual--;

  if(
    experienciaActual < 0
  ){

    experienciaActual = 8;

  }

  iniciarExperiencia();

}


// =====================================================
// INICIAR EXPERIENCIA
// =====================================================

function iniciarExperiencia(){

  tiempoInicio =
    millis();

  yemasSuavizadas = {};

  // ---------------------------------------------------
  // MEMORIA
  // ---------------------------------------------------

  estelas =
    Array(10)
      .fill()
      .map(
        () => []
      );

  // ---------------------------------------------------
  // HERENCIA
  // ---------------------------------------------------

  herencias = [];

  contactosHerencia = {};

  // ---------------------------------------------------
  // CADUCIDAD
  // ---------------------------------------------------

  circulosCaducidad = [];

  prevYemasCaducidad = {};

  // IMPORTANTE:
  // cada vez que entramos empieza sin caducidad.
  // Se activa recién cuando chocan dos yemas.
  caducidadActivada = false;

  // ---------------------------------------------------
  // IDENTIDAD
  // ---------------------------------------------------

  inicializarIdentidades();

  // ---------------------------------------------------
  // EMPATÍA
  // ---------------------------------------------------

  empatiaIluminacion = [
    true,
    false
  ];

  ultimoContactoEmpatia =
    millis();

  // ---------------------------------------------------
  // COLABORACIÓN
  // ---------------------------------------------------

  colaboracionHijitos = [];

  contactosColaboracion = {};

  colaboracionCentroTorre =
    null;

  colaboracionObjetivoAlcanzado =
    false;

  colaboracionTiempoObjetivo =
    0;

  colaboracionBrillando =
    false;

  colaboracionContactosInicializados =
    false;

  colaboracionPuedeCrear =
    true;

  // ---------------------------------------------------
  // INCERTIDUMBRE
  // ---------------------------------------------------

  contactosIncertidumbre = {};

  coloresIncertidumbre =
    Array(10)
      .fill()
      .map(
        () => null
      );

  // ---------------------------------------------------
  // ANSIEDAD
  // ---------------------------------------------------

  ansiedadFases =
    Array(10)
      .fill()
      .map(
        () => random(TWO_PI)
      );

  ansiedadColisionIniciada =
    false;

  tiempoInicioAnsiedadColision =
    0;

  // ---------------------------------------------------
  // GUÍA
  // ---------------------------------------------------

  guiaMostradaInteraccion =
    true;

  // ---------------------------------------------------
  // EXPECTATIVA
  // ---------------------------------------------------

  crearPatronExpectativa();

}


// =====================================================
// COLOR POR MANO
// =====================================================

function colorPorMano(
  mano,
  colorA,
  colorB
){

  if(
    mano === 0
  ){

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
){

  for(
    let p of yemas
  ){

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
// CENTRO DE MANO
// =====================================================

function obtenerCentroMano(
  numeroMano
){

  const puntos =
    yemas.filter(
      p =>
        p.mano === numeroMano
    );

  if(
    puntos.length === 0
  ){

    return null;

  }

  let sumaX = 0;
  let sumaY = 0;

  for(
    let p of puntos
  ){

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

function manosEnContacto(){

  const centroA =
    obtenerCentroMano(0);

  const centroB =
    obtenerCentroMano(1);

  if(
    !centroA ||
    !centroB
  ){

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

function memoria(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  const ahora =
    millis();

  if(
    frameCount % 2 === 0
  ){

    for(
      let p of yemas
    ){

      const indice =
        p.mano * 5 +
        p.dedo;

      estelas[indice].push({

        x:p.x,

        y:p.y,

        tiempo:ahora

      });

    }

  }

  for(
    let i=0;
    i<estelas.length;
    i++
  ){

    estelas[i] =
      estelas[i].filter(
        punto =>
          (
            ahora -
            punto.tiempo
          ) < 25000
      );

  }

  let totalCirculos =
    estelas.reduce(
      (acc,e) =>
        acc + e.length,
      0
    );

  while(
    totalCirculos > 200
  ){

    let indiceMasAntiguo = -1;

    let tiempoMasAntiguo =
      Infinity;

    for(
      let i=0;
      i<estelas.length;
      i++
    ){

      if(
        estelas[i].length > 0 &&
        estelas[i][0].tiempo <
          tiempoMasAntiguo
      ){

        tiempoMasAntiguo =
          estelas[i][0].tiempo;

        indiceMasAntiguo =
          i;

      }

    }

    if(
      indiceMasAntiguo !== -1
    ){

      estelas[
        indiceMasAntiguo
      ].shift();

      totalCirculos--;

    }else{

      break;

    }

  }

  for(
    let i=0;
    i<estelas.length;
    i++
  ){

    const color =
      i < 5
        ? AZUL
        : AMARILLO;

    for(
      let punto of estelas[i]
    ){

      const edad =
        ahora -
        punto.tiempo;

      const alpha =
        map(
          edad,
          0,
          25000,
          35,
          0
        );

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

function herencia(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      if(
        a.mano === b.mano
      ){

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

      if(
        distancia <
        TAM_CIRCULO
      ){

        if(
          !contactosHerencia[clave]
        ){

          contactosHerencia[clave] =
            true;

          const cx =
            (a.x+b.x)/2;

          const cy =
            (a.y+b.y)/2;

          // Un solo hijito verde
          herencias.push({

            x:cx,

            y:cy,

            tam:0,

            tamFinal:
              TAM_CIRCULO * 0.8,

            tiempoNacimiento:
              millis()

          });

        }

      }else{

        contactosHerencia[clave] =
          false;

      }

    }

  }

  // El hijito aparece y después desaparece.
  for(
    let i=herencias.length-1;
    i>=0;
    i--
  ){

    const h =
      herencias[i];

    const edad =
      millis() -
      h.tiempoNacimiento;

    h.tam =
      lerp(
        h.tam,
        h.tamFinal,
        0.18
      );

    let alpha = 255;

    // Después de formarse empieza a desaparecer.
    if(
      edad > 650
    ){

      alpha =
        map(
          edad,
          650,
          1000,
          255,
          0
        );

    }

    noStroke();

    fill(
      VERDE.r,
      VERDE.g,
      VERDE.b,
      45 * (alpha/255)
    );

    circle(
      h.x,
      h.y,
      h.tam * 1.8
    );

    fill(
      VERDE.r,
      VERDE.g,
      VERDE.b,
      alpha
    );

    circle(
      h.x,
      h.y,
      h.tam
    );

    if(
      edad >= 1000
    ){

      herencias.splice(
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
// 3 — CADUCIDAD
// =====================================================

function caducidad(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  // ===================================================
  // PRIMERO: BUSCAR CHOQUE DE YEMAS
  // ===================================================

  let choque =
    false;

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      // Tiene que ser entre manos diferentes.
      if(
        a.mano === b.mano
      ){

        continue;

      }

      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );

      if(
        distancia <
        TAM_CIRCULO * 0.9
      ){

        choque =
          true;

      }

    }

  }

  // ===================================================
  // EL CHOQUE ACTIVA LA CADUCIDAD
  // ===================================================

  if(choque){

    caducidadActivada =
      true;

  }

  // ===================================================
  // ANTES DEL CHOQUE:
  // NO SE PIERDE NADA
  // ===================================================

  if(
    !caducidadActivada
  ){

    dibujarYemas(
      AZUL,
      AMARILLO
    );

    return;

  }

  // ===================================================
  // UNA VEZ ACTIVADA:
  // LOS COSITOS EMPIEZAN A CAER
  // ===================================================

  if(
    frameCount % 5 === 0 &&
    yemas.length > 0
  ){

    const origen =
      random(yemas);

    const color =
      origen.mano === 0
        ? AZUL
        : AMARILLO;

    circulosCaducidad.push({

      x:origen.x,

      y:origen.y,

      vx:
        random(-1.2,1.2),

      vy:
        random(0.5,1.8),

      gravedad:
        random(0.05,0.12),

      tam:
        random(
          TAM_CIRCULO * 0.22,
          TAM_CIRCULO * 0.45
        ) * 1.3,

      vida:
        random(100,220),

      color:color

    });

  }

  // ===================================================
  // ANIMACIÓN DE CAÍDA
  // ===================================================

  for(
    let i =
      circulosCaducidad.length-1;
    i>=0;
    i--
  ){

    const c =
      circulosCaducidad[i];

    c.x += c.vx;

    c.y += c.vy;

    c.vy += c.gravedad;

    c.vida -= 0.8;

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

    if(
      c.y > height ||
      c.vida <= 0
    ){

      circulosCaducidad.splice(
        i,
        1
      );

    }

  }

  // Las yemas siguen estando presentes
  // mientras los cositos se desprenden.
  dibujarYemas(
    AZUL,
    AMARILLO
  );

}


// =====================================================
// 4 — IDENTIDAD
// =====================================================

function inicializarIdentidades(){

  identidades = [];

  identidadEstado = [];

  contactosIdentidad = {};

  const tonosAzul = [

    {r:30,g:120,b:255},
    {r:60,g:160,b:255},
    {r:80,g:190,b:255},
    {r:20,g:140,b:230},
    {r:100,g:200,b:255}

  ];

  const tonosNaranja = [

    {r:255,g:90,b:30},
    {r:255,g:135,b:45},
    {r:255,g:165,b:50},
    {r:240,g:110,b:20},
    {r:255,g:185,b:70}

  ];

  for(
    let idx=0;
    idx<10;
    idx++
  ){

    const mano =
      floor(idx/5);

    const dedo =
      idx%5;

    const colBase =
      mano === 0
        ? tonosAzul[dedo]
        : tonosNaranja[dedo];

    identidades.push({

      color:colBase,

      tamano:
        TAM_CIRCULO *
        random(1.0,1.5),

      opacidad:
        random(178,255)

    });

    identidadEstado.push({

      animando:false,

      tiempoInicioAnim:0,

      brilloExtra:false,

      tiempoInicioBrillo:0

    });

  }

}


function identidad(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  if(
    identidades.length === 0
  ){

    inicializarIdentidades();

  }

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      if(
        a.mano === b.mano
      ){

        continue;

      }

      const idxA =
        a.mano*5+a.dedo;

      const idxB =
        b.mano*5+b.dedo;

      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );

      const clave =
        `${idxA}-${idxB}`;

      const tamA =
        identidades[idxA]
          ? identidades[idxA].tamano
          : TAM_CIRCULO;

      const tamB =
        identidades[idxB]
          ? identidades[idxB].tamano
          : TAM_CIRCULO;

      const umbralColision =
        (tamA+tamB) *
        0.5 *
        0.7;

      if(
        distancia <
        umbralColision
      ){

        if(
          !contactosIdentidad[clave]
        ){

          contactosIdentidad[clave] =
            true;

          const ahora =
            millis();

          identidadEstado[idxA]
            .animando = true;

          identidadEstado[idxA]
            .tiempoInicioAnim =
              ahora;

          identidadEstado[idxB]
            .animando = true;

          identidadEstado[idxB]
            .tiempoInicioAnim =
              ahora;

        }

      }else{

        contactosIdentidad[clave] =
          false;

      }

    }

  }

  for(
    let p of yemas
  ){

    const idx =
      p.mano*5+p.dedo;

    const est =
      identidadEstado[idx];

    const idOriginal =
      identidades[idx];

    if(
      !est ||
      !idOriginal
    ){

      continue;

    }

    let idVisual =
      idOriginal;

    if(
      est.animando
    ){

      const transcurrido =
        (
          millis() -
          est.tiempoInicioAnim
        ) / 1000;

      if(
        transcurrido < 1.0
      ){

        const paso =
          floor(
            transcurrido*15
          ) %
          identidades.length;

        idVisual =
          identidades[paso];

      }else{

        est.animando =
          false;

        est.brilloExtra =
          true;

        est.tiempoInicioBrillo =
          millis();

      }

    }

    const col =
      idVisual.color;

    const tam =
      idVisual.tamano;

    const opa =
      idVisual.opacidad;

    if(
      est.brilloExtra
    ){

      const tiempoBrillo =
        (
          millis() -
          est.tiempoInicioBrillo
        ) / 1000;

      if(
        tiempoBrillo < 3.0
      ){

        const factorFade =
          constrain(
            1.0 -
            (tiempoBrillo-2.0),
            0.0,
            1.0
          );

        noStroke();

        const pulsoGlow =
          sin(
            frameCount*0.08
          ) * 3;

        fill(
          col.r,
          col.g,
          col.b,
          25*factorFade
        );

        circle(
          p.x,
          p.y,
          tam*1.5 +
          pulsoGlow
        );

        fill(
          col.r,
          col.g,
          col.b,
          45*factorFade
        );

        circle(
          p.x,
          p.y,
          tam*1.25 +
          pulsoGlow*0.5
        );

      }else{

        est.brilloExtra =
          false;

      }

    }

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

function empatia(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  const contacto =
    manosEnContacto();

  if(contacto){

    empatiaIluminacion[0] =
      true;

    empatiaIluminacion[1] =
      true;

    ultimoContactoEmpatia =
      millis();

  }

  if(
    !contacto &&
    millis() -
      ultimoContactoEmpatia >
      TIEMPO_APAGADO_EMPATIA
  ){

    empatiaIluminacion[1] =
      false;

  }

  for(
    let p of yemas
  ){

    const color =
      p.mano === 0
        ? AZUL
        : NARANJA;

    const iluminada =
      empatiaIluminacion[
        p.mano
      ];

    if(iluminada){

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
        TAM_CIRCULO*2.2
      );

    }

    noStroke();

    fill(
      color.r,
      color.g,
      color.b,
      iluminada ? 255 : 80
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

function colaboracion(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  if(
    !colaboracionContactosInicializados
  ){

    actualizarContactosColaboracion();

    colaboracionContactosInicializados =
      true;

    colaboracionPuedeCrear =
      false;

  }

  if(
    colaboracionBrillando
  ){

    const tiempo =
      millis() -
      colaboracionTiempoObjetivo;

    const pulso =
      sin(
        frameCount * 0.15
      );

    const intensidad =
      0.85 +
      pulso * 0.15;

    if(
      colaboracionCentroTorre
    ){

      const centroX =
        colaboracionCentroTorre.x;

      const centroY =
        colaboracionCentroTorre.y -
        (
          colaboracionHijitos.length - 1
        ) *
        TAM_CIRCULO *
        0.31;

      noStroke();

      fill(
        AZUL.r,
        AZUL.g,
        AZUL.b,
        45 * intensidad
      );

      circle(
        centroX,
        centroY,
        TAM_CIRCULO * 4.2
      );

      fill(
        NARANJA.r,
        NARANJA.g,
        NARANJA.b,
        45 * intensidad
      );

      circle(
        centroX,
        centroY,
        TAM_CIRCULO * 3.7
      );

      fill(
        255,
        255,
        255,
        35 * intensidad
      );

      circle(
        centroX,
        centroY,
        TAM_CIRCULO * 3
      );

    }

    for(
      let i=0;
      i<colaboracionHijitos.length;
      i++
    ){

      const h =
        colaboracionHijitos[i];

      h.tam =
        lerp(
          h.tam,
          h.tamFinal,
          0.12
        );

      h.x =
        lerp(
          h.x,
          h.objetivoX,
          0.10
        );

      h.y =
        lerp(
          h.y,
          h.objetivoY,
          0.10
        );

      const brillo =
        0.85 +
        sin(
          frameCount*0.12+i
        )*0.15;

      noStroke();

      fill(
        AZUL.r,
        AZUL.g,
        AZUL.b,
        80*brillo
      );

      circle(
        h.x,
        h.y,
        h.tam*1.9
      );

      fill(
        NARANJA.r,
        NARANJA.g,
        NARANJA.b,
        70*brillo
      );

      circle(
        h.x,
        h.y,
        h.tam*1.65
      );

      fill(
        AZUL.r,
        AZUL.g,
        AZUL.b,
        255
      );

      arc(
        h.x,
        h.y,
        h.tam,
        h.tam,
        HALF_PI,
        PI+HALF_PI,
        PIE
      );

      fill(
        NARANJA.r,
        NARANJA.g,
        NARANJA.b,
        255
      );

      arc(
        h.x,
        h.y,
        h.tam,
        h.tam,
        -HALF_PI,
        HALF_PI,
        PIE
      );

      fill(
        255,
        255,
        255,
        100
      );

      circle(
        h.x,
        h.y,
        h.tam*0.32
      );

      stroke(
        255,
        255,
        255,
        190
      );

      strokeWeight(2);

      line(
        h.x,
        h.y-h.tam/2,
        h.x,
        h.y+h.tam/2
      );

      noStroke();

    }

    dibujarYemas(
      AZUL,
      NARANJA
    );

    if(
      tiempo >=
      DURACION_BRILLO_COLABORACION
    ){

      colaboracionHijitos = [];

      colaboracionCentroTorre =
        null;

      colaboracionObjetivoAlcanzado =
        false;

      colaboracionBrillando =
        false;

      colaboracionTiempoObjetivo =
        0;

      colaboracionPuedeCrear =
        false;

      actualizarContactosColaboracion();

    }

    return;

  }

  const contactosActuales = [];

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      if(
        a.mano === b.mano
      ){

        continue;

      }

      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );

      if(
        distancia <
        UMBRAL_CONTACTO_COLABORACION
      ){

        contactosActuales.push({

          a:a,
          b:b

        });

      }

    }

  }

  if(
    contactosActuales.length === 0
  ){

    colaboracionPuedeCrear =
      true;

  }

  if(
    colaboracionPuedeCrear &&
    contactosActuales.length > 0 &&
    colaboracionHijitos.length < 4
  ){

    const contacto =
      contactosActuales[0];

    const a =
      contacto.a;

    const b =
      contacto.b;

    const cx =
      (
        a.x +
        b.x
      ) / 2;

    const cy =
      (
        a.y +
        b.y
      ) / 2;

    if(
      colaboracionCentroTorre === null
    ){

      colaboracionCentroTorre = {

        x:cx,

        y:cy

      };

    }

    const numeroHijito =
      colaboracionHijitos.length;

    const separacion =
      TAM_CIRCULO * 0.62;

    const objetivoX =
      colaboracionCentroTorre.x;

    const objetivoY =
      colaboracionCentroTorre.y -
      numeroHijito *
      separacion;

    colaboracionHijitos.push({

      x:cx,

      y:cy,

      objetivoX:objetivoX,

      objetivoY:objetivoY,

      tam:0,

      tamFinal:
        TAM_CIRCULO * 0.78

    });

    colaboracionPuedeCrear =
      false;

    if(
      colaboracionHijitos.length === 4
    ){

      colaboracionObjetivoAlcanzado =
        true;

      colaboracionTiempoObjetivo =
        millis();

      colaboracionBrillando =
        true;

    }

  }

  const cantidad =
    colaboracionHijitos.length;

  let intensidadBrillo =
    0;

  if(
    cantidad === 1
  ){

    intensidadBrillo =
      0.15;

  }else if(
    cantidad === 2
  ){

    intensidadBrillo =
      0.30;

  }else if(
    cantidad === 3
  ){

    intensidadBrillo =
      0.50;

  }

  if(
    cantidad > 0 &&
    colaboracionCentroTorre
  ){

    const centroTorreX =
      colaboracionCentroTorre.x;

    const centroTorreY =
      colaboracionCentroTorre.y -
      (
        cantidad - 1
      ) *
      TAM_CIRCULO *
      0.31;

    noStroke();

    fill(
      AZUL.r,
      AZUL.g,
      AZUL.b,
      12 +
      30 * intensidadBrillo
    );

    circle(
      centroTorreX,
      centroTorreY,
      TAM_CIRCULO *
      (
        1.8 +
        cantidad * 0.2
      )
    );

    fill(
      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      10 +
      25 * intensidadBrillo
    );

    circle(
      centroTorreX,
      centroTorreY,
      TAM_CIRCULO *
      (
        1.5 +
        cantidad * 0.18
      )
    );

  }

  for(
    let i=0;
    i<colaboracionHijitos.length;
    i++
  ){

    const h =
      colaboracionHijitos[i];

    h.tam =
      lerp(
        h.tam,
        h.tamFinal,
        0.12
      );

    h.x =
      lerp(
        h.x,
        h.objetivoX,
        0.10
      );

    h.y =
      lerp(
        h.y,
        h.objetivoY,
        0.10
      );

    const pulso =
      sin(
        frameCount*0.08 +
        i*0.5
      );

    noStroke();

    fill(
      AZUL.r,
      AZUL.g,
      AZUL.b,
      18 +
      42 * intensidadBrillo
    );

    circle(
      h.x,
      h.y,
      h.tam *
      (
        1.45 +
        intensidadBrillo*0.25 +
        pulso*0.03
      )
    );

    fill(
      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      14 +
      35 * intensidadBrillo
    );

    circle(
      h.x,
      h.y,
      h.tam *
      (
        1.25 +
        intensidadBrillo*0.18
      )
    );

    fill(
      AZUL.r,
      AZUL.g,
      AZUL.b,
      240
    );

    arc(
      h.x,
      h.y,
      h.tam,
      h.tam,
      HALF_PI,
      PI+HALF_PI,
      PIE
    );

    fill(
      NARANJA.r,
      NARANJA.g,
      NARANJA.b,
      240
    );

    arc(
      h.x,
      h.y,
      h.tam,
      h.tam,
      -HALF_PI,
      HALF_PI,
      PIE
    );

    stroke(
      255,
      255,
      255,
      50 +
      70 * intensidadBrillo
    );

    strokeWeight(1);

    line(
      h.x,
      h.y-h.tam/2,
      h.x,
      h.y+h.tam/2
    );

    noStroke();

  }

  dibujarYemas(
    AZUL,
    NARANJA
  );

}


// =====================================================
// REGISTRAR CONTACTOS DE COLABORACIÓN
// =====================================================

function actualizarContactosColaboracion(){

  const contactos = {};

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      if(
        a.mano === b.mano
      ){

        continue;

      }

      const distancia =
        dist(
          a.x,
          a.y,
          b.x,
          b.y
        );

      if(
        distancia <
        UMBRAL_CONTACTO_COLABORACION
      ){

        const indiceA =
          a.mano * 5 +
          a.dedo;

        const indiceB =
          b.mano * 5 +
          b.dedo;

        const clave =
          indiceA < indiceB
            ? `${indiceA}-${indiceB}`
            : `${indiceB}-${indiceA}`;

        contactos[clave] =
          true;

      }

    }

  }

  contactosColaboracion =
    contactos;

}


// =====================================================
// 7 — INCERTIDUMBRE
// =====================================================

function incertidumbre(){

  if(
    guiaMostradaInteraccion
  ){

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

  for(
    let i=0;
    i<yemas.length;
    i++
  ){

    for(
      let j=i+1;
      j<yemas.length;
      j++
    ){

      const a =
        yemas[i];

      const b =
        yemas[j];

      if(
        a.mano === b.mano
      ){

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

      if(
        distancia <
        TAM_CIRCULO*1.15
      ){

        if(
          !contactosIncertidumbre[clave]
        ){

          contactosIncertidumbre[clave] =
            true;

          const indiceA =
            a.mano*5 +
            a.dedo;

          const indiceB =
            b.mano*5 +
            b.dedo;

          coloresIncertidumbre[indiceA] =
            random(
              coloresRandom
            );

          coloresIncertidumbre[indiceB] =
            random(
              coloresRandom
            );

        }

      }else{

        contactosIncertidumbre[clave] =
          false;

      }

    }

  }

  for(
    let p of yemas
  ){

    const indice =
      p.mano*5 +
      p.dedo;

    let color =
      coloresIncertidumbre[indice];

    if(!color){

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

function ansiedad(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  if(
    !ansiedadColisionIniciada
  ){

    if(
      manosEnContacto()
    ){

      ansiedadColisionIniciada =
        true;

      tiempoInicioAnsiedadColision =
        millis();

    }else{

      for(
        let i=0;
        i<yemas.length;
        i++
      ){

        for(
          let j=i+1;
          j<yemas.length;
          j++
        ){

          if(
            dist(
              yemas[i].x,
              yemas[i].y,
              yemas[j].x,
              yemas[j].y
            ) <
            TAM_CIRCULO*1.2
          ){

            ansiedadColisionIniciada =
              true;

            tiempoInicioAnsiedadColision =
              millis();

            break;

          }

        }

        if(
          ansiedadColisionIniciada
        ){

          break;

        }

      }

    }

  }

  let intensidad = 0;

  let velFase = 0.2;

  if(
    ansiedadColisionIniciada
  ){

    const segColision =
      (
        millis() -
        tiempoInicioAnsiedadColision
      ) / 1000;

    const factorTension =
      1.0 +
      segColision*1.1;

    intensidad =
      8*factorTension;

    velFase =
      0.2 *
      (
        1.0 +
        segColision*0.15
      );

  }

  for(
    let p of yemas
  ){

    const indice =
      p.mano*5 +
      p.dedo;

    if(
      ansiedadFases[indice] ===
      undefined
    ){

      ansiedadFases[indice] =
        random(TWO_PI);

    }

    ansiedadFases[indice] +=
      random(0.15,0.4) *
      velFase;

    let movimientoX = 0;

    let movimientoY = 0;

    if(
      ansiedadColisionIniciada
    ){

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
          ansiedadFases[indice]*1.4
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
      p.x+movimientoX,
      p.y+movimientoY,
      TAM_CIRCULO*1.8
    );

    fill(
      color.r,
      color.g,
      color.b
    );

    circle(
      p.x+movimientoX,
      p.y+movimientoY,
      TAM_CIRCULO
    );

  }

}


// =====================================================
// 9 — EXPECTATIVA
// =====================================================

function crearPatronExpectativa(){

  patronExpectativa =
    Array(10)
      .fill()
      .map(
        () => ({

          prevX:null,

          prevY:null,

          projX:null,

          projY:null

        })
      );

}


function expectativa(){

  if(
    guiaMostradaInteraccion
  ){

    dibujarGuiaManos();

    return;

  }

  for(
    let p of yemas
  ){

    const indice =
      p.mano*5 +
      p.dedo;

    const estado =
      patronExpectativa[indice];

    if(
      estado.prevX === null
    ){

      estado.prevX =
        p.x;

      estado.prevY =
        p.y;

      estado.projX =
        p.x;

      estado.projY =
        p.y;

    }

    const vx =
      p.x -
      estado.prevX;

    const vy =
      p.y -
      estado.prevY;

    const objetivoX =
      p.x +
      vx *
      HORIZONTE_ANTICIPACION;

    const objetivoY =
      p.y +
      vy *
      HORIZONTE_ANTICIPACION;

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

    estado.prevX =
      p.x;

    estado.prevY =
      p.y;

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

    const pulso =
      1 +
      0.15 *
      sin(
        frameCount *
        (
          0.1 +
          velocidad*0.02
        )
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
      TAM_CIRCULO *
      0.9 *
      pulso
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
// BARRA INFERIOR
// =====================================================

function dibujarBarraTiempo(){

  const total = 9;

  const diametro = 6;

  const espaciado = 16;

  const anchoTotal =
    (total-1) *
    espaciado;

  const inicioX =
    (
      width -
      anchoTotal
    ) / 2;

  const y =
    height - 25;

  noStroke();

  for(
    let i=0;
    i<total;
    i++
  ){

    if(
      i === experienciaActual
    ){

      fill(
        255,
        230
      );

      circle(
        inicioX +
        i*espaciado,
        y,
        diametro*1.4
      );

    }else{

      fill(
        255,
        60
      );

      circle(
        inicioX +
        i*espaciado,
        y,
        diametro
      );

    }

  }

}


// =====================================================
// CAMBIO AUTOMÁTICO
// =====================================================

function controlarCambioAutomatico(){}


// =====================================================
// REDIMENSIONAR
// =====================================================

function windowResized(){

  resizeCanvas(
    windowWidth,
    windowHeight
  );

}
