import p5 from 'p5';

const NUMBER_OF_BLOBS = 5;
const BLOB_COLOR = 'RGBA(241, 241, 241, 0.5)';
const BLOB_XOFF = 0.1;
const BLOB_YOFF = 0.01;

class Blobby {
  constructor(p, x, y, r) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.limit(1);
    this.radius = r;
    this.xoff = 0;
    this.yoff = 0;
  }

  edgeDetection() {
    if (this.pos.x - this.radius > this.p.width) {
      this.pos.x = -this.radius;
    } else if (this.pos.x + this.radius < 0) {
      this.pos.x = this.p.width + this.radius;
    }

    if (this.pos.y - this.radius > this.p.height) {
      this.pos.y = -this.radius;
    } else if (this.pos.y + this.radius < 0) {
      this.pos.y = this.p.height + this.radius;
    }
  }

  update() {
    this.pos.add(this.vel);
    this.edgeDetection();
  }

  render() {
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.beginShape();
    this.xoff = 0;

    for (let i = 0; i < Math.PI * 2; i += 0.075) {
      const offset = this.p.map(this.p.noise(this.xoff, this.yoff), 0, 1, -25, 25);
      const x = (offset + this.radius) * Math.cos(i);
      const y = (offset + this.radius) * Math.sin(i);
      this.p.vertex(x, y);
      this.xoff += BLOB_XOFF;
    }

    this.yoff += BLOB_YOFF;
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }
}

export default p => {

  let blobs = new Array(NUMBER_OF_BLOBS);
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
    p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);

    p.frameRate(18);

    p.fill(BLOB_COLOR);
    p.noStroke();

    for (let i = 0; i < blobs.length; i++) {
      blobs[i] = new Blobby(
        p,
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
        Math.floor(Math.random() * 200 + 80)
      );
    }
  };

  p.draw = () => {
    p.clear();
    blobs.forEach(blobby => {
      blobby.update();
      blobby.render();
    });
  }
};
