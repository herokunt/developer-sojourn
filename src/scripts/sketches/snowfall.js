import p5 from 'p5';

class Particle {
  constructor(p) {
    const x = Math.random() * p.width;
    const y = p.random(-p.height, p.height / 4);
    this.p = p;
    this.pos = p.createVector(x, y);
    this.acc = p.createVector();
    this.vel = p.createVector();
    this.mass = Math.abs(p.randomGaussian(0, 4) * 10);
    this.size = p.constrain(Math.sqrt(this.mass), 2, 20);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  applyWind(force) {
    let f = p5.Vector.div(force, this.mass * 0.1);
    this.acc.add(f);
  }

  edgeDetection() {
    if (this.pos.x > this.p.width + this.size) {
      this.pos.x = -this.size;
    } else if (this.pos.x < -this.size) {
      this.pos.x = this.p.width + this.size;
    }

    if (this.pos.y > this.p.height + this.size) {
      this.pos.y = this.p.random(-100, -50);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.size * 0.15);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edgeDetection();
  }

  show() {
    this.p.ellipse(this.pos.x, this.pos.y, this.size);
  }
}


export default p => {

  const PARTICLES = 600;
  const FRAME_RATE = 30;
  let snow, gravity, wind, windOffset, angle, xoff, yoff, force;
  let canvasDOM;
  let timer;

  p.stopLoop = () => {
    p.noLoop();
  };

  p.resumeLoop = () => {
    p.loop();
  };

  p.destroy = () => {
    p.stopLoop();
    p.noCanvas();
    return null;
  };

  const setupFlakes = () => {
    for (let i = 0; i < PARTICLES; i++) {
      snow[i] = new Particle(p);
    }
  };

  p.windowResized = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      p.resizeCanvas(document.body.clientWidth, canvasDOM.scrollHeight);
      setupFlakes();
    }, 100);
  };

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);

    p.frameRate(FRAME_RATE);
    p.noStroke();
    p.fill(255);

    gravity = p.createVector(0, 0.7);
    windOffset = 0;
    snow = [];
    setupFlakes();
  };

  p.draw = () => {
    p.clear();

    windOffset += 0.0075;

    for (const flake of snow) {
      xoff = flake.pos.x / p.width;
      yoff = flake.pos.y / p.height;
      force = p.noise(xoff, yoff, windOffset) * (Math.PI * 2);
      wind = p5.Vector.fromAngle(force);
      wind.mult(0.2);
      flake.applyForce(wind);
      flake.applyForce(gravity);
      flake.update();
      flake.show();
    }
  };
};
