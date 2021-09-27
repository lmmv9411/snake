import { eventosTouch } from './eventos.js';

const EVT= new eventosTouch();

const cnvx = mycanvas.getContext('2d');
const CUADRICULA_ANCHO = mycanvas.width / 50;
const CUADRICULA_LARGO = mycanvas.height / 50;

const cabeza = {
  x: generarPosicion().x,
  y: generarPosicion().y,
  w: CUADRICULA_ANCHO,
  h: CUADRICULA_LARGO
};

const comida = Object.assign({}, cabeza);

const DIRECCION = {
  x: 0,
  y: 0
};

const MAP_DIRECCION = {
  'ArrowUp': [0, -1],
  'ArrowDown': [0, 1],
  'ArrowRight': [1, 0],
  'ArrowLeft': [-1, 0]
}
const RUNNING = 0;
const LOSING = 1;
const STOP = 2;

let TICK = parseInt(1000 / 12);
const GROW_SIZE = 10;
let grow = GROW_SIZE / 2;
let STATE = RUNNING;
let cuerpo = [cabeza];
let puntos = 0;
const AUDIO_LOSING = new Audio('./assets/losing.wav');
let kto = null;
let kra = null;


window.onload = () => {
  let p = localStorage.getItem('puntaje');
  if (p) {
    historia.textContent = p;
  }

  const pos = generarPosicion();

  comida.x = pos.x;
  comida.y = pos.y;
  AUDIO_LOSING.volume = 0.2;

  const [x, y] =  EVT.corregirDireccion(cabeza, mycanvas);
  DIRECCION.x = x;
  DIRECCION.y = y;

  dibujar();
}


function generarPosicion() {
  return {
    x: parseInt(Math.random() * (mycanvas.width - CUADRICULA_ANCHO)),
    y: parseInt(Math.random() * (mycanvas.height - CUADRICULA_LARGO))
  };
}

function pintar() {
  cnvx.clearRect(0, 0, mycanvas.width, mycanvas.height);
  //cuerpo
  for (let i = cuerpo.length - 1; i > -1; i--) {
    if (i === 0) {
      cnvx.fillStyle = 'rgb(255, 255, 255)';
      cnvx.fillRect(cabeza.x, cabeza.y, cabeza.w, cabeza.h)
    } else {
      cnvx.fillStyle = 'rgb(255, 255, 255)';
      cnvx.fillRect(cuerpo[i].x, cuerpo[i].y, cuerpo[i].w, cuerpo[i].h)
    }
  }
  //comida
  cnvx.fillStyle = 'rgb(0, 255, 0)';
  cnvx.fillRect(comida.x, comida.y, comida.w, comida.h);
}

function dibujar() {

  if (STATE !== STOP) {
    kto = setTimeout(dibujar, TICK);
    kra = requestAnimationFrame(pintar);
  }

  if (STATE === RUNNING && !colision()) {

    //Come
    if (cabeza.x < comida.x + comida.w &&
      cabeza.x + cabeza.w > comida.x &&
      cabeza.y < comida.y + comida.h &&
      cabeza.y + cuerpo[0].h > comida.y) {

      let t = true;
      let p = generarPosicion();
      let id = cnvx.getImageData(p.x, p.y, 10, 10).data;
      while (t) {
        t = false;
        for (let i = 0; i < id.length; i += 4) {
          if (id[i + 2] === 255 && id[i] === 255 && id[i + 1] === 255) {
            p = generarPosicion();
            id = cnvx.getImageData(p.x, p.y, 10, 10).data;
            t = true;
            break;
          }
        }
      }
      puntos += 5;
      puntaje.textContent = puntos;

      comida.x = p.x;
      comida.y = p.y;

      grow += GROW_SIZE;

      let a = new Audio('assets/snake.wav');
      a.volume = 0.2;
      a.play();

    }

    if (grow > 0) {
      cuerpo.push(Object.assign({}, cuerpo[cuerpo.length - 1]));
      grow--;
    }

    //Avanza
    for (let i = cuerpo.length - 1; i > -1; i--) {
      if (i === 0) {
        cabeza.x += (DIRECCION.x * CUADRICULA_ANCHO);
        cabeza.y += (DIRECCION.y * CUADRICULA_LARGO);
      } else {
        cuerpo[i].y = cuerpo[i - 1].y;
        cuerpo[i].x = cuerpo[i - 1].x;
      }
    }
  }

  if (STATE === LOSING) {
    DIRECCION.x = 0;
    DIRECCION.y = 0;
    TICK = 1000 / 70;
    if (cuerpo.length > 1) {
      cuerpo.splice(cuerpo.length - 1, 1);
    } else {
      let p = localStorage.getItem('puntaje');
      if (p < puntos) {
        localStorage.setItem('puntaje', puntos);
      }
      STATE = STOP;

    }
  }

}


function colision() {
  // cuerpo
  for (let i = 1; i < cuerpo.length; i++) {
    if (cabeza.x < cuerpo[i].x + cuerpo[i].w &&
      cabeza.x + cabeza.w > cuerpo[i].x &&
      cabeza.y < cuerpo[i].y + cuerpo[i].h &&
      cabeza.y + cabeza.h > cuerpo[i].y) {

      AUDIO_LOSING.play();
      STATE = LOSING;
      return true;

    }
  }
  //bordes
  if (cabeza.x + cabeza.w > mycanvas.width ||
    cabeza.x < 0 ||
    cabeza.y + cabeza.h > mycanvas.height ||
    cabeza.y < 0) {

    AUDIO_LOSING.play();
    STATE = LOSING;
    return true
  }

  return false;

}


function direccion(map) {
  let [x, y] = MAP_DIRECCION[map];
  if (-x !== DIRECCION.x &&
    -y !== DIRECCION.y) {
    DIRECCION.x = x;
    DIRECCION.y = y;
  }
}


window.onkeydown = e => direccion(e.key);

play.onclick = e => {
  cancelAnimationFrame(kra);
  clearTimeout(kto);
  STATE = RUNNING;
  let p = generarPosicion();
  TICK = 1000 / 15;
  comida.x = p.x;
  comida.y = p.y;
  p = generarPosicion();
  cabeza.x = p.x;
  cabeza.y = p.y;
  puntos = 0;
  puntaje.textContent = 0;
  let pt = localStorage.getItem('puntaje');
  if (pt) {
    historia.textContent = pt;
  }
  grow = GROW_SIZE;
  const [x, y] =  EVT.corregirDireccion(cabeza, mycanvas);
  DIRECCION.x = x;
  DIRECCION.y = y;
  cuerpo = [cabeza];
  dibujar();
}

mycanvas.addEventListener('touchstart', e => EVT.handleTouchStart(e), false);
mycanvas.addEventListener('touchmove', e => {
  const map = EVT.handleTouchMove(e);
  if (map) {
    direccion(map);
  }
}, false);