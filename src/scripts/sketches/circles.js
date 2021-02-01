import p5 from 'p5';

class Circle {
  constructor(p) {
    this.p = p;
    this.set();
  }

  isOverlapping(circles) {
    return circles.some(c => c.pos.dist(this.pos) < c.r + this.r);
  }

  set(){
    this.pos = this.p.createVector(Math.floor(Math.random() * this.p.width), Math.floor(Math.random() * this.p.height));
    this.r = Math.floor(Math.random() * 40 + 2);
  }

  show() {
    this.p.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

export default p => {

  const totalCircles = 1000;
  const totalTries = 100;
  let circles = [];
  let canvasDOM;
  let timer;

  const setupCircles = () => {
    for (let i = 0; i < totalCircles; i++) {
      const newCircle = new Circle(p);
      let tries = 0;

      while (newCircle.isOverlapping(circles)) {
        if (tries >= totalTries) break;
        newCircle.set();
        tries++;
      }

      if (tries < totalTries) {
        circles.push(newCircle);
      }
    }
  };

  p.stopLoop = () => {
    p.noLoop();
  };

  p.resumeLoop = () => {
    // p.loop();
    // Modified because this sketch is static and painting over and over again
    // the same pattern is wasteful.
    p.draw();
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
      setupCircles();
      p.draw();
    }, 100);
  };

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);

    p.noStroke();
    p.fill(20, 80, 100, 25);

    setupCircles();
  };

  p.draw = () => {
    p.clear();
    circles.forEach(c => {
      c.show();
    });
    p.noLoop();
  };
};
