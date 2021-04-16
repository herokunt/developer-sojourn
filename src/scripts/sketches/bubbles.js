import p5 from 'p5';

const FRAME_RATE = 24;
const TOTAL_BUBBLES = 100;

class Bubble {
  constructor(x, y, m, p){
    this.pos = p.createVector(x, y);
    this.acc = p.createVector(0, 0);
    this.vel = p.createVector(0, 0);
    this.p = p;
    this.mass = m;
    this.r = p.sqrt(this.mass) * 10;
    this.done = false;
  }

  edgeDetection(){
    if (this.pos.y + this.r < 0) {
      this.done = true;
    }
  }

  applyForce(force) {
    const f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  applyBuoyancy() {
    this.acc.add(this.p.random(-0.03, 0.03), this.p.random(0,-0.1));
  }

  applyDragForce(){
    // Get vector of opposite direction of magnitude 1.
    let drag = this.vel.copy();
    drag.normalize();
    drag.mult(-1);

    // Calculate the magnitude of the drag vector.
    const speedSq = this.vel.magSq();
    drag.setMag(0.2 * speedSq);

    this.applyForce(drag);
  }

  applyFriction(){
    // Get vector of opposite direction of magnitude 1.
    let friction = this.vel.copy();
    friction.normalize();
    friction.mult(-1);

    // Calculate the magnitude of the friction vector.
    friction.setMag(0.01 * this.mass);

    this.applyForce(friction);
  }

  update(){
    this.applyDragForce();
    this.applyBuoyancy();
    this.applyFriction();
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0,0);
    this.edgeDetection();
  }

  show(){
    this.p.ellipse(this.pos.x, this.pos.y, this.r);
  }
}

export default p => {

  let bubbles = [];
  let canvasDOM;
  let timer;

  const initialSetup = () => {
    for (let i = 0; i < TOTAL_BUBBLES; i++){
      const bubble = new Bubble(
        p.random(0, p.width),
        p.random(0, p.height + 100),
        p.random(1,10),
        p
      );
      bubbles.push(bubble);
    }

    p.frameRate(FRAME_RATE);
  };

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
    timer = setTimeout(() => {
      p.resizeCanvas(document.body.clientWidth, canvasDOM.scrollHeight);
      initialSetup();
      p.draw();
    }, 100);
  };

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    // p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);
    p.resizeCanvas(window.innerWidth, window.innerHeight);

    p.fill(20, 80, 100, 25);
    p.noStroke();

    initialSetup();
  };

  p.draw = () => {
    p.clear();
    bubbles = bubbles.map(bubble => {
      bubble.update();
      bubble.show();
      return bubble.done
        ? new Bubble(p.random(0, p.width), p.height + 10, p.random(1,10), p)
        : bubble;
    });
  };
};
