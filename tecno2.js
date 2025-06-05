let c;
let botonDerechoPresionado = false;

let INTERVALO = 5000; // 5 segundos

function preload() {

  imagenFondo = loadImage("data/rio.png");
  imagenTrazo = loadImage("data/aqua01.png");
}

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100); // Definimos rangos explícitos

  let blancoPapel = color(45, 10, 95); // Tono cálido, saturación baja, brillo alto
  background(blancoPapel);


  colorMode(HSB);
  c = new Caminante(imagenTrazo);
}

function draw() {

  push();
  textureMode(NORMAL);
  noStroke();
  translate(0, height / 2 - 200, -1);
  tint(color(120, 200, 50)); //

  beginShape();
  texture(imagenFondo);
  vertex(-width / 2, 0, 0, 0);         // arriba izquierda
  vertex(width / 2, 0, 1, 0);          // arriba derecha
  vertex(width / 2, 200, 1, 1);        // abajo derecha
  vertex(-width / 2, 200, 0, 1);       // abajo izquierda
  endShape(CLOSE);

  pop();


  pop();

  push();
  resetMatrix();
  noStroke();
  fill(0, 3);
  rect(0, 0, width, height);
  translate(0, height / 2, 0);  
  pop();

  if (mouseIsPressed) {
    if (mouseButton === RIGHT) {
    } else if (mouseButton === LEFT) {
      c.moverCircular();
      c.dibujarTrazo();
    } else if (mouseButton === CENTER) {
      c.moverHaciaMouse();
      c.dibujarTrazo();
    }
  } else {
    c.moverSalto();
  }
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    botonDerechoPresionado = true;
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    botonDerechoPresionado = false;
  }
}

class Caminante {
  constructor(imagen) {
    this.imagen = imagen;
    this.imagen.mask(this.imagen);

    this.x = 0;
this.y = height / 2 - 5;  // borde inferior

    this.dir = 0; // Dirección fija para empezar

    this.vel = 3;
    this.estado = "cambio";

    this.cantidadPorciones = 40;
    this.cualPorcion = 0;

    this.xa = 0;
    this.ya = 0;
    this.xd = 0;
    this.yd = 0;
    this.yaTengoCuatrosPuntos = false;

    this.marcaEnElTiempo = millis();
    this.avance = 0;
  }

  dibujarTrazo() {
    if (!this.yaTengoCuatrosPuntos) {
      let radio = 50;
      let anguloIzq = radians(-90) + this.dir;
      let anguloDer = radians(90) + this.dir;

      this.xa = this.x + cos(anguloIzq) * radio;
      this.ya = this.y + sin(anguloIzq) * radio;
      this.xd = this.x + cos(anguloDer) * radio;
      this.yd = this.y + sin(anguloDer) * radio;
      this.yaTengoCuatrosPuntos = true;
      return; // No dibujar el primer frame
    }

    this.cualPorcion = (this.cualPorcion + 1) % this.cantidadPorciones;
    let anchoNorm = 1.0 / this.cantidadPorciones;

    let u1 = map(this.cualPorcion, 0, this.cantidadPorciones, 0, 1);
    let v1 = 0;
    let u2 = u1 + anchoNorm;
    let v2 = 0;
    let u3 = u2;
    let v3 = 1;
    let u4 = u1;
    let v4 = 1;

    let radio = 50;
    let angulo = radians(-90) + this.dir;
    let xb = radio * cos(angulo) + this.x;
    let yb = radio * sin(angulo) + this.y;
    angulo = radians(90) + this.dir;
    let xc = radio * cos(angulo) + this.x;
    let yc = radio * sin(angulo) + this.y;

    let maxDist = width / 2;
    function distCheck(x1, y1, x2, y2) {
      return dist(x1, y1, x2, y2) < maxDist;
    }

    if (distCheck(this.xa, this.ya, xb, yb)
      && distCheck(xb, yb, xc, yc)
      && distCheck(xc, yc, this.xd, this.yd)
      && distCheck(this.xd, this.yd, this.xa, this.ya)) {

      push();
      colorMode(HSB);
      tint(color(210, 255, 255));
      noStroke();
      textureMode(NORMAL);
      texture(this.imagen);
      beginShape();
      vertex(this.xa, this.ya, u1, v1);
      vertex(xb, yb, u2, v2);
      vertex(xc, yc, u3, v3);
      vertex(this.xd, this.yd, u4, v4);
      endShape();
      pop();
    }

    this.xa = xb;
    this.ya = yb;
    this.xd = xc;
    this.yd = yc;
  }

  limitarPantalla() {
    let salto = false;
    if (this.x > width / 2) {
      this.x -= width;
      salto = true;
    }
    if (this.x < -width / 2) {
      this.x += width;
      salto = true;
    }
    if (this.y > height / 2) {
      this.y -= height;
      salto = true;
    }
    if (this.y < -height / 2) {
      this.y += height;
      salto = true;
    }
    if (salto) {
      this.yaTengoCuatrosPuntos = false;
    }
  }

  moverCircular() {
    this.dir += radians(2);
    let dx = this.vel * cos(this.dir);
    let dy = this.vel * sin(this.dir);
    this.actualizarPosicion(dx, dy);
  }

  moverSalto() {
    if (frameCount % 20 === 0) {
      this.dir = radians(random(360));
      let dx = this.vel * 4 * cos(this.dir);
      let dy = this.vel * 4 * sin(this.dir);
      this.actualizarPosicion(dx, dy);
    }
  }

  moverHaciaMouse() {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let dx = mx - this.x;
    let dy = my - this.y;
    let ang = atan2(dy, dx);
    this.dir = ang;
    this.x += this.vel * cos(ang);
    this.y += this.vel * sin(ang);
    this.limitarPantalla();
  }

  actualizarPosicion(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.limitarPantalla();
  }
}
