class Gota {
  constructor(frames) {
    this.frames = frames;       // Array de imágenes
    this.currentFrame = 0;      // Índice del frame actual
    this.frameDelay = 6;        // Cada cuántos frames cambiar (puede ajustar velocidad)
    this.counter = 0;

    this.x = width / 2;
    this.y = height + 30;       // Comienza desde abajo
    this.speedY = -1.5;
  }

  update() {
    // Movimiento hacia arriba
    this.y += this.speedY;

    // Control de animación de frames
    this.counter++;
    if (this.counter % this.frameDelay === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }

  display() {
    imageMode(CENTER);
    image(this.frames[this.currentFrame], this.x, this.y, 50, 50);
  }
}
