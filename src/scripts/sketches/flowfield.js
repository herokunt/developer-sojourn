import p5 from 'p5';

const NOISE_OFFSET = 0.5;
const GRID_SIZE = 40;
const MAX_PARTICLES = 500;
const SHOW_FIELD = false;
const FRAME_RATE = 18;
const STROKE_COLOR = 'RGBA(200,200,200,0.075)';
let _cols, _rows, _xoff, _yoff, _zoff, _particles, _flowField;

class Particle {
  constructor(p) {
    this.p = p;

    this.pos = p.createVector(
      p.randomGaussian(p.width / 2, 100),
      p.randomGaussian(p.height / 2, 100)
    );
    this.vel = p.createVector();
    this.acc = p.createVector();
    this.prev = this.pos.copy();
    this.maxSpeed = 4;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  follow(vectors) {
    const x = Math.floor(this.pos.x / GRID_SIZE);
    const y = Math.floor(this.pos.y / GRID_SIZE);
    const index = x + y * _cols;
    this.applyForce(vectors[index]);
  }

  updatePrevious() {
    this.prev = this.pos.copy();
  }

  edgeDetection() {
    if (this.pos.x > this.p.width) {
      this.pos.x = 0;
      this.updatePrevious()
    } else if (this.pos.x < 0) {
      this.pos.x = this.p.width;
      this.updatePrevious()
    }

    if (this.pos.y > this.p.height) {
      this.pos.y = 0;
      this.updatePrevious()
    } else if (this.pos.y < 0) {
      this.pos.y = this.p.height;
      this.updatePrevious()
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.edgeDetection();
    this.acc.set(0, 0);
  }

  show() {
    this.p.strokeWeight(1);
    this.p.stroke(STROKE_COLOR);
    this.p.line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
  }
};

export default p => {

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

  p.windowResized = () => {
    clearTimeout(timer);
    p.noLoop();
    timer = setTimeout(() => {
      p.resizeCanvas(document.body.clientWidth, canvasDOM.scrollHeight);
      p.loop();
    }, 250)
  }

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    // p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);
    p.resizeCanvas(window.innerWidth, window.innerHeight);

    p.frameRate(FRAME_RATE);

    _cols = p.width / GRID_SIZE;
    _rows = p.height / GRID_SIZE;

    _flowField = [];
    _particles = [];

    for (let i = 0; i < MAX_PARTICLES; i++) {
      _particles[i] = new Particle(p);
    }

    _zoff = 0;
  };

  p.draw = () => {
    // p.clear();
    p.background(255, 0);

    _yoff = 0;
    for (let x = 0; x < _cols; x++) {
      _xoff = 0;
      for (let y = 0; y < _rows; y++) {
        const index = x + y * _cols;
        const r = p.noise(_xoff, _yoff, _zoff) * p.TWO_PI * 2;
        const v = p5.Vector.fromAngle(r);

        _flowField[index] = v;

        if (SHOW_FIELD) {
          p.push();
          p.translate(x * GRID_SIZE, y * GRID_SIZE);
          p.rotate(v.heading());
          p.stroke(210);
          p.line(0, 0, GRID_SIZE, 0);
          p.pop();
        }

        _xoff += NOISE_OFFSET;
      }
      _yoff += NOISE_OFFSET;
    }
    _zoff += 0.008;

    _particles.forEach(particle => {
      particle.follow(_flowField);
      particle.update();
      particle.show();
      particle.updatePrevious();
    });
  };
};
